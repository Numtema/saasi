
export enum StepType {
  Welcome = 'welcome',
  Question = 'question',
  Message = 'message',
  LeadCapture = 'lead_capture',
  Calendar = 'calendar'
}

export type MediaType = 'video' | 'image' | 'none';

export interface MediaConfig {
  type: MediaType;
  url: string;
}

export interface FunnelStep {
  id: string;
  type: StepType;
  title: string;
  description: string;
  media: MediaConfig;
  buttonText: string;
  options?: { id: string; text: string; score: number }[];
  fields?: ('name' | 'email' | 'phone')[];
}

export interface Funnel {
  id: string;
  name: string;
  description: string;
  steps: FunnelStep[];
  status: 'draft' | 'published';
  views: number;
  conversions: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  funnelId: string;
  name: string;
  email: string;
  phone?: string;
  score: number;
  status: 'new' | 'contacted' | 'converted';
  createdAt: string;
  answers: Record<string, string>;
}

export interface AppTheme {
  colors: {
    primary: string;
    primarySoft: string;
    surface: string;
    border: string;
    bg: string;
    text: {
      title: string;
      body: string;
      muted: string;
    }
  }
}
