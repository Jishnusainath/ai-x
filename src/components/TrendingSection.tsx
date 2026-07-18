import React from 'react';
import { Cpu, Zap, Activity, TrendingUp, TrendingDown, Building, MessageSquare, ArrowUpRight } from 'lucide-react';

interface TrendingEntity {
  name: string;
  type: 'Model' | 'Hardware' | 'Company';
  metric: string;
  sentiment: string;
  heatIndex: number;
  isUp: boolean;
  change: string;
  bullet: string;
}

export default function TrendingSection() {
  const entities: TrendingEntity[] = [
    {
      name: "Gemini 3.5 Ultra",
      type: "Model",
      metric: "98.2% MMLU",
      sentiment: "94% Positive",
      heatIndex: 98,
      isUp: true,
      change: "+2.4%",
      bullet: "Unveiled globally with natively integrated 2M context window."
    },
    {
      name: "NVIDIA Blackwell B200",
      type: "Hardware",
      metric: "Production mass yield",
      sentiment: "91% Positive",
      heatIndex: 95,
      isUp: true,
      change: "+4.1%",
      bullet: "TSMC Hsinchu facility trial yields exceeding 89.2% benchmark."
    },
    {
      name: "OpenAI Operator Suite",
      type: "Model",
      metric: "Agentic SWE standard",
      sentiment: "87% Positive",
      heatIndex: 92,
      isUp: true,
      change: "+1.8%",
      bullet: "Launches automated browser agent framework for enterprise workflows."
    },
    {
      name: "AlphaProof 2 Math",
      type: "Model",
      metric: "41/42 Olympiad pts",
      sentiment: "96% Positive",
      heatIndex: 90,
      isUp: true,
      change: "+3.2%",
      bullet: "Solves complex symbolic Olympiad proofs in gold-medal timeframe."
    },
    {
      name: "TSMC 2nm Experimental",
      type: "Hardware",
      metric: "+15% Power savings",
      sentiment: "85% Neutral",
      heatIndex: 88,
      isUp: true,
      change: "+0.9%",
      bullet: "Experimental trial tooling completed for custom hyper-scalers."
    },
    {
      name: "Anthropic Computer Use",
      type: "Company",
      metric: "Multi-agent sync v2",
      sentiment: "89% Positive",
      heatIndex: 86,
      isUp: true,
      change: "+1.5%",
      bullet: "Released native orchestrators coordinating multi-app desktop debugging."
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Model': return 'bg-blue-500/10 text-blue-400 border-blue-500/15';
      case 'Hardware': return 'bg-amber-500/10 text-amber-400 border-amber-500/15';
      default: return 'bg-purple-500/10 text-purple-400 border-purple-500/15';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Model': return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case 'Hardware': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Building className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#5194ec]" />
          <h4 className="font-display text-lg font-semibold text-white tracking-tight">Trending AI Entities Index</h4>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest select-none">
          Live Heat Sentiment Updates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {entities.map((item, idx) => (
          <div 
            key={idx}
            className="group rounded-2xl border border-neutral-900 bg-neutral-950/20 p-5 hover:border-neutral-800/80 hover:bg-neutral-950/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#5194ec]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="space-y-4">
              {/* Type and Heat row */}
              <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                  {item.type}
                </span>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                    <span>Heat Index:</span>
                    <span className="text-white font-bold">{item.heatIndex}%</span>
                  </div>
                  {item.isUp ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Title & metrics block */}
              <div>
                <h5 className="text-sm font-semibold text-white group-hover:text-[#5194ec] transition-colors font-display tracking-tight flex items-center justify-between gap-2">
                  <span>{item.name}</span>
                  <span className={`text-[10px] font-bold font-mono ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.change}
                  </span>
                </h5>
                
                {/* Secondary data strip */}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <span className="font-bold text-neutral-600">Metric:</span>
                    <span className="text-neutral-300 font-semibold">{item.metric}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-bold text-neutral-600">Sentiment:</span>
                    <span className="text-emerald-400/80 font-bold">{item.sentiment}</span>
                  </span>
                </div>
              </div>

              {/* Text bullet summaries */}
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans border-t border-neutral-900/60 pt-3">
                {item.bullet}
              </p>
            </div>

            {/* Quick-look hover overlay */}
            <div className="mt-4 flex justify-end">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-500 group-hover:text-white transition-colors cursor-pointer select-none">
                Details
                <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
