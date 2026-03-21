import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SavantButton } from '../components/ui/SavantButton';
import { MagneticButton } from '../components/MagneticButton';
import { 
  ArrowUpRight, 
  Terminal, 
  Fingerprint, 
  Network, 
  Cpu, 
  Quote,
  Zap
} from 'lucide-react';
import Savant3DLogo from '../components/Savant3DLogo';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState(4);

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div className="relative bg-[#050505] text-white overflow-hidden font-sans">
      {/* Section 01: THE CENTERPIECE (Hero) */}
      <section 
        ref={heroRef}
        className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20"
      >
        <motion.div 
          style={{ y, opacity, scale }}
          className="w-full h-[50vh] relative z-10"
        >
          <Savant3DLogo variant={variant} className="w-full h-full" />
        </motion.div>

        {/* Atmospheric Background - Simplified */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.02)_0%,transparent_70%)]" />
        </div>

        <div className="container mx-auto px-5 md:px-10 lg:px-20 relative z-20 text-center -mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="text-6xl md:text-[10vw] font-black leading-none tracking-tighter uppercase select-none">
              SAVANT_<br />
              <span className="text-[#ff003c] italic font-serif font-light">SYNDICATE.</span>
            </h1>
            
            <p className="max-w-lg text-lg md:text-xl text-white/40 font-light leading-relaxed">
              Sovereign creative engine for iconic digital legacies.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <button 
                onClick={() => setVariant(4)}
                className={`px-6 py-3 rounded-full border transition-all duration-500 font-mono text-[8px] tracking-[0.3em] uppercase ${variant === 4 ? 'bg-white text-black border-white' : 'bg-transparent text-white/30 border-white/10 hover:border-white/40'}`}
              >
                OPALINE
              </button>
              <button 
                onClick={() => setVariant(5)}
                className={`px-6 py-3 rounded-full border transition-all duration-500 font-mono text-[8px] tracking-[0.3em] uppercase ${variant === 5 ? 'bg-[#ff003c] text-white border-[#ff003c]' : 'bg-transparent text-white/30 border-white/10 hover:border-white/40'}`}
              >
                BIOTIC
              </button>
            </div>
          </motion.div>
        </div>
      </section>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
        >
          <span className="font-mono text-[8px] text-white/20 tracking-[0.6em] uppercase">SCROLL_TO_EXPLORE</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>

      {/* Section 02: THE MANIFESTO (Editorial) - Simplified */}
      <section className="py-32 px-5 md:px-10 lg:px-20 bg-white text-[#050505]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-12 text-center">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
              THE <span className="text-[#ff003c] italic font-serif font-light">SOVEREIGN</span> MINDSET.
            </h2>
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-[#050505]/60 max-w-3xl mx-auto">
              We engineer for the inevitable future where intelligence is the only currency.
            </p>
          </div>
        </div>
      </section>

      {/* Section 03: SYSTEM ARCHITECTURE (Grid) - Simplified */}
      <section className="py-32 px-5 md:px-10 lg:px-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Terminal, title: "NEURAL_OS", desc: "Autonomous intelligence layer." },
              { icon: Fingerprint, title: "BIO_SYNC", desc: "Biometric security integration." },
              { icon: Network, title: "FRACTAL_NET", desc: "Zero latency architecture." },
              { icon: Cpu, title: "QUANTUM_CORE", desc: "Transcendent processing power." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-6 p-8 border border-white/5 hover:border-white/20 transition-all duration-500">
                <item.icon className="text-[#ff003c]" size={32} strokeWidth={1} />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title}</h3>
                <p className="text-white/40 font-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 04: SELECTED ARTIFACTS (Exhibition) - Simplified */}
      <section className="py-32 px-5 md:px-10 lg:px-20 bg-white text-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { title: "NEURAL_LATTICE", category: "CORE_ENGINE", img: "https://picsum.photos/seed/neural/1200/800" },
              { title: "CHRONOS_FLUX", category: "TIME_DILATION", img: "https://picsum.photos/seed/time/1200/800" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-6 group cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#f5f5f5]">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[8px] text-[#ff003c] tracking-[0.3em] uppercase font-bold">{item.category}</span>
                    <h3 className="text-2xl font-bold tracking-tighter uppercase">{item.title}</h3>
                  </div>
                  <ArrowUpRight className="text-[#050505]/20 group-hover:text-[#ff003c] transition-all duration-500" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 05: CALL TO ACTION - Simplified */}
      <section className="py-48 bg-[#050505] flex flex-col items-center justify-center text-center px-5 relative overflow-hidden">
        <div className="flex flex-col gap-12 max-w-3xl relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase">
            READY TO <span className="text-[#ff003c] italic font-serif font-light">ASCEND?</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/40 font-light leading-relaxed">
            Partner with Savant to redefine your digital sovereignty.
          </p>
          <div className="flex justify-center pt-8">
            <button className="px-12 py-6 text-sm font-mono tracking-[0.3em] bg-white text-black hover:bg-[#ff003c] hover:text-white transition-all duration-500 rounded-full uppercase">
              INITIATE_CONTACT
            </button>
          </div>
        </div>

        {/* Footer Metadata - Simplified */}
        <div className="absolute bottom-12 left-10 right-10 flex justify-between items-end font-mono text-[6px] text-white/10 tracking-[0.4em] uppercase">
          <div className="flex flex-col gap-1">
            <span>NODE_ID: SAVANT_ALPHA_01</span>
          </div>
          <div className="text-center">
            © 2026 SAVANT SYNDICATE
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span>ENCRYPTION: AES_512</span>
          </div>
        </div>
      </section>
    </div>
  );
}
