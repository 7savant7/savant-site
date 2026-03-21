import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uiSound } from '../utils/audio';
import { TextScramble } from './TextScramble';
import Magnetic from './Magnetic';
import { MagneticButton } from './MagneticButton';

interface NavItemProps {
  path: string;
  label: string;
  active: boolean;
  onClick: (path: string) => void;
  index: number;
}

const NavItem: React.FC<NavItemProps> = ({ path, label, active, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    uiSound.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    uiSound.playClick();
    onClick(path);
  };

  return (
    <Magnetic strength={0.3}>
      <motion.button 
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative flex items-center gap-6 focus:outline-none pr-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          delay: index * 0.05, 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {/* Label - Now on the left of the icon for better readability in vertical layout */}
        <div className="flex flex-col items-end min-w-[120px]">
          <span className={`font-mono text-[10px] md:text-[11px] tracking-[0.5em] uppercase transition-all duration-500 ${active ? 'text-white font-black' : 'text-white/30 group-hover:text-electric-gold'}`}>
            {label.split('_')[1] || label}
          </span>
          <motion.div 
            className={`h-[1px] mt-1.5 transition-all duration-700 ${active ? 'bg-crimson w-full' : 'bg-white/5 w-0 group-hover:w-1/2'}`}
          />
          {active && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-mono text-[7px] text-crimson tracking-widest mt-1"
            >
              ACTIVE_NODE
            </motion.div>
          )}
        </div>

        {/* The Diamond Shape Icon */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0">
          {/* Scanning Line Effect */}
          <AnimatePresence>
            {(isHovered || active) && (
              <motion.div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ 
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(255,0,60,0.4) 50%, transparent 100%)',
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

          <motion.div 
            className={`absolute inset-1 transition-colors duration-500 ${active ? 'bg-crimson/20 backdrop-blur-xl' : 'bg-white/[0.02] backdrop-blur-sm group-hover:bg-electric-gold/10'}`}
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            animate={{ 
              scale: active ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <motion.div 
            className={`absolute inset-0 transition-colors duration-500 border border-white/10 ${active ? 'bg-crimson/40 border-crimson' : 'bg-white/5 group-hover:bg-electric-gold/20 group-hover:border-electric-gold'}`}
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', zIndex: -1 }}
            animate={{ 
              opacity: active ? [0.4, 0.8, 0.4] : 1,
              boxShadow: active ? ['0 0 15px rgba(255,0,60,0.3)', '0 0 30px rgba(255,0,60,0.6)', '0 0 15px rgba(255,0,60,0.3)'] : 'none'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <motion.div 
            className={`w-2 h-2 transition-all duration-500 ${active ? 'bg-white shadow-[0_0_15px_#fff] scale-110' : 'bg-white/20 group-hover:bg-electric-gold group-hover:shadow-[0_0_10px_rgba(249,255,0,0.4)]'}`}
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          />
        </div>
      </motion.button>
    </Magnetic>
  );
};

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { path: '/', label: 'HOME' },
    { path: '/work', label: 'WORK' },
    { path: '/services', label: 'SERVICES' },
    { path: '/journal', label: 'JOURNAL' },
    { path: '/branding', label: 'BRANDING' },
    { path: '/contact', label: 'CONTACT' },
  ];

  return (
    <nav className="flex items-center gap-12 pointer-events-auto">
      {items.map((item, index) => (
        <motion.button
          key={item.path}
          onClick={() => {
            uiSound.playClick();
            navigate(item.path);
          }}
          onMouseEnter={() => uiSound.playHover()}
          className="group relative flex flex-col items-center focus:outline-none"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
        >
          <span className={`font-mono text-[10px] tracking-[0.4em] uppercase transition-colors duration-500 ${location.pathname === item.path ? 'text-white font-black' : 'text-white/30 group-hover:text-white'}`}>
            {item.label}
          </span>
          <motion.div 
            className={`h-[1px] mt-2 transition-all duration-500 ${location.pathname === item.path ? 'bg-crimson w-full' : 'bg-white/0 w-0 group-hover:w-full group-hover:bg-white/20'}`}
          />
        </motion.button>
      ))}
      
      <div className="w-[1px] h-6 bg-white/10 mx-4" />
      
      <MagneticButton strength={0.1}>
        <button 
          onClick={() => navigate('/os')}
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-crimson hover:text-white transition-colors"
        >
          SYSTEM_OS
        </button>
      </MagneticButton>
    </nav>
  );
}
