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
    <div className="savant-page-container">
      <div className="savant-stack">
        <motion.h1 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-display font-black text-8xl md:text-[12rem] text-white tracking-tighter leading-[0.8]"
        >
          <TextScramble text="Establish_" /> <br />
          <span className="text-white italic font-serif text-[0.7em]">Uplink.</span>
        </motion.h1>

        <ZoomBlock className="savant-grid lg:grid-cols-12">
          <div className="lg:col-span-6 savant-stack">
            <div className="h-[2px] bg-white/5 w-full relative overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                whileInView={{ x: '100%' }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-crimson to-transparent"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="savant-stack !gap-12"
            >
              <p className="text-3xl md:text-5xl text-white/90 leading-[1.1] font-display font-bold tracking-tight">
                Initiate a secure connection to the <span className="text-crimson italic font-serif">Savant Core</span>.
              </p>
              <div className="savant-stack !gap-6 text-xl text-white/40 leading-relaxed max-w-2xl font-light">
                <p>
                  Our sovereign architecture ensures that all communications are encrypted and decentralized. We do not track, store, or analyze your data without explicit consent.
                </p>
              </div>
              
              <div className="savant-grid md:grid-cols-2 pt-8">
                 <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-500">
                    <div className="font-mono text-[10px] text-white/30 mb-4 tracking-widest">SECURE_EMAIL</div>
                    <div className="text-xl font-bold text-white">hello@savant.os</div>
                 </div>
                 <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-500">
                    <div className="font-mono text-[10px] text-white/30 mb-4 tracking-widest">ENCRYPTED_NODE</div>
                    <div className="text-xl font-bold text-electric-gold">@savant_core</div>
                 </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <GlassCard className="p-8 md:p-16 border border-white/10 bg-obsidian/40 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-crimson/50" />
                <div className="absolute top-0 right-0 p-6 font-mono text-[9px] text-white/20 tracking-widest uppercase">UPLINK_TERMINAL</div>
                
                <h3 className="font-display font-black text-5xl text-white mb-12 flex items-center gap-4">
                  <TextScramble text="Transmit_Data" />
                  <span className="w-3 h-3 bg-electric-gold rounded-full animate-ping" />
                </h3>
                
                <form className="savant-stack !gap-8" onSubmit={handleSubmit}>
                  <div className="savant-stack !gap-2">
                    <label className="font-mono text-[10px] text-white/50 tracking-widest uppercase">IDENTIFIER</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm focus:outline-none focus:border-crimson transition-colors duration-300" 
                      placeholder="ENTER_NAME" 
                    />
                  </div>
                  <div className="savant-stack !gap-2">
                    <label className="font-mono text-[10px] text-white/50 tracking-widest uppercase">RETURN_NODE</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm focus:outline-none focus:border-electric-gold transition-colors duration-300" 
                      placeholder="ENTER_EMAIL" 
                    />
                  </div>
                  <div className="savant-stack !gap-2">
                    <label className="font-mono text-[10px] text-white/50 tracking-widest uppercase">PAYLOAD</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm h-32 resize-none focus:outline-none focus:border-white transition-colors duration-300" 
                      placeholder="ENTER_MESSAGE" 
                    />
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <MagneticButton strength={0.2}>
                      <SavantButton 
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-64 h-20"
                      >
                        {isSubmitting ? 'TRANSMITTING...' : 'INITIATE_TRANSMISSION'}
                      </SavantButton>
                    </MagneticButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </ZoomBlock>
      </div>
    </div>
  );
}
