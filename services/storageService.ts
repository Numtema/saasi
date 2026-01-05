
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Funnel, Lead } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Initialisation sécurisée : on ne crée le client que si les clés sont présentes
let supabase: SupabaseClient | null = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn("Supabase : Clés manquantes (SUPABASE_URL/SUPABASE_ANON_KEY). Utilisation du stockage local en mode dégradé.");
  }
} catch (e) {
  console.error("Erreur d'initialisation Supabase:", e);
}

// Fallback LocalStorage pour assurer la fonctionnalité "AI Complet" sans configuration backend
const LS_KEYS = {
  FUNNELS: 'numtema_funnels_backup',
  LEADS: 'numtema_leads_backup',
  VIDEOS: 'numtema_videos_backup'
};

const ls = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data))
};

export const storageService = {
  // --- FUNNELS ---
  getFunnels: async (): Promise<Funnel[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) return data as Funnel[];
    }
    // Fallback
    return ls.get(LS_KEYS.FUNNELS);
  },
  
  saveFunnel: async (funnel: Partial<Funnel>) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('funnels')
        .upsert({
          ...funnel,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!error) return data as Funnel;
    }
    
    // Fallback LocalStorage
    const funnels = ls.get(LS_KEYS.FUNNELS);
    const existingIndex = funnels.findIndex((f: Funnel) => f.id === funnel.id);
    const newFunnel = { 
      ...funnel, 
      id: funnel.id || Math.random().toString(36).substr(2, 9),
      createdAt: funnel.createdAt || new Date().toISOString() 
    };
    
    if (existingIndex > -1) funnels[existingIndex] = newFunnel;
    else funnels.unshift(newFunnel);
    
    ls.set(LS_KEYS.FUNNELS, funnels);
    return newFunnel as Funnel;
  },

  deleteFunnel: async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('funnels').delete().eq('id', id);
      if (!error) return;
    }
    
    const funnels = ls.get(LS_KEYS.FUNNELS).filter((f: Funnel) => f.id !== id);
    ls.set(LS_KEYS.FUNNELS, funnels);
  },

  // --- LEADS ---
  getLeads: async (): Promise<Lead[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) return data as Lead[];
    }
    return ls.get(LS_KEYS.LEADS);
  },

  addLead: async (lead: Partial<Lead>) => {
    if (supabase) {
      const { data, error } = await supabase.from('leads').insert([lead]).select().single();
      if (!error) return data as Lead;
    }
    
    const leads = ls.get(LS_KEYS.LEADS);
    const newLead = { ...lead, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    leads.unshift(newLead);
    ls.set(LS_KEYS.LEADS, leads);
    return newLead as Lead;
  },

  // --- VIDEOS ---
  getVideos: async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('video_history')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) return data;
    }
    return ls.get(LS_KEYS.VIDEOS);
  },

  saveVideo: async (videoUrl: string, prompt: string) => {
    if (supabase) {
      const { error } = await supabase.from('video_history').insert([{ url: videoUrl, prompt }]);
      if (!error) return;
    }
    
    const videos = ls.get(LS_KEYS.VIDEOS);
    videos.unshift({ url: videoUrl, prompt, createdAt: new Date().toISOString() });
    ls.set(LS_KEYS.VIDEOS, videos);
  }
};
