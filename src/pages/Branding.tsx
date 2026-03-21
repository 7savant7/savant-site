import React, { useMemo, useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  Environment,
  MeshTransmissionMaterial,
  Text,
  Center,
  OrbitControls,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  PresentationControls,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'motion/react';
import { TextScramble } from '../components/TextScramble';
import { X, Info, Zap, Shield, Cpu } from 'lucide-react';
import { SavantButton } from '../components/ui/SavantButton';

// --- TREFOIL CURVE GENERATOR ---
const createTrefoilCurve = (scale = 2) => {
  const points = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const x = scale * (Math.sin(t) + 2 * Math.sin(2 * t));
    const y = scale * (Math.cos(t) - 2 * Math.cos(2 * t));
    const z = scale * -Math.sin(3 * t);
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, true);
};

// --- LOGO VARIANT COMPONENT ---
const LogoVariant = ({ index, config, isLarge = false }: { index: number, config: any, isLarge?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const curve = useMemo(() => createTrefoilCurve(isLarge ? 2.5 : 1.5), [isLarge]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    if (config.animationType === 'rotate') {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.2;
    } else if (config.animationType === 'pulse') {
      const s = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current.scale.set(s, s, s);
      meshRef.current.rotation.y = t * 0.3;
    } else if (config.animationType === 'float') {
      meshRef.current.position.y = Math.sin(t + index) * 0.2;
      meshRef.current.rotation.x = Math.cos(t * 0.5) * 0.1;
      meshRef.current.rotation.y = t * 0.4;
    }

    if (hovered && !isLarge) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    } else if (!isLarge) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <group>
      <Float speed={config.floatSpeed || 2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          ref={meshRef} 
          onPointerOver={() => setHovered(true)} 
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <tubeGeometry args={[curve, 256, config.thickness || 0.3, 64, true]} />
          {config.materialType === 'transmission' ? (
            <MeshTransmissionMaterial 
              {...config.materialProps}
              samples={32}
              resolution={1024}
              thickness={1.5}
              chromaticAberration={0.8}
              anisotropy={0.5}
              distortion={0.3}
              distortionScale={0.3}
              temporalDistortion={0.2}
            />
          ) : config.materialType === 'distort' ? (
            <MeshDistortMaterial 
              {...config.materialProps}
              speed={3}
              distort={0.5}
            />
          ) : (
            <MeshWobbleMaterial 
              {...config.materialProps}
              speed={2}
              factor={0.8}
            />
          )}
        </mesh>
      </Float>

      {!isLarge && (
        <>
          <Center position={[0, -3.2, 0]}>
            <Text
              fontSize={0.35}
              color="white"
              font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t6nu21tuWht9mXzE7h459uPzXOk9.woff2"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.2}
            >
              {config.name}
            </Text>
          </Center>
          
          <Text
            position={[0, -3.8, 0]}
            fontSize={0.14}
            color={config.accentColor || "#ff003c"}
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t6nu21tuWht9mXzE7h459uPzXOk9.woff2"
            fillOpacity={0.6}
            letterSpacing={0.4}
          >
            {`TECH_SPEC: ${config.spec}`}
          </Text>
        </>
      )}
    </group>
  );
};

const BrandingPage = () => {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const variants = [
    {
      name: "Liquid_Obsidian",
      spec: "REFRACTIVE_INDEX_2.4",
      materialType: "transmission",
      materialProps: { color: "#000000", transmission: 0.2, roughness: 0, ior: 2.4, attenuationColor: "#ffffff" },
      animationType: "rotate",
      accentColor: "#ff003c"
    },
    {
      name: "Plasma_Core",
      spec: "EMISSIVE_FLUX_9000",
      materialType: "distort",
      materialProps: { color: "#ff003c", emissive: "#ff003c", emissiveIntensity: 2, roughness: 0.1 },
      animationType: "pulse",
      accentColor: "#f9ff00"
    },
    {
      name: "Crystal_Lattice",
      spec: "DISPERSION_ENABLED",
      materialType: "transmission",
      materialProps: { color: "#ffffff", transmission: 1, roughness: 0.05, ior: 1.5, chromaticAberration: 1 },
      animationType: "float",
      accentColor: "#00f2ff"
    },
    {
      name: "Iridescent_Flow",
      spec: "THIN_FILM_INTERFERENCE",
      materialType: "transmission",
      materialProps: { color: "#8fd7ff", transmission: 1, roughness: 0.1, ior: 1.8, attenuationColor: "#ff00ff" },
      animationType: "rotate",
      accentColor: "#ff00ff"
    },
    {
      name: "Molten_Gold",
      spec: "METALLIC_PURITY_99.9",
      materialType: "transmission",
      materialProps: { color: "#ffcc00", transmission: 0.5, roughness: 0.1, ior: 2.0, metalness: 1 },
      animationType: "pulse",
      accentColor: "#ffffff"
    },
    {
      name: "Bio_Lume",
      spec: "ORGANIC_SYNC_ACTIVE",
      materialType: "wobble",
      materialProps: { color: "#4ade80", emissive: "#10b981", emissiveIntensity: 1, roughness: 0.2 },
      animationType: "float",
      accentColor: "#4ade80"
    },
    {
      name: "Void_Glass",
      spec: "ABSORPTION_MAXIMIZED",
      materialType: "transmission",
      materialProps: { color: "#1a1a1a", transmission: 0.8, roughness: 0.4, ior: 1.2, attenuationColor: "#000000" },
      animationType: "rotate",
      accentColor: "#ffffff"
    },
    {
      name: "Neon_Pulse",
      spec: "HIGH_FREQUENCY_GLOW",
      materialType: "distort",
      materialProps: { color: "#00f2ff", emissive: "#00f2ff", emissiveIntensity: 1.5, roughness: 0 },
      animationType: "pulse",
      accentColor: "#ff003c"
    },
    {
      name: "Frosted_Ether",
      spec: "DIFFUSE_TRANSMISSION",
      materialType: "transmission",
      materialProps: { color: "#ffffff", transmission: 1, roughness: 0.8, ior: 1.4, attenuationColor: "#8fd7ff" },
      animationType: "float",
      accentColor: "#8fd7ff"
    }
  ];

  return (
    <div className="min-h-screen bg-obsidian pt-32 pb-20 px-5 md:px-10 lg:px-20 overflow-x-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-[1px] bg-crimson" />
          <span className="font-mono text-[10px] tracking-[0.5em] text-crimson uppercase font-bold">Branding_Matrix_v2.0</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-display tracking-tighter leading-none mb-8">
          LOGO_<span className="text-crimson italic font-serif font-light">GENETICS.</span>
        </h1>
        <p className="text-xl text-white/40 max-w-2xl font-light leading-relaxed">
          9 robust, powerful animated logo designs engineered for maximum brand resonance. 
          Each variant explores a unique material dimension of the trefoil knot architecture.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {variants.map((v, i) => (
          <motion.div 
            key={i} 
            layoutId={`logo-${i}`}
            onClick={() => setSelectedVariant({ ...v, index: i })}
            className="aspect-square relative group rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700 overflow-hidden cursor-pointer"
          >
            <div className="absolute top-6 left-6 z-10">
              <div className="font-mono text-[8px] text-white/20 tracking-[0.4em] uppercase mb-1">VARIANT_0{i + 1}</div>
              <div className="h-[1px] w-12 bg-crimson" />
            </div>
            
            <div className="absolute top-6 right-6 z-10 flex gap-1">
              <div className="w-1 h-1 rounded-full bg-crimson animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-white/20" />
            </div>

            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color={v.accentColor} />
                <Environment preset="studio" />
                
                <LogoVariant index={i} config={v} />
                
                <EffectComposer multisampling={4}>
                  <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
                  <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
                  <Noise opacity={0.02} />
                  <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
              </Suspense>
            </Canvas>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="font-mono text-[7px] text-white/20 tracking-widest uppercase">
                SAVANT_STUDIO_ASSET_LOCKED
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:border-crimson group-hover:text-crimson transition-all">
                <span className="text-[10px]">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Explorer */}
      <AnimatePresence>
        {selectedVariant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVariant(null)}
              className="absolute inset-0 bg-obsidian/95 backdrop-blur-2xl"
            />
            
            <motion.div 
              layoutId={`logo-${selectedVariant.index}`}
              className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-[80vh] bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedVariant(null)}
                className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-crimson hover:border-crimson transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex-1 relative min-h-[40vh] md:min-h-0">
                <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                  <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={1} color={selectedVariant.accentColor} />
                    <Environment preset="studio" />
                    
                    <LogoVariant index={selectedVariant.index} config={selectedVariant} isLarge />
                    
                    <EffectComposer multisampling={4}>
                      <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
                      <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
                      <Noise opacity={0.05} />
                    </EffectComposer>
                  </Suspense>
                  <OrbitControls autoRotate autoRotateSpeed={0.5} />
                </Canvas>
              </div>

              <div className="w-full md:w-[400px] p-12 md:p-16 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-center bg-black/40 backdrop-blur-xl">
                <div className="font-mono text-[10px] text-crimson tracking-[0.5em] uppercase mb-4">MATERIAL_SPEC_v8.0</div>
                <h2 className="text-5xl font-display text-white mb-8 leading-none">{selectedVariant.name}</h2>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-4">
                    <Zap className="text-crimson shrink-0" size={18} />
                    <div>
                      <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">PROPERTIES</div>
                      <div className="text-sm text-white/80 font-light">{selectedVariant.spec}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Shield className="text-electric-gold shrink-0" size={18} />
                    <div>
                      <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">MATERIAL_TYPE</div>
                      <div className="text-sm text-white/80 font-light uppercase">{selectedVariant.materialType}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Cpu className="text-white shrink-0" size={18} />
                    <div>
                      <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">ANIMATION_ENGINE</div>
                      <div className="text-sm text-white/80 font-light uppercase">{selectedVariant.animationType}</div>
                    </div>
                  </div>
                </div>

                <SavantButton variant="primary" className="w-full h-16">
                  DOWNLOAD_ASSET_PACK
                </SavantButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <div className="max-w-7xl mx-auto mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="font-mono text-[10px] text-white/20 tracking-[1em] uppercase">
          Sovereign_Fractal_Architecture // Build_42_Omega
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col items-end">
            <span className="font-mono text-[8px] text-white/20 uppercase mb-1">Sync_Rate</span>
            <span className="font-mono text-xs text-emerald-400">99.999%</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[8px] text-white/20 uppercase mb-1">Entropy</span>
            <span className="font-mono text-xs text-crimson">0.0042</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;
