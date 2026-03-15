import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const bootStatuses = [
  "INITIALIZING_KERNEL",
  "MAPPING_FRACTAL_LATTICE",
  "ALLOCATING_SHARD_MEMORY",
  "UPLINK_SECURED",
  "WELCOME_SAVANT"
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % bootStatuses.length);
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(statusInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 50);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: 'blur(20px)',
        transition: { duration: 1.2, ease: [0.9, 0, 0.1, 1] } 
      }}
      className="fixed inset-0 bg-obsidian z-[10000] flex items-center justify-center overflow-hidden"
    >
      {/* Scanning Line */}
      <motion.div 
        className="absolute inset-0 w-full h-[2px] bg-crimson/20 z-[10001] pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Background Fractal Lattice */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-crimson)_0%,transparent_70%)] opacity-20" />
        <div className="grid grid-cols-12 h-full w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-white/5 h-full" />
          ))}
        </div>
        <div className="grid grid-rows-12 h-full w-full absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-white/5 w-full" />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Central Fractal Symbol */}
        <div className="relative w-40 h-40 mb-16">
          <motion.div 
            className="absolute inset-0 border-2 border-crimson/40"
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            animate={{ rotate: 360, scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-4 border border-electric-gold/30"
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            animate={{ rotate: -360, scale: [1, 0.9, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-8 border border-white/20"
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            animate={{ rotate: 180, scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
              className="w-1.5 h-1.5 bg-white shadow-[0_0_20px_#fff] rounded-full"
              animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
             />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display font-black text-7xl md:text-9xl text-white tracking-tighter mb-4 uppercase"
        >
          SAVANT<span className="text-crimson">.</span>
        </motion.div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-white/10" />
          <div className="font-mono text-[8px] text-white/40 tracking-[0.8em] uppercase">
            sovereign_os_v5.5
          </div>
          <div className="h-[1px] w-12 bg-white/10" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="font-mono text-[10px] text-crimson tracking-[0.5em] h-4 uppercase font-bold">
            {bootStatuses[statusIdx]}
          </div>
          
          <div className="relative w-96 h-[3px] bg-white/5 overflow-hidden rounded-full">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-crimson to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="h-full bg-crimson shadow-[0_0_15px_rgba(255,0,60,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="font-mono text-[9px] text-white/20 tracking-widest">
            {Math.round(progress)}%_STABILIZED
          </div>
        </div>

        {/* Technical Data Stream */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[120%] opacity-20 pointer-events-none">
          <div className="font-mono text-[7px] text-white/50 leading-relaxed grid grid-cols-3 gap-8">
            <div>
              [SYS] KERNEL_LOAD_SUCCESS<br/>
              [SYS] MEMORY_MAP_0x4421_OK<br/>
              [SYS] FRACTAL_CORE_SYNCED
            </div>
            <div className="text-center">
              [NET] UPLINK_ESTABLISHED<br/>
              [NET] LATTICE_HANDSHAKE_OK<br/>
              [NET] ENCRYPTION_LAYER_4_ACTIVE
            </div>
            <div className="text-right">
              [USR] IDENTITY_VERIFIED<br/>
              [USR] PERMISSIONS_GRANTED<br/>
              [USR] SESSION_ID_0x992_ACTIVE
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
