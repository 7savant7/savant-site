import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, ContactShadows, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const SHARD_COUNT = 120;

const ShardSpiral = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  const shards = useMemo(() => {
    const temp = [];
    for (let i = 0; i < SHARD_COUNT; i++) {
      const t = i / SHARD_COUNT;
      const angle = i * 0.4;
      const radius = 0.5 + t * 3.5;
      const y = (t - 0.5) * 6;
      
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );
      
      const rotation = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      const scale = 0.05 + Math.random() * 0.25;
      
      temp.push({ 
        position, 
        rotation, 
        scale, 
        speed: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        distanceFactor: Math.random() * 2
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Robust rotation with occasional "glitch" snaps
      const glitch = Math.sin(time * 10) > 0.98 ? 0.2 : 0;
      groupRef.current.rotation.y = time * 0.15 + glitch;
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.15;
      
      groupRef.current.children.forEach((child, i) => {
        if (i < shards.length) {
          const shard = shards[i];
          // Individual shard rotation
          child.rotation.x += shard.speed * 0.04;
          child.rotation.y += shard.speed * 0.05;
          
          // Kinetic breathing and complex orbital drift
          // Massively animate: add an expansion/contraction wave
          const wave = Math.sin(time * 0.5) * 2;
          const pulse = Math.sin(time * 2.5 + shard.phase) * 0.08;
          child.scale.setScalar(shard.scale + pulse);
          
          const driftX = Math.sin(time * 0.8 + shard.phase) * (0.3 + wave * 0.1);
          const driftZ = Math.cos(time * 0.8 + shard.phase) * (0.3 + wave * 0.1);
          
          // Jitter/Glitch effect
          const jitter = (Math.random() - 0.5) * 0.02;
          
          child.position.x = shard.position.x * (1 + wave * 0.2) + driftX + jitter;
          child.position.z = shard.position.z * (1 + wave * 0.2) + driftZ + jitter;
          child.position.y = shard.position.y + Math.sin(time * 1.5 + shard.phase) * 0.4;
        }
      });
    }

    if (coreRef.current) {
      // Core pulsing animation
      const corePulse = 1 + Math.sin(time * 3) * 0.1;
      coreRef.current.scale.setScalar(corePulse);
      if (coreRef.current.material instanceof THREE.MeshStandardMaterial) {
        coreRef.current.material.emissiveIntensity = 15 + Math.sin(time * 5) * 10;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {shards.map((shard, i) => (
        <mesh 
          key={i} 
          position={shard.position} 
          rotation={shard.rotation} 
          scale={shard.scale}
        >
          <torusKnotGeometry args={[0.5, 0.15, 128, 16]} />
          <meshPhysicalMaterial
            color={i % 15 === 0 ? "#ff003c" : "#ffffff"}
            metalness={1}
            roughness={0.1}
            reflectivity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.2}
            thickness={1}
          />
        </mesh>
      ))}
      
      {/* Central Singularity - Sculpted Core */}
      <mesh ref={coreRef}>
        <torusKnotGeometry args={[0.8, 0.3, 256, 32]} />
        <meshStandardMaterial 
          color="#ff003c" 
          emissive="#ff003c" 
          emissiveIntensity={20} 
          toneMapped={false}
          metalness={1}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

const AtmosphericParticles = () => {
  const points = useMemo(() => {
    const p = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, []);

  return (
    <Points positions={points}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.15}
      />
    </Points>
  );
};

const DynamicLighting = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.5) * 10;
      lightRef.current.position.y = Math.cos(time * 0.5) * 10;
      lightRef.current.position.z = Math.sin(time * 0.2) * 5 + 5;
    }
  });
  return <pointLight ref={lightRef} intensity={10} color="#ff003c" />;
};

export const ThreeLogo = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 10], fov: 35 }} 
        shadows 
        gl={{ alpha: true, antialias: true }}
      >
        <Environment preset="night" />
        
        <ambientLight intensity={0.2} />
        <DynamicLighting />
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={10} 
          color="#ffffff" 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={5} color="#ff003c" />
        <pointLight position={[5, 5, 5]} intensity={4} color="#ffffff" />
        
        {/* Rim Lights */}
        <pointLight position={[0, 0, 12]} intensity={2} color="#ffffff" />
        <pointLight position={[0, 0, -12]} intensity={2} color="#ff003c" />

        <Float speed={3} rotationIntensity={0.6} floatIntensity={1}>
          <ShardSpiral />
          <AtmosphericParticles />
        </Float>

        <ContactShadows 
          position={[0, -5, 0]} 
          opacity={0.4} 
          scale={25} 
          blur={4} 
          far={10} 
          color="#000000"
        />
      </Canvas>
    </div>
  );
};
