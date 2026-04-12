/**
 * TimePortalSpiral.tsx
 *
 * Bioluminescent time-portal spiral for the Savant preloader.
 *
 * ─── Tweak guide ────────────────────────────────────────────────────────────
 *  BLOOM_INTENSITY       – post-process glow strength  (default 2.2, range 0.5–5)
 *  SMOKE_PARTICLE_COUNT  – smoke/ripple particle density (default 320)
 *  ELECTRON_COUNT        – orbiting electron count      (default 90)
 *  RIPPLE_SPEED          – multiplier for all animation speeds (default 1.0)
 * ────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Tweak constants ─────────────────────────────────────────────────────────
/** Post-process bloom strength. Range: 0.5–5.0 */
export const BLOOM_INTENSITY = 2.2;
/** Smoke/ripple particle count – lower for better performance */
export const SMOKE_PARTICLE_COUNT = 320;
/** Orbiting electron particle count */
export const ELECTRON_COUNT = 90;
/** Global animation speed multiplier (ripple + spiral) */
export const RIPPLE_SPEED = 1.0;

// ─────────────────────────────────────────────────────────────────────────────
// GLSL – Portal disc
// ─────────────────────────────────────────────────────────────────────────────
const PORTAL_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PORTAL_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uRippleSpeed;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8660, 0.5, -0.5, 0.8660);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv   = vUv * 2.0 - 1.0;
    float dist  = length(uv);
    float angle = atan(uv.y, uv.x);
    float t     = uTime * uRippleSpeed;

    // Domain-warp smoke displacement
    vec2 q = vec2(fbm(uv + t * 0.08), fbm(uv + vec2(5.2, 1.3) + t * 0.07));
    vec2 r = vec2(
      fbm(uv + q * 1.4 + vec2(1.7, 9.2) + t * 0.10),
      fbm(uv + q * 1.2 + vec2(8.3, 2.8) - t * 0.09)
    );
    vec2  warpedUv   = uv + r * 0.28;
    float warpedDist = length(warpedUv);

    // Spiral bands
    float spiralAngle = angle - dist * 7.0 + t * 1.8;
    float spiral1 = sin(spiralAngle * 4.0) * 0.5 + 0.5;
    float spiral2 = sin(spiralAngle * 7.0 - t * 0.8) * 0.5 + 0.5;

    // Portal shape
    float edge     = smoothstep(1.02, 0.35, warpedDist) * smoothstep(0.0, 0.06, dist);
    float innerGlow = pow(max(0.0, 1.0 - warpedDist * 1.15), 2.8);

    // Bioluminescent ripple rings
    float ripple = sin(dist * 16.0 - t * 4.5) * 0.5 + 0.5;
    float ring   = pow(ripple, 6.0) * edge;

    // High-freq freneticism (wavering time-portal feel)
    float frenetic = sin(dist * 32.0 - t * 14.0) * 0.5 + 0.5;
    frenetic *= smoothstep(0.65, 0.0, dist) * 0.18;

    // Color palette
    vec3 cyan   = vec3(0.05, 0.90, 1.00);
    vec3 violet = vec3(0.55, 0.05, 1.00);
    vec3 bio    = vec3(0.05, 1.00, 0.60);
    vec3 gold   = vec3(0.83, 0.69, 0.22);

    float mx1 = sin(spiralAngle * 0.6 + t * 0.38) * 0.5 + 0.5;
    float mx2 = cos(spiralAngle * 0.4 - t * 0.27) * 0.5 + 0.5;

    vec3 col = mix(cyan, violet, mx1 * edge);
    col  = mix(col, bio, spiral1 * mx2 * 0.45 * edge);
    col += gold * innerGlow * 0.75;
    col += cyan * ring * 0.6;
    col += vec3(1.0) * pow(innerGlow, 5.0) * 1.2;  // bright white core
    col += bio  * frenetic;

    float alpha = edge * (spiral1 * 0.6 + spiral2 * 0.15 + 0.25)
                + innerGlow * 0.95
                + ring * 0.4;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// GLSL – Smoke / ripple particles
