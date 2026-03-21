"use client";

import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { extend, useFrame, Canvas } from "@react-three/fiber";
import { 
  ContactShadows, 
  Environment, 
  Float, 
  MeshTransmissionMaterial, 
  OrbitControls, 
  shaderMaterial, 
  PerspectiveCamera,
  Center
} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
// @ts-ignore
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMood } from "../contexts/MoodContext";

const SVG_MARKUP = String.raw`<svg viewBox="0 0 64 84" xmlns="http://www.w3.org/2000/svg" version="1.1"> <g> <path d="m47.67,37.07l-2.67,1.54a0.62,0.62 0 0 1 -0.89,-0.75q1.43,-3.96 1.47,-5.02c0.34,-10.74 -15.97,-7.15 -11.12,2.26q0.99,1.9 4.64,6.77a1.35,1.35 0 0 1 -0.06,1.69l-1.2,1.39a0.86,0.85 47.6 0 1 -1.35,-0.07c-4.32,-6.16 -10.05,-11.78 -4.62,-18.81c6.72,-8.71 20.69,-1.03 17.23,9.25a3.23,3.18 84.7 0 1 -1.43,1.75z" fill="#ffffff"/> <path d="m30.29,41.13q-2.55,-0.05 -3.6,0.11c-6.01,0.9 -6.62,8.78 -1.66,11.21q4.03,1.96 7.59,-1.57q8.7,-8.65 9.6,-9.62q3.72,-3.99 8.93,-3.91c8.35,0.13 12.15,10 6.99,16.13c-4.55,5.4 -12.91,4.27 -16.55,-1.84a0.2,0.2 0 0 1 0,-0.22q1.08,-1.68 2.55,-2.86a0.11,0.11 0 0 1 0.16,0.03q2,3.44 3.83,4.1q3.88,1.38 6.54,-1.15c5.86,-5.59 -2.23,-14.35 -8.51,-8.58q-3.54,3.26 -10.92,10.77c-4.56,4.64 -12.2,4.14 -15.81,-1.33c-2.46,-3.73 -1.98,-9.15 1.32,-12.34q2.79,-2.71 7.11,-2.89a1.51,1.5 73.4 0 1 1.36,0.74l1.46,2.55a0.45,0.44 -14.8 0 1 -0.39,0.67z" fill="#ffffff"/> </g> </svg>`;

