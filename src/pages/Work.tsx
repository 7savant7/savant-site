import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextScramble } from '../components/TextScramble';
import { ParallaxImage } from '../components/ParallaxImage';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { ArrowUpRight, Globe, Zap, Shield } from 'lucide-react';

const WorkItem = ({ work, i }: { work: any, i: number }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <motion.div 
      ref={container}
      style={{ opacity, scale }}
      className={`savant-grid lg:grid-cols-12 items-center min-h-[80vh] py-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className={`lg:col-span-7 ${i % 2 !== 0 ? 'lg:order-2' : ''} relative group`}>
        <div className="absolute -inset-4 bg-crimson/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02]">
          <ParallaxImage 
            src={work.img}
            alt={work.title}
            className="w-full aspect-[16/10] object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] scale-110 group-hover:scale-100"
            offset={80}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
          
          {/* HUD Overlay */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="font-mono text-[8px] text-white/40 tracking-[0.5em] uppercase">
              PROJECT_ID: {work.id} // SECTOR_0{i+1}
            </div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className={`lg:col-span-4 ${i % 2 !== 0 ? 'lg:order-1' : 'lg:col-start-9'}`}>
        <motion.div style={{ y }} className="savant-stack !gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-crimson" />
            <span className="font-mono text-[10px] text-crimson tracking-[0.6em] uppercase font-bold">
              {work.category}
            </span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display leading-[0.8] tracking-tighter text-white">
            <TextScramble text={work.title} />
          </h2>
          
          <p className="text-xl md:text-2xl text-white/40 leading-relaxed font-light max-w-md">
            {work.desc}
          </p>

          <div className="flex flex-wrap gap-4">
            {['Strategy', 'Design', 'Development'].map((tag) => (
              <span key={tag} className="px-4 py-1.5 border border-white/5 bg-white/[0.02] rounded-full font-mono text-[9px] text-white/30 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-10">
            <MagneticButton strength={0.2}>
              <SavantButton 
                variant="primary"
                className="w-full sm:w-64 h-20 group/btn"
              >
                <span className="flex items-center gap-3">
                  VIEW_ARTIFACT
                  <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </span>
              </SavantButton>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Work() {
  const works = [
    { id: '01', title: 'OBLIVION', category: 'GLOBAL_REBRAND', desc: 'A comprehensive brand transformation for a leading luxury house, redefining elegance for the digital elite.', img: 'https://picsum.photos/seed/oblivion/1600/1000' },
    { id: '02', title: 'LATTICE', category: 'ADVERTISING_IMPACT', desc: 'A high-energy, kinetic advertising campaign that captured global attention and drove unprecedented growth.', img: 'https://picsum.photos/seed/lattice/1600/1000' },
    { id: '03', title: 'VOID', category: 'VISUAL_IDENTITY', desc: 'Meticulous design systems engineered to translate complex strategies into powerful visual geometry.', img: 'https://picsum.photos/seed/void/1600/1000' },
    { id: '04', title: 'NEURAL', category: 'AI_INTEGRATION', desc: 'Advanced neural networks integrated into consumer products, creating seamless human-machine synergy.', img: 'https://picsum.photos/seed/neural/1600/1000' }
  ];

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-[70vh] flex flex-col justify-center mb-40">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.05, x: 0 }}
              transition={{ duration: 2 }}
              className="absolute -top-20 -left-10 font-display text-[25vw] text-white pointer-events-none select-none"
            >
              ARCHIVE
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="text-massive font-display relative z-10"
            >
              SELECTED<br/>
              <span className="text-crimson italic font-serif font-light text-[0.7em]">Artifacts.</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 flex justify-between items-end border-t border-white/10 pt-10"
          >
            <div className="max-w-md">
              <p className="text-xl text-white/30 font-light leading-relaxed">
                A curated selection of our most impactful creative interventions. Each project is a testament to our commitment to excellence and innovation.
              </p>
            </div>
            <div className="hidden lg:block rail-text h-40 opacity-20">
              SAVANT_OS_ARCHIVE_v80.0.0_SELECTED_WORKS_MANIFEST
            </div>
          </motion.div>
        </header>

        <div className="savant-stack !gap-0">
          {works.map((work, i) => (
            <WorkItem key={work.id} work={work} i={i} />
          ))}
        </div>

        <footer className="py-40 border-t border-white/10 flex flex-col items-center text-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display mb-12">READY_TO_BUILD_YOUR_LEGACY?</h2>
          <MagneticButton strength={0.3}>
            <SavantButton variant="primary" className="px-16 h-24 text-xl">
              INITIATE_UPLINK
            </SavantButton>
          </MagneticButton>
        </footer>
      </div>
    </div>
  );
}
