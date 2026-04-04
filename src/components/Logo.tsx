import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Savant3DLogo from './Savant3DLogo';

export default function Logo() {
  return (
    <Link 
      to="/" 
      className="relative group block pointer-events-auto"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 relative">
          <Suspense fallback={<div className="w-full h-full bg-white/5 rounded-full animate-pulse" />}>
            <Savant3DLogo className="w-full h-full scale-150" />
          </Suspense>
        </div>

        <div className="flex flex-col">
          <div className="font-display font-black text-xl md:text-2xl text-white tracking-tighter leading-none uppercase">
            SAVANT<span className="text-neon-pink">.</span>
          </div>
          <div className="font-mono text-[6px] tracking-[0.4em] text-white/40 uppercase font-bold">
            sovereign_os
          </div>
        </div>
      </div>
    </Link>
  );
}
