import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { TechButton } from '../components/TechButton';
import { TextScramble } from '../components/TextScramble';
import { ZoomBlock } from '../components/ZoomBlock';
import { MagneticButton } from '../components/MagneticButton';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { supabase } from '../supabase';
import { toast } from 'sonner';
import { Send, Mail, MessageSquare, Shield, Globe, Zap, Terminal, Cpu, Network, Activity } from 'lucide-react';

const NeuralInput = ({ label, placeholder, type = 'text', value, onChange, required = false, icon: Icon }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="savant-stack !gap-4 group/input">
      <div className="flex justify-between items-center">
        <label className={`font-mono text-[10px] tracking-[0.4em] uppercase transition-colors duration-500 ${isFocused ? 'text-neon-pink' : 'text-white/40'}`}>
          {label}
        </label>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-[8px] text-neon-pink/60 uppercase tracking-widest"
          >
            ACTIVE_INPUT_NODE
          </motion.div>
        )}
      </div>
      <div className="relative">
        <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-500 ${isFocused ? 'text-neon-pink' : 'text-white/20'}`}>
          <Icon size={18} />
        </div>
        {type === 'textarea' ? (
          <textarea
            required={required}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-white/[0.02] border border-white/10 p-6 pl-16 text-xl text-white font-display h-40 resize-none focus:outline-none focus:border-neon-pink/50 focus:bg-neon-pink/5 transition-all duration-500 placeholder:text-white/5 rounded-2xl"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-white/[0.02] border border-white/10 p-6 pl-16 text-xl text-white font-display focus:outline-none focus:border-neon-pink/50 focus:bg-neon-pink/5 transition-all duration-500 placeholder:text-white/5 rounded-2xl"
            placeholder={placeholder}
          />
        )}
        <div className={`absolute bottom-0 left-0 h-[2px] bg-neon-pink transition-all duration-700 ${isFocused ? 'w-full' : 'w-0'}`} />
      </div>
    </div>
  );
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [systemStatus, setSystemStatus] = useState('READY');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Validation Error', {
        description: 'Please fill in all required identifier fields.'
      });
      return;
    }

    setIsSubmitting(true);
    setSystemStatus('TRANSMITTING');
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
      setSystemStatus('SUCCESS');
      setTimeout(() => setSystemStatus('READY'), 3000);
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error('Transmission Failed', {
        id: toastId,
        description: err.message || 'An unexpected error occurred during uplink.'
      });
      setSystemStatus('ERROR');
      setTimeout(() => setSystemStatus('READY'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="savant-page-container bg-obsidian">
      <div className="noise-overlay opacity-5" />
      
      <div className="relative z-10">
        <header className="min-h-[70vh] flex flex-col justify-center mb-20 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <Network size={600} strokeWidth={0.2} className="text-neon-pink animate-pulse" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="savant-stack !gap-10 max-w-4xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-[1px] bg-neon-pink" />
              <span className="font-mono text-xs text-neon-pink tracking-[0.8em] uppercase font-bold">UPLINK_PROTOCOL_v4.2</span>
            </div>
            
            <h1 className="text-massive title-serif leading-[0.85]">
              ESTABLISH<br/>
              <span className="text-neon-pink italic font-light text-[0.7em]">Connection.</span>
            </h1>

            <p className="text-2xl text-white/40 font-light leading-relaxed max-w-2xl">
              Initiate a secure, end-to-end encrypted transmission to the Savant Core. Our decentralized architecture ensures absolute data sovereignty.
            </p>
          </motion.div>
        </header>

        <div className="savant-grid lg:grid-cols-12 items-start gap-20">
          <div className="lg:col-span-5 savant-stack !gap-20">
            <div className="savant-stack !gap-10">
              <h2 className="text-4xl md:text-6xl font-display leading-[1.1] text-white">
                INITIATE_SECURE_UPLINK_TO_THE_<span className="text-neon-pink">SAVANT_CORE</span>.
              </h2>
              <div className="p-8 border border-white/5 bg-white/[0.01] rounded-3xl flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-neon-pink/10 flex items-center justify-center group-hover:bg-neon-pink/20 transition-colors">
                  <Shield className="text-neon-pink" size={20} />
                </div>
                <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                  ENCRYPTION_STATUS: <span className="text-emerald-400">ACTIVE_AES_256</span>
                </div>
              </div>
            </div>

            <div className="savant-grid sm:grid-cols-2 gap-8">
              <GlassCard className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 group rounded-[2rem]">
                <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-4 flex justify-between">
                  <span>SECURE_NODE</span>
                  <Mail size={10} />
                </div>
                <div className="text-xl font-display text-white group-hover:text-neon-pink transition-colors">hello@savant.os</div>
              </GlassCard>
              <GlassCard className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 group rounded-[2rem]">
                <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-4 flex justify-between">
                  <span>ENCRYPTED_COMMS</span>
                  <MessageSquare size={10} />
                </div>
                <div className="text-xl font-display text-gold group-hover:text-white transition-colors">@savant_core</div>
              </GlassCard>
            </div>

            <div className="savant-stack !gap-10 pt-10 border-t border-white/5">
              <div className="flex items-center gap-8 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon-pink/10 transition-colors">
                  <Globe className="text-neon-pink/40 group-hover:text-neon-pink transition-colors" size={24} />
                </div>
                <div className="savant-stack !gap-1">
                  <div className="font-mono text-[10px] text-white tracking-widest uppercase">DECENTRALIZED_ROUTING</div>
                  <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase">GLOBAL_NODE_NETWORK_v8.0</div>
                </div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Cpu className="text-gold/40 group-hover:text-gold transition-colors" size={24} />
                </div>
                <div className="savant-stack !gap-1">
                  <div className="font-mono text-[10px] text-white tracking-widest uppercase">NEURAL_PROCESSING</div>
                  <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase">CORE_AI_OPTIMIZATION</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <GlassCard className="p-12 md:p-20 border border-white/5 bg-white/[0.01] relative overflow-hidden rounded-[3rem] shadow-2xl">
              <div className="absolute top-0 right-0 p-12 flex flex-col items-end gap-2">
                <div className="font-mono text-[8px] text-white/10 tracking-[0.5em] uppercase">
                  TERMINAL_ID: SVNT_UPLINK_01
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${systemStatus === 'ERROR' ? 'bg-neon-pink' : systemStatus === 'SUCCESS' ? 'bg-emerald-400' : 'bg-gold'}`} />
                  <div className="font-mono text-[8px] text-white/20 tracking-widest uppercase">STATUS: {systemStatus}</div>
                </div>
              </div>
              
              <form className="savant-stack !gap-12" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-12">
                  <NeuralInput 
                    label="IDENTIFIER" 
                    placeholder="ENTER_NAME" 
                    icon={Terminal}
                    value={formData.name}
                    onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <NeuralInput 
                    label="RETURN_NODE" 
                    placeholder="ENTER_EMAIL" 
                    type="email"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <NeuralInput 
                  label="PAYLOAD" 
                  placeholder="ENTER_MESSAGE_DATA..." 
                  type="textarea"
                  icon={MessageSquare}
                  value={formData.message}
                  onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                
                <div className="pt-10">
                  <MagneticButton strength={0.2}>
                    <SavantButton 
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-24 text-xl group/btn relative overflow-hidden"
                    >
                      <motion.div 
                        className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                        animate={isSubmitting ? { x: ['-100%', '100%'] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="flex items-center justify-center gap-6 relative z-10">
                        <span className="tracking-[0.3em] font-black italic">
                          {isSubmitting ? 'TRANSMITTING_DATA...' : 'INITIATE_UPLINK'}
                        </span>
                        <Send size={24} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />
                      </span>
                    </SavantButton>
                  </MagneticButton>
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
                  <div className="flex items-center gap-4">
                    <Activity size={14} className="text-neon-pink" />
                    <span className="font-mono text-[8px] tracking-[0.3em] uppercase">Neural_Sync_Active</span>
                  </div>
                  <div className="font-mono text-[8px] tracking-[0.3em] uppercase">Build_80_Ultra</div>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
