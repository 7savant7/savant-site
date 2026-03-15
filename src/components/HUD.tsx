import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import { SavantCard } from './ui/SavantCard';

export const HUD = () => {
  const [coords, setCoords] = useState({ x: '000', y: '000' });
  const [activityData, setActivityData] = useState<{val: number}[]>(Array(10).fill({val: 50}));
  const { activeNodes, latency, logs, updateMetrics, clearance } = useStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({
        x: e.clientX.toString().padStart(3, '0'),
        y: e.clientY.toString().padStart(3, '0')
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      updateMetrics();
      setActivityData(p => [...p.slice(1), { val: 20 + Math.random() * 60 }]);
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [updateMetrics]);

  return (
    <SavantCard className="hidden lg:flex flex-col text-right font-mono text-[9px] text-white/40 tracking-widest pointer-events-auto p-8 relative overflow-hidden group min-w-[240px] max-w-[320px] max-h-[80vh] overflow-y-auto custom-scrollbar rounded-3xl border-white/5 bg-obsidian/80 backdrop-blur-2xl shadow-2xl">
      {/* Neural Pulse */}
      <motion.div 
        className="absolute inset-0 bg-crimson/5 z-0 pointer-events-none"
        animate={{ 
          opacity: [0, 0.1, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Scanning Line */}
      <motion.div 
        className="absolute inset-0 w-full h-[1px] bg-crimson/10 z-0 pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="flex items-center justify-end gap-3 mb-8">
        <motion.div 
          animate={{ 
            opacity: [1, 0.3, 1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-2 h-2 rounded-full ${clearance === 'ROOT' ? 'bg-electric-gold shadow-[0_0_15px_#f9ff00]' : 'bg-crimson shadow-[0_0_15px_#ff003c]'}`} 
        />
        <span className="text-white font-black tracking-[0.4em] uppercase text-[10px]">
          {clearance === 'ROOT' ? 'ROOT_ACCESS_GRANTED' : 'SAVANT_LATTICE_ACTIVE'}
        </span>
      </div>

      <div className="space-y-5 mb-10">
        {[
          { label: 'COORD_X', val: coords.x, color: 'text-white' },
          { label: 'COORD_Y', val: coords.y, color: 'text-white' },
          { label: 'LATENCY', val: `${latency.toFixed(4)}MS`, color: 'text-electric-gold' },
          { label: 'NODES', val: activeNodes, color: 'text-white' },
          { label: 'UPTIME', val: '142:12:44', color: 'text-white/40' },
          { label: 'THREAT', val: 'MINIMAL', color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="flex justify-between gap-12 border-b border-white/5 pb-2">
            <span className="opacity-30 uppercase tracking-[0.2em]">{stat.label}</span>
            <b className={`${stat.color} font-tech`}>{stat.val}</b>
          </div>
        ))}
      </div>

      <div className="h-16 w-full border border-white/5 bg-black/40 mb-10 p-2 relative rounded-xl overflow-hidden">
        <div className="absolute top-2 left-3 font-mono text-[7px] text-white/20 uppercase tracking-widest">Neural_Activity_Stream</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activityData}>
            <Line 
              type="stepAfter" 
              dataKey="val" 
              stroke={clearance === 'ROOT' ? '#f9ff00' : '#ff003c'} 
              strokeWidth={1.5} 
              dot={false} 
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col gap-2">
        <div className="font-mono text-[8px] text-white/20 uppercase mb-4 tracking-[0.3em]">System_Logs_v80</div>
        <div className="space-y-2">
          {logs.slice(0, 6).map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-[7px] font-mono leading-tight ${
                log.level === 'ERROR' ? 'text-crimson' : 
                log.level === 'CRITICAL' ? 'text-electric-gold' : 
                'text-white/40'
              }`}
            >
              <span className="opacity-30">[{log.level.substring(0, 3)}]</span> {log.message}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4">
         <div className="flex justify-between items-center">
           <span className="opacity-30 uppercase">BUILD</span>
           <b className="text-crimson font-black tracking-widest">80_ULTRA</b>
         </div>
         <div className="flex justify-between items-center">
           <span className="opacity-30 uppercase">ARCH</span>
           <b className="text-white tracking-widest">SOVEREIGN_v80</b>
         </div>
      </div>
    </SavantCard>
  );
};
