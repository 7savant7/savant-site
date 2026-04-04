import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Cpu, Globe, Shield, Zap, Layers, Code, Palette, Terminal, X, ArrowRight, CheckCircle2, Activity, Database, Network } from 'lucide-react';

const ServiceNode = ({ service, active }: { service: any, active: boolean }) => {
  return (
    <div className={`relative flex items-center justify-center transition-all duration-700 ${active ? 'scale-110' : 'scale-100 opacity-40'}`}>
      <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${active ? 'bg-neon-pink/20' : 'bg-transparent'}`} />
      <div className={`relative w-24 h-24 rounded-full border flex items-center justify-center transition-all duration-700 ${active ? 'border-neon-pink bg-neon-pink/10 shadow-[0_0_30px_rgba(255,64,104,0.3)]' : 'border-white/10 bg-white/5'}`}>
        <service.icon size={32} className={active ? 'text-neon-pink' : 'text-white/40'} />
      </div>
      
      {/* Orbital Rings */}
      {active && (
        <>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 border border-neon-pink/20 rounded-full border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-40 h-40 border border-white/10 rounded-full border-dotted"
          />
        </>
      )}
    </div>
  );
};

const ServiceCard = ({ service, i, onSelect }: { service: any, i: number, onSelect: (s: any) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.8 }}
      className="group relative h-full cursor-pointer"
      onClick={() => onSelect(service)}
    >
      <GlassCard className="p-12 h-full border border-white/5 hover:border-neon-pink/30 transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.03] overflow-hidden">
        <div className="absolute -right-10 -top-10 p-8 opacity-5 group-hover:opacity-20 transition-all duration-700 group-hover:scale-110">
          <service.icon size={160} strokeWidth={0.5} />
        </div>
        
        <div className="savant-stack !gap-8 relative z-10">
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon-pink/20 transition-colors duration-500">
              <service.icon size={32} className="text-white group-hover:text-neon-pink transition-colors" />
            </div>
            <div className="font-mono text-[8px] text-white/20 tracking-[0.5em] uppercase">NODE_ID: {service.id}</div>
          </div>
          
          <h3 className="text-4xl title-serif text-white group-hover:text-neon-pink transition-colors duration-500">
            <TextScramble text={service.title} />
          </h3>
          
          <p className="text-lg text-white/40 leading-relaxed font-light">
            {service.desc}
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            {service.features.slice(0, 4).map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 font-mono text-[9px] text-white/30 tracking-widest uppercase">
                <div className="w-1 h-1 bg-neon-pink rounded-full" />
                {feature}
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center gap-2 text-neon-pink font-mono text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
            ACCESS_CAPABILITY <ArrowRight size={12} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function Services() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);

  const services = [
    { 
      id: 'STRAT',
      title: 'CORE_STRATEGY', 
      icon: Cpu, 
      desc: 'Architecting digital ecosystems that redefine market standards and establish sovereign dominance.',
      features: ['MARKET_ANALYSIS', 'ECOSYSTEM_DESIGN', 'FUTURE_PROOFING', 'COMPETITIVE_INTEL', 'SCALABILITY_AUDIT'],
      details: 'Our strategy phase involves deep-dive analysis of market dynamics, identifying untapped opportunities for disruption. We build blueprints for ecosystems that are not just resilient, but evolutionary.'
    },
    { 
      id: 'VISUAL',
      title: 'VISUAL_ENGINEERING', 
      icon: Palette, 
      desc: 'Precision-crafted visual identities that translate complex narratives into powerful geometric languages.',
      features: ['BRAND_GEOMETRY', 'MOTION_SYSTEMS', 'VISUAL_HIERARCHY', 'TYPOGRAPHIC_PRECISION', 'CHROMATIC_LOGIC'],
      details: 'Visual engineering is the art of translating abstract strategy into tangible form. We create design systems that act as a visual manifestation of your brand\'s core values.'
    },
    { 
      id: 'NEURAL',
      title: 'NEURAL_DEVELOPMENT', 
      icon: Code, 
      desc: 'Advanced software engineering utilizing neural architectures and decentralized protocols.',
      features: ['SMART_CONTRACTS', 'AI_INTEGRATION', 'SCALABLE_NODES', 'DECENTRALIZED_LOGIC', 'QUANTUM_READY_CODE'],
      details: 'We build the engines of the future. Our development stack is built on cutting-edge neural frameworks and decentralized protocols to ensure absolute autonomy and performance.'
    },
    { 
      id: 'SECURE',
      title: 'SECURE_INFRASTRUCTURE', 
      icon: Shield, 
      desc: 'Hardened digital fortresses engineered for maximum privacy and absolute data sovereignty.',
      features: ['ENCRYPTION_LAYERS', 'THREAT_MITIGATION', 'SOVEREIGN_HOSTING', 'ZERO_TRUST_ARCH', 'DATA_IMMUTABILITY'],
      details: 'Security is not a feature; it is the foundation. We engineer infrastructure that is impenetrable by design, ensuring your data remains your own, always.'
    },
    { 
      id: 'KINETIC',
      title: 'KINETIC_EXPERIENCES', 
      icon: Zap, 
      desc: 'Immersive digital environments that leverage motion and interactivity to captivate global audiences.',
      features: ['WEBGL_INTERFACES', 'HAPTIC_FEEDBACK', 'SPATIAL_DESIGN', 'INTERACTIVE_NARRATIVES', 'REALTIME_RENDERING'],
      details: 'We create digital spaces that breathe. Kinetic experiences use motion and interaction to create a visceral connection between the user and the brand.'
    },
    { 
      id: 'SYSTEM',
      title: 'SYSTEM_OPTIMIZATION', 
      icon: Terminal, 
      desc: 'Continuous refinement of digital assets to ensure peak performance and maximum efficiency.',
      features: ['LATENCY_REDUCTION', 'LOAD_BALANCING', 'CORE_DIAGNOSTICS', 'PREDICTIVE_MAINTENANCE', 'RESOURCE_ALLOCATION'],
      details: 'The digital landscape is constantly shifting. We provide continuous optimization to ensure your systems are always running at peak efficiency, regardless of load.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodeIndex(prev => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-[80vh] flex flex-col justify-center mb-20 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-12 items-center">
            {services.map((s, i) => (
              <ServiceNode key={s.id} service={s} active={i === activeNodeIndex} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="savant-stack !gap-10 max-w-4xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-[1px] bg-gold" />
              <span className="font-mono text-xs text-gold tracking-[0.8em] uppercase font-bold">CAPABILITIES_MANIFEST_v8.0</span>
            </div>
            
            <h1 className="text-massive title-serif leading-[0.85]">
              SOVEREIGN<br/>
              <span className="text-gold italic font-light text-[0.7em]">Engineering.</span>
            </h1>

            <p className="text-2xl text-white/40 font-light leading-relaxed max-w-2xl">
              We deploy advanced digital architectures designed for absolute autonomy, performance, and market dominance.
            </p>

            <div className="flex gap-8 pt-12">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">System_Uptime</span>
                <span className="text-2xl font-display text-white">99.99%</span>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">Active_Nodes</span>
                <span className="text-2xl font-display text-white">1,024</span>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">Neural_Sync</span>
                <span className="text-2xl font-display text-gold">ACTIVE</span>
              </div>
            </div>
          </motion.div>
        </header>

        <ZoomBlock className="savant-grid md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} i={i} onSelect={setSelectedService} />
          ))}
        </ZoomBlock>

        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="absolute inset-0 bg-obsidian/95 backdrop-blur-2xl"
              />
              
              <motion.div 
                layoutId={`service-${selectedService.id}`}
                className="relative w-full max-w-5xl bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden p-12 lg:p-20 bg-black/40 backdrop-blur-xl"
              >
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-neon-pink hover:border-neon-pink transition-all"
                >
                  <X size={20} />
                </button>

                <div className="savant-stack !gap-12">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-neon-pink/20 flex items-center justify-center">
                      <selectedService.icon size={48} className="text-neon-pink" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase mb-2">CAPABILITY_NODE // {selectedService.id}</div>
                      <h2 className="text-5xl lg:text-7xl font-display text-white leading-none">{selectedService.title}</h2>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-20">
                    <div className="savant-stack !gap-8">
                      <p className="text-2xl text-white/60 font-light leading-relaxed">
                        {selectedService.details}
                      </p>

                      <div className="savant-stack !gap-6">
                        <div className="font-mono text-[10px] text-neon-pink tracking-[0.5em] uppercase">CORE_FEATURES</div>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedService.features.map((f: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 text-white/40 font-mono text-xs tracking-widest uppercase p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                              <CheckCircle2 size={14} className="text-neon-pink" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="savant-stack !gap-12">
                      <div className="savant-stack !gap-6">
                        <div className="font-mono text-[10px] text-gold tracking-[0.5em] uppercase">SYSTEM_METRICS</div>
                        <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 space-y-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity size={120} strokeWidth={0.5} />
                          </div>
                          
                          <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-end">
                              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Efficiency</span>
                              <span className="font-mono text-2xl text-white">99.9%</span>
                            </div>
                            <div className="h-[2px] bg-white/10 w-full relative overflow-hidden rounded-full">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '99.9%' }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="absolute inset-0 bg-neon-pink" 
                              />
                            </div>
                            
                            <div className="flex justify-between items-end">
                              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Uptime</span>
                              <span className="font-mono text-2xl text-white">100%</span>
                            </div>
                            <div className="h-[2px] bg-white/10 w-full relative overflow-hidden rounded-full">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5, delay: 0.7 }}
                                className="absolute inset-0 bg-gold" 
                              />
                            </div>

                            <div className="flex justify-between items-end">
                              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Latency</span>
                              <span className="font-mono text-2xl text-emerald-400">0.004ms</span>
                            </div>
                            <div className="h-[2px] bg-white/10 w-full relative overflow-hidden rounded-full">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5, delay: 0.9 }}
                                className="absolute inset-0 bg-emerald-400" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                          <Database size={20} className="text-gold" />
                        </div>
                        <div>
                          <div className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">Data_Sovereignty</div>
                          <div className="text-white font-mono text-xs tracking-widest">ENCRYPTED_AES_256</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <SavantButton variant="primary" className="w-full h-24 text-xl tracking-[0.2em]">
                      INITIATE_SERVICE_UPLINK
                    </SavantButton>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <section className="py-40 mt-40 border-t border-white/10">
          <div className="savant-grid lg:grid-cols-12 items-center">
            <div className="lg:col-span-6">
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display leading-[0.9] mb-12">
                ENGINEERED_FOR_<br/>
                <span className="text-neon-pink">SOVEREIGNTY.</span>
              </h2>
              <p className="text-xl text-white/40 font-light leading-relaxed max-w-xl">
                We don't just build websites; we engineer digital legacies. Our approach combines rigorous technical precision with avant-garde creative vision.
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="p-12 border border-white/5 bg-white/[0.01] rounded-[3rem] savant-stack !gap-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="flex justify-between items-center relative z-10">
                  <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">CORE_EFFICIENCY</span>
                  <span className="font-mono text-[10px] text-gold tracking-widest uppercase">99.9%_OPTIMAL</span>
                </div>
                <div className="h-[1px] bg-white/10 w-full relative overflow-hidden rounded-full">
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-gold origin-left"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div>
                    <div className="text-4xl font-display text-white">120+</div>
                    <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase mt-2">NODES_DEPLOYED</div>
                  </div>
                  <div>
                    <div className="text-4xl font-display text-white">24/7</div>
                    <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase mt-2">CORE_MONITORING</div>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-4">
                    <Network size={20} className="text-neon-pink" />
                    <span className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase">Global_Lattice_Network_Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
