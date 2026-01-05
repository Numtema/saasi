
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

export interface QuestionOption {
  id: string;
  text: string;
  score: number;
}

export interface FunnelStep {
  id: string;
  type: StepType;
  title: string;
  description: string;
  media: MediaConfig;
  buttonText: string;
  options?: QuestionOption[];
  fields?: ('name' | 'email' | 'phone')[];
}

export interface ScoringSegment {
  id: string;
  label: string;
  min: number;
  max: number;
}

export interface FunnelSettings {
  scoring: {
    enabled: boolean;
    maxScore: number;
    showSegment: boolean;
    segments: ScoringSegment[];
  };
  integrations: {
    webhookUrl: string;
    calendarUrl: string;
  };
  pixels: {
    facebook: string;
    google: string;
    tiktok: string;
  };
  multiLanguage: {
    enabled: boolean;
    languages: string[];
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    message: string;
  };
  redirection: {
    type: 'url' | 'whatsapp' | 'none';
    value: string;
  };
  branding: {
    logoUrl: string;
  };
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
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
  settings: FunnelSettings;
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
