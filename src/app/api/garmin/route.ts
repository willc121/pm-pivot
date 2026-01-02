import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Clean up old entries periodically to prevent memory leaks
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupRateLimitMap, 10 * 60 * 1000);

function getRateLimitInfo(ip: string): { limited: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { limited: false, remaining: RATE_LIMIT - 1, resetIn: WINDOW_MS };
  }

  if (record.count >= RATE_LIMIT) {
    return { limited: true, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return { limited: false, remaining: RATE_LIMIT - record.count, resetIn: record.resetTime - now };
}

// ============================================================================
// TYPES
// ============================================================================

type SleepSummaryRow = {
  nights: number;
  first_night: string;
  last_night: string;
  avg_duration_hours: number;
};

// ============================================================================
// DATA FETCHING
// ============================================================================

async function fetchAllActivitiesRaw() {
  const pageSize = 1000;
  let from = 0;
  const all: any[] = [];

  while (true) {
    const { data, error } = await supabase
      .from('activities')
      .select('activity_type, distance_km, duration_minutes, avg_hr, start_time')
      .order('start_time', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    all.push(...data);

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return all;
}

// Fetch data from Supabase and format for the AI
async function getGarminContext(): Promise<string> {
  // VO2 Max
  const { data: vo2Data, error: vo2Err } = await supabase
    .from('vo2_max')
    .select('calendar_date, vo2_max_value, sport')
    .order('calendar_date', { ascending: true });

  if (vo2Err) throw vo2Err;

  // Activities (paginate past 1000)
  const activitiesRaw = await fetchAllActivitiesRaw();

  // Group activities
  const activityGroups: Record<string, { count: number; totalKm: number; totalHours: number }> = {};
  activitiesRaw.forEach((a: any) => {
    const type = a.activity_type || 'unknown';
    if (!activityGroups[type]) {
      activityGroups[type] = { count: 0, totalKm: 0, totalHours: 0 };
    }
    activityGroups[type].count += 1;
    activityGroups[type].totalKm += a.distance_km || 0;
    activityGroups[type].totalHours += (a.duration_minutes || 0) / 60;
  });

  // Sleep summary (no row cap)
  const { data: sleepSummary, error: sleepErr } = await supabase
    .from('sleep_summary')
    .select('*')
    .single();

  if (sleepErr) throw sleepErr;

  const s = (sleepSummary as SleepSummaryRow) || null;
  const sleepNights = s?.nights ?? 0;
  const sleepFirst = s?.first_night ?? 'N/A';
  const sleepLast = s?.last_night ?? 'N/A';
  const avgSleep = typeof s?.avg_duration_hours === 'number' ? s.avg_duration_hours.toFixed(1) : 'N/A';

  // Race predictions
  const { data: raceData, error: raceErr } = await supabase
    .from('race_predictions')
    .select('*')
    .order('calendar_date', { ascending: false })
    .limit(5);

  if (raceErr) throw raceErr;

  // Heart rate zones
  const { data: hrZones, error: hrErr } = await supabase
    .from('heart_rate_zones')
    .select('*')
    .limit(1);

  if (hrErr) throw hrErr;

  // Training load
  const { data: trainingLoad, error: loadErr } = await supabase
    .from('training_load')
    .select('*')
    .order('calendar_date', { ascending: false })
    .limit(30);

  if (loadErr) throw loadErr;

  const formatTime = (seconds: number | null): string => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const vo2Values = (vo2Data || []).map((v: any) => v.vo2_max_value).filter((n: any) => typeof n === 'number');
  const firstVO2 = vo2Data?.[0];
  const latestVO2 = vo2Data?.[vo2Data.length - 1];
  const peakVO2 = vo2Values.length ? Math.max(...vo2Values) : 0;

  const latestRace = raceData?.[0];
  const zones = hrZones?.[0];

  return `
GARMIN HEALTH DATA FOR WILL CHUNG
==================================
Total Activities: ${activitiesRaw.length}
VO2 Max Records: ${(vo2Data || []).length}

SLEEP:
- Nights tracked: ${sleepNights}
- Average duration: ${avgSleep} hours
- Date range: ${sleepFirst} to ${sleepLast}

VO2 MAX PROGRESSION:
- First recorded (${firstVO2?.calendar_date}): ${firstVO2?.vo2_max_value} ml/kg/min
- Latest (${latestVO2?.calendar_date}): ${latestVO2?.vo2_max_value} ml/kg/min
- Peak: ${peakVO2} ml/kg/min
- Improvement: ${
    firstVO2 && latestVO2
      ? Math.round(((latestVO2.vo2_max_value - firstVO2.vo2_max_value) / firstVO2.vo2_max_value) * 100)
      : 0
  }%

Recent VO2 Max readings:
${(vo2Data || []).slice(-10).map((v: any) => `- ${v.calendar_date}: ${v.vo2_max_value} (${v.sport})`).join('\n')}

ACTIVITY BREAKDOWN:
${Object.entries(activityGroups)
  .sort((a, b) => b[1].count - a[1].count)
  .map(([type, data]) => `- ${type}: ${data.count} activities, ${Math.round(data.totalKm)} km, ${Math.round(data.totalHours)} hours`)
  .join('\n')}

RACE PREDICTIONS (Latest: ${latestRace?.calendar_date || 'N/A'}):
- 5K: ${formatTime(latestRace?.race_time_5k)}
- 10K: ${formatTime(latestRace?.race_time_10k)}
- Half Marathon: ${formatTime(latestRace?.race_time_half)}
- Marathon: ${formatTime(latestRace?.race_time_marathon)}

HEART RATE ZONES:
${
  zones
    ? `
- Max HR: ${zones.max_hr} bpm
- Lactate Threshold: ${zones.lactate_threshold_hr} bpm
- Zone 1 (Warm Up): ${zones.zone1_floor}-${zones.zone2_floor - 1} bpm
- Zone 2 (Easy): ${zones.zone2_floor}-${zones.zone3_floor - 1} bpm
- Zone 3 (Aerobic): ${zones.zone3_floor}-${zones.zone4_floor - 1} bpm
- Zone 4 (Threshold): ${zones.zone4_floor}-${zones.zone5_floor - 1} bpm
- Zone 5 (Maximum): ${zones.zone5_floor}-${zones.max_hr} bpm
`
    : 'No heart rate zone data available'
}

TRAINING LOAD (Recent):
${(trainingLoad || []).slice(0, 5).map((t: any) => `- ${t.calendar_date}: Acute ${t.acute_load}, Chronic ${t.chronic_load}, Status: ${t.acwr_status}`).join('\n')}
`.trim();
}

// ============================================================================
// API HANDLERS
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const { limited, remaining, resetIn } = getRateLimitInfo(ip);
    
    if (limited) {
      const resetMinutes = Math.ceil(resetIn / 60000);
      return NextResponse.json(
        {
          response: `You've reached the demo limit (${RATE_LIMIT} questions/hour). Try again in ${resetMinutes} minutes, or explore the Dashboard tab to view the data visually!`,
          rateLimited: true,
          resetIn: resetMinutes,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
          },
        }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        response: "The AI chat feature requires an API key. Check out the dashboard tab to explore the data visually!",
      });
    }

    // Input guard to reduce token burn
    const trimmed = message.trim().slice(0, 600);

    const garminContext = await getGarminContext();

    const systemPrompt = `You are a helpful health analytics assistant for Will Chung's personal Garmin data dashboard.
Answer questions about his fitness, activities, sleep, heart rate, VO2 max, race predictions, and training.
Be conversational and reference specific data points when relevant.
If asked about data you don't have, say so politely.

Keep responses concise.

Here is Will's Garmin health data:

${garminContext}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: trimmed },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json(
      { response: assistantMessage },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error in Garmin API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { count: activityCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true });

    const { count: vo2Count } = await supabase
      .from('vo2_max')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      status: 'ok',
      activities: activityCount,
      vo2MaxRecords: vo2Count,
      rateLimit: `${RATE_LIMIT} requests per hour`,
      message: 'Garmin Health API is running. Use POST to query data.',
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Database connection failed' }, { status: 500 });
  }
}