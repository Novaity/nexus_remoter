
export enum ActionType {
  LAUNCH_APP = 'LAUNCH_APP',
  OPEN_URL = 'OPEN_URL',
  COMMAND = 'COMMAND',
  MACRO = 'MACRO',
  KEY_COMBINATION = 'KEY_COMBINATION',
  MOTION_REPLAY = 'MOTION_REPLAY'
}

export interface AutomationStep {
  id: string;
  type: ActionType;
  value: string;
  description: string;
}

export interface ControlButton {
  id: string;
  label: string;
  color: string;
  icon: string;
  steps: AutomationStep[];
}

export interface DashboardPage {
  id: string;
  name: string;
  buttons: ControlButton[];
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface AppState {
  currentPageId: string;
  pages: DashboardPage[];
  isEditMode: boolean;
  isExecuting: boolean;
  pcIpAddress: string;
  connectionStatus: ConnectionStatus;
}
