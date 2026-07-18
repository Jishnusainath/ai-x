import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Zap, RefreshCw, Cpu, Award, Globe } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface TrendingTopic {
  name: string;
  type: 'company' | 'technology' | 'topic';
  mentions: number;
  change: number;
  score: number;
}

const INITIAL_TRENDS: TrendingTopic[] = [
  { name: 'NVIDIA Blackwell', type: 'technology', mentions: 1240, change: 32.4, score: 98 },
  { name: 'OpenAI Agents', type: 'company', mentions: 980, change: 18.2, score: 95 },
  { name: 'TSMC 2nm Process', type: 'technology', mentions: 710, change: 14.7, score: 91 },
  { name: 'Anthropic Computer Use', type: 'technology', mentions: 640, change: 25.1, score: 88 },
  { name: 'Google Axion ARM CPU', type: 'company', mentions: 590, change: 12.0, score: 85 },
  { name: 'EU AI Act Enforcement', type: 'topic', mentions: 480, change: -4.3, score: 78 },
  { name: 'Cybersecurity Threat Detection', type: 'topic', mentions: 420, change: 8.5, score: 72 },
  { name: 'Autonomous Robotics', type: 'technology', mentions: 390, change: 19.3, score: 70 }
];

// Historical mock points for charting
const CHART_DATA = [
  { time: '02:00', 'NVIDIA': 400, 'Agents': 320, 'TSMC': 210 },
  { time: '04:00', 'NVIDIA': 520, 'Agents': 380, 'TSMC': 260 },
  { time: '06:00', 'NVIDIA': 690, 'Agents': 410, 'TSMC': 380 },
  { time: '08:00', 'NVIDIA': 920, 'Agents': 580, 'TSMC': 420 },
  { time: '10:00', 'NVIDIA': 1240, 'Agents': 980, 'TSMC': 710 }
];

export default function TrendingRadar() {
  const [trends, setTrends] = useState<TrendingTopic[]>(INITIAL_TRENDS);
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'technology' | 'topic'>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  // Periodically fluctuate values to simulate real-time search radar monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setTrends(prev =>
          prev.map(t => {
            const deltaMentions = Math.floor((Math.random() - 0.4) * 15);
            const deltaChange = parseFloat(((Math.random() - 0.5) * 1.5).toFixed(1));
            return {
              ...t,
              mentions: Math.max(100, t.mentions + deltaMentions),
              change: parseFloat((t.change + deltaChange).toFixed(1)),
              score: Math.min(100, Math.max(50, t.score + (deltaMentions > 0 ? 1 : -1)))
            };
          })
        );
        setIsUpdating(false);
      }, 800);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const filteredTrends = trends
    .filter(t => activeTab === 'all' || t.type === activeTab)
    .sort((a, b) => b.mentions - a.mentions);

  return (
    <div id="trending-radar" className="p-6 sm:p-7 rounded-[26px] border border-neutral-900/60 bg-neutral-950/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Glare effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#5194ec]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#5194ec]" />
          <div>
            <h4 className="font-display text-base font-semibold text-white tracking-tight">Trending AI Radar</h4>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">REAL-TIME WEB MENTIONS & VELOCITY INDEX</p>
          </div>
        </div>

        {/* Pulse radar indicator */}
        <div className="flex items-center gap-1.5 bg-neutral-900/40 border border-neutral-800/80 px-2.5 py-1 rounded-full font-mono text-[9px] text-neutral-400">
          <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isUpdating ? 'animate-ping' : 'animate-pulse'}`} />
          <span>{isUpdating ? 'SCANNING...' : 'LIVE INDEX'}</span>
        </div>
      </div>

      {/* Tabs / Filter Pills */}
      <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-900 rounded-xl p-1 mb-5">
        {(['all', 'company', 'technology', 'topic'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-neutral-900 border border-neutral-800 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Layout Grid: Chart + List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Trend chart visualizer (Recharts area) */}
        <div className="md:col-span-7 flex flex-col justify-between bg-neutral-950/45 border border-neutral-900/50 rounded-2xl p-4 h-[210px] sm:h-[230px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Velocity Timeline (Hours)</span>
            <div className="flex items-center gap-3 text-[9px] font-mono text-neutral-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#5194ec]" /> NVIDIA</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Agents</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> TSMC</span>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0 text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5194ec" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#5194ec" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#404040" fontSize={9} tickLine={false} />
                <YAxis stroke="#404040" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c0c0c', 
                    border: '1px solid #1f1f1f', 
                    borderRadius: '10px', 
                    fontSize: '10px',
                    color: '#fff' 
                  }} 
                />
                <Area type="monotone" dataKey="NVIDIA" stroke="#5194ec" strokeWidth={1.5} fillOpacity={1} fill="url(#colorNv)" />
                <Area type="monotone" dataKey="Agents" stroke="#818cf8" strokeWidth={1} fillOpacity={1} fill="url(#colorAg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List of trending tags */}
        <div className="md:col-span-5 flex flex-col justify-between max-h-[230px] overflow-y-auto pr-1 scrollbar-none">
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTrends.slice(0, 5).map((topic, i) => {
                const isPositive = topic.change >= 0;

                return (
                  <motion.div
                    key={topic.name}
                    layoutId={`trend-card-${topic.name}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-900 bg-neutral-900/30 hover:bg-neutral-900/60 transition-all text-left"
                  >
                    <div className="flex items-center gap-2 max-w-[65%]">
                      {/* Left icon representing category */}
                      <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 flex-shrink-0">
                        {topic.type === 'technology' ? (
                          <Cpu className="w-3.5 h-3.5 text-blue-400" />
                        ) : topic.type === 'company' ? (
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="text-[11px] font-bold text-white block truncate leading-none">
                          {topic.name}
                        </span>
                        <span className="text-[9px] text-neutral-500 font-mono">
                          {topic.mentions.toLocaleString()} mentions
                        </span>
                      </div>
                    </div>

                    {/* Change badge */}
                    <div className="flex flex-col items-end">
                      <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{isPositive ? '+' : ''}{topic.change}%</span>
                      </div>
                      
                      {/* Small reliability score label */}
                      <span className="text-[8px] font-mono text-neutral-500">
                        VELOCITY: {topic.score}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
