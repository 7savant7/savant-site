import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshTransmissionMaterial, 
  Environment, 
  ContactShadows, 
  Points, 
  PointMaterial,
  PerspectiveCamera,
  Text,
  Center,
  useTexture,
  MeshDistortMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, DepthOfField } from '@react-three/postprocessing';

// Procedural Neural/Circuit Texture Generator
const generateNeuralTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  // Dark base
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 1024, 1024);
  
  // Draw neural network / circuit lines
  ctx.strokeStyle = 'rgba(255, 0, 60, 0.4)';
  ctx.lineWidth = 1;
  
  const nodes = Array.from({ length: 50 }, () => ({
    x: Math.random() * 1024,
    y: Math.random() * 1024
  }));

  nodes.forEach((node, i) => {
    nodes.slice(i + 1).forEach(other => {
      const dist = Math.hypot(node.x - other.x, node.y - other.y);
      if (dist < 200) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    });
  });

  // Draw glowing nodes
  nodes.forEach(node => {
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 4);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 0, 60, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

const SavantLogoShape = () => {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const strandsRef = useRef<THREE.Group>(null);
  const neuralTexture = useMemo(() => generateNeuralTexture(), []);
  
  // Exact Savant Logo Shape: Triple Loop / Triquetra
  const curve = useMemo(() => {
    const points = [];
    const segments = 300;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      
      // Parametric equation for a refined triquetra-like shape
      // r = a + b * cos(k * t)
      const r = 3.2 * (1 + 0.4 * Math.cos(3 * t));
      const x = r * Math.sin(t);
      const y = r * Math.cos(t);
      const z = 0.6 * Math.sin(3 * t); // 3D wave
      
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  // Inner strands curves
  const strandCurves = useMemo(() => {
    return Array.from({ length: 3 }, (_, idx) => {
      const points = [];
      const segments = 200;
      const offset = (idx / 3) * Math.PI * 2;
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        const r = 3.2 * (1 + 0.4 * Math.cos(3 * t));
        const x = r * Math.sin(t) + Math.sin(t * 10 + offset) * 0.15;
        const y = r * Math.cos(t) + Math.cos(t * 10 + offset) * 0.15;
        const z = 0.6 * Math.sin(3 * t) + Math.sin(t * 5 + offset) * 0.1;
        points.push(new THREE.Vector3(x, y, z));
      }
      return new THREE.CatmullRomCurve3(points, true);
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = -time * 0.4;
    }
    if (strandsRef.current) {
      strandsRef.current.children.forEach((child, i) => {
        child.rotation.z = time * (0.2 + i * 0.1);
      });
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Glassy Structure - High Refraction */}
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 300, 0.5, 32, true]} />
        <MeshTransmissionMaterial
          backside
          samples={32}
          resolution={1024}
          transmission={1.0}
          roughness={0.02}
          thickness={2.0}
          ior={1.6}
          chromaticAberration={0.25}
          anisotropy={0.5}
          distortion={0.3}
          distortionScale={0.3}
          temporalDistortion={0.15}
          clearcoat={1}
          attenuationDistance={1.0}
          attenuationColor="#ffffff"
          color="#ffffff"
          normalMap={neuralTexture}
          normalScale={new THREE.Vector2(0.08, 0.08)}
        />
      </mesh>

      {/* Internal Neural Core - Pulsing Energy */}
      <mesh ref={coreRef}>
        <tubeGeometry args={[curve, 300, 0.15, 12, true]} />
        <MeshDistortMaterial
          color="#ff003c"
          emissive="#ff003c"
          emissiveIntensity={15}
          speed={5}
          distort={0.5}
          radius={1}
          metalness={1}
          roughness={0.05}
        />
      </mesh>

      {/* Neural Strands - Flowing Data */}
      <group ref={strandsRef}>
        {strandCurves.map((c, i) => (
          <mesh key={i}>
            <tubeGeometry args={[c, 200, 0.03, 8, true]} />
            <meshBasicMaterial
              color="#ff003c"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Atmospheric Outer Shell - Soft Glow */}
      <mesh scale={1.15}>
        <tubeGeometry args={[curve, 150, 0.7, 16, true]} />
        <meshBasicMaterial
          color="#ff003c"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const BackgroundAtmosphere = () => {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * 2) % 10;
    }
  });

  return (
    <group>
      {/* Deep Purple Volumetric Gradient */}
      <mesh position={[0, 0, -15]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#0a0514" />
      </mesh>
      
      {/* Moving Neural Grid */}
      <group ref={gridRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
        <gridHelper args={[100, 50, "#ff003c", "#1a0b2e"]} />
      </group>

      <Points positions={new Float32Array(Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 50))}>
        <PointMaterial
          transparent
          color="#ff003c"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        />
      </Points>
    </group>
  );
};

const LogoScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={35} />
      <Environment preset="night" />
      
      <ambientLight intensity={0.2} />
      <spotLight position={[15, 25, 15]} angle={0.2} penumbra={1} intensity={25} castShadow />
      <pointLight position={[-15, -15, -15]} color="#ff003c" intensity={10} />
      <pointLight position={[10, 10, 10]} color="#ffffff" intensity={5} />
      
      {/* Intense Purple Background Glow */}
      <pointLight position={[0, 0, -8]} color="#6a0dad" intensity={40} distance={50} />
      
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8}>
        <SavantLogoShape />
      </Float>

      <BackgroundAtmosphere />

      <ContactShadows 
        position={[0, -8, 0]} 
        opacity={0.6} 
        scale={40} 
        blur={4} 
        far={15} 
        color="#0a0514"
      />

      <EffectComposer multisampling={8}>
        <Bloom 
          luminanceThreshold={0.15} 
          mipmapBlur 
          intensity={2.0} 
          radius={0.5}
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(0.003, 0.003)} 
        />
        <DepthOfField
          focusDistance={0}
          focalLength={0.03}
          bokehScale={3}
          height={480}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.05} darkness={1.2} />
      </EffectComposer>
    </>
  );
};

export const ThreeLogo = () => {
  return (
    <div className="w-full h-full relative bg-[#050505]">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
      >
        <LogoScene />
      </Canvas>
      
      {/* UI Overlay - Editorial Style */}
      <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="font-mono text-[10px] text-crimson tracking-[0.8em] uppercase font-black">
              SAVANT_CORE_v14.5
            </div>
            <div className="h-[1px] w-24 bg-crimson/30" />
          </div>
          <div className="font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase">
            NEURAL_LATTICE_ACTIVE
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <div className="font-mono text-[8px] text-white/10 tracking-[1.2em] uppercase">
              PRECISION_3D_ARCHITECTURE
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-crimson rounded-full animate-pulse" />
              <div className="font-mono text-[10px] text-white/40 tracking-[0.5em] uppercase">
                SYNCHRONIZED
              </div>
            </div>
          </div>
          <div className="font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase">
            LATENCY: 0.0014ms
          </div>
        </div>
      </div>
    </div>
  );
};
