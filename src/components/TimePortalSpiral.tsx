/**
 * TimePortalSpiral — bioluminescent, hyperreal time-portal preloader visual.
 *
 * Reusable parameters (via PortalConfig):
 *   intensity      – overall brightness/energy  (default 1.2)
 *   particleCount  – electron orbit particles    (default 200)
 *   rippleSpeed    – smoke warp animation speed  (default 0.5)
 *   flareStrength  – bloom intensity multiplier  (default 1.0)
 *   palette        – custom hex colour overrides (optional)
 *
 * Progress wiring:
 *   • Shader: radial fill expands from centre as progress 0→100
 *   • SVG:    36 segmented tick marks light up + clockwise arc trace
 *
 * Chrome logo:
 *   Multi-stop linear-gradient + portal-colour reflection overlay
 *   (CSS/SVG; no extra GL context needed).
 */

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// @ts-expect-error — @react-three/postprocessing lacks full TS declarations for this version; pre-existing pattern in this repo
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { LoadingPhase } from '../contexts/LoadingContext';

// ─── Public config interface ──────────────────────────────────────────────────

export interface PortalConfig {
  intensity?: number;
  particleCount?: number;
  rippleSpeed?: number;
  flareStrength?: number;
  palette?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// ─── GLSL shaders ─────────────────────────────────────────────────────────────

const PORTAL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PORTAL_FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;   // 0.0 → 1.0
  uniform float uIntensity;
  uniform float uRippleSpeed;

  varying vec2 vUv;

  #define PI  3.14159265358979
  #define TAU 6.28318530718

