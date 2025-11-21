import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AgentList } from './components/AgentList';
import { IncidentLog } from './components/IncidentLog';
import { Agent, AgentStatus, GlobalState, Incident, View, IncidentSeverity } from './types';
import { MOCK_AGENTS, MOCK_INCIDENTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [globalState, setGlobalState] = useState<GlobalState>(GlobalState.NORMAL);
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);

  // Effect: When Global Emergency Stop is triggered, stop all running agents
  useEffect(() => {
    if (globalState === GlobalState.EMERGENCY_MODE) {
      setAgents(prevAgents => 
        prevAgents.map(a => 
          a.status === AgentStatus.RUNNING || a.status === AgentStatus.PAUSED 
            ? { ...a, status: AgentStatus.STOPPED } 
            : a
        )
      );
      
      // Add a system incident for the E-Stop
      const newIncident: Incident = {
        id: `inc-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        agentId: 'GLOBAL',
        agentName: 'ALL AGENTS',
        type: 'EMERGENCY_STOP',
        severity: IncidentSeverity.CRITICAL,
        reason: 'Global Emergency Stop triggered by Operator',
        actor: 'Operator (Admin)',
        resolved: false
      };
      setIncidents(prev => [newIncident, ...prev]);
    }
  }, [globalState]);

  const handleAgentStatusUpdate = (id: string, newStatus: AgentStatus) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    
    // Log manual intervention
    if (newStatus === AgentStatus.STOPPED || newStatus === AgentStatus.PAUSED || newStatus === AgentStatus.QUARANTINED) {
       const agent = agents.find(a => a.id === id);
       const newIncident: Incident = {
        id: `inc-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        agentId: id,
        agentName: agent?.name || 'Unknown',
        type: 'MANUAL_STOP',
        severity: IncidentSeverity.HIGH,
        reason: `Manual status change to ${newStatus}`,
        actor: 'Operator (John Doe)',
        resolved: true
      };
      setIncidents(prev => [newIncident, ...prev]);
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      globalState={globalState}
    >
      {currentView === 'DASHBOARD' && (
        <Dashboard 
          agents={agents} 
          incidents={incidents}
          globalState={globalState}
          setGlobalState={setGlobalState}
        />
      )}
      {currentView === 'AGENTS' && (
        <AgentList 
          agents={agents} 
          onUpdateStatus={handleAgentStatusUpdate}
        />
      )}
      {currentView === 'INCIDENTS' && (
        <IncidentLog incidents={incidents} />
      )}
      {/* Placeholder views for less critical sections */}
      {(currentView === 'POLICIES' || currentView === 'SETTINGS') && (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
          <div className="text-6xl mb-4 opacity-20 font-mono">404</div>
          <h2 className="text-xl font-semibold text-white">Under Construction</h2>
          <p>This module is simulated in this prototype.</p>
        </div>
      )}
    </Layout>
  );
};

export default App;