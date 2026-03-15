import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Network, Shield, Cpu, Activity, SplitSquareHorizontal, SplitSquareVertical, X, Lock, Database, Radio, Fingerprint, Box, Search, Command, Zap, Globe, Settings, User } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { Lattice3D } from '../components/Lattice3D';
import { NeuralLatticeViz } from '../components/NeuralLatticeViz';
import { useStore } from '../store/useStore';
import * as d3 from 'd3';
import { SavantCard } from '../components/ui/SavantCard';
import { SavantButton } from '../components/ui/SavantButton';
import { GlassCard } from '../components/ui/GlassCard';
import { MagneticButton } from '../components/MagneticButton';
import { SystemStatus } from '../components/SystemStatus';
import { AmbientAudioController } from '../components/AmbientAudioController';

type AppType = 'terminal' | 'network' | 'vault' | 'system' | 'matrix' | 'comms' | 'auth' | 'lattice' | 'diagnostics' | 'neural';

interface PaneNode {
  id: string;
  type: 'leaf' | 'split';
  direction?: 'horizontal' | 'vertical';
  ratio?: number;
  children?: PaneNode[];
  appType?: AppType;
}

const APPS: Record<AppType, { name: string; icon: any; color: string; hex: string }> = {
  terminal: { name: 'FRACTAL_TERMINAL', icon: Terminal, color: 'text-electric-gold', hex: '#f9ff00' },
  network: { name: 'NEURAL_LATTICE', icon: Network, color: 'text-crimson', hex: '#ff003c' },
  vault: { name: 'OBLIVION_VAULT', icon: Shield, color: 'text-white', hex: '#ffffff' },
  system: { name: 'SYSTEM_TELEMETRY', icon: Cpu, color: 'text-electric-gold', hex: '#f9ff00' },
  matrix: { name: 'RECURSIVE_MATRIX', icon: Activity, color: 'text-crimson', hex: '#ff003c' },
  comms: { name: 'ENCRYPTED_COMMS', icon: Radio, color: 'text-white', hex: '#ffffff' },
  auth: { name: 'BIOMETRIC_AUTH', icon: Fingerprint, color: 'text-electric-gold', hex: '#f9ff00' },
  lattice: { name: 'SPATIAL_LATTICE', icon: Box, color: 'text-crimson', hex: '#ff003c' },
  diagnostics: { name: 'SYSTEM_DIAGNOSTICS', icon: Activity, color: 'text-white', hex: '#ffffff' },
  neural: { name: 'NEURAL_MAP', icon: Command, color: 'text-electric-gold', hex: '#f9ff00' }
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// --- Command Palette ---
const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const addLog = useStore(state => state.addLog);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAction = (action: string) => {
    addLog(`Executing command: ${action.toUpperCase()}`, 'INFO');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-industrial-gray border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="w-4 h-4 text-white/30" />
              <input 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="EXECUTE_COMMAND..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white placeholder:text-white/10"
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-white/30">
                <Command className="w-2 h-2" />
                <span>K</span>
              </div>
            </div>
            <div className="p-2 max-h-[400px] overflow-y-auto">
              {['SYNC_LATTICE', 'PURGE_LOGS', 'REBOOT_CORE', 'TERMINATE_ALL_NODES', 'INIT_BIOMETRIC_SCAN'].map((cmd) => (
                <MagneticButton key={cmd} strength={0.1} className="w-full">
                  <button 
                    onClick={() => handleAction(cmd)}
                    className="w-full text-left p-3 font-mono text-[10px] text-white/50 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between group"
                  >
                    <span>{cmd}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-crimson">EXECUTE</span>
                  </button>
                </MagneticButton>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- App Components ---

const TerminalApp = () => {
  const [lines, setLines] = useState<string[]>([]);
  const addLog = useStore(state => state.addLog);

  useEffect(() => {
    const msgs = [
      'INITIALIZING KERNEL...',
      'MAPPING FRACTAL LATTICE...',
      'ALLOCATING SHARD MEMORY...',
      'UPLINK SECURED.',
      'AWAITING COMMAND...'
    ];
    let i = 0;
    const int = setInterval(() => {
      if (i < msgs.length) {
        setLines(p => [...p, msgs[i]]);
        i++;
      } else {
        const addr = `0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`;
        setLines(p => [...p, `> ${addr} PROCESSED`]);
        if (Math.random() > 0.95) addLog(`Anomalous activity detected at ${addr}`, 'WARN');
      }
    }, 800);
    return () => clearInterval(int);
  }, [addLog]);

  return (
    <div className="h-full w-full p-4 font-mono text-[10px] text-electric-gold overflow-hidden flex flex-col justify-end relative">
      <div className="absolute top-4 right-4 text-electric-gold/20 animate-pulse">
        <Terminal className="w-16 h-16" />
      </div>
      <div className="relative z-10">
        {lines.slice(-20).map((l, i) => (
          <div key={i} className="opacity-80">{l}</div>
        ))}
        <div className="animate-pulse mt-2">_</div>
      </div>
    </div>
  );
};

const SystemApp = () => {
  const { cpuUsage, memUsage, updateMetrics } = useStore();
  const [data, setData] = useState<{val: number, val2: number, time: string}[]>([]);
  
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      val: 30 + Math.random() * 40,
      val2: 20 + Math.random() * 50,
      time: `${i}:00`
    }));
    setData(initialData);
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      updateMetrics();
      setData(p => {
        const next = [...p.slice(1), { 
          val: cpuUsage,
          val2: memUsage,
          time: new Date().toLocaleTimeString().split(' ')[0]
        }];
        return next;
      });
    }, 1000);
    return () => clearInterval(int);
  }, [cpuUsage, memUsage, updateMetrics]);

  return (
    <div className="h-full w-full p-8 flex flex-col gap-8 relative overflow-y-auto custom-scrollbar">
      <div className="absolute top-8 right-8 text-electric-gold/5 pointer-events-none">
        <Cpu className="w-48 h-48" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <GlassCard title="TELEMETRY" subtitle="Core_Frequency" className="p-6">
          <div className="font-mono text-3xl text-electric-gold font-black">{(4.2 + (cpuUsage / 100) * 0.8).toFixed(2)}<span className="text-sm ml-1 opacity-50">GHz</span></div>
        </GlassCard>
        
        <GlassCard title="NEURAL_LOAD" subtitle="System_Stress" className="p-6">
          <div className="font-mono text-3xl text-crimson font-black">{cpuUsage.toFixed(1)}<span className="text-sm ml-1 opacity-50">%</span></div>
        </GlassCard>
      </div>

      <GlassCard title="VISUALIZATION" subtitle="Telemetry_Stream_01" className="flex-1 min-h-[250px] relative z-10 p-6">
        <div className="absolute top-4 right-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-electric-gold rounded-full animate-pulse" />
          <span className="font-mono text-[8px] text-white/40 uppercase">Live_Feed</span>
        </div>
        <div className="h-[calc(100%-10px)]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f9ff00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f9ff00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#f9ff00' }}
              />
              <Area type="monotone" dataKey="val" stroke="#f9ff00" fillOpacity={1} fill="url(#colorVal)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="ANALYTICS" subtitle="Telemetry_Stream_02" className="flex-1 min-h-[250px] relative z-10 p-6">
        <div className="absolute top-4 right-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-crimson rounded-full animate-pulse" />
          <span className="font-mono text-[8px] text-white/40 uppercase">Live_Feed</span>
        </div>
        <div className="h-[calc(100%-10px)]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="stepAfter" dataKey="val2" stroke="#ff003c" strokeWidth={1} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

const VaultApp = () => {
  return (
    <div className="h-full w-full p-4 flex flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5">
        <Lock className="w-48 h-48" />
      </div>
      <div className="font-mono text-[10px] text-white/50 mb-4 relative z-10">
        ENCRYPTED_SECTORS // AES-256-GCM
      </div>
      <div className="flex-1 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 relative z-10 overflow-y-auto pr-2">
        {[...Array(48)].map((_, i) => (
          <div key={i} className="aspect-square border border-white/10 bg-white/5 flex flex-col items-center justify-center p-2 group hover:bg-white/20 transition-colors cursor-pointer">
            <Database className="w-4 h-4 text-white/30 group-hover:text-white mb-1" />
            <span className="text-[8px] text-white/30 group-hover:text-white font-mono">0x{i.toString(16).padStart(2, '0').toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NetworkApp = () => {
  return (
    <div className="h-full w-full p-4 relative overflow-hidden flex flex-col">
      <div className="font-mono text-[10px] text-crimson/50 mb-4 relative z-10 flex justify-between">
        <span>GLOBAL_LATTICE_TOPOLOGY</span>
        <span className="animate-pulse">LIVE_FEED</span>
      </div>
      <div className="flex-1 relative border border-white/5 bg-black/20">
        <NeuralLatticeViz />
        
        <div className="absolute bottom-4 left-4 font-mono text-[9px] text-crimson bg-black/60 p-2 backdrop-blur-sm border border-crimson/20">
          ACTIVE_NODES: {Math.floor(Math.random() * 1000) + 5000}<br/>
          LATENCY: {Math.floor(Math.random() * 10) + 2}ms<br/>
          PACKET_LOSS: 0.00%
        </div>
      </div>
    </div>
  );
};

const MatrixApp = () => {
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    setColumns(Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)));
  }, []);

  return (
    <div className="h-full w-full p-4 font-mono text-[10px] text-crimson overflow-hidden bg-black flex justify-between">
      {columns.map((start, i) => (
        <motion.div
          key={i}
          initial={{ y: -100 }}
          animate={{ y: [ -100, 400 ] }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
          className="flex flex-col gap-1"
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <span key={j} className="opacity-40">{Math.random() > 0.5 ? '1' : '0'}</span>
          ))}
        </motion.div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-4xl font-black tracking-[1em] opacity-10">RECURSIVE</div>
      </div>
    </div>
  );
};

const DiagnosticsApp = () => {
  const { activeNodes, latency, cpuUsage, memUsage, updateMetrics } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      updateMetrics();
    }, 2000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return (
    <div className="h-full w-full savant-stack !gap-6 p-6 overflow-y-auto bg-obsidian/20 custom-scrollbar">
      <div className="savant-grid grid-cols-2 !gap-4">
        <div className="border border-white/5 p-4 bg-black/20">
          <div className="font-mono text-[8px] text-white/20 uppercase mb-2 tracking-widest">CPU_LOAD</div>
          <div className="text-2xl font-black text-electric-gold">{cpuUsage.toFixed(1)}%</div>
          <div className="w-full h-1 bg-white/5 mt-2 overflow-hidden">
            <motion.div className="h-full bg-electric-gold" animate={{ width: `${cpuUsage}%` }} />
          </div>
        </div>
        <div className="border border-white/5 p-4 bg-black/20">
          <div className="font-mono text-[8px] text-white/20 uppercase mb-2 tracking-widest">MEM_ALLOC</div>
          <div className="text-2xl font-black text-crimson">{memUsage.toFixed(1)}%</div>
          <div className="w-full h-1 bg-white/5 mt-2 overflow-hidden">
            <motion.div className="h-full bg-crimson" animate={{ width: `${memUsage}%` }} />
          </div>
        </div>
      </div>

      <div className="border border-white/5 p-4 bg-black/20 savant-stack !gap-4">
        <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">LATTICE_HEALTH_METRICS</div>
        <div className="savant-stack !gap-3">
          <div className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-white/60">ACTIVE_NODES</span>
            <span className="text-white">{activeNodes}</span>
          </div>
          <div className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-white/60">SIGNAL_LATENCY</span>
            <span className="text-electric-gold">{latency.toFixed(4)}ms</span>
          </div>
          <div className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-white/60">UPTIME</span>
            <span className="text-white">142:12:44:09</span>
          </div>
          <div className="flex justify-between items-center font-mono text-[10px]">
            <span className="text-white/60">ENCRYPTION_STRENGTH</span>
            <span className="text-crimson">AES-4096-QUANTUM</span>
          </div>
        </div>
      </div>

      <div className="border border-white/5 p-4 bg-black/20 h-32 savant-stack !gap-2">
        <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">TELEMETRY_STREAM</div>
        <div className="savant-stack !gap-1 opacity-40 text-[8px] font-mono">
          <div>[INFO] NEURAL_LATTICE_SYNC_OK</div>
          <div>[INFO] QUANTUM_ENTANGLEMENT_STABLE</div>
          <div>[WARN] MINOR_PACKET_LOSS_IN_SECTOR_7G</div>
          <div>[INFO] RE-ROUTING_TRAFFIC_THROUGH_CORE_3</div>
          <div>[INFO] SYSTEM_INTEGRITY_99.998%</div>
        </div>
      </div>
    </div>
  );
};

const CommsApp = () => {
  return (
    <div className="h-full w-full p-4 savant-stack !gap-4 relative overflow-hidden">
      <div className="font-mono text-[10px] text-white/50 relative z-10 tracking-widest uppercase">
        SECURE_CHANNELS // P2P_ENCRYPTED
      </div>
      <div className="flex-1 savant-stack !gap-2 relative z-10 overflow-y-auto custom-scrollbar">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border border-white/10 p-3 flex items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
              <Radio className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="font-mono text-[10px] text-white tracking-widest">AGENT_{Math.random().toString(36).substring(2, 6).toUpperCase()}</div>
              <div className="font-mono text-[8px] text-white/30 tracking-widest">STATUS: ONLINE // ENCRYPTED</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-electric-gold animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

const NeuralMapApp = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    const nodes = [
      { id: 'CORE', group: 1, label: 'SAVANT_CORE' },
      { id: 'OS', group: 2, label: 'LATTICE_OS' },
      { id: 'JOURNAL', group: 2, label: 'NEURAL_JOURNAL' },
      { id: 'BLOG', group: 2, label: 'DATA_STREAM' },
      { id: 'ADMIN', group: 3, label: 'ROOT_CONTROL' },
      { id: 'AUTH', group: 3, label: 'BIOMETRIC_GATE' },
      { id: 'LATTICE', group: 4, label: 'SPATIAL_LATTICE' },
      { id: 'NETWORK', group: 4, label: 'NEURAL_NETWORK' },
    ];

    const links = [
      { source: 'CORE', target: 'OS' },
      { source: 'CORE', target: 'JOURNAL' },
      { source: 'CORE', target: 'BLOG' },
      { source: 'OS', target: 'ADMIN' },
      { source: 'OS', target: 'AUTH' },
      { source: 'OS', target: 'LATTICE' },
      { source: 'OS', target: 'NETWORK' },
      { source: 'ADMIN', target: 'AUTH' },
    ];

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height] as any);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<any>(nodes)
      .force('link', d3.forceLink<any, any>(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#f9ff00')
      .attr('stroke-opacity', 0.4)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');

    node.append('circle')
      .attr('r', 8)
      .attr('fill', d => d.group === 1 ? '#f9ff00' : d.group === 2 ? '#ff003c' : '#ffffff')
      .attr('stroke', '#000')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.label)
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', '#ffffff')
      .attr('font-family', 'monospace')
      .attr('font-size', '8px')
      .attr('letter-spacing', '1px');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);
    });

    return () => simulation.stop();
  }, []);

  return (
    <div className="h-full w-full relative bg-black overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 font-mono text-[10px] text-electric-gold bg-black/60 p-2 border border-electric-gold/20 backdrop-blur-md">
        NEURAL_TOPOLOGY // SECTOR: GLOBAL
      </div>
    </div>
  );
};

