import React from 'react';
import { motion } from 'motion/react';

export const GeometricSymbol = () => {
  // Refined triple-loop path for a more accurate "Triquetra" feel
  const loopPath = "M 50 50 C 50 10 85 10 85 50 C 85 90 50 90 50 50";

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_60px_rgba(255,0,60,0.8)]">
      <defs>
        {/* Advanced 3D Gradients */}
        <linearGradient id="triple-3d-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#ff003c" />
          <stop offset="50%" stopColor="#80001e" />
          <stop offset="80%" stopColor="#200008" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        
        <linearGradient id="triple-3d-accent" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f9ff00" />
          <stop offset="40%" stopColor="#ff003c" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>

        <radialGradient id="neural-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff003c" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ff003c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* 3D Bevel and Specular Lighting */}
        <filter id="bevel-3d" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="7" specularConstant="1.5" specularExponent="40" lighting-color="#ffffff" result="specular">
            <fePointLight x="50" y="20" z="60" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularIn" />
          <feComposite in="SourceGraphic" in2="specularIn" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>

        <filter id="hyper-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -12" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>

        <filter id="chromatic-aberration-v3" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset in="SourceGraphic" dx="1.5" dy="0" result="red" />
          <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="blue" />
          <feColorMatrix in="red" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red-only" />
          <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue-only" />
          <feBlend in="red-only" in2="blue-only" mode="screen" result="aberration" />
          <feBlend in="aberration" in2="SourceGraphic" mode="screen" />
        </filter>
      </defs>

      {/* Atmospheric Neural Field */}
      <motion.circle
        cx="50" cy="50" r="42"
        fill="url(#neural-core-glow)"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [0.85, 1.15, 0.85],
          rotate: 360
        }}
        transition={{ 
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      />

      {/* Triple Loop 3D Structure */}
      {[0, 120, 240].map((rotation) => (
        <motion.g key={rotation} transform={`rotate(${rotation} 50 50)`} filter="url(#bevel-3d)">
          {/* Depth Shadow Layer */}
          <motion.path
            d={loopPath}
            fill="none"
            stroke="black"
            strokeWidth="12"
            strokeOpacity="0.5"
            strokeLinecap="round"
            transform="translate(2, 2)"
          />

          {/* Main Structural Body */}
          <motion.path
            d={loopPath}
            fill="none"
            stroke="url(#triple-3d-main)"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          />
          
          {/* Inner Highlight Ridge */}
          <motion.path
            d={loopPath}
            fill="none"
            stroke="white"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            strokeLinecap="round"
            filter="url(#hyper-glow)"
          />

          {/* Kinetic Energy Pulse */}
          <motion.path
            d={loopPath}
            fill="none"
            stroke="url(#triple-3d-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="20 160"
            animate={{ strokeDashoffset: [0, -180] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Micro-Circuitry Fractal Overlay */}
          {[...Array(6)].map((_, i) => (
            <motion.path
              key={i}
              d={loopPath}
              fill="none"
              stroke={i % 2 === 0 ? "#f9ff00" : "white"}
              strokeWidth="0.08"
              strokeOpacity={0.5 - i * 0.05}
              strokeDasharray={`${1 + i} ${15 + i}`}
              animate={{ strokeDashoffset: [0, 150] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
              style={{ 
                scale: 1 - i * 0.04, 
                transformOrigin: '50% 50%'
              }}
            />
          ))}
        </motion.g>
      ))}

      {/* Central Singularity Core */}
      <motion.g transform="translate(50, 50)" filter="url(#chromatic-aberration-v3)">
        {/* Geometric Containment Rings */}
        {[...Array(4)].map((_, i) => (
          <motion.circle
            key={i}
            r={4 + i * 3}
            fill="none"
            stroke={i % 2 === 0 ? "white" : "#ff003c"}
            strokeWidth="0.15"
            strokeOpacity={0.4 - i * 0.1}
            animate={{ 
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 12 + i * 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}
        
        {/* The Singularity */}
        <motion.circle
          r="2.5"
          fill="white"
          filter="url(#hyper-glow)"
          animate={{ 
            scale: [1, 2.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* Tactical HUD Crosshair */}
        <motion.g animate={{ rotate: 90 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
          <motion.path
            d="M -10 0 L 10 0 M 0 -10 L 0 10"
            stroke="white"
            strokeWidth="0.1"
            strokeOpacity="0.2"
          />
          {[...Array(4)].map((_, i) => (
            <motion.rect
              key={i}
              x="8" y="-0.5" width="2" height="1"
              fill="#ff003c"
              fillOpacity="0.4"
              transform={`rotate(${i * 90} 0 0)`}
            />
          ))}
        </motion.g>
      </motion.g>

      {/* Outer Data Perimeter */}
      <motion.g filter="url(#hyper-glow)">
        <motion.circle
          cx="50" cy="50" r="49"
          fill="none"
          stroke="white"
          strokeWidth="0.15"
          strokeDasharray="0.5 12"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx="50" cy="50" r="47"
          fill="none"
          stroke="#ff003c"
          strokeWidth="0.15"
          strokeDasharray="3 18"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Telemetry Nodes */}
        {[...Array(36)].map((_, i) => (
          <motion.g key={i} transform={`rotate(${i * 10} 50 50)`}>
            <rect
              x="49.9" y="0.5" width="0.2" height="2.5"
              fill={i % 9 === 0 ? "#f9ff00" : "white"}
              fillOpacity="0.6"
            />
            {i % 9 === 0 && (
              <text
                x="51.5" y="5"
                fontSize="1.2"
                fill="white"
                fillOpacity="0.3"
                fontFamily="monospace"
                fontWeight="black"
                transform={`rotate(90 51.5 5)`}
              >
                {`NODE_${i.toString(16).toUpperCase()}`}
              </text>
            )}
          </motion.g>
        ))}
      </motion.g>

      {/* Floating System Metadata */}
      <motion.text
        x="50" y="10"
        textAnchor="middle"
        fill="white"
        fillOpacity="0.2"
        fontSize="2.2"
        fontFamily="monospace"
        className="uppercase tracking-[0.8em] font-black"
      >
        SAVANT_OS_v10.4
      </motion.text>
      
      <motion.text
        x="50" y="94"
        textAnchor="middle"
        fill="#ff003c"
        fillOpacity="0.3"
        fontSize="1.6"
        fontFamily="monospace"
        className="uppercase tracking-[1.2em] font-bold"
      >
        NEURAL_LATTICE_ACTIVE
      </motion.text>
    </svg>
  );
};

