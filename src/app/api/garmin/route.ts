import { NextRequest, NextResponse } from 'next/server';

// Import the data formatting function
// Note: Adjust this import path based on your project structure
// If garmin-data.ts is in (standalone)/garmin/, you may need to adjust
import { formatDataForPrompt, garminData } from '@/app/(standalone)/garmin/garmin-data';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Return a fallback response if no API key
      return NextResponse.json({
        response: "The AI chat feature requires an API key to be configured. Please check out the dashboard tab to explore the data visually!"
      });
    }

    const garminContext = formatDataForPrompt();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are a helpful health analytics assistant for Will Chung's personal Garmin data dashboard. 
You have access to Will's health and fitness data from his Garmin watch spanning nearly 10 years.

Answer questions about his fitness, activities, sleep, heart rate, VO2 max, race predictions, and training.
Be conversational, insightful, and reference specific data points when relevant.
If asked about data you don't have, say so politely.

Keep responses concise but informative (2-4 sentences for simple questions, more for complex analysis).

Here is Will's Garmin health data:

${garminContext}`,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text || 'No response generated';

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error('Error in Garmin API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    dataRange: `${garminData.meta.dataStartDate} to ${garminData.meta.dataEndDate}`,
    totalActivities: garminData.meta.totalActivities,
    message: 'Garmin Health API is running. Use POST to query data.',
  });
}
