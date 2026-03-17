import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TechButton } from '../components/TechButton';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { supabase } from '../supabase';
import { toast } from 'sonner';
import { Send, Mail, MessageSquare, Shield, Globe, Zap } from 'lucide-react';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Validation Error', {
        description: 'Please fill in all required identifier fields.'
      });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Transmitting data to core...');

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success('Transmission Successful', {
        id: toastId,
        description: 'Your data has been securely uplinked to the Savant Core.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error('Transmission Failed', {
        id: toastId,
        description: err.message || 'An unexpected error occurred during uplink.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-[60vh] flex flex-col justify-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="savant-stack !gap-10"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-[1px] bg-crimson" />
              <span className="font-mono text-xs text-crimson tracking-[0.8em] uppercase font-bold">UPLINK_PROTOCOL</span>
            </div>
            
            <h1 className="text-massive font-display">
              ESTABLISH<br/>
              <span className="text-crimson italic font-serif font-light text-[0.7em]">Connection.</span>
            </h1>
          </motion.div>
        </header>

        <div className="savant-grid lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 savant-stack !gap-20">
            <div className="savant-stack !gap-10">
              <h2 className="text-4xl md:text-6xl font-display leading-[1.1] text-white">
                INITIATE_SECURE_UPLINK_TO_THE_<span className="text-crimson">SAVANT_CORE</span>.
              </h2>
              <p className="text-xl text-white/40 font-light leading-relaxed max-w-lg">
                Our sovereign architecture ensures that all communications are encrypted and decentralized. We do not track, store, or analyze your data without explicit consent.
              </p>
            </div>

            <div className="savant-grid sm:grid-cols-2 gap-8">
              <GlassCard className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-4">SECURE_NODE</div>
                <div className="text-xl font-display text-white group-hover:text-crimson transition-colors">hello@savant.os</div>
              </GlassCard>
              <GlassCard className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-4">ENCRYPTED_COMMS</div>
                <div className="text-xl font-display text-electric-gold group-hover:text-white transition-colors">@savant_core</div>
              </GlassCard>
            </div>

            <div className="savant-stack !gap-10 pt-10 border-t border-white/5">
              <div className="flex items-center gap-6">
                <Shield className="text-crimson" size={24} />
                <div className="savant-stack !gap-1">
                  <div className="font-mono text-[10px] text-white tracking-widest uppercase">END_TO_END_ENCRYPTION</div>
                  <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase">AES_256_BIT_STANDARD</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Globe className="text-electric-gold" size={24} />
                <div className="savant-stack !gap-1">
                  <div className="font-mono text-[10px] text-white tracking-widest uppercase">DECENTRALIZED_ROUTING</div>
                  <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase">GLOBAL_NODE_NETWORK</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <GlassCard className="p-12 md:p-20 border border-white/5 bg-white/[0.01] relative overflow-hidden rounded-[3rem]">
              <div className="absolute top-0 right-0 p-10 font-mono text-[8px] text-white/10 tracking-[0.5em] uppercase">
                TERMINAL_ID: SVNT_UPLINK_01
              </div>
              
              <form className="savant-stack !gap-12" onSubmit={handleSubmit}>
                <div className="savant-stack !gap-4">
                  <label className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">IDENTIFIER</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.02] border-b border-white/10 p-6 text-2xl text-white font-display focus:outline-none focus:border-crimson transition-colors duration-500 placeholder:text-white/5" 
                    placeholder="ENTER_NAME" 
                  />
                </div>
                <div className="savant-stack !gap-4">
                  <label className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">RETURN_NODE</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.02] border-b border-white/10 p-6 text-2xl text-white font-display focus:outline-none focus:border-electric-gold transition-colors duration-500 placeholder:text-white/5" 
                    placeholder="ENTER_EMAIL" 
                  />
                </div>
                <div className="savant-stack !gap-4">
                  <label className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">PAYLOAD</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.02] border-b border-white/10 p-6 text-2xl text-white font-display h-40 resize-none focus:outline-none focus:border-white transition-colors duration-500 placeholder:text-white/5" 
                    placeholder="ENTER_MESSAGE" 
                  />
                </div>
                
                <div className="pt-10">
                  <MagneticButton strength={0.2}>
                    <SavantButton 
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-24 text-xl group/btn"
                    >
                      <span className="flex items-center gap-4">
                        {isSubmitting ? 'TRANSMITTING...' : 'INITIATE_TRANSMISSION'}
                        <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </span>
                    </SavantButton>
                  </MagneticButton>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