  // ── Hash / value noise ────────────────────────────────────────────────────
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // 7-octave domain-warped FBM (Inigo Quilez technique)
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 7; i++) {
      v += a * noise(p);
      p  = rot * p * 2.1 + vec2(0.7, 1.3);
      a *= 0.45;
    }
    return v;
  }

  // Cosine colour palette (Inigo Quilez) — cyan → gold → neon-pink cycle
  vec3 portalPalette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);  // phase shifts
    return a + b * cos(TAU * (c * t + d));
  }

  void main() {
    // Centre UV with equal scale on both axes (shader is on a square canvas)
    vec2 uv  = vUv * 2.0 - 1.0;
    float r  = length(uv);
    float th = atan(uv.y, uv.x);
    float t  = uTime * uRippleSpeed;

    // ── Domain-warped smoke ripples ──────────────────────────────────────
    vec2 q = vec2(
      fbm(uv + vec2(0.70) + t * 0.10),
      fbm(uv + vec2(1.30) - t * 0.08)
    );
    vec2 rr = vec2(
      fbm(uv + 2.0 * q + vec2(1.7, 9.2) + t * 0.13),
      fbm(uv + 2.0 * q + vec2(8.3, 2.8) + t * 0.06)
    );
    float smoke = fbm(uv + 2.5 * rr + t * 0.05);

    // ── Logarithmic spiral arms ──────────────────────────────────────────
    float arms       = 3.0;
    float spiralPhase = th + log(max(r, 0.001)) * arms - t * 1.3;
    float spiral      = pow(sin(spiralPhase * 4.0) * 0.5 + 0.5, 2.5);

    // ── Radial masks ─────────────────────────────────────────────────────
    float innerMask = smoothstep(0.04, 0.20, r);
    float outerMask = smoothstep(1.08, 0.35, r);
    float vortex    = innerMask * outerMask;

    // ── Progress fill: filled zone expands from centre outward ──────────
    float filledR    = sqrt(uProgress) * 0.82;
    float filled     = smoothstep(filledR + 0.06, filledR - 0.02, r);
    // Bright border ring at fill boundary
    float boundary   = exp(-200.0 * pow(r - filledR, 2.0));

    // ── Lens-flare / core glow (1/r² falloff) ───────────────────────────
    float coreGlow = 0.10 / (r * r + 0.008);

    // ── Final colour composition ─────────────────────────────────────────
    float colT = smoke * 0.45 + spiral * 0.30 + r * 0.15 + t * 0.08;
    vec3 col   = portalPalette(colT);

    // Cool teal smoke wisps
    col += vec3(0.05, 0.35, 0.70) * smoke * 0.5 * vortex;

    // Warm white-gold core
    col += vec3(1.00, 0.90, 0.55) * coreGlow * uIntensity;

    // Gold boundary ring at progress edge
    col += vec3(0.90, 0.75, 0.20) * boundary * 3.0 * uIntensity;

    // Boost brightness inside filled zone
    col += col * filled * spiral * 0.85;

    // Extra electron shimmer using animated noise
    float shimmer = noise(uv * 12.0 + t * 2.5) * 0.12;
    col += vec3(0.4, 0.9, 1.0) * shimmer * vortex * filled;

    float alpha = clamp(
      spiral * vortex * uIntensity * 0.90
      + smoke  * vortex * 0.28
      + coreGlow * 0.50
      + boundary * 0.40,
      0.0, 1.0
    );

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

// ─── PortalPlane — full-screen quad with shader ───────────────────────────────

interface PortalPlaneProps {
  progress: number;
  intensity: number;
  rippleSpeed: number;
}

const PortalPlane: React.FC<PortalPlaneProps> = ({ progress, intensity, rippleSpeed }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo<Record<string, THREE.IUniform>>(() => ({
    uTime:        { value: 0 },
    uProgress:    { value: progress / 100 },
    uIntensity:   { value: intensity },
    uRippleSpeed: { value: rippleSpeed },
  // Uniforms are created once and mutated in-place each frame via useFrame;
  // re-creating them on every prop change would cause a shader re-link.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value      = clock.getElapsedTime();
    matRef.current.uniforms.uProgress.value  = progress / 100;
    matRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={PORTAL_VERT}
        fragmentShader={PORTAL_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// ─── ElectronParticles — 4 rings of orbiting energy particles ────────────────

interface ElectronParticlesProps {
  count: number;
  progress: number;
}

const ElectronParticles: React.FC<ElectronParticlesProps> = ({ count, progress }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const { geometry, offsets, radii, speeds } = useMemo(() => {
    const pos     = new Float32Array(count * 3);
    const offs    = new Float32Array(count);
    const rads    = new Float32Array(count);
    const spds    = new Float32Array(count);
    const rings   = 4;

    for (let i = 0; i < count; i++) {
      const ring   = i % rings;
      offs[i] = (i / count) * Math.PI * 2 + ring * (Math.PI / rings);
      rads[i] = 0.28 + ring * 0.11 + (Math.random() * 0.04 - 0.02);
      spds[i] = 0.25 + (i % 7) * 0.06;
      pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    return { geometry: geo, offsets: offs, radii: rads, speeds: spds };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t   = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const ang = offsets[i] + t * speeds[i];
      const rr  = radii[i] + Math.sin(t * 0.7 + offsets[i]) * 0.015;
      pos.setXYZ(i,
        Math.cos(ang) * rr,
        Math.sin(ang) * rr,
        Math.sin(t * 1.2 + offsets[i]) * 0.03
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.007}
        sizeAttenuation
        transparent
        opacity={0.55 + (progress / 100) * 0.45}
        color="#00e5ff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ─── GoldElectronParticles — slower gold-toned outer ring ────────────────────

const GoldElectronParticles: React.FC<{ count: number; progress: number }> = ({ count, progress }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const { geometry, offsets } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const offs = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      offs[i] = (i / count) * Math.PI * 2;
      pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { geometry: geo, offsets: offs };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t   = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const ang = offsets[i] - t * 0.18;
      const rr  = 0.68 + Math.sin(t * 0.4 + offsets[i] * 2) * 0.04;
      pos.setXYZ(i,
        Math.cos(ang) * rr,
        Math.sin(ang) * rr,
        0
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.005}
        sizeAttenuation
        transparent
        opacity={0.3 + (progress / 100) * 0.5}
        color="#D4AF37"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ─── PortalScene — all 3D content + post-processing ──────────────────────────

interface PortalSceneProps {
  progress: number;
  intensity: number;
  particleCount: number;
  rippleSpeed: number;
  flareStrength: number;
}

const PortalScene: React.FC<PortalSceneProps> = ({
  progress, intensity, particleCount, rippleSpeed, flareStrength,
}) => (
  <>
    <PortalPlane progress={progress} intensity={intensity} rippleSpeed={rippleSpeed} />
    <ElectronParticles count={particleCount} progress={progress} />
    <GoldElectronParticles count={Math.floor(particleCount / 4)} progress={progress} />
    {/* @ts-expect-error — @react-three/postprocessing props lack full TS declarations */}
    <EffectComposer disableNormalPass multisampling={0}>
      {/* @ts-expect-error — Bloom props vary between postprocessing versions */}
      <Bloom
        luminanceThreshold={0.05}
        luminanceSmoothing={0.85}
        mipmapBlur
        intensity={1.6 + (progress / 100) * 1.2 * flareStrength}
      />
    </EffectComposer>
  </>
);

// ─── ProgressOverlay — SVG tick ring + arc trace ──────────────────────────────

interface ProgressOverlayProps {
  progress: number;
}

const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ progress }) => {
  const TICKS    = 36;
  const CX = 50, CY = 50;
  const TICK_R   = 46.5;
  const TICK_LEN = 3.8;
  const ARC_R    = 41.0;

  // SVG arc path for the progress indicator
  const pct     = Math.max(0, Math.min(progress, 99.99)); // avoid full-circle degenerate
  const arcDeg  = (pct / 100) * 360;
  const arcRad  = (arcDeg - 90) * (Math.PI / 180);
  const arcEndX = CX + ARC_R * Math.cos(arcRad);
  const arcEndY = CY + ARC_R * Math.sin(arcRad);
  const largeArc = arcDeg > 180 ? 1 : 0;
  const arcPath  = pct > 0
    ? `M ${CX} ${CY - ARC_R} A ${ARC_R} ${ARC_R} 0 ${largeArc} 1 ${arcEndX.toFixed(3)} ${arcEndY.toFixed(3)}`
    : '';

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* Arc gradient: pink → gold → cyan */}
        <linearGradient id="ptArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff003c" />
          <stop offset="50%"  stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>
        {/* Outer ring gradient */}
        <linearGradient id="ptRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(212,175,55,0.08)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0.05)"  />
        </linearGradient>
      </defs>

      {/* Subtle outer reference ring */}
      <circle
        cx={CX} cy={CY} r={TICK_R + 1.2}
        fill="none" stroke="url(#ptRingGrad)" strokeWidth="0.3"
      />

      {/* 36 segmented tick marks */}
      {Array.from({ length: TICKS }).map((_, i) => {
        const ang     = (i / TICKS) * 360;
        const rad     = (ang - 90) * (Math.PI / 180);
        const lit     = (i / TICKS) <= (progress / 100);
        const isMajor = i % 9 === 0;
        const inner   = TICK_R - (isMajor ? TICK_LEN + 1 : TICK_LEN);
        const outer   = TICK_R + 0.5;
        const x1 = CX + inner * Math.cos(rad);
        const y1 = CY + inner * Math.sin(rad);
        const x2 = CX + outer * Math.cos(rad);
        const y2 = CY + outer * Math.sin(rad);
        const litColor = isMajor ? '#D4AF37' : '#ff003c';
        return (
          <line
            key={i}
            x1={x1.toFixed(3)} y1={y1.toFixed(3)}
            x2={x2.toFixed(3)} y2={y2.toFixed(3)}
            stroke={lit ? litColor : 'rgba(255,255,255,0.10)'}
            strokeWidth={isMajor ? 0.80 : 0.40}
            strokeLinecap="round"
            style={{ filter: lit ? `drop-shadow(0 0 ${isMajor ? 1.8 : 0.9}px ${litColor})` : 'none' }}
          />
        );
      })}

      {/* Clockwise progress arc */}
      {arcPath && (
        <path
          d={arcPath}
          fill="none"
          stroke="url(#ptArcGrad)"
          strokeWidth="0.9"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 2.5px #ff003c)' }}
        />
      )}

      {/* Small dot at arc tip */}
      {pct > 1 && (
        <circle
          cx={arcEndX.toFixed(3)} cy={arcEndY.toFixed(3)} r="1.2"
          fill="#ffffff"
          style={{ filter: 'drop-shadow(0 0 3px #00e5ff) drop-shadow(0 0 6px #00e5ff)' }}
        />
      )}
    </svg>
  );
};

// ─── ChromeLogoOverlay — Savant "S" with simulated black-chrome reflectance ──

interface ChromeLogoOverlayProps {
  progress: number;
}

const SAVANT_PATHS = [
  // top-loop
  'm47.67,37.07l-2.67,1.54a0.62,0.62 0 0 1 -0.89,-0.75q1.43,-3.96 1.47,-5.02c0.34,-10.74 -15.97,-7.15 -11.12,2.26q0.99,1.9 4.64,6.77a1.35,1.35 0 0 1 -0.06,1.69l-1.2,1.39a0.86,0.85 47.6 0 1 -1.35,-0.07c-4.32,-6.16 -10.05,-11.78 -4.62,-18.81c6.72,-8.71 20.69,-1.03 17.23,9.25a3.23,3.18 84.7 0 1 -1.43,1.75z',
  // middle-loop
  'm30.29,41.13q-2.55,-0.05 -3.6,0.11c-6.01,0.9 -6.62,8.78 -1.66,11.21q4.03,1.96 7.59,-1.57q8.7,-8.65 9.6,-9.62q3.72,-3.99 8.93,-3.91c8.35,0.13 12.15,10 6.99,16.13c-4.55,5.4 -12.91,4.27 -16.55,-1.84a0.2,0.2 0 0 1 0,-0.22q1.08,-1.68 2.55,-2.86a0.11,0.11 0 0 1 0.16,0.03q2,3.44 3.83,4.1q3.88,1.38 6.54,-1.15c5.86,-5.59 -2.23,-14.35 -8.51,-8.58q-3.54,3.26 -10.92,10.77c-4.56,4.64 -12.2,4.14 -15.81,-1.33c-2.46,-3.73 -1.98,-9.15 1.32,-12.34q2.79,-2.71 7.11,-2.89a1.51,1.5 73.4 0 1 1.36,0.74l1.46,2.55a0.45,0.44 -14.8 0 1 -0.39,0.67z',
];

const ChromeLogoOverlay: React.FC<ChromeLogoOverlayProps> = ({ progress }) => {
  const p = progress / 100;
  const glowCyan  = `rgba(0,229,255,${(0.25 + p * 0.65).toFixed(3)})`;
  const glowGold  = `rgba(212,175,55,${(0.15 + p * 0.40).toFixed(3)})`;
  const outerGlow = `drop-shadow(0 0 ${(6 + p * 10).toFixed(1)}px ${glowCyan}) drop-shadow(0 0 ${(12 + p * 14).toFixed(1)}px ${glowGold})`;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      <div style={{ width: '13%', aspectRatio: '64 / 84', position: 'relative', filter: outerGlow }}>
        <svg
          viewBox="0 0 64 84"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Multi-stop chrome gradient — very dark ↔ bright highlight ↔ dark */}
            <linearGradient id="ptChrome" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%"   stopColor="#111111" />
              <stop offset="18%"  stopColor="#6a6a6a" />
              <stop offset="36%"  stopColor="#e8e8e8" />
              <stop offset="52%"  stopColor="#2c2c2c" />
              <stop offset="68%"  stopColor="#b0b0b0" />
              <stop offset="84%"  stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#555555" />
            </linearGradient>

            {/* Portal-colour environmental reflection */}
            <linearGradient id="ptReflect" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={`rgba(0,229,255,${(0.30 * p).toFixed(3)})`} />
              <stop offset="35%"  stopColor={`rgba(212,175,55,${(0.15 * p).toFixed(3)})`} />
              <stop offset="65%"  stopColor={`rgba(255,0,60,${(0.20 * p).toFixed(3)})`}  />
              <stop offset="100%" stopColor={`rgba(0,229,255,${(0.18 * p).toFixed(3)})`} />
            </linearGradient>
          </defs>

          {/* Base chrome */}
          {SAVANT_PATHS.map((d, i) => (
            <path key={`chrome-${i}`} d={d} fill="url(#ptChrome)" />
          ))}

          {/* Colour reflection overlay — screen-blended so it only adds light */}
          {SAVANT_PATHS.map((d, i) => (
            <path key={`reflect-${i}`} d={d} fill="url(#ptReflect)" style={{ mixBlendMode: 'screen' }} />
          ))}
        </svg>
      </div>
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────

export interface TimePortalSpiralProps {
  progress: number;
  phase: LoadingPhase;
  config?: PortalConfig;
}

export const TimePortalSpiral: React.FC<TimePortalSpiralProps> = ({
  progress,
  phase,
  config = {},
}) => {
  const {
    intensity     = 1.2,
    particleCount = 200,
    rippleSpeed   = 0.5,
    flareStrength = 1.0,
  } = config;

  // During transition, slowly wind down intensity
  const activeIntensity = phase === 'transition'
    ? intensity * 0.4
    : phase === 'complete'
    ? 0
    : intensity;

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    // Static fallback for reduced-motion: just a static SVG ring
    return (
      <div
        className="relative"
        style={{ width: '100%', height: '100%' }}
        aria-label="Loading portal"
      >
        <ProgressOverlay progress={progress} />
        <ChromeLogoOverlay progress={progress} />
      </div>
    );
  }

  return (
    <div
      className="relative"
      style={{ width: '100%', height: '100%' }}
      aria-label="Loading portal"
    >
    {/* WebGL portal canvas — transparent bg so obsidian shows through */}
      <Suspense fallback={null}>
        <Canvas
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 1], fov: 90, near: 0.01, far: 10 }}
          style={{ position: 'absolute', inset: 0, background: 'transparent' }}
        >
          <PortalScene
            progress={progress}
            intensity={activeIntensity}
            particleCount={particleCount}
            rippleSpeed={rippleSpeed}
            flareStrength={flareStrength}
          />
        </Canvas>
      </Suspense>

      {/* SVG progress ticks + arc (always on top of canvas) */}
      <ProgressOverlay progress={progress} />

      {/* Chrome Savant logo centred */}
      <ChromeLogoOverlay progress={progress} />
    </div>
  );
};
