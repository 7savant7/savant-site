import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  title?: string;
  subtitle?: string;
}

export const GlassCard = ({ children, className = '', hoverEffect = true, title, subtitle }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.01 } : {}}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl group flex flex-col ${className}`}
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between relative overflow-hidden">
          <div className="flex flex-col relative z-10">
            {title && <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1">{title}</span>}
            {subtitle && <span className="font-display font-bold text-sm tracking-tight text-white">{subtitle}</span>}
          </div>
          <div className="flex gap-1 relative z-10">
            <div className="w-1 h-1 rounded-full bg-crimson/40" />
            <div className="w-1 h-1 rounded-full bg-white/10" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1">
        {children}
      </div>

      {/* Hover Glow */}
      {hoverEffect && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      )}
    </motion.div>
  );
};
