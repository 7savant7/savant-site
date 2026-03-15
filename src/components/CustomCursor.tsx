import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trail effect
  const trailX1 = useSpring(cursorX, { damping: 30, stiffness: 200, mass: 0.8 });
  const trailY1 = useSpring(cursorY, { damping: 30, stiffness: 200, mass: 0.8 });
  const trailX2 = useSpring(cursorX, { damping: 40, stiffness: 150, mass: 1.2 });
  const trailY2 = useSpring(cursorY, { damping: 40, stiffness: 150, mass: 1.2 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail 2 */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9997] mix-blend-difference opacity-20"
        style={{
          x: trailX2,
          y: trailY2,
        }}
      >
        <div className="w-full h-full border border-electric-gold rotate-45 scale-50" />
      </motion.div>

      {/* Trail 1 */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] mix-blend-difference opacity-40"
        style={{
          x: trailX1,
          y: trailY1,
        }}
      >
        <div className="w-full h-full border border-crimson rotate-45 scale-75" />
      </motion.div>

      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div 
          className="w-full h-full relative flex items-center justify-center"
          animate={{
            scale: isHovering ? 1.8 : 1,
            rotate: isHovering ? 135 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Crosshair Lines */}
          <motion.div 
            className="absolute w-full h-[1px] bg-white/40"
            animate={{ width: isHovering ? '150%' : '100%' }}
          />
          <motion.div 
            className="absolute h-full w-[1px] bg-white/40"
            animate={{ height: isHovering ? '150%' : '100%' }}
          />
          
          {/* Outer Frame */}
          <motion.div 
            className="absolute inset-0 border border-white"
            animate={{
              borderRadius: isHovering ? '50%' : '0%',
              borderColor: isHovering ? '#ff003c' : '#ffffff',
              scale: isHovering ? 0.6 : 1,
              borderWidth: isHovering ? '2px' : '1px',
            }}
          />

          {/* Center Dot */}
          <motion.div 
            className="w-1.5 h-1.5 bg-white shadow-[0_0_15px_#fff]"
            animate={{
              scale: isHovering ? 0.3 : 1,
              backgroundColor: isHovering ? '#ff003c' : '#ffffff',
              boxShadow: isHovering ? '0 0 20px #ff003c' : '0 0 15px #fff',
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
};
