import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, Shield, Award, TrendingUp } from 'lucide-react';

interface TickerItem {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

export default function TerminalTicker() {
  const items: TickerItem[] = [
    { label: "GEMINI 3.5 ULTRA", value: "98.2% MMLU", change: "+1.4%", isPositive: true, icon: <Cpu className="w-3.5 h-3.5 text-blue-400" /> },
    { label: "NVIDIA BLACKWELL B200", value: "YIELD 89.2%", change: "+2.5%", isPositive: true, icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
    { label: "CLAUDE 3.5 SONNET", value: "93.1% SWE-BENCH", change: "+0.8%", isPositive: true, icon: <Activity className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: "AGI PROGRESS INDEX", value: "84.3%", change: "+0.3%", isPositive: true, icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: "EU AI ACT GUIDELINES", value: "ACTIVE COMPLIANCE", icon: <Shield className="w-3.5 h-3.5 text-[#5194ec]" /> },
    { label: "TSMC 2NM EXPERIMENTAL", value: "91.4% EFFICIENCY", change: "+4.1%", isPositive: true, icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> },
    { label: "GPT-4O LATENCY CORE", value: "280ms", change: "-40ms", isPositive: true, icon: <Zap className="w-3.5 h-3.5 text-rose-400" /> },
    { label: "ALPHAPROOF 2 STATUS", value: "GOLD MEDAL (41/42)", icon: <Award className="w-3.5 h-3.5 text-amber-500" /> },
  ];

  // Duplicate items to ensure smooth continuous infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-[#050505]/95 border-y border-neutral-900/80 h-10 overflow-hidden flex items-center relative z-20 select-none backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020202] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020202] to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex gap-12 whitespace-nowrap px-4"
        animate={{ x: [0, -1920] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-[10px] font-mono tracking-wider">
            <span className="flex items-center gap-1.5 flex-shrink-0">
              {item.icon}
              <span className="text-neutral-500 font-bold uppercase">{item.label}</span>
            </span>
            <span className="text-white font-semibold">{item.value}</span>
            {item.change && (
              <span className={`font-bold ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change}
              </span>
            )}
            <span className="text-neutral-800 font-bold px-2">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
