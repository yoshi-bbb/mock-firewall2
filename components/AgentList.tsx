import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Box, 
  Terminal, 
  Cpu, 
  AlertCircle,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  Activity
} from 'lucide-react';
import { Agent, AgentStatus, AgentType } from '../types';

interface AgentListProps {
  agents: Agent[];
  onUpdateStatus: (id: string, status: AgentStatus) => void;
}

export const AgentList: React.FC<AgentListProps> = ({ agents, onUpdateStatus }) => {
  const [filterText, setFilterText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [actionType, setActionType] = useState<AgentStatus | null>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(filterText.toLowerCase()) || agent.id.includes(filterText);
    const matchesType = typeFilter === 'ALL' || agent.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: AgentStatus) => {
    const styles = {
      [AgentStatus.RUNNING]: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5',
      [AgentStatus.PAUSED]: 'text-amber-500 border-amber-500/30 bg-amber-500/5',
      [AgentStatus.STOPPED]: 'text-red-500 border-red-500/30 bg-red-500/5',
      [AgentStatus.QUARANTINED]: 'text-purple-500 border-purple-500/30 bg-purple-500/5',
    };
    return (
      <span className={`px-3 py-1 rounded-sm text-[10px] font-bold font-mono tracking-wider border ${styles[status]} uppercase`}>
        {status}
      </span>
    );
  };

  const getTypeIcon = (type: AgentType) => {
    switch (type) {
      case AgentType.PHYSICAL: return <Cpu size={14} className="text-blue-400" />;
      case AgentType.INFO: return <Terminal size={14} className="text-slate-400" />;
      case AgentType.HYBRID: return <Box size={14} className="text-indigo-400" />;
    }
  };

  const confirmAction = () => {
    if (selectedAgent && actionType) {
      onUpdateStatus(selectedAgent.id, actionType);
      setSelectedAgent(null);
      setActionType(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-6">
        <div>
           <h2 className="text-xl font-bold text-white tracking-tight flex items-center">
             <Activity className="mr-3 text-brand" size={20} />
             AGENT REGISTRY
           </h2>
           <p className="text-slate-500 text-xs font-mono mt-1 ml-8">MANAGE AND MONITOR CONNECTED NODES</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand" size={14} />
             <input 
               value={filterText}
               onChange={(e) => setFilterText(e.target.value)}
               placeholder="SEARCH NODES..." 
               className="bg-bg-surface border border-border-subtle rounded-sm pl-9 pr-3 py-2 text-xs text-white font-mono focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none w-64 placeholder-slate-700"
             />
           </div>
           <div className="flex bg-bg-surface border border-border-subtle rounded-sm p-0.5">
              {['ALL', AgentType.PHYSICAL, AgentType.INFO].map((t) => (
                <button 
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm ${typeFilter === t ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t === 'ALL' ? 'All' : t === AgentType.PHYSICAL ? 'Phys' : 'Info'}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-bg-panel border border-border-subtle rounded-sm overflow-hidden flex-1 shadow-2xl">
        <div className="overflow-auto max-h-[calc(100vh-240px)]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#0f0f0f] z-10 shadow-sm">
              <tr className="text-slate-500 text-[10px] uppercase font-mono tracking-wider border-b border-border-subtle">
                <th className="px-6 py-4 font-normal">Node ID / Name</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Type</th>
                <th className="px-6 py-4 font-normal">Risk Lvl</th>
                <th className="px-6 py-4 font-normal">Policy</th>
                <th className="px-6 py-4 font-normal text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-white/5 transition-colors group relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-sm mr-4 ${agent.status === AgentStatus.RUNNING ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`}></div>
                      <div>
                        <div className="font-bold text-white text-sm font-mono tracking-tight">{agent.name}</div>
                        <div className="text-[10px] text-slate-600 font-mono mt-0.5">{agent.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(agent.status)}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center space-x-2">
                       {getTypeIcon(agent.type)}
                       <span className="text-xs text-slate-400 font-mono">{agent.type}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center space-x-3 w-24">
                        <div className="flex-1 h-1 bg-slate-800 rounded-sm overflow-hidden">
                           <div 
                             className={`h-full ${agent.riskScore > 80 ? 'bg-danger shadow-[0_0_5px_rgba(239,68,68,0.5)]' : agent.riskScore > 50 ? 'bg-warning' : 'bg-blue-500'}`} 
                             style={{ width: `${agent.riskScore}%` }}
                           ></div>
                        </div>
                        <span className={`text-xs font-mono w-6 text-right ${agent.riskScore > 80 ? 'text-danger' : 'text-slate-500'}`}>{agent.riskScore}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                    <div className="flex items-center space-x-2">
                      <Shield size={12} className="opacity-50" />
                      <span>{agent.policy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {agent.status === AgentStatus.RUNNING && (
                          <>
                            <button 
                              onClick={() => { setSelectedAgent(agent); setActionType(AgentStatus.PAUSED); }}
                              className="p-1.5 hover:bg-warning/10 text-slate-400 hover:text-warning border border-transparent hover:border-warning/30 rounded-sm transition-all"
                              title="PAUSE"
                            >
                              <Pause size={14} />
                            </button>
                            <button 
                              onClick={() => { setSelectedAgent(agent); setActionType(AgentStatus.STOPPED); }}
                              className="p-1.5 hover:bg-danger/10 text-slate-400 hover:text-danger border border-transparent hover:border-danger/30 rounded-sm transition-all"
                              title="STOP"
                            >
                              <Square size={14} fill="currentColor" />
                            </button>
                          </>
                        )}
                        {(agent.status === AgentStatus.PAUSED || agent.status === AgentStatus.STOPPED) && (
                          <button 
                            onClick={() => { setSelectedAgent(agent); setActionType(AgentStatus.RUNNING); }}
                            className="p-1.5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 border border-transparent hover:border-emerald-500/30 rounded-sm transition-all"
                            title="RESUME"
                          >
                            <Play size={14} fill="currentColor" />
                          </button>
                        )}
                        <button className="p-1.5 hover:bg-white/10 text-slate-500 hover:text-white rounded-sm">
                          <MoreHorizontal size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal - Tech Style */}
      {selectedAgent && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="bg-bg-panel border border-slate-700 w-full max-w-md shadow-2xl relative">
              {/* Decorative Line */}
              <div className={`h-1 w-full ${
                  actionType === AgentStatus.STOPPED ? 'bg-danger' :
                  actionType === AgentStatus.PAUSED ? 'bg-warning' :
                  'bg-emerald-500'
              }`}></div>

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-3 rounded-sm ${
                    actionType === AgentStatus.STOPPED ? 'bg-danger/10 text-danger' :
                    actionType === AgentStatus.PAUSED ? 'bg-warning/10 text-warning' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                     {actionType === AgentStatus.STOPPED ? <AlertCircle size={24} /> : 
                      actionType === AgentStatus.PAUSED ? <Pause size={24} /> : <Play size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">CONFIRM COMMAND</h3>
                    <p className="text-slate-400 text-xs font-mono">TARGET: {selectedAgent.name}</p>
                  </div>
                </div>

                <div className="bg-black border border-border-subtle p-4 mb-6 font-mono text-xs text-slate-400 space-y-2">
                   <div className="flex justify-between"><span>UID:</span> <span className="text-white">{selectedAgent.id}</span></div>
                   <div className="flex justify-between"><span>NEW STATE:</span> <span className={
                      actionType === AgentStatus.STOPPED ? 'text-danger' :
                      actionType === AgentStatus.PAUSED ? 'text-warning' : 'text-emerald-500'
                   }>{actionType}</span></div>
                   <div className="flex justify-between"><span>IMPACT:</span> <span className="text-white">IMMEDIATE</span></div>
                </div>

                <div className="flex space-x-3">
                   <button 
                     onClick={() => { setSelectedAgent(null); setActionType(null); }}
                     className="flex-1 py-2 border border-slate-700 text-slate-400 hover:bg-slate-800 text-xs font-mono uppercase"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={confirmAction}
                     className={`flex-1 py-2 text-white text-xs font-mono font-bold uppercase hover:brightness-110 transition-all ${
                       actionType === AgentStatus.STOPPED ? 'bg-danger' :
                       actionType === AgentStatus.PAUSED ? 'bg-warning text-black' :
                       'bg-emerald-600'
                     }`}
                   >
                     Execute
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};