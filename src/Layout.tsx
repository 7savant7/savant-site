import { Outlet, useLocation, Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import { HUD } from './components/HUD';
import { AdminPanel } from './components/AdminPanel';
import { AdminTrigger } from './components/AdminTrigger';
import { useStore } from './store/useStore';
import { useLoading } from './contexts/LoadingContext';

export default function Layout() {
  const { booted, setBooted, scanlines, neuralOverlay } = useStore();
  const { isLoading } = useLoading();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();
  const isOS = location.pathname === '/os';

  useEffect(() => {
    if (!isLoading && !booted) {
      setBooted(true);
    }
  }, [isLoading, booted, setBooted]);

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
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-neon-pink selection:text-white antialiased">
      {/* Immersive Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <div className="noise-overlay" />
        {scanlines && <div className="scanlines-overlay" />}
        {neuralOverlay && <div className="neural-lattice-overlay opacity-10" />}
        <div className="vignette-heavy" />
      </div>
      
      {/* Global UI Elements */}
      <div className={`anamorphic-flare ${booted ? 'active' : ''}`} />
      
      <div className={`grid-overlay ${booted ? 'active' : ''}`}>
        <div className="grid-line horizontal top-1/4" />
        <div className="grid-line horizontal top-1/2" />
        <div className="grid-line horizontal top-3/4" />
        <div className="grid-line vertical left-1/4" />
        <div className="grid-line vertical left-1/2" />
        <div className="grid-line vertical left-3/4" />
      </div>

      <div className={`corner-accent tl ${booted ? 'active' : ''}`} />
      <div className={`corner-accent tr ${booted ? 'active' : ''}`} />
      <div className={`corner-accent bl ${booted ? 'active' : ''}`} />
      <div className={`corner-accent br ${booted ? 'active' : ''}`} />

      <div className={`telemetry-hud left ${booted ? 'active' : ''}`}>
        SYS_STATUS: OPTIMAL // LATENCY: 0.001ms // SYNC: ACTIVE
      </div>
      <div className={`telemetry-hud right ${booted ? 'active' : ''}`}>
        SAVANT_OS_v80.0.0 // COORD: 34.0522° N, 118.2437° W
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-neon-pink z-[10000] origin-left"
        style={{ scaleX }}
      />

      {/* Header */}
      {!isOS && (
        <header className="fixed top-0 left-0 w-full p-8 md:p-12 z-[5000] flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-8 pointer-events-auto">
            <Logo />
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : -20 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-2xl tracking-[0.8em] uppercase text-white hidden md:block"
            >
              SAVANT
            </motion.div>
          </div>

          <div className="flex items-center gap-12 pointer-events-auto">
            <Navigation />
          </div>
        </header>
      )}

      {/* HUD & Admin */}
      <div className="fixed bottom-12 right-12 z-[5000] pointer-events-auto flex flex-col items-end gap-6">
        <HUD />
        <AdminTrigger onClick={() => setIsAdminPanelOpen(true)} />
      </div>

      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className={`relative z-10 ${isOS ? 'h-screen overflow-hidden' : 'pt-48'}`}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      {!isOS && (
        <footer className="relative z-10 border-t border-white/[0.03] bg-obsidian py-32 px-8 md:px-24 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-20">
            <div className="flex flex-col gap-12">
              <div className="text-5xl font-black tracking-tighter uppercase">SAVANT<span className="text-neon-pink">_</span></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Navigation</span>
                  <Link to="/work" className="text-sm text-white/40 hover:text-neon-pink transition-colors">Work</Link>
                  <Link to="/services" className="text-sm text-white/40 hover:text-neon-pink transition-colors">Services</Link>
                  <Link to="/journal" className="text-sm text-white/40 hover:text-neon-pink transition-colors">Journal</Link>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Connect</span>
                  <a href="#" className="text-sm text-white/40 hover:text-neon-pink transition-colors">Twitter</a>
                  <a href="#" className="text-sm text-white/40 hover:text-neon-pink transition-colors">GitHub</a>
                  <a href="#" className="text-sm text-white/40 hover:text-neon-pink transition-colors">Discord</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Legal</span>
                  <Link to="/privacy" className="text-sm text-white/40 hover:text-neon-pink transition-colors">Privacy</Link>
                  <Link to="/terms" className="text-sm text-white/40 hover:text-neon-pink transition-colors">Terms</Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-8">
              <div className="font-mono text-[10px] text-white/20 text-right uppercase tracking-[0.2em] leading-relaxed">
                © 2026 SAVANT_RECURSIVE_LOGIC <br />
                ALL_RIGHTS_RESERVED // BUILT_FOR_SOVEREIGNTY
              </div>
              <div className="w-32 h-[1px] bg-white/10" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
