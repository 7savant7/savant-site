import React, { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLoading } from '../contexts/LoadingContext';
import Savant3DLogo from './Savant3DLogo';

export const Preloader: React.FC = () => {
  const { isLoading, progress, finishLoading } = useLoading();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev < progress) return prev + 1;
        if (prev >= 100) {
          setShowButton(true);
          return 100;
        }
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
          exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] } }}
          className="fixed inset-0 z-[20000] bg-obsidian flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 w-[760px] h-[760px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(0,229,255,0.12)_0%,rgba(255,122,24,0.12)_26%,rgba(255,42,95,0.08)_48%,transparent_74%)] pointer-events-none z-0" />

          {/* Loader Shell */}
          <div className="savant-loader-shell opacity-40">
            <div className="savant-loader-core">
              <div className="savant-loader-base-ring" />
              <div className="savant-loader-inner-ring" />
              <div className="savant-loader-orbit">
                <div className="savant-loader-arc" />
                <div className="savant-loader-sheen" />
              </div>
              <div className="savant-loader-ticks" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
            {/* 3D Logo Core */}
            <div className="w-full aspect-square max-w-[300px] mb-12 flex items-center justify-center">
              <Suspense fallback={<div className="font-mono text-[10px] text-white/20">INITIALIZING_CORE...</div>}>
                <Savant3DLogo className="!min-h-0 !h-full" />
              </Suspense>
            </div>

            <div className="space-y-8 text-center w-full flex flex-col items-center">
              <AnimatePresence mode="wait">
                {!showButton ? (
                  <motion.div
                    key="loading-info"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 w-full flex flex-col items-center"
                  >
                    <div className="font-display font-black text-5xl text-white tracking-tighter uppercase">
                      SAVANT<span className="text-neon-pink">.</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-3 w-64">
                      <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${displayProgress}%` }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-br-cyan to-br-magenta"
                        />
                      </div>
                      
                      <div className="font-mono text-[8px] text-white/30 tracking-[0.5em] uppercase text-center leading-relaxed">
                        WALLACE_ARCH // SEQ_V36.1<br/>
                        INITIALIZING CORE... {displayProgress.toString().padStart(3, '0')}%
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="enter-button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'white', color: 'black' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => finishLoading()}
                    className="px-12 py-5 border border-white/20 bg-black/40 backdrop-blur-xl text-white font-mono text-[10px] tracking-[1.2em] font-black uppercase transition-all duration-500 hover:tracking-[1.4em] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                  >
                    INITIALIZE_PROTOCOL
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* HUD Elements */}
          <div className="absolute top-12 left-12 font-mono text-[7px] text-white/10 tracking-[0.4em] uppercase space-y-2 hidden md:block">
            <div>System_Status: {displayProgress < 100 ? 'Booting' : 'Ready'}</div>
            <div>Neural_Lattice: {displayProgress < 100 ? 'Synchronizing' : 'Active'}</div>
            <div>Uplink: Established</div>
          </div>

          <div className="absolute bottom-12 right-12 font-mono text-[7px] text-white/10 tracking-[0.4em] uppercase text-right space-y-2 hidden md:block">
            <div>Sovereign_OS_v36.1</div>
            <div>© 2026 Savant_Core</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
