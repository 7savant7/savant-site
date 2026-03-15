import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextScramble } from '../components/TextScramble';
import { ParallaxImage } from '../components/ParallaxImage';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';

export default function Work() {
  return (
    <div className="savant-page-container">
      <div className="savant-stack">
        <div className="relative mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="text-massive font-display"
          >
            SELECTED<br/>
            <span className="text-crimson">ARTIFACTS</span>
          </motion.h1>
          <div className="absolute top-0 right-0 rail-text h-full opacity-30">
            SAVANT_OS_ARCHIVE_v80.0.0_SELECTED_WORKS_MANIFEST
          </div>
        </div>

        <div className="savant-stack !gap-40 md:!gap-60">
          {[
            { id: '01', title: 'OBLIVION', category: 'GLOBAL_REBRAND', desc: 'A comprehensive brand transformation for a leading luxury house, redefining elegance for the digital elite.', img: 'https://picsum.photos/seed/oblivion/1600/1000' },
            { id: '02', title: 'LATTICE', category: 'ADVERTISING_IMPACT', desc: 'A high-energy, kinetic advertising campaign that captured global attention and drove unprecedented growth.', img: 'https://picsum.photos/seed/lattice/1600/1000' },
            { id: '03', title: 'VOID', category: 'VISUAL_IDENTITY', desc: 'Meticulous design systems engineered to translate complex strategies into powerful visual geometry.', img: 'https://picsum.photos/seed/void/1600/1000' }
          ].map((work, i) => (
            <motion.div 
              key={work.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className={`savant-grid lg:grid-cols-12 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={`lg:col-span-8 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="relative group overflow-hidden rounded-2xl border border-white/5">
                  <ParallaxImage 
                    src={work.img}
                    alt={work.title}
                    className="w-full aspect-[16/10] object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s] scale-110 group-hover:scale-100"
                    offset={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                  <div className="absolute top-10 left-10 text-massive font-display opacity-10 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none">
                    {work.id}
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-4 ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div className="savant-stack !gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-[1px] bg-crimson" />
                    <span className="font-mono text-[10px] text-crimson tracking-[0.4em] uppercase">
                      {work.category}
                    </span>
                  </div>
                  
                  <h2 className="text-7xl font-display leading-[0.85]">
                    {work.title}
                  </h2>
                  
                  <p className="text-xl text-white/50 leading-relaxed font-light">
                    {work.desc}
                  </p>

                  <div className="pt-10">
                    <MagneticButton strength={0.2} className="w-full">
                      <SavantButton 
                        variant="outline"
                        className="w-full h-16"
                      >
                        EXPLORE_CASE_STUDY
                      </SavantButton>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
