import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Cpu, Globe, Shield, Zap, Layers, Code, Palette, Terminal, X, ArrowRight, CheckCircle2 } from 'lucide-react';

const ServiceCard = ({ service, i, onSelect }: { service: any, i: number, onSelect: (s: any) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.8 }}
      className="group relative h-full cursor-pointer"
      onClick={() => onSelect(service)}
    >
      <GlassCard className="p-12 h-full border border-white/5 hover:border-crimson/30 transition-all duration-700 bg-white/[0.01] hover:bg-white/[0.03]">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
          <service.icon size={80} strokeWidth={0.5} />
        </div>
        
        <div className="savant-stack !gap-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-crimson/20 transition-colors duration-500">
            <service.icon size={32} className="text-white group-hover:text-crimson transition-colors" />
          </div>
          
          <h3 className="text-4xl font-display text-white group-hover:text-crimson transition-colors duration-500">
            <TextScramble text={service.title} />
          </h3>
          
          <p className="text-lg text-white/40 leading-relaxed font-light">
            {service.desc}
          </p>
          
          <ul className="savant-stack !gap-4 pt-6 border-t border-white/5">
            {service.features.slice(0, 3).map((feature: string, idx: number) => (
              <li key={idx} className="flex items-center gap-3 font-mono text-[10px] text-white/30 tracking-widest uppercase">
                <div className="w-1 h-1 bg-crimson rounded-full" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="pt-4 flex items-center gap-2 text-crimson font-mono text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            EXPLORE_CAPABILITY <ArrowRight size={12} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function Services() {
  const [selectedService, setSelectedService] = useState<any>(null);

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

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-[60vh] flex flex-col justify-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="savant-stack !gap-10"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-[1px] bg-electric-gold" />
              <span className="font-mono text-xs text-electric-gold tracking-[0.8em] uppercase font-bold">CAPABILITIES_MANIFEST</span>
            </div>
            
            <h1 className="text-massive font-display">
              ELITE<br/>
              <span className="text-electric-gold italic font-serif font-light text-[0.7em]">Capabilities.</span>
            </h1>
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
                className="relative w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden p-12 lg:p-20 bg-black/40 backdrop-blur-xl"
              >
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-crimson hover:border-crimson transition-all"
                >
                  <X size={20} />
                </button>

                <div className="savant-stack !gap-12">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-crimson/20 flex items-center justify-center">
                      <selectedService.icon size={48} className="text-crimson" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase mb-2">CAPABILITY_NODE</div>
                      <h2 className="text-5xl lg:text-7xl font-display text-white leading-none">{selectedService.title}</h2>
                    </div>
                  </div>

                  <p className="text-2xl text-white/60 font-light leading-relaxed">
                    {selectedService.details}
                  </p>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="savant-stack !gap-6">
                      <div className="font-mono text-[10px] text-crimson tracking-[0.5em] uppercase">CORE_FEATURES</div>
                      <div className="space-y-4">
                        {selectedService.features.map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-4 text-white/40 font-mono text-xs tracking-widest uppercase">
                            <CheckCircle2 size={14} className="text-crimson" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="savant-stack !gap-6">
                      <div className="font-mono text-[10px] text-electric-gold tracking-[0.5em] uppercase">SYSTEM_METRICS</div>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="font-mono text-[8px] text-white/20 uppercase">Efficiency</span>
                          <span className="font-mono text-xl text-white">99.9%</span>
                        </div>
                        <div className="h-[1px] bg-white/10 w-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-crimson w-[99.9%]" />
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="font-mono text-[8px] text-white/20 uppercase">Uptime</span>
                          <span className="font-mono text-xl text-white">100%</span>
                        </div>
                        <div className="h-[1px] bg-white/10 w-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-electric-gold w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <SavantButton variant="primary" className="w-full h-20 text-lg">
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
              <span className="text-crimson">SOVEREIGNTY.</span>
            </h2>
              <p className="text-xl text-white/40 font-light leading-relaxed max-w-xl">
                We don't just build websites; we engineer digital legacies. Our approach combines rigorous technical precision with avant-garde creative vision.
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="p-12 border border-white/5 bg-white/[0.01] rounded-[3rem] savant-stack !gap-8">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">CORE_EFFICIENCY</span>
                  <span className="font-mono text-[10px] text-electric-gold tracking-widest uppercase">99.9%_OPTIMAL</span>
                </div>
                <div className="h-[1px] bg-white/10 w-full relative overflow-hidden">
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-electric-gold origin-left"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-display text-white">120+</div>
                    <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase mt-2">NODES_DEPLOYED</div>
                  </div>
                  <div>
                    <div className="text-4xl font-display text-white">24/7</div>
                    <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase mt-2">CORE_MONITORING</div>
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
