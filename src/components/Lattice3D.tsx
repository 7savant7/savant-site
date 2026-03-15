import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

const NeuralConnections = ({ count = 50, radius = 2 }) => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      p.push(new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ));
    }
    return p;
  }, [count, radius]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    // Connect each point to its nearest neighbors
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < 1.5) {
          vertices.push(points[i].x, points[i].y, points[i].z);
          vertices.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, [points]);

  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      linesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </lineSegments>
      <Points positions={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}>
        <PointMaterial
          transparent
          color="#ff003c"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const CoreGeometry = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { cpuUsage } = useStore();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        wireframe
        emissive="#ffffff"
        emissiveIntensity={0.5 + (cpuUsage / 100)}
      />
    </mesh>
  );
};

export const Lattice3D = () => {
  const { cpuUsage } = useStore();

  return (
    <div className="w-full h-full bg-obsidian relative overflow-hidden">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff003c" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <NeuralConnections count={100} radius={2.5} />
          <CoreGeometry />
        </Float>
        
        <color attach="background" args={['#050505']} />
      </Canvas>
      
      <div className="absolute top-8 left-8 font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase">
        Neural_Lattice_v8.0 // Active
      </div>
      
      <div className="absolute bottom-8 right-8 font-mono text-[10px] text-crimson/40 tracking-[0.3em] uppercase flex flex-col items-end">
        <span>Processing_Load: {cpuUsage.toFixed(1)}%</span>
        <span>Symmetry_Status: Optimal</span>
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-t from-white/10 to-transparent" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-20 bg-gradient-to-r from-white/10 to-transparent" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-20 bg-gradient-to-l from-white/10 to-transparent" />
      </div>
    </div>
  );
};
