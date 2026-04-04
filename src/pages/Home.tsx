import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Savant3DLogo from '../components/Savant3DLogo';
import { NeuralLattice } from '../components/NeuralLattice';
import { ArrowRight, Cpu, Shield, Terminal, Zap, Globe, Database, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    className="savant-card group p-10 flex flex-col gap-8"
  >
    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-neon-pink/40 transition-colors duration-700">
      <Icon className="w-8 h-8 text-white/40 group-hover:text-neon-pink transition-colors duration-700" />
    </div>
    <div className="space-y-4">
      <h3 className="text-2xl font-black tracking-tighter text-white/90 group-hover:text-white transition-colors duration-700">
        {title}
      </h3>
      <p className="text-white/40 leading-relaxed text-sm font-medium tracking-tight group-hover:text-white/60 transition-colors duration-700">
        {description}
      </p>
    </div>
    <div className="mt-auto pt-8 border-t border-white/[0.03] flex items-center justify-between">
      <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">
        System_Active
      </span>
      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-neon-pink group-hover:translate-x-2 transition-all duration-700" />
    </div>
  </motion.div>
);

const StatItem = ({ label, value, suffix = "" }: any) => (
  <div className="flex flex-col gap-2">
    <span className="font-mono text-[9px] text-white/30 tracking-[0.4em] uppercase">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-5xl font-black tracking-tighter">{value}</span>
      <span className="text-xl font-black text-neon-pink">{suffix}</span>
    </div>
  </div>
);

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -200]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothLogoScale = useSpring(logoScale, springConfig);
  const smoothHeroY = useSpring(heroY, springConfig);

  return (
    <div ref={containerRef} className="relative">
      <NeuralLattice />
      
      {/* Hero Section */}
      <section className="relative min-h-[150vh] flex flex-col items-center justify-start pt-[20vh] overflow-hidden">
        <motion.div 
          style={{ y: smoothHeroY }}
          className="relative z-20 flex flex-col items-center gap-12 px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[10px] text-neon-pink tracking-[1em] uppercase mb-4"
          >
            [ Protocol_Initiated ]
          </motion.div>
          
          <h1 className="text-massive flex flex-col items-center">
            <motion.span
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              SOVEREIGN
            </motion.span>
            <motion.span
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-editorial text-neon-pink -mt-[0.1em]"
            >
              Intelligence
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="max-w-2xl text-white/40 text-lg font-medium tracking-tight text-balance"
          >
            Savant is a recursive neural architecture designed for the next epoch of digital sovereignty. 
            We build systems that learn, adapt, and evolve in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            <Link to="/os" className="savant-button group">
              <Zap className="w-4 h-4 group-hover:text-neon-pink transition-colors" />
              INITIATE_UPLINK
            </Link>
            <Link to="/work" className="savant-button group">
              <Globe className="w-4 h-4 group-hover:text-gold transition-colors" />
              EXPLORE_ARCHIVE
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D Logo Container */}
        <motion.div
          style={{ 
            scale: smoothLogoScale,
            opacity: logoOpacity,
            position: 'fixed',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-40%',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <Savant3DLogo />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-mono text-[8px] text-white/20 tracking-[0.5em] uppercase">Scroll_to_Decrypt</span>
          <div className="w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="savant-section bg-industrial/50 border-y border-white/[0.03]">
        <div className="w-full max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-20">
          <StatItem label="Neural_Nodes" value="12.4" suffix="K" />
          <StatItem label="Uptime_Protocol" value="99.9" suffix="%" />
          <StatItem label="Data_Throughput" value="850" suffix="TB" />
          <StatItem label="Active_Uplinks" value="4.2" suffix="M" />
        </div>
      </section>

      {/* Core Systems Grid */}
      <section className="savant-section">
        <div className="w-full max-w-7xl flex flex-col gap-32">
          <div className="flex flex-col gap-8 max-w-3xl">
            <span className="font-mono text-[10px] text-neon-pink tracking-[0.8em] uppercase">Core_Architecture</span>
            <h2 className="text-fluid-xl">
              Engineered for <span className="text-editorial text-white/40">Autonomy.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard 
              icon={Cpu}
              title="NEURAL_LATTICE"
              description="Self-correcting neural pathways that optimize for latency and cognitive throughput."
              delay={0.1}
            />
            <FeatureCard 
              icon={Shield}
              title="SOVEREIGN_VAULT"
              description="End-to-end encrypted data sovereignty protocols with zero-knowledge architecture."
              delay={0.2}
            />
            <FeatureCard 
              icon={Terminal}
              title="BRAND_TERMINAL"
              description="Advanced visual identity systems generated through recursive design logic."
              delay={0.3}
            />
            <FeatureCard 
              icon={Database}
              title="QUANTUM_LEDGER"
              description="Immutable data persistence layers with sub-millisecond global synchronization."
              delay={0.4}
            />
            <FeatureCard 
              icon={Activity}
              title="REALTIME_SYNC"
              description="High-frequency state synchronization for collaborative neural environments."
              delay={0.5}
            />
            <FeatureCard 
              icon={Zap}
              title="HYPER_SCALING"
              description="Elastic infrastructure that adapts to demand through predictive load balancing."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Immersive Vision Section */}
      <section className="savant-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-pink/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center gap-16 max-w-5xl">
          <h2 className="text-massive">
            THE_FUTURE_IS <br />
            <span className="text-editorial text-neon-pink">Recursive.</span>
          </h2>
          
          <p className="text-xl text-white/60 font-medium tracking-tight max-w-2xl">
            Join the vanguard of digital intelligence. Savant OS is more than an operating system—it's a new paradigm for human-machine synergy.
          </p>

          <Link to="/os" className="savant-button group scale-125">
            <Terminal className="w-5 h-5 group-hover:text-neon-pink transition-colors" />
            LAUNCH_OS_v80.0.0
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-32 border-t border-white/[0.03] bg-obsidian relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-20">
          <div className="flex flex-col gap-12">
            <div className="text-4xl font-black tracking-tighter">SAVANT_</div>
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
            <div className="font-mono text-[10px] text-white/20 text-right">
              © 2026 SAVANT_RECURSIVE_LOGIC <br />
              ALL_RIGHTS_RESERVED // BUILT_FOR_SOVEREIGNTY
            </div>
            <div className="w-32 h-[1px] bg-white/10" />
          </div>
        </div>
      </footer>
    </div>
  );
}
