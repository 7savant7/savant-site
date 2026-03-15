import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useBlog } from '../contexts/BlogContext';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { format } from 'date-fns';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { NeuralSummary } from '../components/NeuralSummary';

import { LoadingLattice } from '../components/LoadingLattice';

export default function Journal() {
  const { posts, loading } = useBlog();

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
            CREATIVE<br/>
            <span className="text-electric-gold">LOGS</span>
          </motion.h1>
          <div className="absolute top-0 right-0 rail-text h-full opacity-30">
            SAVANT_STUDIO_CREATIVE_JOURNAL_v80.0.0_MANIFEST
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingLattice />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-20 border border-white/5 bg-white/[0.01] rounded-3xl text-center">
            <div className="font-mono text-xs text-white/20 tracking-[0.5em] uppercase">
              NO_LOGS_FOUND_IN_CURRENT_TIMELINE
            </div>
          </div>
        ) : (
          <div className="savant-grid lg:grid-cols-12">
            <div className="lg:col-span-8 savant-stack !gap-40">
              {posts.map((post, i) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                  className="group relative savant-stack !gap-10"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-[1px] bg-electric-gold" />
                    <time className="font-mono text-[10px] text-electric-gold tracking-[0.4em] uppercase">
                      {format(new Date(post.createdAt), 'yyyy.MM.dd // HH:mm:ss')}
                    </time>
                  </div>

                  <h2 className="text-6xl font-display leading-[0.85] group-hover:text-electric-gold transition-colors duration-700">
                    {post.title}
                  </h2>

                  <div 
                    className="prose prose-invert prose-xl max-w-none font-light text-white/40 leading-relaxed line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <div className="flex items-center justify-between pt-10 border-t border-white/5">
                    <div className="flex items-center gap-10">
                      <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase">
                        AUTHOR_ID: {post.authorId.substring(0, 8)}
                      </div>
                      <NeuralSummary content={post.content} title={post.title} />
                    </div>
                    
                    <MagneticButton strength={0.2}>
                      <SavantButton 
                        variant="outline"
                        className="w-40 h-12"
                      >
                        READ_LOG
                      </SavantButton>
                    </MagneticButton>
                  </div>
                </motion.article>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-40 savant-stack !gap-12">
                <GlassCard className="p-10 savant-stack !gap-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-electric-gold rounded-full animate-pulse" />
                    <h3 className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">LATTICE_METRICS</h3>
                  </div>

                  <div className="savant-stack !gap-8">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-3">
                        <span>TOTAL_LOGS</span>
                        <span className="text-electric-gold">{posts.length}</span>
                      </div>
                      <div className="h-[2px] bg-white/5 w-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2 }}
                          className="h-full bg-electric-gold" 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-3">
                        <span>SYNC_STATUS</span>
                        <span className="text-white">OPTIMAL</span>
                      </div>
                      <div className="h-[2px] bg-white/5 w-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '98%' }}
                          transition={{ duration: 2 }}
                          className="h-full bg-white" 
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-10">
                  <h3 className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase mb-8">ARCHIVE_INDEX</h3>
                  <ul className="savant-stack !gap-6">
                    {[
                      { label: '2026_Q1', count: posts.length },
                      { label: '2025_Q4', count: 0 },
                      { label: '2025_Q3', count: 0 }
                    ].map((item, i) => (
                      <li key={i} className="flex justify-between items-center group cursor-pointer">
                        <span className="font-mono text-xs text-white/40 group-hover:text-white transition-colors">{item.label}</span>
                        <span className="font-mono text-[10px] text-white/20 group-hover:text-electric-gold transition-colors">[{item.count}]</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
