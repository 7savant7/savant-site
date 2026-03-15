import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import gsap from 'gsap';

export const VisualBrandingPipeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-40"
    >
      <motion.div 
        style={{ scale: springScale, opacity, y }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-crimson" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-crimson">
                  Visual_Branding_Pipeline_v80
                </span>
              </div>
              
              <h2 className="text-massive font-display">
                THE DNA <br />
                <span className="text-crimson">OF SAVANT</span>
              </h2>
              
              <p className="text-xl text-white/60 max-w-md leading-relaxed">
                Our visual identity is not a static asset. It is a generative algorithm, 
                constantly evolving based on system telemetry and cognitive load.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-10">
                {[
                  { label: "COGNITIVE_LOAD", value: "88%" },
                  { label: "NEURAL_SYNC", value: "0.992" },
                  { label: "TRUTH_ANCHOR", value: "LOCKED" },
                  { label: "LATENCY", value: "0.002ms" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-tech font-bold text-electric-gold">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-crimson/5 rounded-full blur-[100px] animate-pulse" />
            
            {/* Generative Visual Element */}
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/5 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-10 border border-crimson/20 rounded-full"
              />
              
              <div className="relative z-10 text-center">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl font-display text-white"
                >
                  S
                </motion.div>
                <div className="mt-4 font-mono text-[8px] tracking-[1em] text-crimson uppercase">
                  Savant_Core
                </div>
              </div>

              {/* Orbiting Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-electric-gold rounded-full"
                  animate={{
                    rotate: 360,
                    x: Math.cos(i * 45) * 150,
                    y: Math.sin(i * 45) * 150,
                  }}
                  transition={{
                    rotate: { duration: 10 + i, repeat: Infinity, ease: "linear" },
                    duration: 0
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Text Rail */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 rail-text">
        SAVANT_OS_VISUAL_IDENTITY_SYSTEM_v80.0.0_DNA_SEQUENCE_LOCKED
      </div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 rail-text">
        NEURAL_LATTICE_INTEGRATION_ACTIVE_TRUTH_ANCHOR_STABLE
      </div>
    </section>
  );
};
