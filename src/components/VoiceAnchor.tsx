import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, Volume2, Sparkles, VolumeX, AlertTriangle, Radio } from 'lucide-react';

interface VoiceAnchorProps {
  newsItems: any[];
}

export default function VoiceAnchor({ newsItems }: VoiceAnchorProps) {
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [statusMessage, setStatusMessage] = useState('News Anchor Idle');
  const [isBriefingMode, setIsBriefingMode] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const visualizerBars = Array.from({ length: 15 });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const s = window.speechSynthesis;
      setSynth(s);

      const loadVoices = () => {
        const availableVoices = s.getVoices();
        setVoices(availableVoices);
        // Default to a premium-sounding English voice if possible
        const defaultVoice = availableVoices.find(v => 
          v.lang.includes('en-US') && (v.name.includes('Google') || v.name.includes('Natural'))
        ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      };

      loadVoices();
      if (s.onvoiceschanged !== undefined) {
        s.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Cleanup synthesis on unmount
  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  const stopSpeaking = () => {
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage('Voice Broadcast Stopped');
    }
  };

  const pauseSpeaking = () => {
    if (synth && isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
        setStatusMessage(isBriefingMode ? 'Broadcasting 60s Briefing...' : 'Reading News Article...');
      } else {
        synth.pause();
        setIsPaused(true);
        setStatusMessage('Broadcast Suspended');
      }
    }
  };

  const speakText = (text: string, onComplete?: () => void) => {
    if (!synth) return;

    synth.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Apply voice settings
    const voiceObj = voices.find(v => v.name === selectedVoice);
    if (voiceObj) {
      utterance.voice = voiceObj;
    }

    utterance.rate = speed;
    utterance.pitch = 1.05; // Slightly clear professional pitch

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage('Broadcast Concluded');
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage('Broadcast Interrupted');
    };

    synth.speak(utterance);
  };

  const handleGenerateBriefing = () => {
    if (newsItems.length === 0) {
      setStatusMessage('No articles loaded to compile briefing.');
      return;
    }

    setIsBriefingMode(true);
    setStatusMessage('Compiling 60s briefing outline...');

    // Extract top 3 articles
    const topStories = newsItems.slice(0, 3);
    let briefingText = `Good morning. Welcome to your sixty-second AI X Intel Daily Briefing for today. Here are the core technical announcements shaping the sector. `;
    
    topStories.forEach((item, index) => {
      const ordinals = ['First', 'In other news', 'Finally'];
      briefingText += `${ordinals[index]}. ${item.title}. Reported by ${item.source || 'our grounding desk'}. ${item.summary.split('.')[0]}. `;
    });

    briefingText += ` That concludes your sixty-second AI X briefing. Stay anchored to live developments. Have a productive day.`;

    speakText(briefingText, () => {
      setIsBriefingMode(false);
    });
    setStatusMessage('Broadcasting 60s Briefing...');
  };

  const handleReadArticle = (item: any) => {
    setIsBriefingMode(false);
    const textToSpeak = `Now reading from ${item.source || 'grounding reporting'}. Title: ${item.title}. Summary: ${item.summary}`;
    speakText(textToSpeak);
    setStatusMessage(`Reading: ${item.title.substring(0, 30)}...`);
  };

  if (!synth) {
    return (
      <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 text-center font-sans">
        <VolumeX className="w-6 h-6 text-neutral-600 mx-auto mb-2" />
        <span className="text-xs text-neutral-500 block">AI Voice Anchor not supported in this browser.</span>
      </div>
    );
  }

  return (
    <div id="ai-voice-news-anchor" className="p-6 sm:p-7 rounded-[26px] border border-neutral-900/60 bg-neutral-950/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Radio className={`w-5 h-5 text-indigo-400 ${isPlaying && !isPaused ? 'animate-pulse' : ''}`} />
          <div>
            <h4 className="font-display text-base font-semibold text-white tracking-tight">AI Voice News Anchor</h4>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">SYNTHETIC BROADCAST DESK</p>
          </div>
        </div>

        <button
          onClick={handleGenerateBriefing}
          disabled={isPlaying && isBriefingMode}
          className="group px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase transition-all shadow-md shadow-indigo-900/10 cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-1.5 font-sans"
        >
          <Sparkles className="w-3 h-3 text-indigo-200 group-hover:rotate-12 transition-transform" />
          <span>60s Briefing</span>
        </button>
      </div>

      {/* Visualizer & Display Screen */}
      <div className="bg-[#040404] border border-neutral-900 rounded-2xl p-4 mb-4 relative overflow-hidden">
        {/* Dynamic Wave Visualizer */}
        <div className="flex items-center justify-center gap-1 h-12 mb-3">
          {visualizerBars.map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying && !isPaused ? {
                height: [
                  `${Math.max(10, Math.sin(i * 0.5) * 40 + 20)}%`,
                  `${Math.max(10, Math.cos(i * 0.8) * 35 + 20)}%`,
                  `${Math.max(10, Math.sin(i * 1.2) * 45 + 15)}%`
                ]
              } : { height: '6px' }}
              transition={isPlaying && !isPaused ? {
                duration: 0.6 + (i % 3) * 0.15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              } : { duration: 0.3 }}
              className={`w-1 rounded-full transition-colors ${
                isPlaying && !isPaused 
                  ? 'bg-gradient-to-t from-indigo-500 to-blue-400' 
                  : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Console Text Status */}
        <div className="flex items-center justify-between text-[10px] font-mono border-t border-neutral-900/80 pt-3">
          <span className="text-neutral-500 uppercase tracking-widest">Broadcaster Status</span>
          <span className={`${isPlaying && !isPaused ? 'text-emerald-400' : 'text-neutral-400'} font-bold`}>
            {statusMessage}
          </span>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={pauseSpeaking}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold cursor-pointer active:scale-95 transition-all font-sans"
              title="Pause speaking"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          ) : (
            <button
              onClick={() => newsItems.length > 0 ? handleReadArticle(newsItems[0]) : null}
              disabled={newsItems.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold cursor-pointer active:scale-95 transition-all disabled:opacity-40 font-sans"
              title="Read latest story"
            >
              <Play className="w-3.5 h-3.5 text-indigo-400" />
              <span>Read Latest</span>
            </button>
          )}

          <button
            onClick={stopSpeaking}
            disabled={!isPlaying}
            className="flex-shrink-0 p-3 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 cursor-pointer disabled:opacity-40 active:scale-95 transition-all"
            title="Stop broadcast"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Controls & Voice selectors */}
        <div className="flex items-center justify-between gap-3 bg-[#0a0a0a]/60 border border-neutral-900 px-3 py-1.5 rounded-xl">
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Speed</span>
          <div className="flex items-center gap-1.5">
            {[1, 1.25, 1.5].map((val) => (
              <button
                key={val}
                onClick={() => setSpeed(val)}
                className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  speed === val
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {val}x
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Voice Selection Dropdown */}
      <div className="mt-3.5 flex items-center justify-between bg-neutral-950/40 border border-neutral-900/60 rounded-xl px-3 py-2 text-[10px] font-sans">
        <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">Voice Model</span>
        <select
          value={selectedVoice}
          onChange={(e) => {
            setSelectedVoice(e.target.value);
            stopSpeaking();
          }}
          className="bg-transparent text-neutral-300 focus:outline-none max-w-[140px] text-[10px] cursor-pointer font-sans"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name} className="bg-neutral-950 text-white text-[10px] font-sans">
              {voice.name.replace('Microsoft', 'MS').replace('Google', 'Google ')}
            </option>
          ))}
        </select>
      </div>

      {/* Embedded tiny helper alert */}
      {newsItems.length > 0 && (
        <div className="mt-4 text-[9px] text-neutral-500 font-sans leading-relaxed text-center">
          💡 You can read <span className="text-white font-medium">any individual article</span> directly by expanding the card and selecting the speech bubble icon!
        </div>
      )}
    </div>
  );
}