// ─────────────────────────────────────────────────────────────────────────────
const SMOKE_VERT = /* glsl */`
  attribute float aSize;
  attribute float aAlpha;
  attribute float aOffset;
  attribute float aRadius;
  uniform float uTime;
  varying float vAlpha;
  varying float vRadius;

  void main() {
    vAlpha  = aAlpha;
    vRadius = aRadius;

    float angle  = atan(position.y, position.x);
    float radius = length(position.xy);

    // Spiral drift – inner particles move faster
    float drift    = uTime * 0.35 / (radius + 0.6) + aOffset;
    float newAngle = angle + drift;

    vec3 pos = vec3(
      cos(newAngle) * radius,
      sin(newAngle) * radius,
      position.z + sin(uTime * 1.1 + aOffset * 6.2832) * 0.04
    );

    vec4 mvPos     = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize   = aSize * (300.0 / -mvPos.z);
    gl_Position    = projectionMatrix * mvPos;
  }
`;

const SMOKE_FRAG = /* glsl */`
  varying float vAlpha;
  varying float vRadius;

  void main() {
    vec2  uv    = gl_PointCoord - 0.5;
    float d     = length(uv);
    float alpha = pow(smoothstep(0.5, 0.0, d), 1.8) * vAlpha * 0.35;
    float ratio = clamp(vRadius / 1.8, 0.0, 1.0);
    vec3  col   = mix(vec3(0.05, 0.6, 1.0), vec3(0.5, 0.0, 0.9), ratio);
    gl_FragColor = vec4(col, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// GLSL – Electron particles
// ─────────────────────────────────────────────────────────────────────────────
const ELECTRON_VERT = /* glsl */`
  attribute float aOrbitRadius;
  attribute float aOrbitSpeed;
  attribute float aOrbitPhase;
  attribute float aOrbitTilt;
  uniform float uTime;

  void main() {
    float angle = uTime * aOrbitSpeed + aOrbitPhase;
    float r     = aOrbitRadius;
    vec3 pos    = vec3(
      cos(angle) * r,
      sin(angle) * r * cos(aOrbitTilt),
      sin(angle) * r * sin(aOrbitTilt)
    );
    vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.8 * (300.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const ELECTRON_FRAG = /* glsl */`
  void main() {
    vec2  uv  = gl_PointCoord - 0.5;
    float d   = length(uv);
    float g   = pow(1.0 - smoothstep(0.0, 0.5, d), 1.5);
    vec3  col = mix(vec3(0.5, 1.0, 1.0), vec3(1.0, 1.0, 0.6), d * 2.0);
    gl_FragColor = vec4(col, g);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// GLSL – Lens-flare / starburst center
// ─────────────────────────────────────────────────────────────────────────────
const FLARE_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FLARE_FRAG = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2  uv   = vUv * 2.0 - 1.0;
    float dist  = length(uv);
    float angle = atan(uv.y, uv.x);

    // 8-point starburst rays (slowly rotate)
    float rays = abs(sin(angle * 4.0 + uTime * 0.18)) * abs(cos(angle * 4.0 - uTime * 0.14));
    rays = pow(rays, 0.35) * pow(max(0.0, 1.0 - dist * 2.5), 2.0);

    // Chromatic halos at different radii
    float halo1 = exp(-abs(dist - 0.18) * 28.0) * 0.45;
    float halo2 = exp(-abs(dist - 0.30) * 35.0) * 0.20;

    // Bright white core
    float core = pow(max(0.0, 1.0 - dist * 5.0), 3.0);

    vec3  col   = vec3(0.88, 0.94, 1.00) * (rays + halo1 + halo2 + core);
    float alpha = rays * 0.25 + halo1 * 0.55 + halo2 * 0.35 + core * 0.85;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// React components
// ─────────────────────────────────────────────────────────────────────────────

/** Main bioluminescent portal disc with domain-warped smoke ripples */
const PortalDisc: React.FC = () => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime:        { value: 0 },
    uRippleSpeed: { value: RIPPLE_SPEED },
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[3.8, 3.8, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={PORTAL_VERT}
        fragmentShader={PORTAL_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/** Spiral tube arm – helical TubeGeometry that slowly counter-rotates */
const SpiralArm: React.FC<{
  offset?: number;
  color?: string;
  turns?: number;
  speed?: number;
}> = ({ offset = 0, color = '#00e5ff', turns = 3, speed = -0.12 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const STEPS = 300;
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS;
      const a = t * Math.PI * 2 * turns + offset;
      const rr = 0.08 + t * 1.55;
      pts.push(new THREE.Vector3(
        Math.cos(a) * rr,
        Math.sin(a) * rr,
        (t - 0.5) * 0.12,
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 300, 0.007, 6, false);
  }, [offset, turns]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * speed;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

/** Smoke / ripple particle cloud swirling around the portal */
const SmokeParticles: React.FC<{ count?: number }> = ({
  count = SMOKE_PARTICLE_COUNT,
}) => {
  const matRef  = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const attrs = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);
    const alphas    = new Float32Array(count);
    const offsets   = new Float32Array(count);
    const radii     = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 0.25 + Math.random() * 1.5;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3]     = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      sizes[i]   = 7 + Math.random() * 28;
      alphas[i]  = 0.35 + Math.random() * 0.65;
      offsets[i] = Math.random() * Math.PI * 2;
      radii[i]   = r;
    }
    return { positions, sizes, alphas, offsets, radii };
  }, [count]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={attrs.positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aSize"    array={attrs.sizes}     count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aAlpha"   array={attrs.alphas}    count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aOffset"  array={attrs.offsets}   count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aRadius"  array={attrs.radii}     count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={SMOKE_VERT}
        fragmentShader={SMOKE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/** Glowing electron particles on randomised orbital paths */
const ElectronParticles: React.FC<{ count?: number }> = ({
  count = ELECTRON_COUNT,
}) => {
  const matRef   = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const attrs = useMemo(() => {
    const positions   = new Float32Array(count * 3); // placeholder; shader computes real pos
    const orbitRadius = new Float32Array(count);
    const orbitSpeed  = new Float32Array(count);
    const orbitPhase  = new Float32Array(count);
    const orbitTilt   = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      orbitRadius[i] = 0.35 + Math.random() * 1.25;
      orbitSpeed[i]  = (0.6 + Math.random() * 2.2) * (Math.random() > 0.5 ? 1 : -1);
      orbitPhase[i]  = Math.random() * Math.PI * 2;
      orbitTilt[i]   = Math.random() * Math.PI;
    }
    return { positions, orbitRadius, orbitSpeed, orbitPhase, orbitTilt };
  }, [count]);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"     array={attrs.positions}   count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aOrbitRadius" array={attrs.orbitRadius} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aOrbitSpeed"  array={attrs.orbitSpeed}  count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aOrbitPhase"  array={attrs.orbitPhase}  count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aOrbitTilt"   array={attrs.orbitTilt}   count={count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={ELECTRON_VERT}
        fragmentShader={ELECTRON_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/** Lens-flare starburst + chromatic halos centred on the portal */
const LensFlareCenter: React.FC = () => {
  const matRef   = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, 0.02]}>
      <planeGeometry args={[1.1, 1.1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={FLARE_VERT}
        fragmentShader={FLARE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Public: full 3-D portal scene (place inside a <Canvas>)
// ─────────────────────────────────────────────────────────────────────────────
export const TimePortalScene: React.FC = () => (
  <>
    <color attach="background" args={['#000000']} />
    <ambientLight intensity={0.05} />

    <PortalDisc />

    {/* Four helical spiral arms at 90° offsets, slightly different speeds */}
    <SpiralArm offset={0}                    color="#00e5ff" turns={3}   speed={-0.12} />
    <SpiralArm offset={Math.PI}              color="#a040ff" turns={3}   speed={-0.10} />
    <SpiralArm offset={Math.PI / 2}          color="#00ff9d" turns={2.5} speed={-0.14} />
    <SpiralArm offset={(3 * Math.PI) / 2}    color="#ff4080" turns={2.5} speed={-0.09} />

    <SmokeParticles  count={SMOKE_PARTICLE_COUNT} />
    <ElectronParticles count={ELECTRON_COUNT} />
    <LensFlareCenter />

    <EffectComposer>
      <Bloom
        luminanceThreshold={0.08}
        luminanceSmoothing={0.85}
        intensity={BLOOM_INTENSITY}
        height={480}
      />
      <ChromaticAberration offset={new THREE.Vector2(0.0018, 0.0018)} />
    </EffectComposer>
  </>
);
