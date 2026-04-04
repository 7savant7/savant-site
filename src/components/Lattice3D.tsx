import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial, OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';

const NeuralConnections = ({ count = 100, radius = 2.5 }) => {
  const { systemLoad } = useStore();
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
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < 1.2) {
          vertices.push(points[i].x, points[i].y, points[i].z);
          vertices.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, [points]);

  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.05;
      linesRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#ff4068" 
          transparent 
          opacity={0.1 + systemLoad * 0.2} 
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <Points ref={pointsRef} positions={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5 + systemLoad * 0.5}
        />
      </Points>
    </group>
  );
};

const CoreGeometry = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { systemLoad } = useStore();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * (0.5 + systemLoad);
      meshRef.current.rotation.x = time * 0.3;
      const s = (hovered ? 1.2 : 1) * (clicked ? 0.8 : 1) * (1 + Math.sin(time * 2) * 0.05);
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <Sphere 
      ref={meshRef} 
      args={[1, 64, 64]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setClicked(true)}
      onPointerUp={() => setClicked(false)}
    >
      <MeshDistortMaterial
        color={hovered ? "#e6c03b" : "#ffffff"}
        speed={2 + systemLoad * 5}
        distort={0.3 + systemLoad * 0.4}
        radius={1}
        emissive={hovered ? "#e6c03b" : "#ff4068"}
        emissiveIntensity={0.5 + systemLoad * 2}
        wireframe
      />
    </Sphere>
  );
};

export const Lattice3D = () => {
  const { cpuUsage, systemLoad } = useStore();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-obsidian relative overflow-hidden group/lattice">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff4068" />
        <spotLight position={[0, 5, 0]} intensity={2} color="#e6c03b" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <NeuralConnections count={150} radius={3} />
          <CoreGeometry />
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5 + systemLoad * 2}
          makeDefault
        />

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1 + systemLoad * 2} />
          <Noise opacity={0.05} />
          <ChromaticAberration offset={new THREE.Vector2(0.001 * (1 + systemLoad), 0.001 * (1 + systemLoad))} />
        </EffectComposer>
        
        <color attach="background" args={['#050505']} />
      </Canvas>
      
      {/* UI Overlays */}
      <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-none">
        <div className="font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase">
          Neural_Lattice_v12.0_ULTRA
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-mono text-[8px] text-emerald-500/60 tracking-widest uppercase">Sync_Active</span>
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8 font-mono text-[10px] text-neon-pink/40 tracking-[0.3em] uppercase flex flex-col items-end pointer-events-none">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-pink"
              animate={{ width: `${cpuUsage}%` }}
            />
          </div>
          <span>Load: {cpuUsage.toFixed(1)}%</span>
        </div>
        <span className="text-[8px] opacity-50">Symmetry_Status: {systemLoad > 0.8 ? 'CRITICAL' : 'OPTIMAL'}</span>
      </div>

      {/* Interactive Legend */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-4">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveNode('CORE')}>
          <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-gold transition-all" />
          <span className="font-mono text-[9px] text-white/30 group-hover:text-white tracking-widest uppercase">Singularity_Core</span>
        </div>
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveNode('LATTICE')}>
          <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-neon-pink transition-all" />
          <span className="font-mono text-[9px] text-white/30 group-hover:text-white tracking-widest uppercase">Neural_Fabric</span>
        </div>
      </div>

      <AnimatePresence>
        {activeNode && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-1/2 left-8 -translate-y-1/2 p-6 border border-white/10 bg-black/80 backdrop-blur-xl max-w-xs"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-display font-black text-xl text-white tracking-tighter uppercase">{activeNode}</h4>
              <button onClick={() => setActiveNode(null)} className="text-white/20 hover:text-white transition-colors">
                <span className="font-mono text-[10px]">CLOSE</span>
              </button>
            </div>
            <p className="font-mono text-[10px] text-white/40 leading-relaxed tracking-widest uppercase">
              {activeNode === 'CORE' 
                ? 'The central processing unit of the Savant OS. Handles recursive fractal logic and sovereign data encryption.' 
                : 'A distributed network of neural nodes facilitating hyper-speed communication across the global lattice.'}
            </p>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Status: Active</span>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 m-4">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20" />
      </div>
    </div>
  );
};

