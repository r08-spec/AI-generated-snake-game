import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, ListMusic, Disc, Activity } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Nodal Frequency',
    artist: 'Synthetix.AI',
    duration: 185,
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Spectral Drift',
    artist: 'Quantum.Osc',
    duration: 210,
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&h=400&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Bitwise Pulse',
    artist: 'Logic_Gate',
    duration: 164,
    coverUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&h=400&auto=format&fit=crop'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= currentTrack.duration) {
            handleSkip(1);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = (direction: number) => {
    setCurrentTrackIndex(prev => {
      const next = prev + direction;
      if (next < 0) return DUMMY_TRACKS.length - 1;
      if (next >= DUMMY_TRACKS.length) return 0;
      return next;
    });
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="w-full flex items-center justify-between gap-12 h-full">
      {/* 1. Now Playing Section */}
      <div className="w-64 flex items-center gap-4 group">
        <motion.div
           key={currentTrack.id}
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-14 h-14 bg-gradient-to-br from-brand-cyan/20 to-brand-magenta/20 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-white/10"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
             <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
               <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
             </div>
          </div>
        </motion.div>
        <div className="flex-1 overflow-hidden">
          <h4 className="text-sm font-bold text-white truncate uppercase tracking-tighter italic">{currentTrack.title}</h4>
          <p className="text-[10px] text-white/40 truncate uppercase font-mono tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* 2. Main Playback Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-lg">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => handleSkip(-1)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </motion.button>

          <button 
            onClick={() => handleSkip(1)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-4 text-[9px] font-mono text-white/30">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-brand-cyan shadow-[0_0_8px_#22d3ee] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-8">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* 3. Extra Controls / Volume */}
      <div className="w-64 flex justify-end items-center gap-6 text-white/40">
        <div className="flex items-center gap-3">
          <Activity className={`w-4 h-4 ${isPlaying ? 'text-brand-cyan animate-pulse' : ''}`} />
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-white/60" />
          </div>
        </div>
        
        <button 
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-2 rounded-md transition-all border
            ${showPlaylist ? 'bg-brand-cyan/20 border-brand-cyan/40 text-brand-cyan' : 'border-white/10 hover:bg-white/5'}
          `}
        >
          <ListMusic className="w-4 h-4" />
        </button>
      </div>

      {/* Playlist Overlay (Floating above footer) */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-28 right-8 w-72 hardware-panel p-4 z-50"
          >
            <h4 className="text-[9px] font-black text-brand-cyan uppercase tracking-[0.3em] mb-4">
              [ NODAL_INDEX ]
            </h4>
            <div className="space-y-1">
              {DUMMY_TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-3 flex items-center justify-between group rounded-xl transition-all
                    ${idx === currentTrackIndex ? 'bg-brand-cyan text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'hover:bg-white/5 text-white/40'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono opacity-30">{idx + 1}</span>
                    <span className="text-xs font-bold uppercase truncate max-w-[140px] italic">{track.title}</span>
                  </div>
                  <Disc className={`w-3.5 h-3.5 ${idx === currentTrackIndex ? 'animate-spin-slow' : 'opacity-20'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
