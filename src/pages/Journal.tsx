import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useBlog } from '../contexts/BlogContext';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { format } from 'date-fns';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { NeuralSummary } from '../components/NeuralSummary';
import { LoadingLattice } from '../components/LoadingLattice';
import { ArrowRight, Calendar, User, Hash, Share2, Bookmark, Eye, Clock, Terminal, Cpu, Database } from 'lucide-react';

const JournalEntry = ({ post, i }: { post: any, i: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative savant-stack !gap-12 pb-32 border-b border-white/5 last:border-0"
    >
      <div className="flex flex-wrap items-center gap-10">
        <div className="flex items-center gap-3 font-mono text-[10px] text-gold tracking-[0.4em] uppercase font-bold">
          <Calendar size={12} className="text-gold/60" />
          {format(new Date(post.createdAt), 'yyyy.MM.dd')}
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase">
          <User size={12} />
          ID_{post.authorId.substring(0, 8)}
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase">
          <Hash size={12} />
          LOG_ENTRY_{i + 1}
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-emerald-400/40 tracking-[0.4em] uppercase">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          ENCRYPTED_DATA
        </div>
      </div>

      <div className="savant-stack !gap-10 relative">
        <div className={`absolute -left-20 top-0 h-full w-[1px] bg-gold/10 transition-all duration-700 ${isHovered ? 'bg-gold/40 h-full' : 'h-0'}`} />
        
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-display leading-[0.85] group-hover:text-gold transition-all duration-700 group-hover:translate-x-4">
          {post.title}
        </h2>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <div 
              className="prose prose-invert prose-2xl max-w-none font-light text-white/40 leading-relaxed line-clamp-4 group-hover:text-white/60 transition-colors duration-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 border border-white/5 bg-white/[0.01] rounded-2xl savant-stack !gap-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Data_Integrity</span>
                <span className="font-mono text-[8px] text-gold uppercase tracking-widest">99.9%</span>
              </div>
              <div className="h-[1px] bg-white/5 w-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '99.9%' }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-gold" 
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 p-4 border border-white/5 bg-white/[0.01] rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                <Share2 size={14} className="text-white/20" />
                <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">SHARE</span>
              </div>
              <div className="flex-1 p-4 border border-white/5 bg-white/[0.01] rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                <Bookmark size={14} className="text-white/20" />
                <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase">SAVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-10 pt-12 border-t border-white/5">
        <div className="flex items-center gap-10">
          <NeuralSummary content={post.content} title={post.title} />
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-4 font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">
            <Clock size={12} />
            READ_TIME: {Math.ceil(post.content.length / 1000)}M
          </div>
          <div className="flex items-center gap-4 font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">
            <Eye size={12} />
            VIEWS: {Math.floor(Math.random() * 5000) + 1000}
          </div>
        </div>
        
        <MagneticButton strength={0.2}>
          <SavantButton 
            variant="outline"
            className="w-64 h-16 group/btn rounded-full border-white/10 hover:border-gold hover:bg-gold/5"
          >
            <span className="flex items-center gap-4 tracking-[0.2em] font-black italic">
              ACCESS_FULL_LOG
              <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
            </span>
          </SavantButton>
        </MagneticButton>
      </div>
    </motion.article>
  );
};

export default function Journal() {
  const { posts, loading } = useBlog();
  const [activeFilter, setActiveFilter] = useState('ALL_LOGS');

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-[70vh] flex flex-col justify-center mb-20 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Database size={800} strokeWidth={0.1} className="text-gold animate-pulse" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="savant-stack !gap-10 max-w-4xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-[1px] bg-gold" />
              <span className="font-mono text-xs text-gold tracking-[0.8em] uppercase font-bold">INTEL_ARCHIVE_v8.0</span>
            </div>
            
            <h1 className="text-massive title-serif leading-[0.85]">
              TECHNICAL<br/>
              <span className="text-gold italic font-light text-[0.7em]">Deep_Dives.</span>
            </h1>
            
            <p className="text-2xl text-white/30 font-light leading-relaxed max-w-2xl">
              A sovereign repository of technical logs, creative explorations, and strategic intelligence from the Savant core.
            </p>

            <div className="flex gap-6 pt-12">
              {['ALL_LOGS', 'STRATEGY', 'ENGINEERING', 'DESIGN'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-8 py-3 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all duration-500 border ${activeFilter === filter ? 'bg-gold text-obsidian border-gold' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingLattice />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-40 border border-white/5 bg-white/[0.01] rounded-[4rem] text-center savant-stack !gap-8">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <Terminal size={32} className="text-white/20" />
            </div>
            <div className="font-mono text-xs text-white/20 tracking-[0.5em] uppercase">
              NO_LOGS_FOUND_IN_CURRENT_TIMELINE
            </div>
          </div>
        ) : (
          <div className="savant-grid lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8 savant-stack !gap-32">
              {posts.map((post, i) => (
                <JournalEntry key={post.id} post={post} i={i} />
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-40 savant-stack !gap-12">
                <GlassCard className="p-12 savant-stack !gap-10 border border-white/5 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="flex items-center gap-4 relative z-10">
                    <Cpu size={16} className="text-gold" />
                    <h3 className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">ARCHIVE_METRICS</h3>
                  </div>

                  <div className="savant-stack !gap-10 relative z-10">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-4 uppercase tracking-widest">
                        <span>DATA_DENSITY</span>
                        <span className="text-gold">{posts.length} LOGS</span>
                      </div>
                      <div className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2 }}
                          className="h-full bg-gold" 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-4 uppercase tracking-widest">
                        <span>SYNC_INTEGRITY</span>
                        <span className="text-white">99.9%</span>
                      </div>
                      <div className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
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

                <GlassCard className="p-12 border border-white/5 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <h3 className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase mb-10 relative z-10">TEMPORAL_ARCHIVE</h3>
                  <ul className="savant-stack !gap-8 relative z-10">
                    {[
                      { label: '2026_Q1', count: posts.length },
                      { label: '2025_Q4', count: 12 },
                      { label: '2025_Q3', count: 8 }
                    ].map((item, i) => (
                      <li key={i} className="flex justify-between items-center group/item cursor-pointer">
                        <span className="font-mono text-xs text-white/40 group-hover/item:text-white transition-colors tracking-widest">{item.label}</span>
                        <div className="flex-1 mx-6 h-[1px] bg-white/5 group-hover/item:bg-white/20 transition-colors" />
                        <span className="font-mono text-[10px] text-white/10 group-hover/item:text-gold transition-colors">[{item.count.toString().padStart(2, '0')}]</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <div className="p-10 border border-white/5 bg-white/[0.01] rounded-[2rem] savant-stack !gap-6">
                  <div className="font-mono text-[8px] text-white/20 tracking-[0.5em] uppercase">Neural_Network_Status</div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="font-mono text-[10px] text-emerald-400/60 tracking-widest uppercase">Nodes_Synchronized</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
