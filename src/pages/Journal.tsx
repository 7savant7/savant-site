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
import { ArrowRight, Calendar, User, Hash } from 'lucide-react';

export default function Journal() {
  const { posts, loading } = useBlog();

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-[50vh] flex flex-col justify-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="savant-stack !gap-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-electric-gold" />
              <span className="font-mono text-[10px] text-electric-gold tracking-[0.5em] uppercase font-bold">INTEL_LOGS</span>
            </div>
            
            <h1 className="text-massive font-display">
              CREATIVE<br/>
              <span className="text-electric-gold italic font-serif font-light text-[0.7em]">Journal.</span>
            </h1>
            
            <div className="max-w-xl">
              <p className="text-xl text-white/30 font-light leading-relaxed">
                A repository of thoughts, technical deep-dives, and creative explorations from the Savant core.
              </p>
            </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingLattice />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-40 border border-white/5 bg-white/[0.01] rounded-[3rem] text-center">
            <div className="font-mono text-xs text-white/20 tracking-[0.5em] uppercase">
              NO_LOGS_FOUND_IN_CURRENT_TIMELINE
            </div>
          </div>
        ) : (
          <div className="savant-grid lg:grid-cols-12">
            <div className="lg:col-span-8 savant-stack !gap-32">
              {posts.map((post, i) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                  className="group relative savant-stack !gap-12"
                >
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-3 font-mono text-[10px] text-electric-gold tracking-widest uppercase">
                      <Calendar size={12} />
                      {format(new Date(post.createdAt), 'yyyy.MM.dd')}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-white/20 tracking-widest uppercase">
                      <User size={12} />
                      ID_{post.authorId.substring(0, 6)}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-white/20 tracking-widest uppercase">
                      <Hash size={12} />
                      LOG_{i + 1}
                    </div>
                  </div>

                  <div className="savant-stack !gap-8">
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-display leading-[0.9] group-hover:text-electric-gold transition-colors duration-700">
                      {post.title}
                    </h2>

                    <div 
                      className="prose prose-invert prose-xl max-w-none font-light text-white/40 leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-8 pt-12 border-t border-white/5">
                    <div className="flex items-center gap-6">
                      <NeuralSummary content={post.content} title={post.title} />
                      <div className="w-[1px] h-4 bg-white/10" />
                      <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase">
                        READ_TIME: {Math.ceil(post.content.length / 1000)}M
                      </div>
                    </div>
                    
                    <MagneticButton strength={0.2}>
                      <SavantButton 
                        variant="outline"
                        className="w-48 h-14 group/btn"
                      >
                        <span className="flex items-center gap-3">
                          ACCESS_LOG
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </SavantButton>
                    </MagneticButton>
                  </div>
                </motion.article>
              ))}
            </div>

            <aside className="lg:col-span-4 lg:pl-20">
              <div className="sticky top-40 savant-stack !gap-12">
                <GlassCard className="p-12 savant-stack !gap-10 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-electric-gold rounded-full animate-pulse" />
                    <h3 className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">SYSTEM_METRICS</h3>
                  </div>

                  <div className="savant-stack !gap-10">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-4 uppercase tracking-widest">
                        <span>DATA_DENSITY</span>
                        <span className="text-electric-gold">{posts.length} LOGS</span>
                      </div>
                      <div className="h-[1px] bg-white/5 w-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2 }}
                          className="h-full bg-electric-gold" 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-4 uppercase tracking-widest">
                        <span>SYNC_INTEGRITY</span>
                        <span className="text-white">99.9%</span>
                      </div>
                      <div className="h-[1px] bg-white/5 w-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '99.9%' }}
                          transition={{ duration: 2 }}
                          className="h-full bg-white" 
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-12 border border-white/5">
                  <h3 className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase mb-10">TEMPORAL_ARCHIVE</h3>
                  <ul className="savant-stack !gap-8">
                    {[
                      { label: '2026_Q1', count: posts.length },
                      { label: '2025_Q4', count: 0 },
                      { label: '2025_Q3', count: 0 }
                    ].map((item, i) => (
                      <li key={i} className="flex justify-between items-center group cursor-pointer">
                        <span className="font-mono text-xs text-white/40 group-hover:text-white transition-colors tracking-widest">{item.label}</span>
                        <span className="font-mono text-[10px] text-white/10 group-hover:text-electric-gold transition-colors">[{item.count}]</span>
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