const AuthApp = () => {
  return (
    <div className="h-full w-full p-4 flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative"
      >
        <Fingerprint className="w-32 h-32 text-electric-gold" />
        <div className="absolute inset-0 bg-electric-gold/20 blur-xl rounded-full" />
      </motion.div>
      <div className="mt-8 font-mono text-xs text-electric-gold tracking-widest animate-pulse">
        AWAITING_BIOMETRIC_INPUT
      </div>
      <div className="mt-4 font-mono text-[10px] text-white/30 text-center max-w-xs">
        PLEASE PLACE FINGER ON SCANNER TO VERIFY IDENTITY AND ACCESS RESTRICTED SECTORS.
      </div>
    </div>
  );
};

// --- Pane Component ---

interface PaneProps {
  node: PaneNode;
  onSplit: (id: string, direction: 'horizontal' | 'vertical') => void;
  onClose: (id: string) => void;
  onChangeApp: (id: string, app: AppType) => void;
  isRoot?: boolean;
}

const Pane: React.FC<PaneProps> = ({ node, onSplit, onClose, onChangeApp, isRoot }) => {
  if (node.type === 'split' && node.children) {
    const isHoriz = node.direction === 'horizontal';
    return (
      <div className={`flex ${isHoriz ? 'flex-row' : 'flex-col'} w-full h-full gap-4 p-4 bg-obsidian`}>
        <div className="flex-1 min-w-0 min-h-0">
          <Pane node={node.children[0]} onSplit={onSplit} onClose={onClose} onChangeApp={onChangeApp} />
        </div>
        <div className="flex-1 min-w-0 min-h-0">
          <Pane node={node.children[1]} onSplit={onSplit} onClose={onClose} onChangeApp={onChangeApp} />
        </div>
      </div>
    );
  }

  const appType: AppType = node.appType || 'terminal';
  const AppConfig = APPS[appType];
  const Icon = AppConfig.icon;

  return (
    <div className="w-full h-full border border-white/10 bg-industrial-gray/50 flex flex-col relative group overflow-hidden min-w-[280px] min-h-[180px]">
      {/* Header */}
      <div className="h-8 border-b border-white/10 bg-obsidian/90 flex items-center justify-between px-3 select-none relative overflow-hidden">
        {/* Subtle header background pulse */}
        <motion.div 
          className="absolute inset-0 bg-white/5 pointer-events-none"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5">
            <Icon className={`w-3 h-3 ${AppConfig.color}`} />
            <div className={`w-1 h-1 rounded-full ${AppConfig.color} animate-pulse`} />
          </div>
          <select 
            value={appType}
            onChange={(e) => onChangeApp(node.id, e.target.value as AppType)}
            className={`bg-transparent font-mono text-[9px] font-bold tracking-[0.2em] outline-none appearance-none cursor-pointer hover:brightness-125 transition-all ${AppConfig.color}`}
            style={{ color: AppConfig.hex }}
          >
            {Object.entries(APPS).map(([k, v]) => (
              <option key={k} value={k} className="bg-obsidian text-white">{v.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2 relative z-10">
          {/* System Health Indicator per pane */}
          <div className="flex items-center gap-1 px-2 py-0.5 border border-white/5 bg-white/5 rounded-full">
            <div className="w-1 h-1 rounded-full bg-electric-gold" />
            <span className="font-mono text-[7px] text-white/30 uppercase tracking-tighter">Health_OK</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onSplit(node.id, 'horizontal')} className="p-1 hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Split Horizontal">
              <SplitSquareHorizontal className="w-3 h-3" />
            </button>
            <button onClick={() => onSplit(node.id, 'vertical')} className="p-1 hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Split Vertical">
              <SplitSquareVertical className="w-3 h-3" />
            </button>
            {!isRoot && (
              <button onClick={() => onClose(node.id)} className="p-1 hover:bg-crimson/20 text-white/40 hover:text-crimson transition-colors" title="Close Pane">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 relative bg-obsidian/40">
        {appType === 'terminal' && <TerminalApp />}
        {appType === 'system' && <SystemApp />}
        {appType === 'vault' && <VaultApp />}
        {appType === 'network' && <NetworkApp />}
        {appType === 'matrix' && <MatrixApp />}
        {appType === 'comms' && <CommsApp />}
        {appType === 'auth' && <AuthApp />}
        {appType === 'lattice' && <Lattice3D />}
        {appType === 'diagnostics' && <DiagnosticsApp />}
        {appType === 'neural' && <NeuralMapApp />}
        
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>
    </div>
  );
};

// --- Main OS Page ---

export default function OS() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [rootNode, setRootNode] = useState<PaneNode>({
    id: 'root',
    type: 'split',
    direction: 'horizontal',
    children: [
      {
        id: 'left',
        type: 'split',
        direction: 'vertical',
        children: [
          { id: 'l1', type: 'leaf', appType: 'terminal' },
          { id: 'l2', type: 'leaf', appType: 'lattice' }
        ]
      },
      {
        id: 'right',
        type: 'split',
        direction: 'vertical',
        children: [
          { id: 'r1', type: 'leaf', appType: 'network' },
          {
            id: 'r2',
            type: 'split',
            direction: 'horizontal',
            children: [
              { id: 'r2a', type: 'leaf', appType: 'vault' },
              { id: 'r2b', type: 'leaf', appType: 'auth' }
            ]
          }
        ]
      }
    ]
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const findAndSplit = (node: PaneNode, targetId: string, direction: 'horizontal' | 'vertical'): PaneNode => {
    if (node.id === targetId && node.type === 'leaf') {
      return {
        id: generateId(),
        type: 'split',
        direction,
        children: [
          { ...node, id: generateId() },
          { id: generateId(), type: 'leaf', appType: 'matrix' }
        ]
      };
    }
    if (node.type === 'split' && node.children) {
      return {
        ...node,
        children: [
          findAndSplit(node.children[0], targetId, direction),
          findAndSplit(node.children[1], targetId, direction)
        ]
      };
    }
    return node;
  };

  const findAndClose = (node: PaneNode, targetId: string): PaneNode | null => {
    if (node.id === targetId) return null;
    if (node.type === 'split' && node.children) {
      const c0 = findAndClose(node.children[0], targetId);
      const c1 = findAndClose(node.children[1], targetId);
      
      if (!c0 && c1) return c1;
      if (c0 && !c1) return c0;
      if (c0 && c1) return { ...node, children: [c0, c1] };
      return null;
    }
    return node;
  };

  const findAndChangeApp = (node: PaneNode, targetId: string, appType: AppType): PaneNode => {
    if (node.id === targetId) {
      return { ...node, appType };
    }
    if (node.type === 'split' && node.children) {
      return {
        ...node,
        children: [
          findAndChangeApp(node.children[0], targetId, appType),
          findAndChangeApp(node.children[1], targetId, appType)
        ]
      };
    }
    return node;
  };

  const handleSplit = (id: string, direction: 'horizontal' | 'vertical') => {
    setRootNode(prev => findAndSplit(prev, id, direction));
  };

  const handleClose = (id: string) => {
    setRootNode(prev => {
      const res = findAndClose(prev, id);
      return res || { id: 'root', type: 'leaf', appType: 'terminal' };
    });
  };

  const handleChangeApp = (id: string, appType: AppType) => {
    setRootNode(prev => findAndChangeApp(prev, id, appType));
  };

  return (
    <div className="fixed inset-0 z-40 bg-obsidian flex flex-col overflow-hidden">
      <div className="noise-overlay opacity-10" />
      <div className="scanlines-overlay opacity-5" />
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
      
      {/* Top Bar */}
      <div className="h-12 border-b border-white/10 bg-obsidian/95 backdrop-blur-xl flex items-center justify-between px-8 z-50 relative group">
        <div className="flex items-center gap-6">
          <div className="flex gap-1 group-hover:gap-2 transition-all duration-500">
            <div className="w-1.5 h-1.5 bg-crimson rotate-45 shadow-[0_0_10px_#ff003c]" />
            <div className="w-1.5 h-1.5 bg-white/10 rotate-45" />
          </div>
          <span className="font-display font-black text-lg tracking-tighter text-white group-hover:glitch-text transition-all">
            SAVANT<span className="text-crimson">_</span>OS
          </span>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <span className="font-mono text-[9px] text-white/30 tracking-[0.3em] hidden lg:inline-block uppercase">
            Sovereign_Fractal_Architecture_v80.0.0
          </span>
        </div>
        <div className="flex items-center gap-8 font-mono text-[10px]">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full hover:border-electric-gold/30 transition-colors cursor-help">
            <div className="w-2 h-2 rounded-full bg-electric-gold animate-pulse shadow-[0_0_10px_#f9ff00]" />
            <span className="text-white/40 tracking-widest hidden md:inline-block">UPLINK_STABLE</span>
          </div>
          <div className="text-white/20 tracking-widest hidden sm:inline-block font-tech">
            {new Date().toISOString().split('T')[1].substring(0, 8)} <span className="text-[8px] opacity-50">UTC</span>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 p-4 lg:p-6 overflow-hidden bg-obsidian relative z-10">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        
        <Pane 
          node={rootNode} 
          onSplit={handleSplit} 
          onClose={handleClose} 
          onChangeApp={handleChangeApp}
          isRoot={true}
        />
      </div>

      <AmbientAudioController />
      <SystemStatus />
    </div>
  );
}
