import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Cpu, Globe, Shield, Zap, Layers, Code, Palette, Terminal } from 'lucide-react';

const ServiceCard = ({ service, i }: { service: any, i: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.8 }}
      className="group relative h-full"
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
            {service.features.map((feature: string, idx: number) => (
              <li key={idx} className="flex items-center gap-3 font-mono text-[10px] text-white/30 tracking-widest uppercase">
                <div className="w-1 h-1 bg-crimson rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function Services() {
  const services = [
    { 
      title: 'CORE_STRATEGY', 
      icon: Cpu, 
      desc: 'Architecting digital ecosystems that redefine market standards and establish sovereign dominance.',
      features: ['MARKET_ANALYSIS', 'ECOSYSTEM_DESIGN', 'FUTURE_PROOFING']
    },
    { 
      title: 'VISUAL_ENGINEERING', 
      icon: Palette, 
      desc: 'Precision-crafted visual identities that translate complex narratives into powerful geometric languages.',
      features: ['BRAND_GEOMETRY', 'MOTION_SYSTEMS', 'VISUAL_HIERARCHY']
    },
    { 
      title: 'NEURAL_DEVELOPMENT', 
      icon: Code, 
      desc: 'Advanced software engineering utilizing neural architectures and decentralized protocols.',
      features: ['SMART_CONTRACTS', 'AI_INTEGRATION', 'SCALABLE_NODES']
    },
    { 
      title: 'SECURE_INFRASTRUCTURE', 
      icon: Shield, 
      desc: 'Hardened digital fortresses engineered for maximum privacy and absolute data sovereignty.',
      features: ['ENCRYPTION_LAYERS', 'THREAT_MITIGATION', 'SOVEREIGN_HOSTING']
    },
    { 
      title: 'KINETIC_EXPERIENCES', 
      icon: Zap, 
      desc: 'Immersive digital environments that leverage motion and interactivity to captivate global audiences.',
      features: ['WEBGL_INTERFACES', 'HAPTIC_FEEDBACK', 'SPATIAL_DESIGN']
    },
    { 
      title: 'SYSTEM_OPTIMIZATION', 
      icon: Terminal, 
      desc: 'Continuous refinement of digital assets to ensure peak performance and maximum efficiency.',
      features: ['LATENCY_REDUCTION', 'LOAD_BALANCING', 'CORE_DIAGNOSTICS']
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
            <ServiceCard key={i} service={service} i={i} />
          ))}
        </ZoomBlock>

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
