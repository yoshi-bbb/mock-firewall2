import React from 'react';
import { Incident, IncidentSeverity } from '../types';
import { CheckCircle, Clock, Terminal, Download } from 'lucide-react';

interface IncidentLogProps {
  incidents: Incident[];
}

export const IncidentLog: React.FC<IncidentLogProps> = ({ incidents }) => {
  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case IncidentSeverity.CRITICAL: return 'text-danger border-danger bg-danger/10';
      case IncidentSeverity.HIGH: return 'text-warning border-warning bg-warning/10';
      case IncidentSeverity.MEDIUM: return 'text-blue-400 border-blue-400 bg-blue-400/10';
      default: return 'text-slate-400 border-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-border-subtle pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center font-mono">
            <Terminal className="mr-3 text-slate-400" size={20} />
            SYSTEM_AUDIT_LOG
          </h2>
          <p className="text-slate-500 text-xs font-mono mt-1 ml-8">SECURE RECORD OF ALL INTERVENTIONS</p>
        </div>
        <button className="flex items-center space-x-2 px-3 py-1.5 bg-bg-surface border border-border-subtle text-slate-400 hover:text-white hover:border-slate-500 rounded-sm text-xs font-mono transition-colors">
          <Download size={14} />
          <span>EXPORT_CSV</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-black border border-border-subtle rounded-sm font-mono p-4 relative">
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20"></div>
        
        <div className="space-y-2 relative z-20">
          {incidents.map((incident) => (
            <div key={incident.id} className="flex items-start p-3 hover:bg-white/5 border-l-2 border-transparent hover:border-brand transition-colors group">
              <div className="w-32 text-[10px] text-slate-500 pt-0.5 shrink-0">
                {incident.timestamp}
              </div>
              
              <div className="flex-1 px-4">
                <div className="flex items-center space-x-3 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 border ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <span className="text-xs text-brand font-bold">{incident.type}</span>
                  <span className="text-slate-600 text-xs">::</span>
                  <span className="text-xs text-white">{incident.agentName}</span>
                </div>
                <p className="text-slate-400 text-xs pl-1">{incident.reason}</p>
                <div className="text-[10px] text-slate-600 mt-1 pl-1">
                   ACTOR: <span className="text-slate-500">{incident.actor}</span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                 {incident.resolved ? (
                   <span className="flex items-center text-emerald-500 text-[10px] uppercase tracking-wider">
                     <CheckCircle size={10} className="mr-1" /> Resolved
                   </span>
                 ) : (
                   <span className="flex items-center text-warning text-[10px] uppercase tracking-wider">
                     <Clock size={10} className="mr-1" /> Active
                   </span>
                 )}
              </div>
            </div>
          ))}
          <div className="text-center py-4 text-slate-700 text-xs animate-pulse">
             _ END OF STREAM
          </div>
        </div>
      </div>
    </div>
  );
};