import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Server, 
  FileText, 
  Settings, 
  Users,
  Bell,
  Search,
  Activity,
  Radio
} from 'lucide-react';
import { GlobalState, View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
  globalState: GlobalState;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onViewChange, 
  globalState 
}) => {
  
  const getStatusColor = () => {
    switch (globalState) {
      case GlobalState.EMERGENCY_MODE: return 'text-danger animate-flash';
      case GlobalState.PARTIAL_STOP: return 'text-warning';
      default: return 'text-success';
    }
  };

  const getStatusText = () => {
    switch (globalState) {
      case GlobalState.EMERGENCY_MODE: return 'EMERGENCY STOP ACTIVE';
      case GlobalState.PARTIAL_STOP: return 'PARTIAL INTERVENTION';
      default: return 'SYSTEM NOMINAL';
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onViewChange(view)}
        className={`group w-full flex items-center space-x-3 px-4 py-3 mb-1 transition-all duration-200 border-l-2 ${
          isActive 
            ? 'border-brand bg-brand/10 text-white' 
            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
        }`}
      >
        <Icon size={18} className={`${isActive ? 'text-brand' : 'text-slate-500 group-hover:text-slate-300'}`} />
        <span className={`font-medium tracking-wide ${isActive ? 'text-white' : ''}`}>{label}</span>
        {isActive && <div className="ml-auto w-1.5 h-1.5 bg-brand rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
      </button>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main text-slate-300 font-sans selection:bg-brand/30">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-panel border-r border-border-subtle flex flex-col z-20 shadow-2xl">
        <div className="h-16 flex items-center px-6 border-b border-border-subtle bg-bg-main">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-brand/20 border border-brand/50 flex items-center justify-center rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <ShieldAlert size={18} className="text-brand" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white font-mono">GATE<span className="text-slate-500">KEEPER</span></h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <div className="px-6 mb-4 text-[10px] font-mono uppercase text-slate-600 tracking-widest">Main Control</div>
          <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="AGENTS" icon={Users} label="Agents" />
          <NavItem view="INCIDENTS" icon={Activity} label="Incidents" />
          <NavItem view="POLICIES" icon={FileText} label="Policies" />
          
          <div className="px-6 mt-8 mb-4 text-[10px] font-mono uppercase text-slate-600 tracking-widest">System</div>
          <NavItem view="SETTINGS" icon={Settings} label="Settings" />
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors border-l-2 border-transparent">
             <Server size={18} />
             <span className="font-medium tracking-wide">Infrastructure</span>
          </button>
        </nav>

        <div className="p-4 border-t border-border-subtle bg-bg-surface/50">
           <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-sm bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700 text-slate-300">
                JD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate font-mono">OP-299</p>
                <p className="text-[10px] text-brand truncate font-mono">LVL 4 ADMIN</p>
              </div>
              <Settings size={14} className="text-slate-600 hover:text-white cursor-pointer" />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-bg-main">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundSize: '30px 30px', backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)' }}>
        </div>

        {/* Top Header */}
        <header className="h-16 bg-bg-panel/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 z-10">
          <div className="flex items-center space-x-6">
             {/* Status Indicator */}
             <div className="flex items-center space-x-3 bg-bg-surface border border-border-subtle px-3 py-1.5 rounded-sm">
                <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] animate-pulse`} />
                <span className={`text-xs font-bold font-mono tracking-widest ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
             </div>

             <div className="h-4 w-px bg-border-subtle" />

             <div className="flex items-center space-x-2">
               <Radio size={14} className="text-slate-500" />
               <select className="bg-transparent text-slate-400 text-xs font-mono outline-none cursor-pointer hover:text-white uppercase">
                 <option>Env: Production</option>
                 <option>Env: Staging</option>
               </select>
             </div>
          </div>

          <div className="flex items-center space-x-4">
             <div className="relative group hidden md:block">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={14} className="text-slate-600 group-focus-within:text-brand" />
                </div>
                <input 
                  type="text" 
                  placeholder="SEARCH_UID..." 
                  className="bg-bg-surface border border-border-subtle text-slate-200 text-xs font-mono rounded-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all placeholder-slate-700"
                />
             </div>
             <button className="relative p-2 text-slate-500 hover:text-white transition-colors border border-transparent hover:border-border-subtle rounded-sm hover:bg-bg-surface">
               <Bell size={18} />
               <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-danger rounded-full" />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 relative z-0">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};