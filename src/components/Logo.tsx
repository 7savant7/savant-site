import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { GeometricSymbol } from './GeometricSymbol';

export default function Logo() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 25 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.25);
    mouseY.set((e.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Link 
      to="/" 
      className="relative group cursor-none block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="flex items-center gap-12"
        style={{ x, y }}
      >
        <motion.div 
          className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 overflow-visible shrink-0"
          whileHover={{ scale: 1.1, rotate: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* Cinematic Atmospheric Glow */}
          <div className="absolute inset-[-60%] bg-crimson/20 blur-[160px] rounded-full pointer-events-none animate-pulse" />
          <div className="absolute inset-[-40%] bg-white/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute inset-[-20%] bg-electric-gold/5 blur-[60px] rounded-full pointer-events-none" />
          
          {/* Symmetrical Geometric Symbol */}
          <div className="absolute inset-0 z-20">
            <GeometricSymbol />
          </div>

          {/* Advanced HUD Metadata */}
          <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 flex flex-col gap-1">
            <div className="font-mono text-[6px] md:text-[8px] text-white/40 tracking-[0.5em] uppercase font-black whitespace-nowrap">
              Neural_Core_v9.4_Omega
            </div>
            <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-crimson to-transparent" />
          </div>
          
          <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 flex flex-col items-end gap-1">
            <div className="h-[1px] w-16 md:w-32 bg-gradient-to-l from-electric-gold to-transparent" />
            <div className="font-mono text-[6px] md:text-[8px] text-crimson/50 tracking-[0.5em] uppercase font-black whitespace-nowrap">
              Singularity_Status:Stable_v4
            </div>
          </div>
          
          {/* Dynamic HUD Lines */}
          <motion.div 
            className="absolute top-1/2 -left-6 md:-left-12 w-6 md:w-10 h-[1px] bg-white/20"
            animate={{ scaleX: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/2 -right-6 md:-right-12 w-6 md:w-10 h-[1px] bg-white/20"
            animate={{ scaleX: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </motion.div>

        <div className="relative flex flex-col min-w-0">
          <div className="overflow-hidden">
            <motion.div 
              className="font-display font-black text-5xl sm:text-7xl md:text-[14rem] text-white tracking-[-0.14em] leading-[0.6] flex items-baseline"
              initial={{ y: "100%", skewY: 20 }}
              animate={{ y: 0, skewY: 0 }}
              whileHover={{ x: 20, skewX: -3 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="relative">
                SAVANT
                {/* 3D Depth Shadow */}
                <span className="absolute top-[0.02em] left-[0.02em] text-crimson/30 -z-10 blur-[2px]">SAVANT</span>
                
                {/* Glitch Shadow Effect - High Fidelity */}
                <motion.span 
                  className="absolute inset-0 text-crimson opacity-0 group-hover:opacity-60 -z-10 mix-blend-screen"
                  animate={{ 
                    x: [0, -4, 4, -4, 0],
                    y: [0, 3, -3, 3, 0],
                    filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                  }}
                  transition={{ duration: 0.12, repeat: Infinity }}
                >
                  SAVANT
                </motion.span>
                <motion.span 
                  className="absolute inset-0 text-electric-gold opacity-0 group-hover:opacity-30 -z-20 mix-blend-screen"
                  animate={{ 
                    x: [0, 6, -6, 6, 0],
                    y: [0, -2, 2, -2, 0],
                    filter: ["hue-rotate(0deg)", "hue-rotate(-90deg)", "hue-rotate(0deg)"]
                  }}
                  transition={{ duration: 0.18, repeat: Infinity, delay: 0.05 }}
                >
                  SAVANT
                </motion.span>
                
                {/* Atmospheric Volumetric Glow */}
                <motion.span 
                  className="absolute -inset-x-12 -inset-y-8 bg-crimson/10 blur-[100px] -z-30 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 3 }}
                />
              </span>
              <motion.span 
                className="text-crimson ml-[-0.05em] drop-shadow-[0_0_20px_#ff003c]"
                animate={{ 
                  opacity: [1, 0.4, 1], 
                  scale: [1, 1.3, 1],
                  filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                .
              </motion.span>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-12 mt-2 md:mt-6">
            <motion.div 
              className="h-[1px] md:h-[3px] bg-gradient-to-r from-crimson via-electric-gold to-transparent shadow-[0_0_15px_rgba(255,0,60,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: 'clamp(60px, 20vw, 250px)' }}
              transition={{ duration: 3, delay: 1.8 }}
            />
            <div className="flex flex-col min-w-0">
              <motion.span 
                className="font-mono text-[9px] md:text-[14px] font-black tracking-[0.6em] md:tracking-[2.2em] text-white/80 uppercase whitespace-nowrap italic truncate"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 2, delay: 2.2 }}
              >
                Cognitive_Creative_Core
              </motion.span>
              <motion.div className="flex items-center gap-2 md:gap-4 mt-1 md:mt-4">
                <motion.div 
                  className="w-1.5 h-1.5 md:w-3 md:h-3 bg-crimson rounded-full"
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 1, 0.4],
                    boxShadow: ["0 0 0px rgba(255,0,60,0)", "0 0 20px rgba(255,0,60,1)", "0 0 0px rgba(255,0,60,0)"]
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.span 
                  className="font-mono text-[7px] md:text-[9px] text-white/50 tracking-[0.6em] md:tracking-[1.2em] uppercase font-black truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 2.8 }}
                >
                  Sovereign_Intelligence_Protocol_v10.4_Active
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
