import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { uiSound } from '../../utils/audio';

interface SavantButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const SavantButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  icon,
  disabled = false,
  type = 'button'
}: SavantButtonProps) => {
  const variantClasses = {
    primary: 'bg-white/[0.05] border-white/10 text-white hover:bg-crimson hover:border-crimson hover:text-white',
    secondary: 'bg-white/[0.05] border-white/10 text-white hover:bg-electric-gold hover:border-electric-gold hover:text-obsidian',
    ghost: 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5',
    outline: 'bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white',
  };

  const handleClick = () => {
    if (disabled) return;
    uiSound.playClick();
    onClick?.();
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      className={`savant-button group relative overflow-hidden transition-all duration-500 ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
    >
      {/* Liquid Fill Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ y: '100%' }}
          whileHover={{ y: '0%' }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0 bg-white/10"
        />
      </div>

      {/* Glitch Layers */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-crimson/20 translate-x-[2px] blur-[1px] animate-pulse" />
        <div className="absolute inset-0 bg-electric-gold/20 -translate-x-[2px] blur-[1px] animate-pulse delay-75" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        {icon && <span className="opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>}
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase font-black">{children}</span>
      </div>

      {/* Industrial Corner */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-white transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-white transition-colors" />
    </motion.button>
  );
};
