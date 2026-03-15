import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TechButton } from '../components/TechButton';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';

export default function Services() {
  return (
    <div className="savant-page-container">
      <div className="savant-stack">
        <motion.h1 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-display font-black text-8xl md:text-[12rem] text-white tracking-tighter leading-[0.8]"
        >
          <TextScramble text="Core_" /> <br />
          <span className="text-electric-gold italic font-serif text-[0.7em]">Services.</span>
        </motion.h1>

        <div className="savant-grid md:grid-cols-2">
          {[
            { id: '01', title: 'SOVEREIGN_ARCHITECTURE', desc: 'Custom operating environments built on fractal logic for absolute digital autonomy. We engineer systems that resist centralized control.', icon: 'bg-crimson' },
            { id: '02', title: 'NEURAL_INTERFACE_DESIGN', desc: 'High-fidelity, low-latency UI/UX for complex data visualization and predictive modeling. Designed for the digital elite.', icon: 'bg-electric-gold' },
            { id: '03', title: 'CRYPTOGRAPHIC_INTEGRATION', desc: 'Seamless integration of advanced encryption protocols and decentralized identity matrices to ensure data sovereignty.', icon: 'bg-white' },
            { id: '04', title: 'FRACTAL_RENDERING', desc: 'Proprietary WebGL and Three.js engines capable of generating infinite geometric variations in real-time.', icon: 'bg-obsidian border border-white/20' }
          ].map((service, i) => (
            <ZoomBlock key={service.id} className="h-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className={`h-full p-8 md:p-16 border border-white/10 ${i % 2 === 0 ? 'bg-obsidian' : 'bg-industrial-gray'} hover:bg-white/[0.05] transition-all duration-700 group relative overflow-hidden flex flex-col`}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                
                <div className="flex justify-between items-start mb-16">
                  <div className="font-mono text-[10px] text-white/30 tracking-[0.5em] uppercase">SERVICE_{service.id}</div>
                  <div className={`w-4 h-4 rounded-full ${service.icon} shadow-[0_0_15px_currentColor]`} />
                </div>
                
                <h3 className="font-display font-black text-4xl text-white mb-8 tracking-tighter">
                  <TextScramble text={service.title} />
                </h3>
                <p className="text-lg text-white/40 leading-relaxed font-light mb-12 flex-grow">
                  {service.desc}
                </p>
                
                <div className="mt-auto pt-8 border-t border-white/10 flex justify-between items-center">
                  <TechButton 
                    onClick={() => console.log(`Initiating ${service.title}`)}
                    className="w-full"
                  >
                    INITIATE_PROTOCOL
                  </TechButton>
                </div>
              </motion.div>
            </ZoomBlock>
          ))}
        </div>
      </div>
    </div>
  );
}
