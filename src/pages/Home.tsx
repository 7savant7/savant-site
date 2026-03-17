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
import Magnetic from '../components/Magnetic';
import Glow from '../components/Glow';
import { GeometricSymbol } from '../components/GeometricSymbol';
import FractalExplorer from '../components/FractalExplorer';
import { useStore } from '../store/useStore';
import { useLoading } from '../contexts/LoadingContext';

gsap.registerPlugin(ScrollTrigger);

const NeuralBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
    <svg className="w-full h-full" viewBox="0 0 1000 1000">
      <defs>
        <radialGradient id="neural-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff003c" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[...Array(20)].map((_, i) => (
        <motion.circle
          key={i}
          cx={Math.random() * 1000}
          cy={Math.random() * 1000}
          r={Math.random() * 2 + 1}
          fill="white"
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
      {[...Array(15)].map((_, i) => (
        <motion.line
          key={i}
          x1={Math.random() * 1000}
          y1={Math.random() * 1000}
          x2={Math.random() * 1000}
          y2={Math.random() * 1000}
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.1"
          animate={{
            strokeOpacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </svg>
  </div>
);

const ArtifactCard = ({ item, i }: { item: any, i: number }) => (
  <motion.div 
    className="artifact-card group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700"
    whileHover={{ y: -15, scale: 1.02 }}
    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
  >
    <Glow color="rgba(255,0,60,0.15)" blur="100px">
      <div className="relative w-full h-full">
        <ParallaxImage 
          src={item.img} 
          alt={item.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-105"
          offset={60}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-90" />
        
        {/* HUD Overlay */}
        <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="font-mono text-[7px] md:text-[8px] text-white/40 tracking-[0.4em] uppercase truncate pr-4">
            SCANNING_ARTIFACT_{item.id}
          </div>
          <div className="flex gap-1 md:gap-1.5 shrink-0">
            <div className="w-1 h-1 rounded-full bg-crimson animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
          </div>
        </div>

        <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 md:gap-3"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-4 md:w-6 h-[1px] bg-crimson" />
              <span className="font-mono text-[8px] md:text-[9px] text-crimson tracking-[0.5em] uppercase font-bold">{item.category}</span>
            </div>
            <h3 className="text-xl md:text-3xl font-display leading-tight tracking-tighter text-white group-hover:glitch-text">{item.title}</h3>
            
            <div className="mt-2 md:mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="flex flex-col gap-0.5 md:gap-1">
                <span className="text-[7px] md:text-[8px] font-mono text-white/20 uppercase tracking-widest">Neural_Sync</span>
                <span className="text-[10px] md:text-xs font-mono text-electric-gold font-black">0.99{i}</span>
              </div>
              <Magnetic strength={0.3}>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-crimson hover:text-white transition-all duration-500">
                  <ArrowUpRight size={14} className="md:w-[18px] md:h-[18px]" />
                </div>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>
    </Glow>
  </motion.div>
);

export default function Home() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { finishLoading } = useLoading();

  useEffect(() => {
    // Ensure loading finishes when Home mounts
    const timer = setTimeout(finishLoading, 1000);
    return () => clearTimeout(timer);
  }, [finishLoading]);

  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroBlur = useTransform(heroScroll, [0, 0.5], [0, 20]);

  useEffect(() => {
    // GSAP Cinematic Entrance & Magnetic Effects
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      
      tl.from(".hero-title-line", {
        y: 150,
        opacity: 0,
        skewY: 10,
        stagger: 0.2,
        duration: 2,
        ease: "expo.out",
      })
      .from(".hero-subtitle", {
        opacity: 0,
        y: 20,
        duration: 1.5,
        ease: "power3.out"
      }, "-=1")
      .from(".hero-scroll-indicator", {
        scaleY: 0,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.5");

      // Magnetic Title Effect
      const magneticTitle = document.querySelector('.magnetic-title');
      if (magneticTitle) {
        magneticTitle.addEventListener('mousemove', (e: any) => {
          const { clientX, clientY } = e;
          const { left, top, width, height } = magneticTitle.getBoundingClientRect();
          const x = (clientX - (left + width / 2)) * 0.15;
          const y = (clientY - (top + height / 2)) * 0.15;
          gsap.to(magneticTitle, { x, y, duration: 0.5, ease: "power2.out" });
        });
        magneticTitle.addEventListener('mouseleave', () => {
          gsap.to(magneticTitle, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
        });
      }

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
      
      {/* Hero Section - Massively Upgraded */}
      <div ref={heroRef} className="h-screen relative overflow-hidden bg-obsidian flex items-center justify-center">
        {/* Background Layers */}
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity, filter: `blur(${heroBlur}px)` }} 
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,60,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/50 to-obsidian" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-5 md:px-10 lg:px-20 flex flex-col items-center text-center">
          <motion.div 
            className="magnetic-title cursor-default select-none"
            whileHover={{ skewX: -2 }}
          >
            <h1 className="font-display font-black text-[14vw] sm:text-[12vw] md:text-[10vw] leading-[0.85] tracking-tighter text-white uppercase">
              <div className="hero-title-line overflow-hidden">
                <span className="block">Sovereign</span>
              </div>
              <div className="hero-title-line overflow-hidden text-crimson italic font-serif font-light">
                <span className="block">Intelligence</span>
              </div>
              <div className="hero-title-line overflow-hidden">
                <span className="block">Syndicate</span>
              </div>
            </h1>
          </motion.div>

          <div className="hero-subtitle mt-12 max-w-2xl">
            <p className="text-white/40 font-mono text-xs md:text-sm tracking-[0.3em] uppercase leading-relaxed">
              Engineering the next epoch of digital dominance. <br />
              Fractal logic. Absolute autonomy. <span className="text-white">Savant_v5.2</span>
            </p>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 hero-subtitle">
            <MagneticButton strength={0.1}>
              <SavantButton variant="primary" className="px-12 h-16 text-xs tracking-[0.2em]">
                INITIATE_UPLINK
              </SavantButton>
            </MagneticButton>
            <MagneticButton strength={0.1}>
              <SavantButton variant="outline" className="px-12 h-16 text-xs tracking-[0.2em]">
                CORE_TELEMETRY
              </SavantButton>
            </MagneticButton>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 hero-scroll-indicator">
          <div className="font-mono text-[8px] text-white/20 tracking-[0.5em] uppercase">Scroll_to_Explore</div>
          <div className="w-[1px] h-24 bg-gradient-to-b from-crimson via-crimson/50 to-transparent relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-white"
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Decorative HUD Elements */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 hidden xl:flex flex-col gap-24 font-mono text-[8px] text-white/10 tracking-[1em] uppercase vertical-text rotate-180">
          <span>System_Status: Optimal</span>
          <span>Neural_Lattice: Active</span>
        </div>
        <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden xl:flex flex-col gap-24 font-mono text-[8px] text-white/10 tracking-[1em] uppercase vertical-text">
          <span>Build: 42_Omega_Stable</span>
          <span>Sync_Rate: 99.99%</span>
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
                <h1 className="font-display font-black text-[clamp(3rem,12vw,16rem)] text-white leading-[0.8] tracking-tighter mix-blend-difference">
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
      <ZoomBlock className="min-h-screen flex items-center bg-obsidian py-40 -mx-5 md:-mx-10 lg:-mx-20 px-5 md:px-10 lg:px-20 relative">
        <NeuralBackground />
        <section id="sec-02" className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { id: "01", title: "NEURAL_LATTICE", category: "CORE_ENGINE", img: "https://picsum.photos/seed/neural/800/1000" },
                { id: "02", title: "CHRONOS_FLUX", category: "TIME_DILATION", img: "https://picsum.photos/seed/time/800/1000" },
                { id: "03", title: "VOID_RESONANCE", category: "SPATIAL_LOGIC", img: "https://picsum.photos/seed/void/800/1000" },
                { id: "04", title: "OBLIVION_CORE", category: "ENTROPY_MGMT", img: "https://picsum.photos/seed/oblivion/800/1000" }
              ].map((item, i) => (
                <ArtifactCard key={i} item={item} i={i} />
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
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
                className="font-display font-black text-6xl sm:text-7xl md:text-[8rem] lg:text-[10rem] text-white tracking-tighter leading-[0.8]"
              >
                <TextScramble text="Selected_" /> <br />
                <span className="text-crimson italic font-serif text-[0.7em]">Works.</span>
              </motion.h2>
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="space-y-8 text-2xl text-white/50 leading-relaxed font-light max-w-xl"
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
                className="grid grid-cols-2 gap-12 pt-12"
              >
                 <div className="p-10 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 rounded-3xl group/stat">
                    <div className="font-mono text-[11px] text-white/30 mb-6 tracking-[0.4em] group-hover/stat:text-crimson transition-colors">LINES_OF_CODE</div>
                    <div className="text-6xl font-black text-white tracking-tighter">3.1M+</div>
                    <div className="h-1.5 w-16 bg-crimson mt-8" />
                 </div>
                 <div className="p-10 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 rounded-3xl group/stat">
                    <div className="font-mono text-[11px] text-white/30 mb-6 tracking-[0.4em] group-hover/stat:text-electric-gold transition-colors">PIXELS_PUSHED</div>
                    <div className="text-6xl font-black text-electric-gold tracking-tighter">14B+</div>
                    <div className="h-1.5 w-16 bg-electric-gold mt-8" />
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

      {/* Section 02.7: Visual Branding Pipeline */}
      <VisualBrandingPipeline />

      {/* Section 02.8: Fractal Architecture Explorer */}
      <section className="savant-section bg-obsidian relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-4">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-crimson" />
                  <span className="text-crimson font-mono text-[10px] tracking-[0.5em] font-bold uppercase">RECURSIVE_LOGIC</span>
                </div>
                <h2 className="text-7xl md:text-8xl font-display leading-[0.85] tracking-tighter">
                  FRACTAL<br/><span className="text-white/20 italic font-serif font-light">ARCHITECTURE</span>
                </h2>
                <p className="text-xl text-white/40 leading-relaxed font-light max-w-sm">
                  Explore the infinite depths of our design system. Every node is a universe, every line a protocol. Zoom into the core of Savant.
                </p>
                <div className="pt-8">
                  <Magnetic strength={0.2}>
                    <div className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-crimson transition-colors duration-500">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-crimson rounded-full"
                        />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">INITIATE_DEEP_SCAN</span>
                    </div>
                  </Magnetic>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <FractalExplorer />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02.9: Split Layout Philosophy */}
      <section className="split-layout border-y border-white/5 min-h-screen bg-obsidian">
        <div className="relative overflow-hidden group p-10 md:p-20 lg:p-32 flex flex-col justify-center">
          <ParallaxImage 
            src="https://picsum.photos/seed/logic/1200/1600" 
            alt="Logic" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-110 transition-transform duration-[3s]"
            offset={100}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
          <div className="relative z-10 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-crimson" />
              <span className="text-crimson font-mono text-xs tracking-[0.5em] font-bold uppercase">01_STRATEGY</span>
            </motion.div>
            <h2 className="text-massive font-display leading-[0.8] tracking-tighter">KINETIC<br/><span className="text-white/20 italic font-serif font-light">IDEAS</span></h2>
            <p className="text-2xl text-white/40 max-w-lg leading-relaxed font-light">
              The spark of every iconic brand is a kinetic idea. 
              We don't just plan; we ignite movements that redefine the cultural zeitgeist.
            </p>
            <div className="pt-10">
              <Magnetic strength={0.2}>
                <TechButton>EXPLORE_STRATEGY</TechButton>
              </Magnetic>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden group bg-crimson/[0.02] p-10 md:p-20 lg:p-32 flex flex-col justify-center border-l border-white/5">
          <div className="absolute inset-0 neural-lattice-overlay opacity-10" />
          <div className="relative z-10 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-electric-gold" />
              <span className="text-electric-gold font-mono text-xs tracking-[0.5em] font-bold uppercase">02_CRAFT</span>
            </motion.div>
            <h2 className="text-massive font-display leading-[0.8] tracking-tighter">TACTILE<br/><span className="text-white/20 italic font-serif font-light">JOY</span></h2>
            <p className="text-2xl text-white/40 max-w-lg leading-relaxed font-light">
              We find joy in the tactile details of branding. 
              From metallic foils to digital precision, the craft is our obsession and our legacy.
            </p>
            <div className="pt-10">
              <Magnetic strength={0.2}>
                <TechButton>OUR_CAPABILITIES</TechButton>
              </Magnetic>
            </div>
          </div>
          
          {/* Decorative HUD Element */}
          <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none">
            <div className="font-mono text-[8px] text-white tracking-[0.5em] uppercase mb-2">Craft_Status</div>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 h-4 bg-electric-gold"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: CAPABILITIES */}
      <ZoomBlock className="min-h-screen flex items-center bg-industrial-gray py-40 -mx-5 md:-mx-10 lg:-mx-20 px-5 md:px-10 lg:px-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <section id="sec-03" className="w-full max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-20 mb-40">
            <div className="max-w-4xl">
              <motion.h2 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-6xl sm:text-7xl md:text-[12rem] lg:text-[16rem] text-white tracking-tighter leading-[0.75]"
              >
                <TextScramble text="Studio_" /> <br />
                <span className="text-electric-gold italic font-serif text-[0.55em] font-light">Arsenal.</span>
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
              className="max-w-md text-right flex flex-col items-end space-y-10"
            >
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="text-3xl text-white/30 leading-relaxed font-light italic"
              >
                The tools and disciplines we deploy to dominate the digital landscape. No fluff, just raw capability.
              </motion.p>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
                <Magnetic strength={0.3}>
                  <SavantButton 
                    variant="primary"
                    className="w-full sm:w-72 h-24 text-xl"
                  >
                    START_A_PROJECT
                  </SavantButton>
                </Magnetic>
              </motion.div>
            </motion.div>
          </div>

          <div className="savant-grid md:grid-cols-2 lg:grid-cols-4 gap-1">
            {[
              { title: "NEURAL_BRANDING", desc: "Generative identity systems that evolve with your audience.", icon: "01", color: "text-crimson" },
              { title: "KINETIC_UI", desc: "High-fidelity motion systems for immersive digital experiences.", icon: "02", color: "text-electric-gold" },
              { title: "SOVEREIGN_STRATEGY", desc: "Uncompromising market positioning and cultural engineering.", icon: "03", color: "text-white" },
              { title: "QUANTUM_DEV", desc: "Next-generation full-stack architectures built for speed.", icon: "04", color: "text-white/40" }
            ].map((cap, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="p-12 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 group/cap relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-0 group-hover/cap:scale-x-100 transition-transform duration-700" />
                <div className={`text-[10px] font-mono mb-8 tracking-[0.5em] font-bold ${cap.color}`}>{cap.icon}</div>
                <h3 className="text-3xl font-display mb-6 group-hover/cap:text-crimson transition-colors">{cap.title}</h3>
                <p className="text-white/40 leading-relaxed font-light">{cap.desc}</p>
                <div className="mt-10 opacity-0 group-hover/cap:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight size={20} className="text-white/20" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advanced System Log Module */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-40 p-10 md:p-20 border border-white/10 bg-black/40 backdrop-blur-3xl font-mono text-[11px] text-white/40 relative group rounded-3xl overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-crimson via-electric-gold to-transparent" />
             <div className="flex justify-between items-center mb-16 border-b border-white/5 pb-10">
                <div className="flex items-center gap-6">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-crimson rounded-full" 
                  />
                  <span className="text-white font-black tracking-[0.6em] text-sm uppercase italic">LIVE_STUDIO_TELEMETRY_v8.2</span>
                </div>
                <div className="flex gap-10 text-[10px] tracking-[0.3em] font-bold">
                  <span>LOCATION: <b className="text-white">DEEP_CORE</b></span>
                  <span>STATUS: <b className="text-emerald-400">OPTIMAL</b></span>
                  <span>UPTIME: <b className="text-electric-gold">99.999%</b></span>
                </div>
             </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 h-80 overflow-hidden relative">
                <div className="space-y-4">
                  {[
                    { time: "04:23:36", msg: "INITIALIZING BRAND_PIPELINE...", level: "INFO" },
                    { time: "04:23:37", msg: "DEPLOYING GLOBAL_CAMPAIGN...", level: "CRITICAL" },
                    { time: "04:23:38", msg: "INSIGHT: AUDIENCE_RESONANCE_MAXIMIZED", level: "SUCCESS" },
                    { time: "04:23:39", msg: "REFINING VISUAL_GEOMETRY...", level: "INFO" },
                    { time: "04:23:40", msg: "BRAND_STABILIZED_AT_PEAK_IMPACT", level: "SUCCESS" },
                    { time: "04:23:41", msg: "UPLINK_ESTABLISHED: CREATIVE_NETWORK", level: "INFO" },
                    { time: "04:23:42", msg: "MAPPING_BRAND_JOURNEY...", level: "INFO" },
                    { time: "04:23:43", msg: "NEURAL_LATTICE_SYNC_COMPLETE", level: "SUCCESS" }
                  ].map((log, i) => (
                    <div key={i} className="flex gap-6 group/log">
                      <span className="text-white/10 group-hover/log:text-white/30 transition-colors">[{log.time}]</span> 
                      <span className={
                        log.level === 'CRITICAL' ? 'text-electric-gold' : 
                        log.level === 'SUCCESS' ? 'text-emerald-400' : 
                        log.level === 'ERROR' ? 'text-crimson' : 
                        'text-white/40'
                      }>{log.msg}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 opacity-30 hidden lg:block">
                  {[
                    "ALLOCATING_RENDER_RESOURCES...",
                    "ENCRYPTING_ASSETS...",
                    "PROTOCOL_42_ACTIVE",
                    "STANDBY_FOR_DEPLOYMENT...",
                    "CODE_INTEGRITY: 100%",
                    "RECURSIVE_LOOPS: OPTIMIZED",
                    "BEAST_MODE: ENABLED",
                    "TRUTH_ANCHOR: LOCKED"
                  ].map((msg, i) => (
                    <div key={i} className="flex gap-6">
                      <span className="text-white/20">{">"}</span> 
                      <span className={i === 2 ? 'text-crimson font-bold' : ''}>{msg}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
             </div>
          </motion.div>
        </section>
      </ZoomBlock>
    </div>
  );
}
