/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Activity, LayoutGrid, Trophy, Settings, Ghost } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-surface-obsidian">
      {/* Background Ambient Glows */}
      <div className="ambient-glow-cyan" />
      <div className="ambient-glow-magenta" />

      {/* Top Navigation / Header */}
      <header className="h-16 flex items-center justify-between px-8 glass-nav z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-cyan to-brand-magenta rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic text-white">
            CyberSync <span className="text-brand-cyan">v2.0</span>
          </h1>
        </div>

        <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
          <span className="text-brand-cyan border-b border-brand-cyan pb-1 cursor-default">ARENA</span>
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <LayoutGrid className="w-3 h-3" /> LEADERBOARD
          </span>
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
            <Settings className="w-3 h-3" /> SETTINGS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-white/40 uppercase tracking-tighter">Status</p>
            <p className="text-[11px] text-green-400 font-mono">SYSTEM_ONLINE</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
            <div className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 relative z-10">
        
        {/* Sidebar: System Info / Playlist Placeholder */}
        <section className="hidden xl:flex w-72 flex-col gap-4">
          <div className="hardware-panel p-5 flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-cyan">Active Nodes</h2>
              <Ghost className="w-4 h-4 text-white/20" />
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl relative group cursor-default">
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-brand-cyan rounded-r-full shadow-[0_0_8px_#22d3ee]" />
                <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">Main Buffer</p>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "84%" }}
                    className="h-full bg-brand-cyan"
                  />
                </div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl opacity-40">
                <p className="text-[10px] font-bold text-white uppercase tracking-tight">Neural Sync</p>
                <p className="text-[9px] text-white/40 mt-1 uppercase">Awaiting process...</p>
              </div>
            </div>

            <div className="mt-auto p-4 bg-brand-cyan/5 rounded-xl border border-brand-cyan/20">
               <p className="text-[9px] text-brand-cyan uppercase tracking-[0.2em] mb-3 font-bold">Visualizer_Stream</p>
               <div className="flex items-end gap-1 h-12">
                 {[40, 70, 90, 50, 80, 30, 60].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${h}%`, `${h-20}%`, `${h}%`] }}
                      transition={{ duration: 1 + i*0.2, repeat: Infinity }}
                      className="flex-1 bg-brand-cyan/30 rounded-t-sm"
                    />
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* Center: Arena Window */}
        <section className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex-1 arena-window flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden mt-8">
              <SnakeGame />
            </div>

            {/* Grid Mesh Overlay (Decorative) */}
            <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-[0.03] z-0"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
          </div>
        </section>

        {/* Right: Metrics Panel */}
        <section className="hidden lg:flex w-64 flex-col gap-4">
           <div className="hardware-panel flex-1 p-5 flex flex-col gap-6">
              <div>
                 <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Activity className="w-3 h-3" /> System Metrics
                 </h3>
                 <div className="space-y-5">
                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                          <span className="text-[9px] text-white/30 uppercase tracking-wider">Multi Threading</span>
                          <span className="text-xs font-mono text-brand-cyan">v1.45</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="w-[65%] h-full bg-brand-cyan shadow-[0_0_8px_#22d3ee]" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                          <span className="text-[9px] text-white/30 uppercase tracking-wider">Core Temp</span>
                          <span className="text-xs font-mono text-brand-magenta">CRITICAL</span>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-brand-magenta shadow-[0_0_8px_#d946ef]" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-auto space-y-4">
                 <div className="p-4 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl">
                    <p className="text-[9px] text-brand-cyan mb-2 font-black uppercase tracking-widest">Operator Note</p>
                    <p className="text-[11px] leading-relaxed text-white/40 font-medium">
                      Neural interface processing optimized for high-frequency feedback loops. Timing alignment highly recommended.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Bottom: playback footer integration */}
      <footer className="h-24 bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 flex items-center px-4 md:px-8 z-30 relative overflow-visible">
        <MusicPlayer />
      </footer>
    </div>
  );
}
