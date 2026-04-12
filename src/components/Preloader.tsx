import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'motion/react';
import { useLoading } from '../contexts/LoadingContext';
import { TimePortalScene } from './TimePortalSpiral';

// ─── SVG progress arc ────────────────────────────────────────────────────────
const SVG_SIZE  = 320;
const ARC_R     = 138; // radius of the progress ring inside the 320×320 viewBox
const CX        = SVG_SIZE / 2;
const ARC_CIRC  = 2 * Math.PI * ARC_R;
const TICK_COUNT = 60;

const ProgressArc: React.FC<{ progress: number }> = ({ progress }) => {
  const dashOffset = ARC_CIRC * (1 - Math.min(progress, 100) / 100);
  const filled     = progress / 100;

  return (
    <svg
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff003c" />
          <stop offset="50%"  stopColor="#8040ff" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <filter id="spArcGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Tick marks */}
      {Array.from({ length: TICK_COUNT }, (_, i) => {
        const a   = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
        const big = i % 5 === 0;
        const r1  = ARC_R - 5;
        const r2  = ARC_R - (big ? 13 : 8);
        return (
          <line
            key={i}
            x1={CX + Math.cos(a) * r1}  y1={CX + Math.sin(a) * r1}
            x2={CX + Math.cos(a) * r2}  y2={CX + Math.sin(a) * r2}
            stroke={i / TICK_COUNT <= filled ? '#D4AF37' : 'rgba(255,255,255,0.10)'}
            strokeWidth={big ? 1.5 : 0.8}
          />
        );
      })}

      {/* Track ring */}
      <circle
        cx={CX} cy={CX} r={ARC_R}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="2"
      />

      {/* Progress arc */}
      <circle
        cx={CX} cy={CX} r={ARC_R}
        fill="none"
        stroke="url(#spArcGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={ARC_CIRC}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${CX} ${CX})`}
        filter="url(#spArcGlow)"
        style={{ transition: 'stroke-dashoffset 0.45s ease' }}
      />

      {/* Percentage label below arc */}
      <text
        x={CX}
        y={CX + ARC_R + 20}
        textAnchor="middle"
        fill="rgba(255,255,255,0.25)"
        fontFamily="JetBrains Mono, monospace"
        fontSize="8"
        letterSpacing="3"
      >
        {Math.floor(Math.min(progress, 100)).toString().padStart(3, '0')}%
      </text>
    </svg>
  );
};

// ─── Reflective black-chrome Savant logo ─────────────────────────────────────
const ChromeLogo: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}
  >
    {/* Glossy dark disc behind the wordmark */}
    <div
      style={{
        position: 'absolute',
        width: '92px',
        height: '92px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 36% 34%, #2a2a2a 0%, #050505 68%)',
        boxShadow:
          '0 0 36px rgba(0,210,255,0.30), 0 0 72px rgba(80,0,255,0.18), inset 0 0 28px rgba(0,0,0,0.85)',
      }}
    />

    {/* SAVANT – reflective black chrome */}
    <div
      style={{
        position: 'relative',
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontWeight: 900,
        fontSize: '21px',
        letterSpacing: '-0.04em',
        textTransform: 'uppercase',
        background:
          'linear-gradient(to bottom, #151515 0%, #4a4a4a 18%, #c6c6c6 42%, #ffffff 50%, #adadad 58%, #444444 80%, #0d0d0d 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter:
          'drop-shadow(0 0 10px rgba(0,210,255,0.85)) drop-shadow(0 0 22px rgba(80,0,255,0.55))',
      }}
    >
      SAVANT
    </div>

    <div
      style={{
        position: 'relative',
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 400,
        fontSize: '6px',
        letterSpacing: '0.44em',
        textTransform: 'uppercase',
        color: 'rgba(0,210,255,0.45)',
        marginTop: '4px',
      }}
    >
      OS_V36
    </div>
  </div>
);

// ─── Preloader ────────────────────────────────────────────────────────────────
export const Preloader: React.FC = () => {
  const { phase, progress } = useLoading();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x:  (e.clientX  / window.innerWidth)  * 2 - 1,
        y: -(e.clientY  / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const showUI        = phase === 'booting' || phase === 'cinematic';
  const showBackground = phase !== 'complete';

  return (
    <AnimatePresence>
      {showBackground && (
        <motion.div
          className="fixed inset-0 z-[14000] overflow-hidden pointer-events-none"
          exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] } }}
        >
          {/* Solid obsidian background – fades to reveal the site */}
          <motion.div
            className="absolute inset-0 bg-obsidian"
            animate={{ opacity: phase === 'transition' ? 0 : 1 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          />

          {/* ── WebGL time-portal canvas (full-screen) ── */}
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 5], fov: 55 }}
                style={{ width: '100%', height: '100%' }}
                gl={{ antialias: true }}
              >
                <TimePortalScene />
              </Canvas>
            </Suspense>
          </div>

          {/* ── 2-D UI overlay ── */}
          <AnimatePresence>
            {showUI && (
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12 overflow-hidden"
                exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 1 } }}
              >
                {/* Top-left HUD label */}
                <motion.div
                  animate={{ x: mouse.x * -20, y: mouse.y * 20 }}
                  className="font-mono text-[8px] md:text-[10px] text-white/40 tracking-[0.5em] uppercase"
                >
                  System_Boot // Sequence_V36.1<br />
                  <span className="text-neon-pink">God_Tier_Protocol_Active</span>
                </motion.div>

                {/* ── Centred spiral progress UI ── */}
                <div className="flex-1 flex items-center justify-center">
                  {/*
                    Responsive container sized to match the portal disc's
                    apparent on-screen diameter. Adjust this clamp to shift
                    the arc inward or outward relative to the portal edge.
                  */}
                  <div
                    style={{
                      position: 'relative',
                      width:  'clamp(260px, 44vmin, 460px)',
                      height: 'clamp(260px, 44vmin, 460px)',
                    }}
                  >
                    <ProgressArc progress={progress} />
                    <ChromeLogo />
                  </div>
                </div>

                {/* Bottom-right HUD label */}
                <motion.div
                  animate={{ x: mouse.x * 20, y: mouse.y * -20 }}
                  className="absolute bottom-6 md:bottom-12 right-6 md:right-12 text-right font-mono text-[6px] md:text-[8px] text-white/20 tracking-[0.5em] uppercase"
                >
                  <div>Neural_Lattice: {progress < 100 ? 'Syncing...' : 'Active'}</div>
                  <div>Data_Sovereignty: Verified</div>
                  <div className="text-gold mt-2">© 2026 SAVANT_CORE</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
