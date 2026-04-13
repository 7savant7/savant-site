import { Outlet, useLocation, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
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
  const location = useLocation();
  const isOS = location.pathname === '/os';

  useEffect(() => {
    if (!isLoading && !booted) {
      setBooted(true);
    }
  }, [isLoading, booted, setBooted]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-gold/30 selection:text-white antialiased relative z-10">
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <div className="noise-overlay" />
        {scanlines && <div className="scanlines-overlay" />}
        {neuralOverlay && <div className="neural-lattice-overlay opacity-10" />}
        <div className="vignette-heavy" />
      </div>

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
        signal integrity // recursive field // live
      </div>
      <div className={`telemetry-hud right ${booted ? 'active' : ''}`}>
        savant // sovereign interface lattice
      </div>

      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[10000] origin-left"
        style={{ scaleX }}
      />

      {!isOS && (
        <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-[5000] flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-8 pointer-events-auto">
            <Logo />
          </div>

          <div className="flex items-center gap-8 pointer-events-auto">
            <Navigation />
          </div>
        </header>
      )}

      <div className="fixed bottom-8 right-8 z-[5000] pointer-events-auto flex flex-col items-end gap-4">
        <HUD />
        <AdminTrigger onClick={() => setIsAdminPanelOpen(true)} />
      </div>

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-10 ${isOS ? 'h-screen overflow-hidden' : 'pt-32 md:pt-36'}`}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {!isOS && (
        <footer className="relative z-10 border-t border-white/[0.04] bg-obsidian py-24 px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16">
            <div className="flex flex-col gap-10">
              <div className="text-4xl md:text-6xl font-black tracking-tighter lowercase">
                savant<span className="text-gold">.</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest lowercase">
                    navigation
                  </span>
                  <Link to="/cognition" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    cognition
                  </Link>
                  <Link to="/systems" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    systems
                  </Link>
                  <Link to="/interface" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    interface
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest lowercase">
                    exploratory
                  </span>
                  <Link to="/lab" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    lab
                  </Link>
                  <Link to="/signal" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    signal
                  </Link>
                  <Link to="/archive" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    archive
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] text-white/20 tracking-widest lowercase">
                    connect
                  </span>
                  <Link to="/contact" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    uplink
                  </Link>
                  <Link to="/journal" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    journal
                  </Link>
                  <Link to="/branding" className="text-sm text-white/50 hover:text-gold transition-colors lowercase">
                    branding
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-6">
              <div className="font-mono text-[10px] text-white/25 text-left lg:text-right lowercase tracking-[0.18em] leading-relaxed">
                savant builds perception systems, interface atmospheres,
                and recursive identities for projects that need more
                than surface polish.
              </div>
              <div className="w-32 h-[1px] bg-white/10" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
