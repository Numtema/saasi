
import React, { useState } from 'react';
import { 
  User, Bell, Lock, Globe, Shield, CreditCard, Save, 
  Smartphone, Zap, Puzzle, MessageSquare, Check, ExternalLink 
} from 'lucide-react';
import { AppTheme } from '../types';

interface SettingsViewProps {
  theme: AppTheme;
}

type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing' | 'integrations';

const SettingsView: React.FC<SettingsViewProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const navItems = [
    { id: 'profile', label: 'Profil', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Sécurité', icon: <Lock size={18} /> },
    { id: 'billing', label: 'Facturation', icon: <CreditCard size={18} /> },
    { id: 'integrations', label: 'Intégrations', icon: <Zap size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8 animate-fade-in">
            <section className="space-y-6">
              <h3 className="font-bold text-lg">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Prénom</label>
                  <input type="text" defaultValue="Admin" className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[var(--primary)] focus:outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Nom</label>
                  <input type="text" defaultValue="Team" className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[var(--primary)] focus:outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Email professionnel</label>
                <input type="email" defaultValue="admin@numtema-face.ai" className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[var(--primary)] focus:outline-none transition-all" />
              </div>
            </section>
            <section className="space-y-6 pt-8 border-t">
              <h3 className="font-bold text-lg">Préférences AI</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-sm text-[var(--text-title)]">Mode "Thinking" stratégique</p>
                    <p className="text-xs text-[var(--text-muted)]">Plus lent mais analyse psychologique plus profonde.</p>
                  </div>
                  <div className="w-12 h-6 bg-[var(--primary)] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-8 animate-fade-in">
            <h3 className="font-bold text-lg">Connectez vos outils</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Zapier', desc: 'Automatisez vos flux de travail', icon: 'https://cdn.worldvectorlogo.com/logos/zapier.svg', connected: true },
                { name: 'Make.com', desc: 'Intégrations visuelles complexes', icon: 'https://www.make.com/favicon.ico', connected: false },
                { name: 'Slack', desc: 'Alertes de leads en temps réel', icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', connected: false },
                { name: 'GoHighLevel', desc: 'CRM de vente tout-en-un', icon: 'https://v2.gohighlevel.com/favicon.ico', connected: false },
              ].map((app) => (
                <div key={app.name} className="flex items-center justify-between p-6 bg-white border rounded-2xl hover:border-[var(--primary)] transition-all group">
                  <div className="flex items-center gap-4">
                    <img src={app.icon} alt={app.name} className="w-10 h-10 object-contain rounded-lg" />
                    <div>
                      <p className="font-bold text-[var(--text-title)]">{app.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{app.desc}</p>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    app.connected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-[var(--primary)] hover:text-white'
                  }`}>
                    {app.connected ? 'Connecté' : 'Connecter'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-8 animate-fade-in">
            <h3 className="font-bold text-lg">Plan et Facturation</h3>
            <div className="p-8 bg-gradient-to-br from-[var(--primary)] to-orange-600 rounded-[32px] text-white shadow-xl shadow-orange-100 relative overflow-hidden">
               <div className="relative z-10">
                 <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Plan Actuel</p>
                 <h4 className="text-3xl font-bold mb-6">Agent Pro Unlimited</h4>
                 <div className="flex items-center gap-6 text-sm font-medium">
                    <div className="flex items-center gap-2"><Check size={16}/> Leads illimités</div>
                    <div className="flex items-center gap-2"><Check size={16}/> 100min Veo/mois</div>
                 </div>
               </div>
               <Zap className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Mode de paiement</h4>
              <div className="flex items-center justify-between p-4 border rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold italic text-blue-800">VISA</div>
                    <span className="text-sm font-bold">**** **** **** 4242</span>
                 </div>
                 <button className="text-xs font-bold text-[var(--primary)] hover:underline">Modifier</button>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8 animate-fade-in">
            <h3 className="font-bold text-lg">Sécurité du compte</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Nouveau mot de passe</label>
                <input type="password" placeholder="Min. 12 caractères" className="w-full p-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[var(--primary)]" />
              </div>
              <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-red-700 text-sm">Zone de danger</p>
                  <p className="text-xs text-red-500">Supprimer définitivement votre compte et vos données.</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all">Supprimer</button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8 animate-fade-in">
            <h3 className="font-bold text-lg">Alertes et Rapports</h3>
            <div className="space-y-4">
               {[
                 { label: 'Nouveau Lead capturé', desc: 'Recevoir un push immédiat' },
                 { label: 'Rapport Hebdomadaire', desc: 'Résumé des stats par email' },
                 { label: 'Alertes Quota AI', desc: 'Quand vous atteignez 80% des crédits' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                    <div>
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 ${i === 2 ? 'bg-gray-200' : 'bg-[var(--primary)]'} rounded-full relative cursor-pointer`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${i === 2 ? 'left-1' : 'right-1'}`}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h2 className="text-[28px] font-bold text-[var(--text-title)]">Configuration</h2>
        <p className="text-[14px] text-[var(--text-muted)]">Gérez votre écosystème Lead Generation Machine.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === item.id 
                    ? 'bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm' 
                    : 'text-[var(--text-body)] hover:bg-white hover:shadow-sm'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <div className="bg-white border border-[var(--border-color)] rounded-[40px] p-8 md:p-12 shadow-sm min-h-[600px] flex flex-col">
            <div className="flex-1">
              {renderTabContent()}
            </div>
            
            <div className="pt-10 mt-10 border-t flex justify-end gap-4">
               <button className="px-6 py-3 rounded-xl text-sm font-bold text-[var(--text-body)] hover:bg-gray-50">Annuler</button>
               <button className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-orange-100">
                  <Save size={18} /> Enregistrer
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
