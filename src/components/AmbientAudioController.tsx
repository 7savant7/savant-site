
import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ambientAudio } from '../services/ambientAudio';
import { motion, AnimatePresence } from 'motion/react';

export const AmbientAudioController: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { cpuUsage, latency, memUsage, updateMetrics } = useStore();

  // Update metrics periodically if not already being updated elsewhere
  useEffect(() => {
    const interval = setInterval(() => {
      updateMetrics();
    }, 2000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Sync audio with metrics
  useEffect(() => {
    if (isEnabled) {
      ambientAudio.updateMetrics(cpuUsage, latency, memUsage);
    }
  }, [cpuUsage, latency, memUsage, isEnabled]);

  const toggleAudio = async () => {
    if (!isEnabled) {
      await ambientAudio.start();
      setIsEnabled(true);
    } else {
      ambientAudio.stop();
      setIsEnabled(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-8 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-obsidian/80 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-4 mb-2"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-8">
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Acoustic_Feedback</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: [4, 8 + Math.random() * 8, 4],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 0.5 + Math.random(), 
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                      className="w-0.5 bg-electric-gold"
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-crimson" />
                  <span className="text-[9px] font-mono text-crimson uppercase tracking-tighter">
                    Resonance: {(cpuUsage * 1.2).toFixed(0)}Hz
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-gold/40 animate-pulse" />
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter">
                    Static: {(latency * 1000).toFixed(2)}ms
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleAudio}
        className={`p-3 rounded-full border transition-all duration-500 group relative overflow-hidden ${
          isEnabled 
            ? 'bg-electric-gold border-electric-gold text-obsidian shadow-[0_0_20px_rgba(249,255,0,0.3)]' 
            : 'bg-obsidian/40 border-white/10 text-white/40 hover:border-white/30 hover:text-white'
        }`}
        title={isEnabled ? "Disable Ambient Audio" : "Enable Ambient Audio"}
      >
        {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        
        {/* Subtle pulse effect when enabled */}
        {isEnabled && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white rounded-full pointer-events-none"
          />
        )}
      </button>
    </div>
  );
};
