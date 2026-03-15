import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TechButton } from '../components/TechButton';
import { TextScramble } from '../components/TextScramble';
import { toast } from 'sonner';
import { Key, Save, Trash2 } from 'lucide-react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [debouncedKey, setDebouncedKey] = useState('');

  // Load key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('SAVANT_API_KEY') || '';
    setApiKey(savedKey);
    setDebouncedKey(savedKey);
  }, []);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKey(apiKey);
    }, 500);

    return () => clearTimeout(timer);
  }, [apiKey]);

  const handleSave = () => {
    localStorage.setItem('SAVANT_API_KEY', apiKey);
    toast.success('API_KEY_STORED: Sovereign access updated.');
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('SAVANT_API_KEY');
    toast.success('API_KEY_PURGED: Local storage cleared.');
  };

  return (
    <div className="savant-page-container">
      <div className="savant-stack">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-6xl md:text-8xl text-white tracking-tighter leading-[0.8]"
        >
          <TextScramble text="System_" /> <br />
          <span className="text-crimson italic font-serif text-[0.7em]">Settings.</span>
        </motion.h1>

        <div className="savant-grid grid-cols-1 !gap-12">
          <section className="p-8 border border-white/10 bg-obsidian/40 backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-crimson opacity-50" />
            
            <div className="flex items-center gap-4 mb-8">
              <Key className="text-crimson" size={24} />
              <h2 className="font-display text-2xl text-white tracking-tight">API_KEY_CONFIGURATION</h2>
            </div>

            <p className="text-white/40 font-mono text-xs mb-8 leading-relaxed tracking-widest uppercase">
              Configure your sovereign access key for external service integration. 
              This key is stored locally in your browser and never leaves your machine.
            </p>

            <div className="savant-stack !gap-6">
              <div className="savant-stack !gap-2">
                <label className="font-mono text-[10px] text-white/30 tracking-widest uppercase block">
                  ACCESS_KEY_SECRET
                </label>
                <div className="relative">
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="ENTER_SOVEREIGN_KEY..."
                    className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white focus:outline-none focus:border-crimson transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-crimson' : 'bg-white/10'}`} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <TechButton 
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save size={14} />
                  SAVE_CONFIG
                </TechButton>
                
                <TechButton 
                  onClick={handleClear}
                  colorClass="bg-white/10"
                  borderClass="border-white/20"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  PURGE_KEY
                </TechButton>
              </div>
            </div>

            {debouncedKey && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-4 bg-white/5 border-l-2 border-electric-gold font-mono text-[10px] text-white/40"
              >
                <span className="text-electric-gold">STATUS:</span> KEY_DETECTED_IN_BUFFER // {debouncedKey.substring(0, 4)}****{debouncedKey.substring(debouncedKey.length - 4)}
              </motion.div>
            )}
          </section>

          <section className="p-8 border border-white/10 bg-obsidian/40 backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-electric-gold opacity-50" />
            
            <div className="flex items-center gap-4 mb-8">
              <Save className="text-electric-gold" size={24} />
              <h2 className="font-display text-2xl text-white tracking-tight">SOURCE_EXTRACTION_v80</h2>
            </div>

            <p className="text-white/40 font-mono text-xs mb-8 leading-relaxed tracking-widest uppercase">
              Initiate a full-spectrum extraction of the Savant OS codebase. 
              This will generate a source dump, file tree, and archive it to GitHub and S3.
            </p>

            <TechButton 
              onClick={async () => {
                const promise = fetch('/api/extract', { method: 'POST' });
                toast.promise(promise, {
                  loading: 'INITIATING_EXTRACTION_SEQUENCE...',
                  success: 'EXTRACTION_COMPLETE: Archive deployed.',
                  error: 'EXTRACTION_FAILURE: Check system logs.'
                });
              }}
              colorClass="bg-electric-gold"
              borderClass="border-electric-gold"
              className="flex items-center gap-2"
            >
              <Save size={14} />
              RUN_EXTRACTOR_v80
            </TechButton>
          </section>

          <section className="p-8 border border-white/10 bg-obsidian/40 backdrop-blur-3xl opacity-40">
            <h2 className="font-display text-2xl text-white tracking-tight mb-4">SYSTEM_TELEMETRY</h2>
            <div className="savant-grid grid-cols-2 md:grid-cols-4 !gap-8 font-mono text-[10px] text-white/40 tracking-widest">
              <div>
                <div className="text-white mb-1">LOCAL_STORAGE</div>
                <div>ENABLED</div>
              </div>
              <div>
                <div className="text-white mb-1">ENCRYPTION</div>
                <div>AES_256_LOCAL</div>
              </div>
              <div>
                <div className="text-white mb-1">SYNC_STATUS</div>
                <div>OFFLINE_ONLY</div>
              </div>
              <div>
                <div className="text-white mb-1">NODE_ID</div>
                <div>{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
