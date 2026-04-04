import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { TextScramble } from '../components/TextScramble';
import { ParallaxImage } from '../components/ParallaxImage';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { ArrowUpRight, X, Zap, Shield, Cpu, Globe, Activity, Layers, Terminal, Box, ChevronRight, Filter } from 'lucide-react';

const WorkItem = ({ work, i, onSelect }: { work: any, i: number, onSelect: (w: any) => void }) => {
  const container = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [2, -2]);

  return (
    <motion.div 
      ref={container}
      style={{ opacity, scale, rotate }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`savant-grid lg:grid-cols-12 items-center min-h-screen py-32 relative ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Background Telemetry */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/20" />
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-white/20" />
        <div className="absolute left-1/4 top-0 w-[1px] h-full bg-white/20" />
        <div className="absolute left-3/4 top-0 w-[1px] h-full bg-white/20" />
      </div>

      <div className={`lg:col-span-7 ${i % 2 !== 0 ? 'lg:order-2' : ''} relative group cursor-pointer`} onClick={() => onSelect(work)}>
        <div className="absolute -inset-10 bg-gold/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-obsidian shadow-2xl transform-gpu transition-transform duration-1000 group-hover:scale-[1.02]">
          <ParallaxImage 
            src={work.img}
            alt={work.title}
            className="w-full aspect-[16/10] object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-110 group-hover:scale-100"
            offset={100}
          />
          
          {/* Overlay UI */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
          
          <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="savant-stack !gap-2">
                <div className="font-mono text-[8px] text-gold tracking-[0.6em] uppercase font-bold">SECTOR_0{i+1}</div>
                <div className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">ID: {work.id}</div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Layers size={16} className="text-white/40" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="savant-stack !gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase">ENCRYPTED_ARTIFACT</span>
                </div>
                <h3 className="text-4xl font-display text-white tracking-tighter uppercase">{work.title}</h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center transform translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
                <ArrowUpRight size={24} className="text-obsidian" />
              </div>
            </div>
          </div>

          {/* Scanline Effect */}
          <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
        </div>
      </div>

      <div className={`lg:col-span-4 ${i % 2 !== 0 ? 'lg:order-1' : 'lg:col-start-9'}`}>
        <motion.div style={{ y }} className="savant-stack !gap-12 relative">
          <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          
          <div className="savant-stack !gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-[1px] bg-gold" />
              <span className="font-mono text-[10px] text-gold tracking-[0.8em] uppercase font-black italic">
                {work.category}
              </span>
            </div>
            
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl title-serif leading-[0.8] tracking-tighter text-white">
              <TextScramble text={work.title} />
            </h2>
          </div>
          
          <p className="text-2xl text-white/30 leading-relaxed font-light max-w-md group-hover:text-white/50 transition-colors duration-700">
            {work.desc}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {work.stats.slice(0, 2).map((stat: any, idx: number) => (
              <div key={idx} className="p-6 border border-white/5 bg-white/[0.01] rounded-2xl savant-stack !gap-2">
                <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{stat.label}</div>
                <div className="text-xl font-tech font-bold text-white">{stat.val}</div>
              </div>
            ))}
          </div>

          <div className="pt-10">
            <MagneticButton strength={0.2}>
              <SavantButton 
                onClick={() => onSelect(work)}
                variant="outline"
                className="w-full h-20 group/btn rounded-full border-white/10 hover:border-gold hover:bg-gold/5"
              >
                <span className="flex items-center gap-4 tracking-[0.3em] font-black italic">
                  DECRYPT_DATA
                  <ChevronRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
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
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [activeSector, setActiveSector] = useState('ALL_SECTORS');

  const sectors = ['ALL_SECTORS', 'STRATEGY', 'IDENTITY', 'NEURAL', 'IMPACT'];

  const works = [
    { 
      id: '01', 
      title: 'OBLIVION', 
      category: 'IDENTITY', 
      desc: 'A comprehensive brand transformation for a leading luxury house, redefining elegance for the digital elite.', 
      img: 'https://picsum.photos/seed/oblivion/1920/1080',
      stats: [
        { label: 'GLOBAL_REACH', val: '42M+', icon: Globe },
        { label: 'CONVERSION', val: '+240%', icon: Zap },
        { label: 'SECURITY', val: 'LOCKED', icon: Shield }
      ]
    },
    { 
      id: '02', 
      title: 'LATTICE', 
      category: 'IMPACT', 
      desc: 'A high-energy, kinetic advertising campaign that captured global attention and drove unprecedented growth.', 
      img: 'https://picsum.photos/seed/lattice/1920/1080',
      stats: [
        { label: 'IMPRESSIONS', val: '1.2B', icon: Activity },
        { label: 'VELOCITY', val: 'HIGH', icon: Zap },
        { label: 'NODES', val: '8.4K', icon: Cpu }
      ]
    },
    { 
      id: '03', 
      title: 'VOID', 
      category: 'STRATEGY', 
      desc: 'Meticulous design systems engineered to translate complex strategies into powerful visual geometry.', 
      img: 'https://picsum.photos/seed/void/1920/1080',
      stats: [
        { label: 'PRECISION', val: '99.9%', icon: Shield },
        { label: 'ASSETS', val: '4.2K', icon: Cpu },
        { label: 'SYNC', val: 'ACTIVE', icon: Activity }
      ]
    },
    { 
      id: '04', 
      title: 'NEURAL', 
      category: 'NEURAL', 
      desc: 'Advanced neural networks integrated into consumer products, creating seamless human-machine synergy.', 
      img: 'https://picsum.photos/seed/neural/1920/1080',
      stats: [
        { label: 'COGNITION', val: 'OMEGA', icon: Cpu },
        { label: 'LATENCY', val: '0.4ms', icon: Zap },
        { label: 'UPTIME', val: '100%', icon: Shield }
      ]
    }
  ];

  const filteredWorks = activeSector === 'ALL_SECTORS' 
    ? works 
    : works.filter(w => w.category === activeSector);

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-screen flex flex-col justify-center mb-40 relative overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.03, x: 0 }}
              transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
              className="absolute -top-40 -left-20 title-serif text-[35vw] text-white pointer-events-none select-none leading-none"
            >
              ARCHIVE
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="savant-stack !gap-12"
            >
              <div className="flex items-center gap-8">
                <div className="w-24 h-[1px] bg-gold" />
                <span className="font-mono text-xs text-gold tracking-[1em] uppercase font-black italic">PROPRIETARY_MANIFEST_v9.4</span>
              </div>

              <h1 className="text-massive title-serif relative z-10 leading-[0.8]">
                SELECTED<br/>
                <span className="text-gold italic font-light text-[0.7em]">Artifacts.</span>
              </h1>

              <div className="flex flex-col md:flex-row justify-between items-end gap-12 mt-20 pt-12 border-t border-white/10">
                <div className="max-w-xl">
                  <p className="text-2xl text-white/30 font-light leading-relaxed">
                    A curated selection of our most impactful creative interventions. Each artifact is a sovereign testament to our commitment to unprecedented excellence.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {sectors.map((sector) => (
                    <button 
                      key={sector}
                      onClick={() => setActiveSector(sector)}
                      className={`px-8 py-3 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all duration-500 border ${activeSector === sector ? 'bg-gold text-obsidian border-gold' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'}`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        <div className="savant-stack !gap-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSector}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {filteredWorks.map((work, i) => (
                <WorkItem key={work.id} work={work} i={i} onSelect={setSelectedWork} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedWork && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedWork(null)}
                className="absolute inset-0 bg-obsidian/98 backdrop-blur-3xl"
              />
              
              <motion.div 
                layoutId={`work-${selectedWork.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="relative w-full max-w-7xl h-[90vh] bg-white/[0.02] border border-white/10 rounded-[4rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="absolute top-10 right-10 z-50 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-obsidian transition-all duration-500"
                >
                  <X size={24} />
                </button>

                <div className="flex-1 relative h-1/2 lg:h-full overflow-hidden group">
                  <img src={selectedWork.img} alt={selectedWork.title} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-12 left-12 savant-stack !gap-4">
                    <div className="font-mono text-[10px] text-gold tracking-[0.5em] uppercase font-bold">ARTIFACT_VISUAL_DATA</div>
                    <div className="flex gap-2">
                      {[1,2,3,4].map(i => <div key={i} className="w-12 h-1 bg-white/10 rounded-full overflow-hidden"><motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="h-full bg-gold/40 w-1/2" /></div>)}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[600px] p-12 lg:p-24 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-center bg-black/40 backdrop-blur-3xl overflow-y-auto custom-scrollbar">
                  <div className="savant-stack !gap-12">
                    <div className="savant-stack !gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-gold" />
                        <span className="font-mono text-[10px] text-gold tracking-[0.6em] uppercase font-black italic">{selectedWork.category}</span>
                      </div>
                      <h2 className="text-6xl lg:text-9xl font-display text-white leading-none tracking-tighter">{selectedWork.title}</h2>
                    </div>
                    
                    <p className="text-2xl text-white/40 font-light leading-relaxed">
                      {selectedWork.desc}
                    </p>

                    <div className="grid grid-cols-1 gap-10">
                      {selectedWork.stats.map((stat: any, i: number) => (
                        <div key={i} className="flex items-center gap-8 p-8 border border-white/5 bg-white/[0.02] rounded-3xl group/stat hover:bg-white/5 transition-all duration-500">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/stat:border-gold transition-colors">
                            <stat.icon className="text-gold" size={24} />
                          </div>
                          <div>
                            <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mb-2">{stat.label}</div>
                            <div className="text-3xl font-tech font-bold text-white tracking-tight">{stat.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-10">
                      <SavantButton variant="primary" className="w-full h-24 text-xl rounded-full font-black italic tracking-[0.2em]">
                        EXPLORE_CASE_STUDY
                      </SavantButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <footer className="py-60 border-t border-white/10 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/5 blur-[150px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="savant-stack !gap-16 relative z-10"
          >
            <div className="font-mono text-xs text-gold tracking-[1em] uppercase font-bold">NEXT_PHASE</div>
            <h2 className="text-5xl sm:text-7xl md:text-9xl font-display leading-none tracking-tighter">
              READY_TO_BUILD<br/>
              YOUR_LEGACY?
            </h2>
            
            <MagneticButton strength={0.3}>
              <SavantButton variant="primary" className="px-24 h-28 text-2xl rounded-full font-black italic tracking-[0.2em]">
                INITIATE_UPLINK
              </SavantButton>
            </MagneticButton>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
