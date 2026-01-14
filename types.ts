
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { uri: string; title: string }[];
}

export interface ComplaintData {
  victimName: string;
  scamType: string;
  details: string;
  contactInfo: string;
}

export enum BotMode {
  IDLE = 'IDLE',
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  DASHBOARD = 'DASHBOARD'
}

export interface VoiceState {
  isConnecting: boolean;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  error: string | null;
}
