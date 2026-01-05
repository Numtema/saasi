
import React from 'react';
import { User, Bell, Lock, Globe, Shield, CreditCard, Save, Smartphone } from 'lucide-react';
import { AppTheme } from '../types';

interface SettingsViewProps {
  theme: AppTheme;
}

const SettingsView: React.FC<SettingsViewProps> = ({ theme }) => {
  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h2 className="text-[28px] font-bold text-[var(--text-title)]">Paramètres du compte</h2>
        <p className="text-[14px] text-[var(--text-muted)]">Gérez votre profil d'agent Nümtema et vos préférences d'automatisation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-1">
          {[
            { id: 'profile', label: 'Profil', icon: <User size={18} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
            { id: 'security', label: 'Sécurité', icon: <Lock size={18} /> },
            { id: 'billing', label: 'Facturation', icon: <CreditCard size={18} /> },
            { id: 'integrations', label: 'Intégrations', icon: <Globe size={18} /> },
          ].map((item, i) => (
            <button 
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                i === 0 ? 'bg-[var(--primary-soft)] text-[var(--primary)]' : 'text-[var(--text-body)] hover:bg-white hover:shadow-sm'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-[var(--border-color)] rounded-[32px] p-8 space-y-8">
            <section className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <User size={20} className="text-[var(--primary)]" /> Informations personnelles
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Prénom</label>
                  <input type="text" defaultValue="Admin" className="w-full p-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Nom</label>
                  <input type="text" defaultValue="Team" className="w-full p-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Email professionnel</label>
                <input type="email" defaultValue="admin@numtema-face.ai" className="w-full p-3 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all" />
              </div>
            </section>

            <section className="space-y-6 pt-8 border-t">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Smartphone size={20} className="text-[var(--primary)]" /> Préférences AI
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-sm">Mode "Thinking" par défaut</p>
                  <p className="text-xs text-[var(--text-muted)]">Utilise plus de jetons pour une réflexion stratégique approfondie.</p>
                </div>
                <div className="w-12 h-6 bg-[var(--primary)] rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-sm">Transcription automatique des Leads</p>
                  <p className="text-xs text-[var(--text-muted)]">Génère un résumé textuel des réponses vidéo des prospects.</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </section>

            <div className="pt-6 flex justify-end">
               <button className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-lg transition-all">
                  <Save size={18} /> Enregistrer les modifications
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
