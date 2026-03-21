import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Center, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const SVG_MARKUP = String.raw`<svg viewBox="0 0 64 84" xmlns="http://www.w3.org/2000/svg" version="1.1"> <g> <path d="m47.67,37.07l-2.67,1.54a0.62,0.62 0 0 1 -0.89,-0.75q1.43,-3.96 1.47,-5.02c0.34,-10.74 -15.97,-7.15 -11.12,2.26q0.99,1.9 4.64,6.77a1.35,1.35 0 0 1 -0.06,1.69l-1.2,1.39a0.86,0.85 47.6 0 1 -1.35,-0.07c-4.32,-6.16 -10.05,-11.78 -4.62,-18.81c6.72,-8.71 20.69,-1.03 17.23,9.25a3.23,3.18 84.7 0 1 -1.43,1.75z" fill="#ffffff"/> <path d="m30.29,41.13q-2.55,-0.05 -3.6,0.11c-6.01,0.9 -6.62,8.78 -1.66,11.21q4.03,1.96 7.59,-1.57q8.7,-8.65 9.6,-9.62q3.72,-3.99 8.93,-3.91c8.35,0.13 12.15,10 6.99,16.13c-4.55,5.4 -12.91,4.27 -16.55,-1.84a0.2,0.2 0 0 1 0,-0.22q1.08,-1.68 2.55,-2.86a0.11,0.11 0 0 1 0.16,0.03q2,3.44 3.83,4.1q3.88,1.38 6.54,-1.15c5.86,-5.59 -2.23,-14.35 -8.51,-8.58q-3.54,3.26 -10.92,10.77c-4.56,4.64 -12.2,4.14 -15.81,-1.33c-2.46,-3.73 -1.98,-9.15 1.32,-12.34q2.79,-2.71 7.11,-2.89a1.51,1.5 73.4 0 1 1.36,0.74l1.46,2.55a0.45,0.44 -14.8 0 1 -0.39,0.67z" fill="#ffffff"/> </g> </svg>`;

const MiniLogo3D = () => {
  const meshRef = useRef<THREE.Group>(null);
  const svgData = useLoader(SVGLoader, `data:image/svg+xml;utf8,${encodeURIComponent(SVG_MARKUP)}`);

  const meshes = useMemo(() => {
    return svgData.paths.flatMap((path) => {
      const shapes = SVGLoader.createShapes(path);
      return shapes.map((shape) => {
        const geometry = new THREE.ShapeGeometry(shape);
        return { geometry };
      });
    });
  }, [svgData]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
    meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
  });

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.2}>
      <group ref={meshRef} scale={0.02} rotation={[0, 0, Math.PI]}>
        {meshes.map((mesh, idx) => (
          <mesh key={idx} geometry={mesh.geometry}>
            <MeshTransmissionMaterial 
              samples={8}
              resolution={256}
              thickness={1}
              roughness={0}
              chromaticAberration={0.5}
              anisotropy={0.1}
              distortion={0}
              color="#ffffff"
              attenuationColor="#ff003c"
              attenuationDistance={1}
              ior={1.2}
              transmission={1}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

export default function Logo() {
  return (
    <Link 
      to="/" 
      className="relative group block pointer-events-auto"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 relative">
          <svg viewBox="0 0 64 84" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-white group-hover:fill-crimson transition-colors duration-500">
            <g>
              <path d="m47.67,37.07l-2.67,1.54a0.62,0.62 0 0 1 -0.89,-0.75q1.43,-3.96 1.47,-5.02c0.34,-10.74 -15.97,-7.15 -11.12,2.26q0.99,1.9 4.64,6.77a1.35,1.35 0 0 1 -0.06,1.69l-1.2,1.39a0.86,0.85 47.6 0 1 -1.35,-0.07c-4.32,-6.16 -10.05,-11.78 -4.62,-18.81c6.72,-8.71 20.69,-1.03 17.23,9.25a3.23,3.18 84.7 0 1 -1.43,1.75z" />
              <path d="m30.29,41.13q-2.55,-0.05 -3.6,0.11c-6.01,0.9 -6.62,8.78 -1.66,11.21q4.03,1.96 7.59,-1.57q8.7,-8.65 9.6,-9.62q3.72,-3.99 8.93,-3.91c8.35,0.13 12.15,10 6.99,16.13c-4.55,5.4 -12.91,4.27 -16.55,-1.84a0.2,0.2 0 0 1 0,-0.22q1.08,-1.68 2.55,-2.86a0.11,0.11 0 0 1 0.16,0.03q2,3.44 3.83,4.1q3.88,1.38 6.54,-1.15c5.86,-5.59 -2.23,-14.35 -8.51,-8.58q-3.54,3.26 -10.92,10.77c-4.56,4.64 -12.2,4.14 -15.81,-1.33c-2.46,-3.73 -1.98,-9.15 1.32,-12.34q2.79,-2.71 7.11,-2.89a1.51,1.5 73.4 0 1 1.36,0.74l1.46,2.55a0.45,0.44 -14.8 0 1 -0.39,0.67z" />
            </g>
          </svg>
        </div>

        <div className="flex flex-col">
          <div className="font-display font-black text-xl md:text-2xl text-white tracking-tighter leading-none">
            SAVANT
          </div>
          <div className="font-mono text-[6px] tracking-[0.4em] text-white/40 uppercase font-bold">
            SYNDICATE
          </div>
        </div>
      </div>
    </Link>
  );
}
