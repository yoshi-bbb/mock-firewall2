import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Power, 
  Shield,
  Activity,
  Wifi,
  Database,
  Lock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { Agent, AgentStatus, GlobalState, Incident } from '../types';

interface DashboardProps {
  agents: Agent[];
  incidents: Incident[];
  globalState: GlobalState;
  setGlobalState: (state: GlobalState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  agents, 
  incidents, 
  globalState, 
  setGlobalState 
}) => {
  const [showEStopModal, setShowEStopModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  
  // Stats Calculation
  const runningCount = agents.filter(a => a.status === AgentStatus.RUNNING).length;
  const stoppedCount = agents.filter(a => a.status === AgentStatus.STOPPED).length;
  const pausedCount = agents.filter(a => a.status === AgentStatus.PAUSED).length;
  const quarantinedCount = agents.filter(a => a.status === AgentStatus.QUARANTINED).length;
  const totalAgents = agents.length;

  const statusData = [
    { name: 'RUNNING', value: runningCount, color: '#10B981' },
    { name: 'PAUSED', value: pausedCount, color: '#F59E0B' },
    { name: 'STOPPED', value: stoppedCount, color: '#EF4444' },
    { name: 'QUARANTINED', value: quarantinedCount, color: '#8B5CF6' },
  ];

  const activityData = [
    { time: '10:00', calls: 1200 },
    { time: '11:00', calls: 1900 },
    { time: '12:00', calls: 1500 },
    { time: '13:00', calls: 2100 },
    { time: '14:00', calls: 800 },
    { time: '15:00', calls: 950 },
    { time: '16:00', calls: 1700 },
  ];

  const handleEStop = () => {
    if (confirmationText === 'STOP') {
      setGlobalState(GlobalState.EMERGENCY_MODE);
      setShowEStopModal(false);
      setConfirmationText('');
    }
  };

  const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="glass-panel p-4 rounded-sm border-l-2" style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
        <Icon size={14} color={color} className="opacity-70" />
      </div>
      <div className="text-2xl font-bold text-white font-mono leading-none">{value}</div>
      <div className="text-[10px] text-slate-500 mt-1 font-mono">{sub}</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Row: System Stats & E-STOP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Status Overview */}
        <div className="lg:col-span-8 space-y-6">
           {/* Header Section */}
           <div className="flex items-end justify-between border-b border-border-subtle pb-4">
             <div>
               <h2 className="text-xl font-bold text-white tracking-tight">CONTROL ROOM</h2>
               <p className="text-xs text-slate-500 font-mono mt-1">SECTOR 7 // NODES: {totalAgents}</p>
             </div>
             <div className="flex space-x-4">
               <div className="flex items-center space-x-2 text-xs text-emerald-500">
                 <Wifi size={14} /> <span className="font-mono">UPLINK: SECURE</span>
               </div>
               <div className="flex items-center space-x-2 text-xs text-blue-500">
                 <Database size={14} /> <span className="font-mono">DB: SYNCED</span>
               </div>
             </div>
           </div>

           {/* Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Active Agents" value={runningCount} sub={`Total: ${totalAgents}`} icon={Activity} color="#10B981" />
              <StatCard label="Intervention" value="3" sub="Last 1h" icon={Shield} color="#F59E0B" />
              <StatCard label="Latency" value="12ms" sub="Avg response" icon={Wifi} color="#3B82F6" />
              <StatCard label="Security" value="L4" sub="Lockdown ready" icon={Lock} color="#8B5CF6" />
           </div>

           {/* Graph Section */}
           <div className="glass-panel rounded-sm p-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 px-3 py-1 bg-bg-surface border-r border-b border-border-subtle z-10">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Traffic Volume</span>
              </div>
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="time" stroke="#444" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                    <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', color: '#fff', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                       itemStyle={{ color: '#3B82F6' }}
                    />
                    <Area type="monotone" dataKey="calls" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCalls)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Right: Emergency Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           {/* E-STOP Panel */}
           <div className="flex-1 bg-bg-panel border-2 border-danger/20 rounded-sm p-1 relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.05)]">
              <div className="absolute inset-0 bg-danger-stripes opacity-10 pointer-events-none"></div>
              <div className="h-full flex flex-col items-center justify-center p-6 border border-dashed border-danger/30 bg-black/40">
                 <div className="text-center mb-6">
                   <AlertTriangle className="mx-auto text-danger mb-2" size={32} />
                   <h3 className="text-danger font-bold tracking-[0.2em] text-sm">EMERGENCY OVERRIDE</h3>
                   <p className="text-danger/60 text-[10px] font-mono mt-1">PHYSICAL DISCONNECT</p>
                 </div>

                 {globalState !== GlobalState.EMERGENCY_MODE ? (
                    <button 
                      onClick={() => setShowEStopModal(true)}
                      className="group relative w-full max-w-[200px] h-24 bg-[#1a0505] border-2 border-danger rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:bg-danger/10 transition-all active:scale-95"
                    >
                      <div className="absolute inset-2 border border-danger/30 pointer-events-none"></div>
                      <div className="flex flex-col items-center justify-center h-full">
                        <Power size={32} className="text-danger mb-1 group-hover:text-white transition-colors" />
                        <span className="text-danger font-bold tracking-widest text-sm group-hover:text-white">E-STOP</span>
                      </div>
                    </button>
                 ) : (
                    <div className="w-full p-4 bg-danger/20 border border-danger text-center animate-pulse">
                       <h2 className="text-xl font-bold text-danger font-mono">SYSTEM HALTED</h2>
                       <button 
                         onClick={() => setGlobalState(GlobalState.NORMAL)}
                         className="mt-4 px-4 py-1 bg-black border border-danger/50 text-danger text-xs hover:bg-danger hover:text-white transition-colors uppercase tracking-wider"
                       >
                         Reset System
                       </button>
                    </div>
                 )}
                 
                 <div className="mt-6 w-full">
                    <div className="flex justify-between text-[10px] text-slate-600 font-mono uppercase mb-1">
                      <span>Safety Protocol</span>
                      <span>Active</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Distribution Chart */}
           <div className="h-48 glass-panel p-4 rounded-sm relative">
              <h4 className="text-[10px] font-mono uppercase text-slate-500 mb-2">Agent Distribution</h4>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-4 right-4 text-right">
                <div className="text-2xl font-bold text-white font-mono">{runningCount}</div>
                <div className="text-[10px] text-emerald-500">ONLINE</div>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom: Incident Log Preview */}
      <div className="glass-panel rounded-sm overflow-hidden">
         <div className="px-4 py-3 border-b border-border-subtle flex justify-between items-center bg-bg-surface/50">
           <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center">
             <AlertTriangle size={12} className="mr-2 text-warning" /> Recent Incidents
           </h3>
           <button className="text-[10px] text-brand hover:text-brand-glow font-mono uppercase hover:underline">View Full Log</button>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-bg-surface text-[10px] text-slate-500 font-mono uppercase tracking-wider">
               <tr>
                 <th className="px-4 py-2 font-normal">Time</th>
                 <th className="px-4 py-2 font-normal">Agent ID</th>
                 <th className="px-4 py-2 font-normal">Type</th>
                 <th className="px-4 py-2 font-normal">Detail</th>
                 <th className="px-4 py-2 font-normal text-right">Severity</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border-subtle text-xs font-mono">
               {incidents.slice(0, 5).map((inc) => (
                 <tr key={inc.id} className="hover:bg-white/5 transition-colors">
                   <td className="px-4 py-3 text-slate-400">{inc.timestamp.split(' ')[1]}</td>
                   <td className="px-4 py-3 text-brand">{inc.agentName}</td>
                   <td className="px-4 py-3">
                     <span className={inc.type === 'EMERGENCY_STOP' ? 'text-danger' : 'text-warning'}>
                       {inc.type}
                     </span>
                   </td>
                   <td className="px-4 py-3 text-slate-300 max-w-md truncate">{inc.reason}</td>
                   <td className="px-4 py-3 text-right">
                     <span className={`px-1.5 py-0.5 text-[10px] border ${
                        inc.severity === 'CRITICAL' ? 'border-danger text-danger' : 
                        inc.severity === 'HIGH' ? 'border-warning text-warning' : 'border-slate-600 text-slate-400'
                     }`}>
                        {inc.severity}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      {/* E-Stop Modal - Military Style */}
      {showEStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border-2 border-danger w-full max-w-lg shadow-[0_0_50px_rgba(239,68,68,0.3)] relative">
             {/* Decorative Corners */}
             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-danger"></div>
             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-danger"></div>
             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-danger"></div>
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-danger"></div>

             <div className="p-1 bg-danger-stripes">
               <div className="bg-[#0f0f0f] p-8 text-center">
                  <AlertTriangle size={48} className="text-danger mx-auto mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold text-danger font-mono tracking-widest mb-2">EMERGENCY STOP</h2>
                  <p className="text-slate-400 text-sm mb-8 font-mono">
                    AUTHORIZATION REQUIRED.<br/>
                    THIS ACTION WILL HALT ALL PHYSICAL ACTUATORS IMMEDIATELY.
                  </p>
                  
                  <div className="relative max-w-xs mx-auto mb-8">
                    <label className="block text-[10px] text-danger/70 uppercase font-mono mb-1 text-left">Confirmation Code</label>
                    <input 
                      type="text" 
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                      className="w-full bg-black border border-danger text-center text-white font-mono text-xl tracking-[0.5em] py-3 focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                      placeholder="STOP"
                      autoFocus
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setShowEStopModal(false)}
                      className="flex-1 py-3 border border-slate-700 text-slate-400 hover:bg-slate-800 font-mono text-sm uppercase tracking-wider transition-colors"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={handleEStop}
                      disabled={confirmationText !== 'STOP'}
                      className="flex-1 py-3 bg-danger text-white font-bold font-mono text-sm uppercase tracking-wider hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    >
                      Execute
                    </button>
                  </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};