import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLoading } from '../contexts/LoadingContext';

export const Preloader: React.FC = () => {
  const { isLoading, progress, finishLoading } = useLoading();
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev < progress) return prev + 1;
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[20000] bg-obsidian flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Skip Loading Trigger */}
          <button 
            onClick={() => finishLoading()}
            className="absolute top-8 right-8 z-[20001] font-mono text-[8px] text-white/20 hover:text-white transition-colors tracking-[0.5em] uppercase cursor-pointer"
          >
            Skip_Loading
          </button>
          {/* Background Fractal Noise */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.1)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Kinetic Core Animation */}
            <div className="relative w-32 h-32 mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-crimson/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-t-2 border-white/40 rounded-full"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-4 h-4 bg-crimson shadow-[0_0_20px_rgba(255,0,60,0.5)] rotate-45"
                />
              </div>
            </div>

            <div className="space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-black text-4xl text-white tracking-tighter"
              >
                SAVANT<span className="text-crimson">.</span>
              </motion.div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${displayProgress}%` }}
                    className="absolute inset-y-0 left-0 bg-crimson"
                  />
                </div>
                
                <div className="flex justify-between w-64 font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">
                  <span>Initializing_Core</span>
                  <span>{displayProgress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* HUD Elements */}
          <div className="absolute top-12 left-12 font-mono text-[8px] text-white/20 tracking-widest uppercase space-y-2">
            <div>System_Status: Booting</div>
            <div>Neural_Lattice: Synchronizing</div>
            <div>Uplink: Active</div>
          </div>

          <div className="absolute bottom-12 right-12 font-mono text-[8px] text-white/20 tracking-widest uppercase text-right space-y-2">
            <div>Sovereign_OS_v9.4.2</div>
            <div>© 2026 Savant_Core</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
