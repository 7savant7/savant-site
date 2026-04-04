import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Center, 
  Environment, 
  Float, 
  PerspectiveCamera, 
  useScroll,
  MeshTransmissionMaterial,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { SVGLoader } from 'three/addons/loaders/SVGLoader';
import { BRANDING } from '../styles/branding';

const SVG_MARKUP = `
<svg viewBox="0 0 64 84" xmlns="http://www.w3.org/2000/svg">
  <g id="top-loop">
    <path d="m47.67,37.07l-2.67,1.54a0.62,0.62 0 0 1 -0.89,-0.75q1.43,-3.96 1.47,-5.02c0.34,-10.74 -15.97,-7.15 -11.12,2.26q0.99,1.9 4.64,6.77a1.35,1.35 0 0 1 -0.06,1.69l-1.2,1.39a0.86,0.85 47.6 0 1 -1.35,-0.07c-4.32,-6.16 -10.05,-11.78 -4.62,-18.81c6.72,-8.71 20.69,-1.03 17.23,9.25a3.23,3.18 84.7 0 1 -1.43,1.75z" fill="#ffffff"/>
  </g>
  <path id="middle-loop" d="m30.29,41.13q-2.55,-0.05 -3.6,0.11c-6.01,0.9 -6.62,8.78 -1.66,11.21q4.03,1.96 7.59,-1.57q8.7,-8.65 9.6,-9.62q3.72,-3.99 8.93,-3.91c8.35,0.13 12.15,10 6.99,16.13c-4.55,5.4 -12.91,4.27 -16.55,-1.84a0.2,0.2 0 0 1 0,-0.22q1.08,-1.68 2.55,-2.86a0.11,0.11 0 0 1 0.16,0.03q2,3.44 3.83,4.1q3.88,1.38 6.54,-1.15c5.86,-5.59 -2.23,-14.35 -8.51,-8.58q-3.54,3.26 -10.92,10.77c-4.56,4.64 -12.2,4.14 -15.81,-1.33c-2.46,-3.73 -1.98,-9.15 1.32,-12.34q2.79,-2.71 7.11,-2.89a1.51,1.5 73.4 0 1 1.36,0.74l1.46,2.55a0.45,0.44 -14.8 0 1 -0.39,0.67z" fill="#ffffff"/>
</svg>
`;

function LogoMesh() {
  const meshRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const shapes = useMemo(() => {
    const loader = new SVGLoader();
    const svgData = loader.parse(SVG_MARKUP);
    const allShapes: THREE.Shape[] = [];
    
    svgData.paths.forEach((path) => {
      const pathShapes = SVGLoader.createShapes(path);
      allShapes.push(...pathShapes);
    });
    
    return allShapes;
  }, []);

  const extrudeSettings = {
    steps: 2,
    depth: 6,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0.3,
    bevelOffset: 0,
    bevelSegments: 32
  };

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();
    
    // Slow continuous rotation
    const baseRotationY = Math.sin(t * 0.3) * 0.15;
    const baseRotationX = Math.cos(t * 0.2) * 0.1;

    // Mouse influence (slight)
    const targetRotY = baseRotationY + mouse.current.x * 0.2;
    const targetRotX = baseRotationX + mouse.current.y * 0.1;
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);

    // Joby style scroll reveal
    const offset = scroll ? scroll.offset : 0;
    // As we scroll, it twists and moves up
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -offset * 20, 0.1);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, offset * Math.PI * 0.5, 0.1);
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1 - offset * 0.3, 0.1));
  });

  return (
    <Center top>
      <group ref={meshRef} scale={[0.05, -0.05, 0.05]}>
        {shapes.map((shape, i) => (
          <mesh key={i} castShadow receiveShadow>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshPhysicalMaterial 
              color="#0b0c0e"
              metalness={1}
              roughness={0.07}
              transmission={0}
              thickness={10}
              ior={3}
              clearcoat={1}
              clearcoatRoughness={0.02}
              envMapIntensity={8.5}
              emissive="#120604"
              emissiveIntensity={0.55}
            />
          </mesh>
        ))}
        
        {/* Neon Pink Accent Light inside the logo */}
        <pointLight position={[0, 0, 5]} color={BRANDING.colors.neonPink.base} intensity={2} distance={20} />
      </group>
    </Center>
  );
}

export default function Savant3DLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full min-h-[400px] relative ${className}`}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={35} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <spotLight position={[50, 50, 50]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-50, -50, -50]} color={BRANDING.colors.gunmetal.light} intensity={1} />
          
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <LogoMesh />
          </Float>

          <Environment preset="studio" />
          <ContactShadows position={[0, -40, 0]} opacity={0.4} scale={100} blur={2.5} far={40} />
        </Suspense>
      </Canvas>
    </div>
  );
}
