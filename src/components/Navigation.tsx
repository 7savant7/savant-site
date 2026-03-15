import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uiSound } from '../utils/audio';
import { TextScramble } from './TextScramble';

interface NavItemProps {
  path: string;
  label: string;
  active: boolean;
  onClick: (path: string) => void;
  index: number;
}

const NavItem: React.FC<NavItemProps> = ({ path, label, active, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Magnetic effect
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.4);
    y.set((e.clientY - centerY) * 0.4);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    uiSound.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    uiSound.playClick();
    onClick(path);
  };

  return (
    <motion.button 
      ref={ref}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center focus:outline-none"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.08, 
        duration: 0.8, 
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      {/* Scanning Line Effect */}
      <AnimatePresence>
        {(isHovered || active) && (
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ 
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,0,60,0.3) 50%, transparent 100%)',
              height: '2px',
              width: '100%',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* The Diamond Shape Background */}
      <motion.div 
        className={`absolute inset-1 transition-colors duration-500 ${active ? 'bg-crimson/30 backdrop-blur-xl' : 'bg-white/[0.03] backdrop-blur-sm group-hover:bg-electric-gold/20'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
        animate={{ 
          scale: active ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Outer Glowing Border */}
      <motion.div 
        className={`absolute inset-0 transition-colors duration-500 ${active ? 'bg-crimson' : 'bg-white/10 group-hover:bg-electric-gold'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', zIndex: -1 }}
        animate={{ 
          opacity: active ? [0.6, 1, 0.6] : 1,
          boxShadow: active ? ['0 0 10px rgba(255,0,60,0.5)', '0 0 30px rgba(255,0,60,0.8)', '0 0 10px rgba(255,0,60,0.5)'] : 'none'
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Inner Core */}
      <motion.div 
        className={`w-3 h-3 transition-all duration-500 ${active ? 'bg-white shadow-[0_0_20px_#fff] scale-125' : 'bg-white/40 group-hover:bg-electric-gold group-hover:shadow-[0_0_15px_rgba(249,255,0,0.5)]'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
      />

      {/* Active Indicator Line */}
      <AnimatePresence>
        {active && (
          <motion.div 
            layoutId="active-indicator"
            className="absolute -right-4 w-1 h-8 bg-crimson shadow-[0_0_15px_rgba(255,0,60,1)]"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Label Reveal */}
      <AnimatePresence>
        {(isHovered || active) && (
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            className="absolute right-16 pointer-events-none flex items-center"
          >
            <div className="flex flex-col items-end">
              <span className={`font-mono text-[10px] tracking-[0.5em] whitespace-nowrap drop-shadow-lg ${active ? 'text-white font-black' : 'text-electric-gold'}`}>
                <TextScramble text={label} trigger={isHovered || active} />
              </span>
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className={`h-[1px] mt-1 ${active ? 'bg-crimson' : 'bg-electric-gold/30'}`}
              />
            </div>
            <div className={`h-[1px] w-12 ml-4 ${active ? 'bg-crimson shadow-[0_0_15px_var(--color-crimson)]' : 'bg-electric-gold/20'}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { path: '/', label: '01_HOME' },
    { path: '/work', label: '02_WORK' },
    { path: '/services', label: '03_SERVICES' },
    { path: '/contact', label: '04_CONTACT' },
    { path: '/apps', label: '05_APPS' },
    { path: '/journal', label: '06_JOURNAL' },
    { path: '/admin', label: '07_ADMIN' },
    { path: '/settings', label: '08_SETTINGS' },
    { path: '/os', label: '09_OS' },
  ];

  return (
    <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 md:gap-6 z-50 max-h-[90vh] overflow-y-auto custom-scrollbar pr-2">
      {/* Connection Line */}
      <div className="absolute top-0 bottom-0 right-6 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent -z-10" />
      
      {items.map((item, index) => (
        <NavItem 
          key={item.path}
          path={item.path}
          label={item.label}
          active={location.pathname === item.path}
          onClick={(path) => navigate(path)}
          index={index}
        />
      ))}
    </nav>
  );
}
