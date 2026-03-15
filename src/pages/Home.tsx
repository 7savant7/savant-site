import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TechButton } from '../components/TechButton';
import { HeroSlider } from '../components/HeroSlider';
import { TextScramble } from '../components/TextScramble';
import { ParallaxText } from '../components/ParallaxText';
import { ParallaxImage } from '../components/ParallaxImage';
import { ZoomBlock } from '../components/ZoomBlock';
import { SavantCard } from '../components/ui/SavantCard';
import { SavantButton } from '../components/ui/SavantButton';
import { Marquee } from '../components/Marquee';
import { DataGrid } from '../components/DataGrid';
import { ArrowUpRight, Shield, Zap, Cpu, Globe, Database, Terminal, Layers, Activity, Lock, Eye } from 'lucide-react';
import { VisualBrandingPipeline } from '../components/VisualBrandingPipeline';
import { NeuralLattice } from '../components/NeuralLattice';
import { MagneticButton } from '../components/MagneticButton';
import { GlassCard } from '../components/ui/GlassCard';

gsap.registerPlugin(ScrollTrigger);

import { SunGodsLogo } from '../components/SunGodsLogo';

export default function Home() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.5]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  useEffect(() => {
    // GSAP Cinematic Entrance
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.from(titleRef.current, {
        y: 200,
        opacity: 0,
        skewY: 15,
        scale: 0.8,
        duration: 3,
        ease: "expo.out",
      });

      // Complex Scroll Timeline for Section 01
      gsap.to("#sec-01-bg", {
        scrollTrigger: {
          trigger: "#sec-01",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        },
        y: -300,
        scale: 1.5,
        opacity: 1,
        filter: "blur(150px)"
      });

      // Staggered reveal for artifacts
      gsap.from(".artifact-card", {
        scrollTrigger: {
          trigger: "#sec-02-5",
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.3,
        duration: 1.5,
        ease: "power4.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col relative">
      <NeuralLattice />
      
      {/* Hero Section with Sun Gods Logo */}
      <div ref={heroRef} className="h-screen relative overflow-hidden bg-obsidian">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }} 
          className="absolute inset-0 z-0"
        >
          <SunGodsLogo />
        </motion.div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1.5 }}
            className="savant-stack items-center"
          >
            <div className="font-mono text-[10px] text-crimson tracking-[1em] uppercase mb-4">
              SOVEREIGN_LATTICE_INITIALIZED
            </div>
            <div className="w-px h-24 bg-gradient-to-b from-crimson to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Hero Slider Section */}
      <div className="h-screen relative bg-obsidian border-y border-white/5">
        <HeroSlider />
      </div>

      {/* Section 01: THE STUDIO */}
      <ZoomBlock className="min-h-screen flex items-center bg-obsidian py-32 -mx-5 md:-mx-10 lg:-mx-20 px-5 md:px-10 lg:px-20">
        <section id="sec-01" className="w-full relative savant-section">
          <div id="sec-01-bg" className="absolute inset-0 bg-crimson/5 blur-3xl rounded-full pointer-events-none -z-10" />
          
          <div className="max-w-7xl w-full mx-auto savant-stack">
            <div className="relative mb-32">
              <motion.div 
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 0.1, x: 0 }}
                transition={{ duration: 2 }}
                className="font-serif italic text-[18vw] text-crimson absolute -z-10 -top-24 -left-12 whitespace-nowrap pointer-events-none select-none"
              >
                <TextScramble text="brutal_design" />
              </motion.div>
              
              <div ref={titleRef}>
                <h1 className="font-display font-black text-8xl md:text-[16rem] text-white leading-[0.8] tracking-tighter mix-blend-difference">
                  <TextScramble text="Savant." /><br />
                  <span className="text-crimson italic font-serif font-light text-[0.6em]">Creative.</span><br />
                  Syndicate.
                </h1>
              </div>
            </div>

            <div className="savant-grid lg:grid-cols-12 items-start">
              <div className="lg:col-span-6 savant-stack">
                <div className="h-[2px] bg-white/5 w-full relative overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileInView={{ x: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-crimson to-transparent"
                  />
                </div>
                
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.2
                      }
                    }
                  }}
                  className="savant-stack"
                >
                  <ParallaxText offset={30} className="text-3xl md:text-5xl text-white/90 leading-[1.1] font-display font-bold tracking-tight">
                    Savant is a <span className="text-crimson italic font-serif">premier creative studio</span> dedicated to the joy of crafting iconic brands.
                  </ParallaxText>
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className="savant-stack text-xl text-white/40 leading-relaxed max-w-2xl font-light"
                  >
                    <p>
                      We believe in the kinetic energy of great ideas. Savant provides the creative spark and technical precision required to build, deploy, and maintain category-defining brands and digital experiences.
                    </p>
                    <p>
                      We don't just build websites; we craft brand legacies. We find joy in the details, deconstructing and rebuilding identities with a passion for excellence. Welcome to the studio.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className="flex flex-col sm:flex-row gap-5 sm:gap-10 pt-8"
                  >
                    <MagneticButton strength={0.2}>
                      <SavantButton 
                        variant="primary"
                        className="w-full sm:w-56 h-16"
                      >
                        EXPLORE_SERVICES
                      </SavantButton>
                    </MagneticButton>
                    <MagneticButton strength={0.2}>
                      <SavantButton 
                        variant="outline"
                        className="w-full sm:w-56 h-16"
                      >
                        VIEW_PORTFOLIO
                      </SavantButton>
                    </MagneticButton>
                  </motion.div>
                </motion.div>
              </div>

              <div className="lg:col-span-5 lg:col-start-8">
                <GlassCard className="p-12 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-crimson/50" />
                  
                  <div className="flex items-center gap-4 mb-10">
                    <h3 className="font-display font-black text-5xl text-white">
                      <TextScramble text="Creative_Load" />
                    </h3>
                    <span className="w-3 h-3 bg-electric-gold rounded-full animate-ping" />
                  </div>
                  
                  <div className="savant-stack">
                    {[
                      { label: 'BRAND_RESONANCE', val: '98.7%', color: 'bg-crimson', status: 'PEAK' },
                      { label: 'CAMPAIGN_VELOCITY', val: 'LEVEL_42', color: 'bg-electric-gold', status: 'ACCELERATING' },
                      { label: 'CREATIVE_SYNERGY', val: '99.999%', color: 'bg-white', status: 'OPTIMAL' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between font-mono text-[10px] tracking-widest text-white/50">
                          <span className="flex items-center gap-2">
                            <span className={`w-1 h-1 ${item.color} rounded-full`} />
                            {item.label}
                          </span>
                          <span className="text-white">{item.val} <span className="opacity-30 ml-2">[{item.status}]</span></span>
                        </div>
                        <div className="h-[4px] bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: item.val }}
                            transition={{ duration: 2, ease: "circOut", delay: i * 0.3 }}
                            className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 gap-8">
                    <div>
                      <div className="font-mono text-[8px] text-white/30 mb-2">ACTIVE_PROJECTS</div>
                      <div className="text-2xl font-bold text-white">04</div>
                    </div>
                    <div>
                      <div className="font-mono text-[8px] text-white/30 mb-2">COFFEE_CONSUMED</div>
                      <div className="text-2xl font-bold text-electric-gold">4.2 GAL/D</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>
      </ZoomBlock>

      {/* Section 02: SELECTED WORKS */}
      <ZoomBlock className="min-h-screen flex items-center bg-industrial-gray py-32 -mx-5 md:-mx-10 lg:-mx-20 px-5 md:px-10 lg:px-20">
        <section id="sec-02" className="w-full max-w-7xl mx-auto savant-grid lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[16/10] border border-white/10 relative overflow-hidden group shadow-2xl"
            >
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2670&auto=format&fit=crop"
                alt="Selected Work"
                className="absolute inset-0 grayscale brightness-50 contrast-150 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000"
                offset={150}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 border-[20px] border-obsidian/50 pointer-events-none" />
              
              <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="block font-mono text-[10px] text-white/40 tracking-[0.5em]">CLIENT_ID_42_OMEGA</span>
                    <span className="block font-mono text-[10px] text-crimson font-bold tracking-widest">CLASS: GLOBAL_BRAND</span>
                  </div>
                  <div className="w-16 h-16 border border-white/20 flex items-center justify-center rotate-45">
                    <div className="w-8 h-8 bg-crimson rotate-45 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-display font-black text-6xl text-white tracking-tighter">Neuro_Link_v6</h4>
                  <p className="font-mono text-xs text-white/40 max-w-md">
                    Complete brand deconstruction and digital platform engineering for a next-generation neural interface company.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Floating Data Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 -bottom-12 p-8 bg-crimson border border-white/20 shadow-2xl z-20 hidden md:block"
            >
               <div className="font-mono text-[10px] text-white/60 mb-2">AWARDS_WON</div>
               <div className="text-3xl font-black text-white">#04_FWA</div>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              className="space-y-12"
            >
              <motion.h2 
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="font-display font-black text-8xl text-white tracking-tighter leading-[0.9]"
              >
                <TextScramble text="Selected_" /> <br />
                <span className="text-crimson italic font-serif text-[0.7em]">Works.</span>
              </motion.h2>
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="space-y-8 text-xl text-white/50 leading-relaxed font-light"
              >
                <p>
                  Every project generated within the Savant studio is a unique, handcrafted artifact. We utilize <b className="text-white">brutal, uncompromising design principles</b> to ensure maximum impact and market dominance.
                </p>
              </motion.div>
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="grid grid-cols-2 gap-8 pt-8"
              >
                 <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-500">
                    <div className="font-mono text-[10px] text-white/30 mb-4 tracking-widest">LINES_OF_CODE</div>
                    <div className="text-5xl font-black text-white">3.1M+</div>
                    <div className="h-1 w-12 bg-crimson mt-6" />
                 </div>
                 <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-500">
                    <div className="font-mono text-[10px] text-white/30 mb-4 tracking-widest">PIXELS_PUSHED</div>
                    <div className="text-5xl font-black text-electric-gold">14B+</div>
                    <div className="h-1 w-12 bg-electric-gold mt-6" />
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </ZoomBlock>

      {/* Marquee Section */}
      <Marquee 
        items={['NEURAL_LINK', 'OBLIVION', 'FRACTAL_LOGIC', 'SOVEREIGN_OS', 'QUANTUM_CORE', 'SYNDICATE']} 
        speed={30}
        className="bg-industrial-gray"
      />

      {/* Section 02.5: FEATURED ARTIFACTS */}
      <section id="sec-02-5" className="py-40 bg-obsidian relative overflow-hidden savant-section">
        <div className="container mx-auto px-5 md:px-10 lg:px-20 savant-stack">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-7xl font-display mb-6">FEATURED<br/><span className="text-crimson">ARTIFACTS</span></h2>
              <p className="text-xl text-white/50 leading-relaxed">
                A collection of high-fidelity digital constructs developed within the Savant ecosystem. 
                Each artifact represents a unique intersection of logic and aesthetics.
              </p>
            </div>
            <div className="flex gap-4">
              <TechButton>SEE_CASE_STUDIES</TechButton>
            </div>
          </div>

          <div className="savant-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "01", title: "NEURAL_LATTICE", category: "CORE_ENGINE", img: "https://picsum.photos/seed/neural/800/1000" },
              { id: "02", title: "CHRONOS_FLUX", category: "TIME_DILATION", img: "https://picsum.photos/seed/time/800/1000" },
              { id: "03", title: "VOID_RESONANCE", category: "SPATIAL_LOGIC", img: "https://picsum.photos/seed/void/800/1000" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="artifact-card group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5"
                whileHover={{ y: -20 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <ParallaxImage 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  offset={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="text-[10px] font-mono text-crimson mb-2 tracking-widest">{item.category}</div>
                  <h3 className="text-3xl font-display">{item.title}</h3>
                  <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-mono text-white/40">ID: {item.id}</span>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 02.7: Visual Branding Pipeline */}
      <VisualBrandingPipeline />

      {/* Section 02.8: Split Layout Philosophy */}
      <section className="split-layout border-y border-white/5 min-h-screen">
        <div className="relative overflow-hidden group p-5 md:p-10 lg:p-20 flex flex-col justify-center">
          <img 
            src="https://picsum.photos/seed/logic/1200/1600" 
            alt="Logic" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-obsidian/60" />
          <div className="relative z-10 savant-stack">
            <span className="text-crimson font-mono text-xs mb-4 tracking-[0.5em]">01_STRATEGY</span>
            <h2 className="text-8xl font-display mb-8">KINETIC<br/>IDEAS</h2>
            <p className="text-lg text-white/60 max-w-md">
              The spark of every iconic brand is a kinetic idea. 
              We don't just plan; we ignite movements.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden group bg-crimson/5 p-5 md:p-10 lg:p-20 flex flex-col justify-center border-l border-white/5">
          <div className="absolute inset-0 neural-lattice-overlay opacity-20" />
          <div className="relative z-10 savant-stack">
            <span className="text-electric-gold font-mono text-xs mb-4 tracking-[0.5em]">02_CRAFT</span>
            <h2 className="text-8xl font-display mb-8">TACTILE<br/>JOY</h2>
            <p className="text-lg text-white/60 max-w-md">
              We find joy in the tactile details of branding. 
              From metallic foils to digital precision, the craft is our obsession.
            </p>
            <div className="mt-12">
              <TechButton>OUR_CAPABILITIES</TechButton>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: CAPABILITIES */}
      <ZoomBlock className="min-h-screen flex items-center bg-industrial-gray py-32 -mx-5 md:-mx-10 lg:-mx-20 px-5 md:px-10 lg:px-20">
        <section id="sec-03" className="w-full max-w-7xl mx-auto savant-stack">
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32">
            <div className="max-w-3xl">
              <motion.h2 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="font-display font-black text-8xl md:text-[14rem] text-white tracking-tighter leading-[0.8]"
              >
                <TextScramble text="Studio_" /> <br />
                <span className="text-electric-gold italic font-serif text-[0.6em]">Arsenal.</span>
              </motion.h2>
            </div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              className="max-w-md text-right flex flex-col items-end savant-stack"
            >
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="text-2xl text-white/40 leading-relaxed font-light"
              >
                The tools and disciplines we deploy to dominate the digital landscape. No fluff, just raw capability.
              </motion.p>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
                <MagneticButton strength={0.3}>
                  <SavantButton 
                    variant="primary"
                    className="w-full sm:w-64 h-20"
                  >
                    START_A_PROJECT
                  </SavantButton>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          <div className="savant-grid md:grid-cols-3">
            {[
              { title: 'BRAND_IDENTITY', subtitle: 'Visual_Dominance', val: '01', desc: 'Deconstructing market norms to build aggressive, unforgettable visual identities.', color: 'text-crimson' },
              { title: 'DIGITAL_PRODUCT', subtitle: 'Sovereign_Systems', val: '02', desc: 'Engineering hyper-advanced web applications and sovereign digital platforms.', color: 'text-electric-gold' },
              { title: '3D_INTERACTIVE', subtitle: 'Immersive_Voids', val: '03', desc: 'Crafting immersive WebGL experiences that blur the line between reality and the digital void.', color: 'text-white' }
            ].map((card, i) => (
              <GlassCard 
                key={i}
                className="group relative overflow-hidden p-10"
              >
                <div className="font-mono text-[8px] text-white/20 mb-4 tracking-[0.5em]">{card.subtitle}</div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                <div className={`text-8xl font-black mb-8 tracking-tighter ${card.color}`}>{card.val}</div>
                <h3 className="text-2xl font-display text-white mb-4">{card.title}</h3>
                <p className="text-lg text-white/40 leading-relaxed font-light">{card.desc}</p>
                <div className="mt-12 flex items-center gap-4">
                  <div className="h-[1px] bg-white/10 flex-1" />
                  <span className="font-mono text-[8px] text-white/20">LEARN_MORE</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-32">
            <DataGrid 
              title="SYNDICATE_OPERATIONS_FEED"
              data={[
                { id: '0x42A', label: 'PROJECT_OMEGA', value: '98.2%', status: 'OPTIMAL' },
                { id: '0x11B', label: 'NEURAL_LATTICE', value: 'LEVEL_4', status: 'SYNCING' },
                { id: '0x99C', label: 'OBLIVION_VAULT', value: 'SECURED', status: 'OPTIMAL' },
                { id: '0x77D', label: 'SYSTEM_UPGRADE', value: 'IN_PROGRESS', status: 'CRITICAL' },
                { id: '0x33E', label: 'CLIENT_UPLINK', value: 'ESTABLISHED', status: 'OPTIMAL' },
              ]}
            />
          </div>

          {/* Advanced System Log Module */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-24 p-5 md:p-10 lg:p-12 border border-white/10 bg-obsidian/80 backdrop-blur-3xl font-mono text-[11px] text-white/40 relative group"
          >
             <div className="absolute top-0 left-0 w-full h-[2px] bg-crimson/30" />
             <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-crimson rounded-full animate-pulse" />
                  <span className="text-white font-bold tracking-[0.4em]">LIVE_STUDIO_LOG</span>
                </div>
                <div className="flex gap-6 text-[9px] tracking-widest">
                  <span>LOCATION: <b className="text-white">UNDERGROUND</b></span>
                  <span>STATUS: <b className="text-electric-gold">OPERATIONAL</b></span>
                </div>
             </div>
              <div className="savant-grid md:grid-cols-2 h-64 overflow-hidden relative">
                <div className="savant-stack !gap-3">
                  <div className="flex gap-4"><span className="text-white/20">[04:23:36]</span> <span>INITIALIZING BRAND_PIPELINE...</span></div>
                  <div className="flex gap-4"><span className="text-white/20">[04:23:37]</span> <span className="text-electric-gold">DEPLOYING GLOBAL_CAMPAIGN...</span></div>
                  <div className="flex gap-4"><span className="text-white/20">[04:23:38]</span> <span className="text-crimson font-bold">INSIGHT: AUDIENCE_RESONANCE_MAXIMIZED</span></div>
                  <div className="flex gap-4"><span className="text-white/20">[04:23:39]</span> <span>REFINING VISUAL_GEOMETRY...</span></div>
                  <div className="flex gap-4"><span className="text-white/20">[04:23:40]</span> <span>BRAND_STABILIZED_AT_PEAK_IMPACT</span></div>
                  <div className="flex gap-4"><span className="text-white/20">[04:23:41]</span> <span className="text-white">UPLINK_ESTABLISHED: CREATIVE_NETWORK</span></div>
                  <div className="flex gap-4"><span className="text-white/20">[04:23:42]</span> <span>MAPPING_BRAND_JOURNEY...</span></div>
                </div>
                <div className="savant-stack !gap-3 opacity-40">
                  <div className="flex gap-4"><span>{">"}</span> <span>ALLOCATING_RENDER_RESOURCES...</span></div>
                  <div className="flex gap-4"><span>{">"}</span> <span>ENCRYPTING_ASSETS...</span></div>
                  <div className="flex gap-4"><span>{">"}</span> <span className="text-crimson">PROTOCOL_42_ACTIVE</span></div>
                  <div className="flex gap-4"><span>{">"}</span> <span>STANDBY_FOR_DEPLOYMENT...</span></div>
                  <div className="flex gap-4"><span>{">"}</span> <span>CODE_INTEGRITY: 100%</span></div>
                  <div className="flex gap-4"><span>{">"}</span> <span>RECURSIVE_LOOPS: OPTIMIZED</span></div>
                  <div className="flex gap-4"><span>{">"}</span> <span>BEAST_MODE: ENABLED</span></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-obsidian to-transparent pointer-events-none" />
             </div>
          </motion.div>
        </section>
      </ZoomBlock>
    </div>
  );
}
