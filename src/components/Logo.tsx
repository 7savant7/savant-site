import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const StylizedS = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]">
    <defs>
      <linearGradient id="s-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#ff003c" />
        <stop offset="100%" stopColor="#80001e" />
      </linearGradient>
      <linearGradient id="s-grad-accent" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ff003c" stopOpacity="0" />
      </linearGradient>
      <filter id="s-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* The "S" Shape - Bottom Curve (Simulating Depth) */}
    <motion.path
      d="M 30 70 C 30 85, 70 85, 70 70 C 70 60, 50 55, 50 45 C 50 35, 70 30, 70 30"
      fill="none"
      stroke="#4d0012"
      strokeWidth="12"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{ transform: 'translate(2px, 4px)' }}
    />

    {/* The "S" Shape - Main Body */}
    <motion.path
      d="M 30 70 C 30 85, 70 85, 70 70 C 70 60, 50 55, 50 45 C 50 35, 70 30, 70 30"
      fill="none"
      stroke="url(#s-grad-main)"
      strokeWidth="10"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: 1, 
        opacity: 1,
      }}
      transition={{ duration: 2.5, ease: "circOut" }}
    />

    {/* Top Highlight for 3D effect */}
    <motion.path
      d="M 32 68 C 32 80, 68 80, 68 68 C 68 62, 52 58, 52 47 C 52 38, 68 32, 68 32"
      fill="none"
      stroke="url(#s-grad-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: 1, 
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{ 
        pathLength: { duration: 3, ease: "easeInOut" },
        opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
    />

    {/* Floating Shards around the S */}
    {[...Array(6)].map((_, i) => (
      <motion.circle
        key={i}
        r={0.5 + Math.random() * 1.5}
        fill={i % 2 === 0 ? "#ff003c" : "white"}
        initial={{ 
          x: 50 + (Math.random() - 0.5) * 60, 
          y: 50 + (Math.random() - 0.5) * 60,
          opacity: 0 
        }}
        animate={{ 
          x: [null, 50 + (Math.random() - 0.5) * 80],
          y: [null, 50 + (Math.random() - 0.5) * 80],
          opacity: [0, 0.8, 0],
          scale: [0, 1.5, 0]
        }}
        transition={{ 
          duration: 3 + Math.random() * 4, 
          repeat: Infinity, 
          ease: "linear",
          delay: i * 0.5
        }}
      />
    ))}

    {/* Energy Rings */}
    <motion.circle
      cx="50" cy="50" r="45"
      fill="none"
      stroke="white"
      strokeWidth="0.1"
      strokeDasharray="1 4"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
    <motion.circle
      cx="50" cy="50" r="48"
      fill="none"
      stroke="#ff003c"
      strokeWidth="0.2"
      strokeDasharray="2 10"
      animate={{ rotate: -360 }}
      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

export default function Logo() {
  return (
    <Link to="/" className="relative group cursor-pointer block">
      <div className="flex items-center gap-10">
        <motion.div 
          className="relative w-32 h-32 md:w-44 md:h-44 overflow-visible"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* Background Cinematic Glow */}
          <div className="absolute inset-[-40%] bg-crimson/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
          <div className="absolute inset-[-20%] bg-white/5 blur-[80px] rounded-full pointer-events-none" />
          
          {/* Stylized S Logo */}
          <div className="absolute inset-0 z-20">
            <StylizedS />
          </div>

          {/* HUD Decorative Labels */}
          <div className="absolute -top-4 -left-4 font-mono text-[6px] text-white/20 tracking-widest uppercase">
            Savant_Mark_v2.0
          </div>
          <div className="absolute -bottom-4 -right-4 font-mono text-[6px] text-crimson/30 tracking-widest uppercase">
            Core_Active
          </div>
        </motion.div>

        <div className="relative flex flex-col">
          <div className="overflow-hidden">
            <motion.div 
              className="font-display font-black text-8xl md:text-[10rem] text-white tracking-[-0.1em] leading-[0.7] flex items-baseline"
              initial={{ y: "100%", skewY: 15 }}
              animate={{ y: 0, skewY: 0 }}
              whileHover={{ x: 10 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="relative">
                SAVANT
                <motion.span 
                  className="absolute inset-0 text-crimson opacity-0 group-hover:opacity-50 -z-10"
                  animate={{ 
                    x: [0, -2, 2, -2, 0],
                    y: [0, 1, -1, 1, 0],
                  }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                >
                  SAVANT
                </motion.span>
                <motion.span 
                  className="absolute -inset-x-2 -inset-y-1 bg-white/5 blur-xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 2 }}
                />
              </span>
              <span className="text-crimson ml-[-0.05em] animate-pulse">.</span>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-8 mt-8">
            <motion.div 
              className="h-[1px] bg-gradient-to-r from-crimson via-white to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 140 }}
              transition={{ duration: 2.5, delay: 1.2 }}
            />
            <div className="flex flex-col">
              <motion.span 
                className="font-mono text-[11px] font-black tracking-[1.5em] text-white/60 uppercase whitespace-nowrap"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 1.8 }}
              >
                Cognitive_Creative_Core
              </motion.span>
              <motion.div className="flex items-center gap-2 mt-2">
                <motion.span 
                  className="w-1 h-1 bg-crimson rounded-full"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.span 
                  className="font-mono text-[6px] text-white/30 tracking-[0.8em] uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2.2 }}
                >
                  Sovereign_Intelligence_Protocol_v9.4
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
