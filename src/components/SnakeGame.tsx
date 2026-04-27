import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Circle, Target } from 'lucide-react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 1.5;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > bestScore) setBestScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(src => src + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(70, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, score, bestScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, speed]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full h-full relative">
      {/* Game Metrics Overlay (Design Template style) */}
      <div className="absolute top-0 inset-x-0 px-8 py-2 flex justify-between items-start pointer-events-none z-20">
        <div className="flex flex-col">
          <span className="text-[10px] text-brand-cyan font-mono tracking-[0.2em] uppercase opacity-50 mb-1 leading-none">Score Index</span>
          <motion.span 
            key={score}
            className="text-5xl font-black font-mono tracking-tighter text-white"
          >
            {score.toString().padStart(4, '0')}
          </motion.span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-brand-magenta font-mono tracking-[0.2em] uppercase opacity-50 mb-1 leading-none">Peak Rec</span>
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-brand-magenta" />
            <span className="text-2xl font-bold font-mono text-brand-magenta tracking-tight">
              {bestScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Arena Interface */}
      <div 
        className="relative bg-transparent overflow-hidden mt-12"
        style={{
          width: 'min(75vw, 420px)',
          height: 'min(75vw, 420px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Subtle Background Mesh */}
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-[0.05] pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white" />
          ))}
        </div>

        {/* Snake Sub-routines */}
        {snake.map((segment, index) => (
          <motion.div
            key={`${index}-${segment.x}-${segment.y}`}
            initial={index === 0 ? { scale: 0.8 } : false}
            animate={{ scale: 1 }}
            className={`
              ${index === 0 ? 'bg-brand-cyan z-10 shadow-[0_0_25px_rgba(34,211,238,0.6)]' : 'bg-brand-cyan/20 border border-brand-cyan/30'}
              rounded-sm transition-all duration-75
            `}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Data Fragment (Food) */}
        <motion.div
          animate={{ 
            boxShadow: ["0 0 10px #d946ef", "0 0 30px #d946ef", "0 0 10px #d946ef"],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-brand-magenta flex items-center justify-center rounded-full"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        >
          <div className="absolute inset-1 border border-white/40 rounded-full" />
        </motion.div>

        {/* System Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-center"
            >
               <h3 className="text-4xl font-display font-black uppercase tracking-tighter italic text-brand-magenta mb-2">Process_Halted</h3>
               <p className="text-[10px] font-mono text-white/40 mb-8 uppercase tracking-[0.3em]">
                 Integrity Compromised: {score} units
               </p>
               <button
                 onClick={resetGame}
                 className="px-8 py-3 bg-brand-cyan text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-all"
               >
                 Re-Initiate System
               </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-40"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="w-20 h-20 rounded-2xl border-2 border-brand-cyan/20 bg-brand-cyan/5 flex items-center justify-center group hover:bg-brand-cyan/10 transition-all"
              >
                <Play className="w-8 h-8 text-brand-cyan fill-brand-cyan group-hover:scale-110 transition-transform" />
              </button>
              <p className="text-white/30 mt-6 font-mono text-[9px] tracking-[0.5em] uppercase">
                Awaiting Command
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Legend */}
      <div className="flex gap-8 text-white/20 text-[9px] font-mono tracking-[0.3em] uppercase absolute bottom-8">
        <div className="flex items-center gap-2">
           <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white/40">WASD</span> Move
        </div>
        <div className="flex items-center gap-2">
           <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white/40">SPACE</span> Halt
        </div>
      </div>
    </div>
  );
};