const Variant4Material = shaderMaterial(
  {
    uTime: 0,
    uBaseA: new THREE.Color("#f6d5ff"),
    uBaseB: new THREE.Color("#8fd7ff"),
    uBaseC: new THREE.Color("#ffd590"),
    uSweepA: new THREE.Color("#fff8ff"),
    uSweepB: new THREE.Color("#8ec5ff"),
    uGlow: new THREE.Color("#ffb370"),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform vec3 uBaseA;
  uniform vec3 uBaseB;
  uniform vec3 uBaseC;
  uniform vec3 uSweepA;
  uniform vec3 uSweepB;
  uniform vec3 uGlow;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(.1,.2,.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i + vec3(0,0,0));
    float n100 = hash(i + vec3(1,0,0));
    float n010 = hash(i + vec3(0,1,0));
    float n110 = hash(i + vec3(1,1,0));
    float n001 = hash(i + vec3(0,0,1));
    float n101 = hash(i + vec3(1,0,1));
    float n011 = hash(i + vec3(0,1,1));
    float n111 = hash(i + vec3(1,1,1));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 p = vWorldPos * 0.45;
    float pearlescence = fbm(p + vec3(0.0, 0.0, uTime * 0.08));
    float iridescence = sin((vUv.y * 7.0 + vUv.x * 3.0 + pearlescence * 2.5) * 2.4 + uTime * 0.9) * 0.5 + 0.5;
    vec3 base = mix(uBaseA, uBaseB, iridescence);
    base = mix(base, uBaseC, smoothstep(0.3, 0.95, pearlescence));

    float sweep = smoothstep(0.3, 0.7, sin((vUv.x + vUv.y) * 8.0 - uTime * 2.0) * 0.5 + 0.5);
    float internal = smoothstep(0.35, 0.95, fbm(vWorldPos * 0.9 + vec3(0.0, uTime * 0.55, 0.0)));
    vec3 streak = mix(uSweepA, uSweepB, vUv.y) * sweep * internal * 1.25;

    float fresnel = pow(1.0 - abs(dot(n, vec3(0.0, 0.0, 1.0))), 2.2);
    vec3 color = base + streak + fresnel * 0.35 * uGlow;

    float alpha = 0.72 + fresnel * 0.14;
    gl_FragColor = vec4(color, alpha);
  }
  `
);

const Variant5Material = shaderMaterial(
  {
    uTime: 0,
    uMoss: new THREE.Color("#6b7f1f"),
    uDeep: new THREE.Color("#2b2f12"),
    uBio: new THREE.Color("#d4ff7a"),
    uWarm: new THREE.Color("#ffe18e"),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
  `,
  // Fragment Shader
  `
  uniform float uTime;
  uniform vec3 uMoss;
  uniform vec3 uDeep;
  uniform vec3 uBio;
  uniform vec3 uWarm;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(.1,.2,.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i + vec3(0,0,0));
    float n100 = hash(i + vec3(1,0,0));
    float n010 = hash(i + vec3(0,1,0));
    float n110 = hash(i + vec3(1,1,0));
    float n001 = hash(i + vec3(0,0,1));
    float n101 = hash(i + vec3(1,0,1));
    float n011 = hash(i + vec3(0,1,1));
    float n111 = hash(i + vec3(1,1,1));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 p = vWorldPos * 1.15;

    float mossMask = smoothstep(0.28, 0.88, fbm(p * 1.1));
    float fiber = smoothstep(0.4, 1.0, abs(sin((vUv.y * 30.0 + fbm(p * 2.0) * 3.0) + uTime * 0.65)));
    float wetness = smoothstep(0.55, 0.95, fbm(p * 2.7 + vec3(0.0, uTime * 0.14, 0.0)));
    float streak = smoothstep(0.45, 0.95, sin((vUv.x + vUv.y) * 8.5 - uTime * 1.6) * 0.5 + 0.5);

    vec3 base = mix(uDeep, uMoss, mossMask);
    base += fiber * 0.14 * vec3(0.12, 0.16, 0.04);
    vec3 emissive = mix(uBio, uWarm, streak) * wetness * 0.55;

    float fresnel = pow(1.0 - abs(dot(n, vec3(0.0, 0.0, 1.0))), 2.5);
    vec3 color = base + emissive + fresnel * 0.12;

    gl_FragColor = vec4(color, 1.0);
  }
  `
);

extend({ Variant4Material, Variant5Material });

const LogoMesh = ({ variant = 4 }) => {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { energy } = useMood();
  const svgData = useLoader(SVGLoader, `data:image/svg+xml;utf8,${encodeURIComponent(SVG_MARKUP)}`);

  const meshes = useMemo(() => {
    return svgData.paths.flatMap((path) => {
      const shapes = SVGLoader.createShapes(path);
      return shapes.map((shape) => {
        const geometry = new THREE.ShapeGeometry(shape);
        return { geometry, color: path.color };
      });
    });
  }, [svgData]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    
    // Slight horizontal rotation only
    const targetRotationY = mouse.current.x * 0.15;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
  });

  return (
    <group ref={group} scale={1.25}>
      <Center top>
        <group scale={0.09} rotation={[0, 0, Math.PI]}>
          {meshes.map((mesh, idx) => (
            <mesh key={idx} geometry={mesh.geometry}>
              <meshStandardMaterial 
                color={variant === 4 ? "#ffffff" : "#d4ff7a"}
                emissive={variant === 4 ? "#ffffff" : "#d4ff7a"}
                emissiveIntensity={0.5}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          ))}
        </group>
      </Center>
    </group>
  );
};

export default function Savant3DLogo({ variant = 4, className = "" }: { variant?: number, className?: string }) {
  return (
    <div className={`w-full h-full min-h-[300px] relative ${className}`}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <LogoMesh variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  );
}
