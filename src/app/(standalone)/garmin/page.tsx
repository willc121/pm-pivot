'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, Heart, TrendingUp, Timer, Bike, Moon, Zap, 
  ChevronRight, Target, Send, Loader2, Sparkles, Github, ExternalLink,
  Mountain, Waves, Dumbbell
} from 'lucide-react';
import { garminData, formatDataForPrompt } from './garmin-data';

// ============================================================================
// MINI CHART COMPONENTS
// ============================================================================

const MiniBarChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all hover:opacity-80"
          style={{
            height: `${(value / max) * 100}%`,
            backgroundColor: color,
            minHeight: '2px',
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  trend,
  color = 'blue' 
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down';
  color?: string;
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={trend === 'up' ? 'text-green-500 text-xs' : 'text-red-500 text-xs'}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
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
  "What's Will's VO2 max progression?",
  "How has his fitness improved?",
  "What are his race predictions?",
  "What activities does he do most?",
  "What are his heart rate zones?",
  "How much sleep does he average?",
];

const GarminChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I couldn't process that request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Ask About My Health Data</h3>
            <p className="text-sm text-blue-100">10 years of Garmin tracking, powered by AI</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-x border-gray-200 h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">Ask me anything about my fitness journey!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
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
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {messages.length > 0 && messages.length < 4 && (
        <div className="bg-gray-50 border-x border-gray-200 px-4 py-2">
          <p className="text-xs text-gray-500 mb-2">Try asking:</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestedQuestions.slice(3).map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                className="text-xs bg-white text-gray-600 px-3 py-1 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="bg-gray-50 rounded-b-xl border border-t-0 border-gray-200 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my VO2 max, activities, sleep..."
            disabled={isLoading}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'about'>('dashboard');
  const [showAllActivities, setShowAllActivities] = useState(false);

  // Get data
  const latestVO2 = garminData.vo2Max[garminData.vo2Max.length - 1];
  const firstVO2 = garminData.vo2Max[0];
  const vo2Improvement = Math.round(((latestVO2.value - firstVO2.value) / firstVO2.value) * 100);
  const bestRace = garminData.racePredictions[0];
  const totalActivities = garminData.activities.reduce((sum, a) => sum + a.count, 0);
  const vo2ChartData = garminData.vo2Max.slice(-10).map(v => v.value);

  const activityIcons: Record<string, React.ElementType> = {
    running: Activity,
    cycling: Bike,
    lap_swimming: Waves,
    mountain_biking: Mountain,
    virtual_ride: Zap,
    strength_training: Dumbbell,
  };

  const activityColors: Record<string, string> = {
    running: '#3b82f6',
    cycling: '#10b981',
    lap_swimming: '#06b6d4',
    mountain_biking: '#f59e0b',
    virtual_ride: '#8b5cf6',
    strength_training: '#ef4444',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Garmin Health Analytics
              </h1>
              <p className="text-gray-500">
                10 years of personal health data, queryable through AI
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <a
              href="https://github.com/willchung/garmin-health-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              View Code
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {(['dashboard', 'chat', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={TrendingUp}
                label="VO2 Max"
                value={latestVO2.value}
                subtext={`+${vo2Improvement}% improvement`}
                trend="up"
                color="blue"
              />
              <StatCard
                icon={Timer}
                label="Best 5K"
                value={bestRace.fiveK}
                subtext="Predicted time"
                color="green"
              />
              <StatCard
                icon={Activity}
                label="Activities"
                value={totalActivities}
                subtext={`${garminData.meta.totalDaysTracked} days tracked`}
                color="purple"
              />
              <StatCard
                icon={Moon}
                label="Avg Sleep"
                value={`${garminData.sleepSummary.avgDurationHours}h`}
                subtext={`${garminData.sleepSummary.totalNightsTracked} nights`}
                color="pink"
              />
            </div>

            {/* Main Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* VO2 Max Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">VO2 Max Journey</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Cardiovascular fitness over time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{latestVO2.value}</p>
                    <p className="text-xs text-gray-500">ml/kg/min</p>
                  </div>
                </div>
                
                <MiniBarChart data={vo2ChartData} color="#3b82f6" />
                
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>Started: {firstVO2.value}</span>
                  <span>Peak: {Math.max(...garminData.vo2Max.map(v => v.value))}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Fitness Age</p>
                    <p className="font-semibold text-gray-900">{garminData.fitnessAge.estimated}</p>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    {garminData.fitnessAge.category}
                  </div>
                </div>
              </div>

              {/* Race Predictions */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">Race Predictions</h3>
                <p className="text-xs text-gray-500 mb-4">Based on current fitness level</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">5K</p>
                    <p className="text-lg font-bold text-gray-900">{bestRace.fiveK}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">10K</p>
                    <p className="text-lg font-bold text-gray-900">{bestRace.tenK}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Half</p>
                    <p className="text-lg font-bold text-gray-900">{bestRace.halfMarathon}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600 font-medium">Marathon</p>
                    <p className="text-lg font-bold text-gray-900">{bestRace.marathon}</p>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Activity Breakdown</h3>
                
                <div className="space-y-3">
                  {garminData.activities
                    .slice(0, showAllActivities ? undefined : 4)
                    .map((activity) => {
                      const percentage = (activity.count / totalActivities) * 100;
                      const IconComponent = activityIcons[activity.type] || Activity;
                      const color = activityColors[activity.type] || '#6b7280';
                      
                      return (
                        <div key={activity.type} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                            <IconComponent className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {activity.type.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-gray-500">{activity.count}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
                
                {garminData.activities.length > 4 && (
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="mt-4 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {showAllActivities ? 'Show less' : 'Show all activities'}
                    <ChevronRight className={`w-3 h-3 transition-transform ${showAllActivities ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>

              {/* Heart Rate Zones */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">Heart Rate Zones</h3>
                <p className="text-xs text-gray-500 mb-4">Personalized training zones</p>
                
                <div className="space-y-2">
                  {Object.entries(garminData.heartRateZones.zones).map(([key, zone], i) => {
                    const colors = ['#94a3b8', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors[i] }} />
                        <div className="flex-1 flex justify-between items-center">
                          <div>
                            <span className="text-xs font-medium text-gray-700">Zone {i + 1}</span>
                            <span className="text-xs text-gray-400 ml-1.5">{zone.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-mono">{zone.floor}-{zone.ceiling}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Max HR</p>
                    <p className="font-semibold text-gray-900">{garminData.heartRateZones.maxHR} bpm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lactate Threshold</p>
                    <p className="font-semibold text-gray-900">{garminData.heartRateZones.lactateThreshold} bpm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Key Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {garminData.insights.slice(0, 4).map((insight, i) => (
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
              <h2 className="text-xl font-semibold text-gray-900">Try It Yourself</h2>
              <p className="text-gray-500 text-sm mt-1">
                Ask questions about my health data using natural language
              </p>
            </div>
            <GarminChat />
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Project</h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600">
                After wearing a Garmin watch for nearly <strong>10 years</strong>, I had accumulated 
                a massive amount of health data — but no easy way to query it. I wanted to ask 
                simple questions like "How has my fitness improved this year?" or "Am I overtraining?"
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">The Solution</h3>
              <p className="text-gray-600">
                I built a <strong>Model Context Protocol (MCP) server</strong> that enables Claude to 
                directly query my Garmin data. The MCP server exposes 15 tools covering sleep, 
                heart rate, HRV, VO2 Max, activities, race predictions, and training load.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {['TypeScript', 'Node.js', 'MCP Protocol', 'Next.js', 'React', 'Tailwind CSS', 'Claude API'].map((tech) => (
                  <span 
                    key={tech}
                    className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Features</h3>
              <ul className="text-gray-600 space-y-2 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>VO2 Max Tracking:</strong> Monitor cardiovascular fitness progression</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Race Predictions:</strong> AI-calculated 5K, 10K, Half, Marathon times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Training Load:</strong> Acute/chronic workload ratio analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Natural Language:</strong> Ask questions in plain English</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Built by Will Chung • <a href="/" className="text-blue-600 hover:underline">Back to Portfolio</a></p>
        </footer>
      </div>
    </main>
  );
}
