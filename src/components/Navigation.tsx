import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uiSound } from '../utils/audio';
import { Menu, X, ArrowRight } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    uiSound.playClick();
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    uiSound.playClick();
    navigate(path);
  };

  return (
    <div className="pointer-events-auto">
      {/* Burger Button */}
      <Magnetic strength={0.2}>
        <button 
          onClick={toggleMenu}
          onMouseEnter={() => uiSound.playHover()}
          className="relative z-[1000] w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none group"
        >
          <motion.div 
            animate={{ 
              rotate: isOpen ? 45 : 0, 
              y: isOpen ? 7.5 : 0,
              width: isOpen ? '100%' : '60%'
            }}
            className="h-[2px] bg-white group-hover:bg-neon-pink transition-colors"
          />
          <motion.div 
            animate={{ 
              opacity: isOpen ? 0 : 1,
              width: '100%'
            }}
            className="h-[2px] bg-white group-hover:bg-neon-pink transition-colors"
          />
          <motion.div 
            animate={{ 
              rotate: isOpen ? -45 : 0, 
              y: isOpen ? -7.5 : 0,
              width: isOpen ? '100%' : '60%'
            }}
            className="h-[2px] bg-white group-hover:bg-neon-pink transition-colors"
          />
        </button>
      </Magnetic>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-obsidian z-[999] flex flex-col items-center justify-center p-12"
          >
            {/* Background Text */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02] flex items-center justify-center">
              <span className="title-serif font-black text-[40vw] tracking-tighter uppercase select-none">MENU</span>
            </div>

            <nav className="relative z-10 flex flex-col items-center gap-8 md:gap-12">
              {items.map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  onClick={() => handleNavigate(item.path)}
                  onMouseEnter={() => uiSound.playHover()}
                  className="group flex items-center gap-6 focus:outline-none"
                >
                  <span className="font-mono text-[10px] text-white/20 group-hover:text-neon-pink transition-colors">0{index + 1}</span>
                  <h2 className={`text-5xl md:text-8xl title-serif tracking-tighter uppercase transition-all duration-500 ${location.pathname === item.path ? 'text-neon-pink' : 'text-white group-hover:text-neon-pink group-hover:italic group-hover:translate-x-4'}`}>
                    {item.label}
                  </h2>
                  <ArrowRight className={`opacity-0 group-hover:opacity-100 transition-all duration-500 text-neon-pink ${location.pathname === item.path ? 'opacity-100' : ''}`} size={48} />
                </motion.button>
              ))}
            </nav>

            {/* Footer Info in Menu */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end font-mono text-[8px] tracking-[0.5em] text-white/20 uppercase">
              <div className="flex flex-col gap-2">
                <span>SAVANT_LATTICE_NODE</span>
                <span>EST_2026</span>
              </div>
              <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">TWITTER</a>
                <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
                <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
