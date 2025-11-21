export enum AgentStatus {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  QUARANTINED = 'QUARANTINED',
}

export enum AgentType {
  PHYSICAL = 'PHYSICAL', // Robot arms, drones
  INFO = 'INFO',         // Chatbots, data processors
  HYBRID = 'HYBRID',     // IoT Controllers
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  project: string;
  lastActive: string;
  riskScore: number; // 0-100
  policy: string;
}

export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface Incident {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: 'AUTO_STOP' | 'MANUAL_STOP' | 'EMERGENCY_STOP';
  severity: IncidentSeverity;
  reason: string;
  actor: string; // 'System (Policy X)' or 'User (John Doe)'
  resolved: boolean;
}

export enum GlobalState {
  NORMAL = 'NORMAL',
  PARTIAL_STOP = 'PARTIAL_STOP',
  EMERGENCY_MODE = 'EMERGENCY_MODE',
}

export type View = 'DASHBOARD' | 'AGENTS' | 'POLICIES' | 'INCIDENTS' | 'SETTINGS';
