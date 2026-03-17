import { Outlet, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import Background from './components/Background';
import BootScreen from './components/BootScreen';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import { Breadcrumbs } from './components/Breadcrumbs';
import { CustomCursor } from './components/CustomCursor';
import { NoiseOverlay } from './components/NoiseOverlay';
import { HUD } from './components/HUD';
import { ScrollScene } from './components/ScrollScene';
import { AdminPanel } from './components/AdminPanel';
import { AdminTrigger } from './components/AdminTrigger';
import { NeuralCommand } from './components/NeuralCommand';
import { useStore } from './store/useStore';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { SavantCard } from './components/ui/SavantCard';
import { SavantButton } from './components/ui/SavantButton';

const ChromaticFilter = () => (
  <svg className="hidden">
    <defs>
      <filter id="chromatic-aberration-filter">
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
          result="red"
        />
        <feOffset in="red" dx="2" dy="0" result="redOffset" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
          result="green"
        />
        <feOffset in="green" dx="0" dy="0" result="greenOffset" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
          result="blue"
        />
        <feOffset in="blue" dx="-2" dy="0" result="blueOffset" />
        <feBlend in="redOffset" in2="greenOffset" mode="screen" result="redGreen" />
        <feBlend in="redGreen" in2="blueOffset" mode="screen" />
      </filter>
    </defs>
  </svg>
);

const HUD_INTERNAL_REMOVED = null;

export default function Layout() {
  const { booted, setBooted, addLog, chromaticAberration, scanlines, neuralOverlay } = useStore();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();
  const isOS = location.pathname === '/os';

  useEffect(() => {
    console.log('Layout State:', { booted, isOS, pathname: location.pathname });
  }, [booted, isOS, location.pathname]);

  const handleBootComplete = React.useCallback(() => {
    console.log('Boot sequence complete. Setting booted to true.');
    setBooted(true);
  }, [setBooted]);

  const [showForceReveal, setShowForceReveal] = useState(false);

  // Force boot fallback if stuck
  useEffect(() => {
    if (!booted) {
      const timer = setTimeout(() => {
        console.warn('Force booting system...');
        handleBootComplete();
      }, 15000);
      
      const revealTimer = setTimeout(() => {
        if (!booted) setShowForceReveal(true);
      }, 8000);

      return () => {
        clearTimeout(timer);
        clearTimeout(revealTimer);
      };
    }
  }, [booted, handleBootComplete]);

  useEffect(() => {
    if (booted) {
      addLog(`System transition to ${location.pathname.toUpperCase()}`, 'INFO');
    }
  }, [location.pathname, booted, addLog]);

  useEffect(() => {
    if (isOS) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isOS]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const wrapperClass = `min-h-screen selection:bg-crimson selection:text-white ${chromaticAberration ? 'chromatic-aberration' : ''}`;

  return (
    <div className={wrapperClass}>
      <CustomCursor />
      <NoiseOverlay />
      <NeuralCommand />
      <ChromaticFilter />
      
      <div className="noise-overlay" />
      <div className="vignette-heavy" />
      
      {scanlines && <div className="scanlines-overlay" />}
      {neuralOverlay && <div className="neural-lattice-overlay" />}
      
      <AnimatePresence>
        {!booted && <BootScreen onComplete={handleBootComplete} />}
      </AnimatePresence>

      {showForceReveal && !booted && (
        <button 
          onClick={handleBootComplete}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[30000] px-8 py-3 bg-crimson text-white font-mono text-[10px] tracking-[0.5em] uppercase hover:bg-white hover:text-crimson transition-all"
        >
          Force_System_Reveal
        </button>
      )}

      {isOS ? (
        <div className="overflow-hidden h-screen bg-obsidian">
          <div className="fixed top-8 left-8 z-[60] flex flex-col gap-4">
            <AdminTrigger onClick={() => setIsAdminPanelOpen(true)} />
          </div>

          <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
          
          <Navigation />
          <main className="relative z-10 w-full h-full">
            <Outlet />
          </main>
        </div>
      ) : (
        <div className="bg-obsidian">
          <Background />
          <ScrollScene />
          
          {/* Terminal Industries style grid overlay */}
          <div className="fixed inset-0 z-[1] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

          {/* Progress Bar */}
          <motion.div 
            className="fixed top-0 left-0 right-0 h-[2px] bg-crimson z-[6000] origin-left"
            style={{ scaleX }}
          />

          {/* HUD Header */}
          <header className="fixed top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none">
            <div className="flex flex-col gap-6 items-start">
              <div className="pointer-events-auto">
                <Logo />
              </div>
              <AdminTrigger onClick={() => setIsAdminPanelOpen(true)} />
            </div>

            <HUD />
          </header>

          <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />

          <Navigation />

          <AnimatePresence mode="wait">
            <motion.main 
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 pt-48 pb-32 px-5 md:px-10 lg:px-20"
            >
              <div className="max-w-7xl mx-auto savant-stack">
                <Breadcrumbs />
                <Outlet />
              </div>
            </motion.main>
          </AnimatePresence>
          
          {/* Footer */}
          <footer className="relative z-10 border-t border-white/5 bg-obsidian/90 backdrop-blur-xl pt-32 pb-12 px-8 md:px-24 overflow-hidden">
            {/* Background Text Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] flex items-center justify-center overflow-hidden">
              <span className="font-display font-black text-[30vw] tracking-tighter uppercase select-none">SAVANT</span>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid md:grid-cols-2 gap-24">
                <div>
                  <h3 className="font-display font-black text-6xl text-white mb-12 tracking-tighter">
                    Savant.
                  </h3>
                  <p className="text-white/40 font-mono text-xs max-w-sm leading-relaxed tracking-widest">
                    Sovereign architecture for the digital elite. Fractal logic. Absolute autonomy. Engineered for dominance.
                  </p>
                  
                  <div className="mt-12 flex gap-4">
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-crimson transition-colors cursor-pointer group">
                      <div className="w-4 h-4 bg-white/20 group-hover:bg-crimson transition-colors" />
                    </div>
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-electric-gold transition-colors cursor-pointer group">
                      <div className="w-4 h-4 bg-white/20 group-hover:bg-electric-gold transition-colors" />
                    </div>
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-white transition-colors cursor-pointer group">
                      <div className="w-4 h-4 bg-white/20 group-hover:bg-white transition-colors" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end justify-between">
                  <div className="flex gap-12 font-mono text-[10px] tracking-[0.3em] text-white/40">
                    <a href="#" className="hover:text-crimson transition-colors duration-500">SYSTEM_LOGS</a>
                    <a href="#" className="hover:text-electric-gold transition-colors duration-500">TELEMETRY</a>
                    <a href="#" className="hover:text-white transition-colors duration-500">CONTACT_NODE</a>
                  </div>
                  
                  <div className="mt-24 md:mt-0 flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">Lattice_Status</div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <div className="font-mono text-[10px] text-emerald-500/60 uppercase tracking-widest">All_Systems_Nominal</div>
                      </div>
                    </div>
                    <div className="w-12 h-[1px] bg-crimson" />
                    <div className="font-mono text-[10px] text-white/20">© 2026 SAVANT_LATTICE</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-48 w-full h-[1px] bg-white/5 relative">
                <motion.div 
                  className="absolute inset-0 bg-crimson"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
              
              <div className="mt-12 font-mono text-[10px] text-white/10 tracking-[1.5em] uppercase text-center w-full">
                designed_by_savant_ai // sovereign_fractal_architecture // build_42_omega
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
