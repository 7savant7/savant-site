import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { path: '/', label: 'HOME' },
    { path: '/work', label: 'ARCHIVE' },
    { path: '/services', label: 'METHODOLOGY' },
    { path: '/journal', label: 'JOURNAL' },
    { path: '/contact', label: 'UPLINK' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="pointer-events-auto">
      {/* Burger Button */}
      <button 
        onClick={toggleMenu}
        className="relative z-[10000] w-12 h-12 flex flex-col items-center justify-center gap-2 focus:outline-none group mix-blend-difference"
      >
        <motion.div 
          animate={{ 
            rotate: isOpen ? 45 : 0, 
            y: isOpen ? 9 : 0,
          }}
          className="h-[1px] w-8 bg-white group-hover:bg-gold transition-colors"
        />
        <motion.div 
          animate={{ 
            opacity: isOpen ? 0 : 1,
          }}
          className="h-[1px] w-8 bg-white group-hover:bg-gold transition-colors"
        />
        <motion.div 
          animate={{ 
            rotate: isOpen ? -45 : 0, 
            y: isOpen ? -9 : 0,
          }}
          className="h-[1px] w-8 bg-white group-hover:bg-gold transition-colors"
        />
      </button>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ opacity: 0, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 bg-obsidian z-[9999] flex flex-col justify-center px-6 md:px-24"
          >
            <div className="absolute inset-0 noise-overlay opacity-10" />
            
            <div className="absolute top-12 left-12 font-mono text-xs text-gold tracking-[1em] uppercase">
              Savant_OS // Navigation
            </div>

            <nav className="relative z-10 flex flex-col gap-4 md:gap-8 max-w-5xl">
              {items.map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  onClick={() => handleNavigate(item.path)}
                  className="group flex items-center gap-8 focus:outline-none w-fit"
                >
                  <span className="font-mono text-sm text-white/20 group-hover:text-gold transition-colors">0{index + 1}</span>
                  <h2 className={`text-6xl md:text-8xl title-serif tracking-tighter uppercase transition-all duration-500 ${location.pathname === item.path ? 'text-gold italic' : 'text-white group-hover:text-white group-hover:italic group-hover:translate-x-8'}`}>
                    {item.label}
                  </h2>
                </motion.button>
              ))}
            </nav>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end font-mono text-[10px] tracking-[0.5em] text-white/40 uppercase border-t border-white/10 pt-8">
              <div className="flex flex-col gap-2">
                <span>SYSTEM_STATUS: NOMINAL</span>
                <span>ENCRYPTION: ACTIVE</span>
              </div>
              <div className="flex gap-12">
                <a href="#" className="hover:text-gold transition-colors">TWITTER</a>
                <a href="#" className="hover:text-gold transition-colors">LINKEDIN</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
