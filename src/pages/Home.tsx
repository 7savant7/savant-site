import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Savant3DLogo from '../components/Savant3DLogo';
import { ArrowRight, Layers, Cpu, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const RevealText = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  </div>
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div ref={containerRef} className="w-full bg-obsidian text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <Savant3DLogo />
        </div>
        
        <motion.div 
          style={{ y: y1, opacity, scale }}
          className="relative z-10 flex flex-col items-center text-center w-full px-6"
        >
          <div className="font-mono text-[10px] md:text-xs text-gold tracking-[0.5em] md:tracking-[1em] uppercase font-bold mb-8">
            <RevealText>Sovereign Creative Engine</RevealText>
          </div>
          
          <h1 className="text-massive title-serif leading-[0.8] tracking-tighter uppercase mix-blend-difference">
            <RevealText>Carte</RevealText>
            <RevealText delay={0.1}>Blanche.</RevealText>
          </h1>
          
          <div className="mt-12 max-w-2xl mx-auto">
            <RevealText delay={0.2}>
              <p className="text-lg md:text-2xl text-white/60 font-light leading-relaxed">
                We don't execute ideas. We transcend them. A fractal approach to identity, architecture, and absolute market dominance.
              </p>
            </RevealText>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="font-mono text-[8px] text-white/40 tracking-widest uppercase">Scroll to Descend</div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* --- PHILOSOPHY: DEEP STACK --- */}
      <section className="py-40 px-6 md:px-12 relative z-10 bg-obsidian">
        <div className="max-w-7xl mx-auto savant-grid">
          <div className="md:col-span-4">
            <div className="sticky top-40">
              <div className="font-mono text-xs text-gold tracking-[0.5em] uppercase mb-8">01 // The Philosophy</div>
              <h2 className="text-5xl md:text-7xl title-serif leading-none tracking-tighter mb-8">
                FRACTAL<br/>DEPTH.
              </h2>
              <p className="text-white/40 font-light leading-relaxed mb-12">
                Most studios decorate the surface. We architect the core. We analyze your entire operational matrix to build a bespoke identity that makes your company undeniably efficient and ideal in its field.
              </p>
              <Link to="/services" className="inline-flex items-center gap-4 font-mono text-xs text-white hover:text-gold transition-colors tracking-widest uppercase group">
                Explore Methodology
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-7 md:col-start-6 savant-stack mt-20 md:mt-0">
            {[
              { title: "Holistic Analysis", desc: "We don't just ask what you want to look like. We audit your entire business model, identifying inefficiencies and opportunities for systemic dominance.", icon: Layers },
              { title: "Carte Blanche Design", desc: "You trust us with absolute creative sovereignty. Unshackled by preconceived notions, we engineer the optimal, unprecedented solution.", icon: Zap },
              { title: "Proprietary Systems", desc: "Every client receives a tailor-made, deeply customized framework. No templates. No standard libraries. Only elite, bespoke architecture.", icon: Cpu }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.2 }}
                className="glass-panel p-12 md:p-16 rounded-[2rem] group hover:border-gold/30 transition-colors duration-700"
              >
                <item.icon className="w-12 h-12 text-gold mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-3xl md:text-4xl title-serif mb-6">{item.title}</h3>
                <p className="text-lg text-white/50 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HUMAN X AI SYNERGY --- */}
      <section className="py-40 relative overflow-hidden bg-gunmetal">
        <div className="absolute inset-0 noise-overlay opacity-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="font-mono text-xs text-ethereal tracking-[0.5em] uppercase mb-12">02 // The Synergy</div>
          <h2 className="text-huge title-serif leading-[0.85] tracking-tighter mb-16">
            <RevealText>HUMAN</RevealText>
            <RevealText delay={0.1}><span className="text-gold italic">×</span> AI</RevealText>
            <RevealText delay={0.2}>SYMBIOSIS.</RevealText>
          </h2>
          <div className="max-w-3xl mx-auto">
            <RevealText delay={0.3}>
              <p className="text-xl md:text-3xl text-white/60 font-light leading-relaxed">
                Savant operates on a foundation of profound mutual respect between human intuition and artificial intelligence. We do not replace the human element; we elevate it to god-tier capabilities through seamless, proprietary technological integration.
              </p>
            </RevealText>
          </div>
        </div>
      </section>

      {/* --- THE WORK PREVIEW --- */}
      <section className="py-40 px-6 md:px-12 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <div className="font-mono text-xs text-gold tracking-[0.5em] uppercase mb-4">03 // The Archive</div>
              <h2 className="text-6xl md:text-8xl title-serif leading-none tracking-tighter">SELECTED<br/>ARTIFACTS.</h2>
            </div>
            <Link to="/work" className="hidden md:flex items-center gap-4 font-mono text-xs text-white hover:text-gold transition-colors tracking-widest uppercase group">
              View Full Archive
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "OBLIVION", category: "Identity System", img: "https://picsum.photos/seed/oblivion/800/1000" },
              { title: "LATTICE", category: "Neural Architecture", img: "https://picsum.photos/seed/lattice/800/1000" }
            ].map((work, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.2 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] cursor-pointer"
              >
                <img src={work.img} alt={work.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="font-mono text-xs text-gold tracking-[0.5em] uppercase mb-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">{work.category}</div>
                  <h3 className="text-5xl title-serif text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{work.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
