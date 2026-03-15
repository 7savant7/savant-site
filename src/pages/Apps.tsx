import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { TechButton } from '../components/TechButton';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';

const APPS = [
  { id: '01', title: 'BRAND_TERMINAL', desc: 'A high-impact branding interface built on recursive creative logic. Real-time identity visualization and predictive market modeling.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop', color: 'electric-gold', hex: '#f9ff00', colorClass: 'bg-electric-gold' },
  { id: '02', title: 'CAMPAIGN_VAULT', desc: 'Centralized campaign and asset management matrix. Secure storage with sovereign creative control.', img: 'https://images.unsplash.com/photo-1614064641913-a53b14683186?q=80&w=2574&auto=format&fit=crop', color: 'crimson', hex: '#ff003c', colorClass: 'bg-crimson' },
  { id: '03', title: 'CREATIVE_DASHBOARD', desc: 'Studio telemetry and brand monitoring. Observe the flow of ideas across the sovereign network.', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2668&auto=format&fit=crop', color: 'white', hex: '#ffffff', colorClass: 'bg-white' }
];

const AppInterface = ({ app, onClose }: { app: typeof APPS[0], onClose: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const bootSequence = [
      `>> INITIALIZING_SAVANT_OS_v80.0.0`,
      `>> LOADING_ENTITY: ${app.title}`,
      '>> ESTABLISHING_NEURAL_LINK...',
      '>> DECRYPTING_SOVEREIGN_LATTICE...',
      '>> TRUTH_ANCHOR: STABLE',
      '>> ACCESS_GRANTED: WELCOME_OPERATOR'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsBooted(true), 500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [app.title]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-20 bg-obsidian/98 backdrop-blur-3xl"
    >
      <div className="absolute inset-0 neural-lattice-overlay opacity-10" />
      <div className="absolute inset-0 scanlines-overlay opacity-5" />
      
      <div className="w-full h-full max-w-7xl border border-white/5 bg-industrial-gray/30 relative overflow-hidden flex flex-col rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: app.hex }} />
            <div className="font-mono text-[10px] text-white/40 tracking-[0.5em] uppercase">
              {app.title} // SYSTEM_ID: {app.id}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="group flex items-center gap-4 font-mono text-[10px] text-white/30 hover:text-crimson transition-colors"
          >
            TERMINATE_SESSION [ESC]
            <div className="w-8 h-8 border border-white/10 flex items-center justify-center rounded-lg group-hover:border-crimson transition-colors">
              X
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-4">
            {lines.map((line, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-xs tracking-widest"
                style={{ color: idx === lines.length - 1 ? app.hex : 'rgba(255,255,255,0.4)' }}
              >
                {line}
              </motion.div>
            ))}
            
            <AnimatePresence>
              {isBooted && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-10"
                >
                  <div className="space-y-10">
                    <h2 className="text-6xl font-display text-white">{app.title}</h2>
                    <p className="text-xl text-white/50 leading-relaxed font-light">{app.desc}</p>
                    <div className="pt-10">
                      <MagneticButton strength={0.2}>
                        <SavantButton 
                          variant="secondary"
                          className="w-64 h-16"
                        >
                          INITIALIZE_OPERATIONS
                        </SavantButton>
                      </MagneticButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "LATENCY", val: "0.001ms" },
                      { label: "SYNC_RATE", val: "99.9%" },
                      { label: "UPTIME", val: "∞" },
                      { label: "SECURITY", val: "MAX" }
                    ].map((stat, i) => (
                      <div key={i} className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl">
                        <div className="text-[9px] font-mono text-white/20 mb-2 tracking-widest">{stat.label}</div>
                        <div className="text-2xl font-tech font-bold" style={{ color: app.hex }}>{stat.val}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <div className="flex gap-10">
            <div className="text-[9px] font-mono text-white/20">CPU: 12%</div>
            <div className="text-[9px] font-mono text-white/20">MEM: 4.2GB</div>
          </div>
          <div className="text-[9px] font-mono text-white/20">SAVANT_OS_v80.0.0_STABLE</div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Apps() {
  const [activeApp, setActiveApp] = useState<typeof APPS[0] | null>(null);

  return (
    <div className="savant-page-container">
      <AnimatePresence>
        {activeApp && (
          <AppInterface app={activeApp} onClose={() => setActiveApp(null)} />
        )}
      </AnimatePresence>

      <div className="savant-stack">
        <div className="relative mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="text-massive font-display"
          >
            SOVEREIGN<br/>
            <span className="text-crimson">APPLICATIONS</span>
          </motion.h1>
          <div className="absolute top-0 right-0 rail-text h-full opacity-30">
            SAVANT_OS_APP_ECOSYSTEM_v80.0.0_MANIFEST
          </div>
        </div>

        <div className="savant-grid grid-cols-1 lg:grid-cols-2">
          {APPS.map((app, i) => (
            <GlassCard 
              key={app.id}
              className="p-8 md:p-12 savant-stack !gap-10 group"
            >
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-2xl rotate-45 group-hover:rotate-90 transition-transform duration-1000">
                  <div className="w-6 h-6 rotate-45 group-hover:-rotate-45 transition-transform duration-1000" style={{ backgroundColor: app.hex }} />
                </div>
                <span className="font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase">APP_{app.id}</span>
              </div>

              <div className="savant-stack !gap-6">
                <h2 className="text-5xl font-display text-white">{app.title}</h2>
                <p className="text-lg text-white/40 leading-relaxed font-light">{app.desc}</p>
              </div>

              <div className="pt-10">
                <MagneticButton strength={0.2} className="w-full">
                  <SavantButton 
                    onClick={() => setActiveApp(app)}
                    variant="outline"
                    className="w-full h-16"
                  >
                    LAUNCH_INTERFACE
                  </SavantButton>
                </MagneticButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
