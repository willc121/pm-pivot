'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, Heart, TrendingUp, Timer, Bike, Moon, Zap,
  ChevronRight, Target, Send, Loader2, Sparkles, Github,
  Mountain, Waves, Dumbbell, Calendar, Footprints
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================================
// TYPES
// ============================================================================

interface VO2MaxEntry {
  calendar_date: string;
  vo2_max_value: number;
  sport: string;
}

interface ActivitySummary {
  activity_type: string;
  count: number;
  total_distance_km: number;
  total_duration_hours: number;
  avg_hr: number | null;
}

interface SleepStats {
  avg_duration: number;
  total_nights: number;
}

interface RacePrediction {
  calendar_date: string;
  race_time_5k: number;
  race_time_10k: number;
  race_time_half: number;
  race_time_marathon: number;
}

interface HeartRateZone {
  max_hr: number;
  lactate_threshold_hr: number;
  zone1_floor: number;
  zone2_floor: number;
  zone3_floor: number;
  zone4_floor: number;
  zone5_floor: number;
}

interface DashboardData {
  vo2Max: VO2MaxEntry[];
  activities: ActivitySummary[];
  sleepStats: SleepStats;
  racePredictions: RacePrediction[];
  heartRateZones: HeartRateZone | null;
  totalActivities: number;
  dateRange: { start: string; end: string };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTime(seconds: number | null): string {
  if (!seconds) return '--:--';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function safeDateOnly(isoLike: string | null | undefined): string {
  if (!isoLike) return 'N/A';
  const t = isoLike.split('T')[0];
  return t || 'N/A';
}

function formatMonthYear(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

// ============================================================================
// COMPONENTS
// ============================================================================

const MiniBarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all hover:opacity-80"
          style={{
            height: `${max > 0 ? (value / max) * 100 : 0}%`,
            backgroundColor: color,
            minHeight: '2px',
          }}
        />
      ))}
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  color = 'blue',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down';
  color?: string;
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400',
    pink: 'bg-pink-500/20 text-pink-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all hover:bg-gray-800/70">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-xl font-bold text-white">{value}</p>
            {trend && (
              <span className={trend === 'up' ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CHAT COMPONENT
// ============================================================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  "What's my VO2 max progression?",
  'How has my fitness improved?',
  'What are my race predictions?',
  'What activities do I do most?',
  'What are my heart rate zones?',
  'How much sleep do I average?',
];

type MCPTool = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description?: string }>;
  };
};

const MCP_TOOL_CATALOG: MCPTool[] = [
  {
    name: "get_health_summary",
    description:
      "Get an overview of all health data including VO2 max, activities, sleep, and race predictions",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_vo2max",
    description:
      "Get VO2 max history and trends. VO2 max measures cardiovascular fitness in ml/kg/min.",
    inputSchema: {
      type: "object",
      properties: {
        start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
        end_date: { type: "string", description: "End date (YYYY-MM-DD, exclusive recommended)" },
        sport: { type: "string", description: "Filter by sport (e.g., 'running', 'cycling')" },
      },
    },
  },
  {
    name: "get_activities",
    description:
      "Get activity breakdown by type, including counts, distances, and durations",
    inputSchema: {
      type: "object",
      properties: {
        start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
        end_date: { type: "string", description: "End date (YYYY-MM-DD)" },
        activity_type: { type: "string", description: "Filter by activity type (e.g., 'running')" },
      },
    },
  },
  {
    name: "get_sleep",
    description:
      "Get sleep statistics including average duration and total nights tracked. Optionally filter by date range.",
    inputSchema: {
      type: "object",
      properties: {
        start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
        end_date: { type: "string", description: "End date (YYYY-MM-DD, exclusive recommended)" },
      },
    },
  },
  {
    name: "get_race_predictions",
    description:
      "Get predicted race times for 5K, 10K, half marathon, and marathon based on current fitness",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_heart_rate_zones",
    description:
      "Get personalized heart rate training zones based on max HR and lactate threshold",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_training_load",
    description:
      "Get training load data including acute/chronic workload ratio to assess overtraining risk",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "number", description: "Number of days (default: 30)" },
      },
    },
  },
];


const GarminChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/garmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      // Update remaining questions from header
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining !== null) {
        setRemainingQuestions(parseInt(remaining, 10));
      }

      const data = await response.json();

      // Handle rate limit response
      if (response.status === 429) {
        setRemainingQuestions(0);
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Ask About My Health Data</h3>
              <p className="text-sm text-blue-100">10 years of Garmin tracking, powered by AI</p>
            </div>
          </div>
          {remainingQuestions !== null && (
            <div
              className={`text-xs px-2.5 py-1 rounded-full ${
                remainingQuestions === 0
                  ? 'bg-red-500/30 text-red-100'
                  : remainingQuestions <= 3
                    ? 'bg-yellow-500/30 text-yellow-100'
                    : 'bg-white/20 text-blue-100'
              }`}
            >
              {remainingQuestions === 0
                ? 'Limit reached'
                : `${remainingQuestions} question${remainingQuestions !== 1 ? 's' : ''} left`}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 border-x border-gray-700 h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-300 mb-4">Ask me anything about my fitness journey!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={remainingQuestions === 0}
                  className="text-xs bg-gray-700 text-blue-400 px-3 py-1.5 rounded-full hover:bg-gray-600 transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-700 text-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {messages.length > 0 && messages.length < 4 && remainingQuestions !== 0 && (
        <div className="bg-gray-800/50 border-x border-gray-700 px-4 py-2">
          <p className="text-xs text-gray-500 mb-2">Try asking:</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestedQuestions.slice(3).map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={isLoading || remainingQuestions === 0}
                className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full border border-gray-600 hover:border-blue-500 hover:text-blue-400 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="bg-gray-800 rounded-b-xl border border-t-0 border-gray-700 p-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={remainingQuestions === 0 ? 'Demo limit reached - try again later' : 'Ask about my VO2 max, activities, sleep...'}
            disabled={isLoading || remainingQuestions === 0}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || remainingQuestions === 0}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function GarminPage() {
  type TabKey = 'MCP' | 'chat' | 'dashboard' | 'about';
  const [activeTab, setActiveTab] = useState<TabKey>('MCP');
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
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

    async function fetchData() {
      try {
        // Fetch VO2 Max
        const { data: vo2Data } = await supabase
          .from('vo2_max')
          .select('calendar_date, vo2_max_value, sport')
          .order('calendar_date', { ascending: true });

        // Fetch ALL activities (paginate past the 1000-row cap)
        const activitiesRaw = await fetchAllActivitiesRaw();

        // Group activities by type (and compute avg_hr)
        const activityGroups: Record<
          string,
          ActivitySummary & { hr_sum: number; hr_count: number }
        > = {};

        activitiesRaw.forEach((a: any) => {
          const type = a.activity_type || 'unknown';

          if (!activityGroups[type]) {
            activityGroups[type] = {
              activity_type: type,
              count: 0,
              total_distance_km: 0,
              total_duration_hours: 0,
              avg_hr: null,
              hr_sum: 0,
              hr_count: 0,
            };
          }

          const g = activityGroups[type];
          g.count += 1;
          g.total_distance_km += a.distance_km || 0;
          g.total_duration_hours += (a.duration_minutes || 0) / 60;

          // Average HR
          if (typeof a.avg_hr === 'number' && a.avg_hr > 0) {
            g.hr_sum += a.avg_hr;
            g.hr_count += 1;
          }
        });

        const activities: ActivitySummary[] = Object.values(activityGroups)
          .map((g) => ({
            activity_type: g.activity_type,
            count: g.count,
            total_distance_km: g.total_distance_km,
            total_duration_hours: g.total_duration_hours,
            avg_hr: g.hr_count > 0 ? Math.round(g.hr_sum / g.hr_count) : null,
          }))
          .sort((a, b) => b.count - a.count);

        // Fetch sleep stats from summary table
        const { data: sleepSummary } = await supabase
          .from('sleep_summary')
          .select('*')
          .single();

        const sleepStats: SleepStats = {
          avg_duration: sleepSummary?.avg_duration_hours ?? 0,
          total_nights: sleepSummary?.nights ?? 0,
        };

        // Fetch race predictions (latest)
        const { data: raceData } = await supabase
          .from('race_predictions')
          .select('*')
          .order('calendar_date', { ascending: false })
          .limit(10);

        // Fetch heart rate zones
        const { data: hrZones } = await supabase.from('heart_rate_zones').select('*').limit(1);

        // Date range from the already-fetched activitiesRaw
        const dateRangeStart = safeDateOnly(activitiesRaw[0]?.start_time);
        const dateRangeEnd = safeDateOnly(activitiesRaw[activitiesRaw.length - 1]?.start_time);

        setData({
          vo2Max: vo2Data || [],
          activities,
          sleepStats,
          racePredictions: raceData || [],
          heartRateZones: hrZones?.[0] || null,
          totalActivities: activitiesRaw.length,
          dateRange: {
            start: dateRangeStart,
            end: dateRangeEnd,
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading health data...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Error loading data</p>
      </main>
    );
  }

  // Header-friendly month/year strings
  const startShort = formatMonthYear(data.dateRange.start);
  const endShort = formatMonthYear(data.dateRange.end);

  // Calculate derived values
  const latestVO2 = data.vo2Max[data.vo2Max.length - 1];
  const firstVO2 = data.vo2Max[0];
  const vo2Improvement =
    firstVO2 && latestVO2
      ? Math.round(((latestVO2.vo2_max_value - firstVO2.vo2_max_value) / firstVO2.vo2_max_value) * 100)
      : 0;
  const bestRace = data.racePredictions[0];
  const vo2ChartData = data.vo2Max.slice(-15).map((v) => v.vo2_max_value);

  // Fitness age estimation based on VO2 Max
  const getFitnessAge = (vo2: number): string => {
    if (vo2 >= 55) return '20-25';
    if (vo2 >= 50) return '25-30';
    if (vo2 >= 45) return '30-35';
    if (vo2 >= 40) return '35-40';
    if (vo2 >= 35) return '40-50';
    return '50+';
  };

  const activityIcons: Record<string, React.ElementType> = {
    running: Activity,
    cycling: Bike,
    lap_swimming: Waves,
    mountain_biking: Mountain,
    virtual_ride: Zap,
    strength_training: Dumbbell,
    walking: Footprints,
    hiking: Mountain,
  };

  const activityColors: Record<string, string> = {
    running: '#3b82f6',
    cycling: '#10b981',
    lap_swimming: '#06b6d4',
    mountain_biking: '#f59e0b',
    virtual_ride: '#8b5cf6',
    strength_training: '#ef4444',
    walking: '#6b7280',
    hiking: '#84cc16',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Garmin MCP Server</h1>

              <h2 className="text-sm text-gray-400 mt-0.5">
                MCP tools for querying 9 years of Garmin data plus a public mirror demo
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-300 tabular-nums">
                <span className="rounded-full bg-white/5 px-2.5 py-1">
                  {startShort} to {endShort}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-1">
                  {data.totalActivities.toLocaleString()} activities
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <a
              href="https://github.com/willc121/garmin-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              View Code
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {(['MCP', 'chat', 'dashboard', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

{/* MCP Tab */}
{activeTab === 'MCP' && (
  <div className="space-y-6">
{/* The Problem & Solution */}
<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
  <h2 className="text-xl font-semibold text-white mb-2">Garmin gives me the data. MCP lets me ask the questions.</h2>
  <p className="text-gray-300">
    After 9 years of wearing a Garmin, I had thousands of activities, sleep records, and fitness metrics, but no way to simply ask "Am I overtraining?" or "How has my fitness changed this year?"
  </p>
  <p className="text-gray-300 mt-3">
    So I built an MCP server that exposes my Garmin data to Claude. Now I can query a decade of health data in plain English.
  </p>
  <p className="text-gray-400 text-sm mt-4">
    This website is a public demo. The real MCP server runs locally with Claude Desktop for private queries.
  </p>
</div>

{/* Architecture */}
<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
  <h3 className="text-lg font-semibold text-white mb-3">Two ways to access the data</h3>
  <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
    <div className="text-gray-400 mb-2"># The real thing: Local MCP Server</div>
        <div className="flex items-center gap-2 text-gray-300 flex-wrap">
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Claude Desktop</span>
          <span className="text-gray-500">→</span>
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">MCP Server (stdio)</span>
          <span className="text-gray-500">→</span>
          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Garmin export JSON</span>
        </div>

      
        <div className="text-gray-400 mt-4 mb-2"># This website: Public demo (simulation)</div>
        <div className="flex items-center gap-2 text-gray-300 flex-wrap">
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Chat UI</span>
          <span className="text-gray-500">→</span>
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">Next.js API</span>
          <span className="text-gray-500">→</span>
          <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">LLM</span>
          <span className="text-gray-500">+</span>
          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Supabase</span>
        </div>
      </div>
    </div>

    {/* Tool catalog */}
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white">Tool catalog</h3>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
       <thead>
  <tr className="text-left text-gray-400">
    <th className="py-2 pr-4">Tool</th>
    <th className="py-2 pr-4">Input schema</th>
    <th className="py-2">What it does</th>
  </tr>
</thead>

          <tbody className="text-gray-200">
            {MCP_TOOL_CATALOG.map((t: MCPTool) => (
  <tr key={t.name} className="border-t border-gray-700/60">
    <td className="py-3 pr-4 font-mono text-blue-300">{t.name}</td>
    <td className="py-3 pr-4 text-gray-300">
      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(t.inputSchema.properties, null, 2)}
      </pre>
    </td>
    <td className="py-3 text-gray-300">{t.description}</td>
  </tr>
))}


          </tbody>
        </table>
      </div>
    </div>

{/* MCP Proof */}
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-3">MCP in action</h3>
      <p className="text-gray-400 text-sm mb-4">
        Claude Desktop connects to the MCP server and calls tools to query real Garmin data.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-2">Garmin connector enabled in Claude Desktop</p>
          <img 
            src="/projects/garmin_mcp/mcp-connector.png" 
            alt="Claude Desktop showing Garmin MCP connector enabled"
            className="rounded-lg border border-gray-700 w-full"
          />
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">Tool call returning real VO2 max data</p>
          <img 
            src="/projects/garmin_mcp/mcp-tool-call.png" 
            alt="Claude calling get_vo2max tool and returning fitness data"
            className="rounded-lg border border-gray-700 w-full"
          />
        </div>
      </div>
    </div>

    {/* Local try-it */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <h3 className="font-semibold mb-2">Try it locally</h3>
      <ol className="list-decimal list-inside text-sm text-blue-100 space-y-1">
        <li>Clone repo, install deps, build the MCP server</li>
        <li>Add the server to Claude Desktop config</li>
        <li>Ask: “List available tools” then “Show my VO2 max trend in 2023”</li>
      </ol>
    </div>
  </div>
)}



        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={TrendingUp}
                label="VO2 Max"
                value={latestVO2?.vo2_max_value || '--'}
                subtext={vo2Improvement > 0 ? `+${vo2Improvement}% improvement` : 'Current'}
                trend={vo2Improvement > 0 ? 'up' : undefined}
                color="blue"
              />
              <StatCard
                icon={Timer}
                label="Best 5K"
                value={formatTime(bestRace?.race_time_5k)}
                subtext="Predicted time"
                color="green"
              />
              <StatCard
                icon={Activity}
                label="Activities"
                value={data.totalActivities.toLocaleString()}
                subtext={`Since ${data.dateRange.start.split('-')[0]}`}
                color="purple"
              />
              <StatCard
                icon={Moon}
                label="Avg Sleep"
                value={`${data.sleepStats.avg_duration.toFixed(1)}h`}
                subtext={`${data.sleepStats.total_nights.toLocaleString()} nights`}
                color="pink"
              />
            </div>

            {/* Main Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* VO2 Max Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-white">VO2 Max Journey</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Cardiovascular fitness over time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">{latestVO2?.vo2_max_value || '--'}</p>
                    <p className="text-xs text-gray-500">ml/kg/min</p>
                  </div>
                </div>

                {vo2ChartData.length > 0 && <MiniBarChart data={vo2ChartData} color="#3b82f6" />}

                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>Started: {firstVO2?.vo2_max_value || '--'}</span>
                  <span>Peak: {Math.max(...data.vo2Max.map((v) => v.vo2_max_value))}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Fitness Age</p>
                    <p className="font-semibold text-white">{getFitnessAge(latestVO2?.vo2_max_value || 0)}</p>
                  </div>
                  <div className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                    {latestVO2?.vo2_max_value >= 50 ? 'Excellent' : latestVO2?.vo2_max_value >= 40 ? 'Good' : 'Fair'}
                  </div>
                </div>
              </div>

              {/* Race Predictions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <h3 className="font-semibold text-white mb-1">Race Predictions</h3>
                <p className="text-xs text-gray-500 mb-4">Based on current fitness level</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400 font-medium">5K</p>
                    <p className="text-lg font-bold text-white">{formatTime(bestRace?.race_time_5k)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400 font-medium">10K</p>
                    <p className="text-lg font-bold text-white">{formatTime(bestRace?.race_time_10k)}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-xs text-purple-400 font-medium">Half</p>
                    <p className="text-lg font-bold text-white">{formatTime(bestRace?.race_time_half)}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-xs text-orange-400 font-medium">Marathon</p>
                    <p className="text-lg font-bold text-white">{formatTime(bestRace?.race_time_marathon)}</p>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <h3 className="font-semibold text-white mb-4">Activity Breakdown</h3>

                <div className="space-y-3">
                  {data.activities
                    .slice(0, showAllActivities ? undefined : 5)
                    .map((activity) => {
                      const percentage = data.totalActivities > 0 ? (activity.count / data.totalActivities) * 100 : 0;
                      const IconComponent = activityIcons[activity.activity_type] || Activity;
                      const color = activityColors[activity.activity_type] || '#6b7280';

                      return (
                        <div key={activity.activity_type} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <IconComponent className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-200 capitalize">
                                {activity.activity_type.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-gray-500">{activity.count.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${percentage}%`, backgroundColor: color }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {data.activities.length > 5 && (
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="mt-4 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {showAllActivities ? 'Show less' : `Show all ${data.activities.length} activities`}
                    <ChevronRight
                      className={`w-3 h-3 transition-transform ${showAllActivities ? 'rotate-90' : ''}`}
                    />
                  </button>
                )}
              </div>

              {/* Heart Rate Zones */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <h3 className="font-semibold text-white mb-1">Heart Rate Zones</h3>
                <p className="text-xs text-gray-500 mb-4">Personalized training zones</p>

                {data.heartRateZones ? (
                  <>
                    <div className="space-y-2">
                      {[
                        {
                          zone: 'Zone 1',
                          name: 'Warm Up',
                          floor: data.heartRateZones.zone1_floor,
                          ceiling: data.heartRateZones.zone2_floor - 1,
                          color: '#94a3b8',
                        },
                        {
                          zone: 'Zone 2',
                          name: 'Easy',
                          floor: data.heartRateZones.zone2_floor,
                          ceiling: data.heartRateZones.zone3_floor - 1,
                          color: '#3b82f6',
                        },
                        {
                          zone: 'Zone 3',
                          name: 'Aerobic',
                          floor: data.heartRateZones.zone3_floor,
                          ceiling: data.heartRateZones.zone4_floor - 1,
                          color: '#22c55e',
                        },
                        {
                          zone: 'Zone 4',
                          name: 'Threshold',
                          floor: data.heartRateZones.zone4_floor,
                          ceiling: data.heartRateZones.zone5_floor - 1,
                          color: '#f59e0b',
                        },
                        {
                          zone: 'Zone 5',
                          name: 'Maximum',
                          floor: data.heartRateZones.zone5_floor,
                          ceiling: data.heartRateZones.max_hr,
                          color: '#ef4444',
                        },
                      ].map((zone) => (
                        <div key={zone.zone} className="flex items-center gap-2">
                          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: zone.color }} />
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <span className="text-xs font-medium text-gray-300">{zone.zone}</span>
                              <span className="text-xs text-gray-500 ml-1.5">{zone.name}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-mono">{zone.floor}-{zone.ceiling}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Max HR</p>
                        <p className="font-semibold text-white">{data.heartRateZones.max_hr} bpm</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Lactate Threshold</p>
                        <p className="font-semibold text-white">{data.heartRateZones.lactate_threshold_hr} bpm</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No heart rate zone data available</p>
                )}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Key Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  `VO2 Max improved ${vo2Improvement}% from ${firstVO2?.vo2_max_value} to ${latestVO2?.vo2_max_value}`,
                  `${data.totalActivities.toLocaleString()} total activities tracked since ${data.dateRange.start.split('-')[0]}`,
                  `Average sleep duration: ${data.sleepStats.avg_duration.toFixed(1)} hours per night`,
                  `Most frequent activity: ${data.activities[0]?.activity_type.replace(/_/g, ' ')} (${data.activities[0]?.count.toLocaleString()} sessions)`,
                ].map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-blue-100">
                    <span className="text-blue-300">•</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
{activeTab === 'chat' && (
  <div className="py-4">
    <div className="text-center mb-6">
      <h2 className="text-xl font-semibold text-white">Try It Yourself</h2>
      <p className="text-gray-400 text-sm mt-1">Ask questions about my health data using natural language</p>
      <p className="text-xs text-gray-500 mt-2">
        This is a public demo using the same dataset. The real MCP server runs locally with Claude Desktop.
      </p>
    </div>
    <GarminChat />
  </div>
)}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            {/* Intro Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">About This Project</h2>
              <p className="text-gray-300">
                After wearing a Garmin watch for nearly <strong className="text-white">10 years</strong>, I had accumulated
                a massive amount of health data but no easy way to query it. I wanted to ask simple questions like
                "How has my fitness improved this year?" or "Am I overtraining?" - but Garmin Connect doesn't let you
                do that.
              </p>
              <p className="text-gray-300 mt-3">
                So I built <strong className="text-white">two complementary interfaces</strong> for the same data:
              </p>
            </div>

            {/* Two Approaches */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Dashboard Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">Structured Analytics</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">The Dashboard tab</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Pre-defined visualizations and stats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Great for at-a-glance metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Built with Next.js + Supabase</span>
                  </li>
                </ul>
              </div>

              {/* MCP Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">Natural Language</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">The Chat tab + MCP Server</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Ask anything in plain English</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>AI interprets and queries the data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>MCP server exposes data to Claude</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* What is MCP */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3">What is MCP?</h3>
              <p className="text-gray-300 mb-4">
                <strong className="text-white">Model Context Protocol (MCP)</strong> is a standard created by Anthropic
                that lets you expose data and tools to LLMs. Instead of copy-pasting data into a chat, you build a
                server that Claude (or other AI) can query directly.
              </p>

              {/* Architecture Diagram */}
              <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-400 mb-2"># Local setup (Claude Desktop)</div>
                <div className="flex items-center gap-2 text-gray-300 flex-wrap">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Claude Desktop</span>
                  <span className="text-gray-500">→</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">MCP Server</span>
                  <span className="text-gray-500">→</span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Garmin JSON</span>
                </div>

                <div className="text-gray-400 mt-4 mb-2"># This website</div>
                <div className="flex items-center gap-2 text-gray-300 flex-wrap">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Chat UI</span>
                  <span className="text-gray-500">→</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">Next.js API</span>
                  <span className="text-gray-500">→</span>
                  <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">OpenAI</span>
                  <span className="text-gray-500">+</span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Supabase</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mt-4">
                The MCP server runs locally with Claude Desktop for private queries. This website is a public demo
                that uses the same data (stored in Supabase) with an OpenAI-powered chat interface.
              </p>
            </div>

            {/* Example Queries */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3">Things You Can Ask</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "What's my VO2 max trend this year?",
                  'Am I overtraining? Check my load.',
                  'How much did I sleep last week?',
                  'What are my predicted race times?',
                  'Compare my cycling vs running volume',
                  "What's my fitness age?",
                ].map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-blue-400">→</span>
                    <span className="text-gray-300">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack & Data */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <h3 className="font-semibold text-white mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['TypeScript', 'Next.js', 'React', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'OpenAI API', 'MCP'].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="bg-gray-700 text-gray-200 text-xs font-medium px-3 py-1 rounded-full border border-gray-600"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                <h3 className="font-semibold text-white mb-3">Data Tracked</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activities</span>
                    <span className="text-white font-medium">{data.totalActivities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">VO2 Max readings</span>
                    <span className="text-white font-medium">{data.vo2Max.length.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sleep nights</span>
                    <span className="text-white font-medium">{data.sleepStats.total_nights.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date range</span>
                    <span className="text-white font-medium">
                      {data.dateRange.start.split('-')[0]}-{data.dateRange.end.split('-')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Want to build your own?</h3>
                  <p className="text-sm text-blue-100 mt-1">
                    The MCP server is open source. Clone it and connect your own Garmin data.
                  </p>
                </div>
                <a
                  href="https://github.com/willc121/garmin-mcp-server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built by Will Chung •{' '}
            <a href="/" className="text-blue-400 hover:underline">
              Back to Portfolio
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
