
import React from 'react';
import { 
  Target, Zap, Globe, MessageCircle, Link, 
  Instagram, Facebook, Linkedin, Code, 
  Settings, CheckCircle2, Copy, AlertCircle,
  Hash, Languages, MousePointer2, Share2, Image as ImageIcon
} from 'lucide-react';
import { FunnelSettings } from '../types';

interface FunnelSettingsPanelProps {
  settings: FunnelSettings;
  onChange: (updates: Partial<FunnelSettings>) => void;
}

const FunnelSettingsPanel: React.FC<FunnelSettingsPanelProps> = ({ settings, onChange }) => {
  const updateNested = (key: keyof FunnelSettings, value: any) => {
    onChange({ [key]: { ...(settings[key] as any), ...value } });
  };

  const sectionHeader = (icon: React.ReactNode, title: string, subtitle?: string) => (
    <div className="flex items-center gap-3 border-b pb-4 mb-6">
      <div className="p-2 bg-orange-100 text-[#FF4D00] rounded-lg">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
      </div>
    </div>
  );

  const inputClass = "w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#FF4D00] focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all text-sm";
  const labelClass = "text-[11px] font-black uppercase text-gray-400 tracking-wider mb-2 block";

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* Scoring & Routing */}
      <section>
        {sectionHeader(<Target size={20}/>, "Scoring & Routing", "Segmentez vos leads selon leurs réponses")}
        <div className="bg-white border rounded-[32px] p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div>
              <p className="font-bold text-sm text-orange-900">Routing Avancé par Score</p>
              <p className="text-xs text-orange-700">Activez le calcul automatique du score prospect.</p>
            </div>
            <button 
              onClick={() => updateNested('scoring', { enabled: !settings.scoring.enabled })}
              className={`w-12 h-6 rounded-full relative transition-all ${settings.scoring.enabled ? 'bg-[#FF4D00]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.scoring.enabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Score maximum possible</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={settings.scoring.maxScore}
                  onChange={(e) => updateNested('scoring', { maxScore: parseInt(e.target.value) })}
                  className={inputClass}
                />
                <span className="font-bold text-gray-400">points</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Segments actifs</label>
              <div className="flex flex-wrap gap-2">
                {['Froid', 'Tiède', 'Chaud'].map(label => (
                  <span key={label} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-600 border border-transparent hover:border-[#FF4D00] cursor-pointer transition-all">
                    {label}
                  </span>
                ))}
                <button className="px-4 py-2 border-2 border-dashed rounded-xl text-xs font-bold text-gray-400 hover:text-[#FF4D00] hover:border-[#FF4D00] transition-all">
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Marketing */}
      <section>
        {sectionHeader(<MessageCircle size={20}/>, "WhatsApp Marketing", "Créez une connexion directe via mobile")}
        <div className="bg-white border rounded-[32px] p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-sm">Activer WhatsApp</p>
            <button 
              onClick={() => updateNested('whatsapp', { enabled: !settings.whatsapp.enabled })}
              className={`w-12 h-6 rounded-full relative transition-all ${settings.whatsapp.enabled ? 'bg-[#FF4D00]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.whatsapp.enabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Numéro WhatsApp</label>
              <input 
                type="text" 
                placeholder="33612345678"
                value={settings.whatsapp.number}
                onChange={(e) => updateNested('whatsapp', { number: e.target.value })}
                className={inputClass}
              />
              <p className="text-[10px] text-gray-400 italic">Format international sans + (ex: 33649653186)</p>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Message pré-rempli</label>
              <textarea 
                value={settings.whatsapp.message}
                onChange={(e) => updateNested('whatsapp', { message: e.target.value })}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Bonjour, je souhaite plus d'informations..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Pixels */}
      <section>
        {sectionHeader(<Code size={20}/>, "Tracking Pixels", "Suivez vos conversions publicitaires")}
        <div className="bg-white border rounded-[32px] p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Facebook Pixel</label>
              <input 
                type="text" 
                placeholder="ID Pixel"
                value={settings.pixels.facebook}
                onChange={(e) => updateNested('pixels', { facebook: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>GA4 ID</label>
              <input 
                type="text" 
                placeholder="G-XXXXXXXX"
                value={settings.pixels.google}
                onChange={(e) => updateNested('pixels', { google: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>TikTok Pixel</label>
              <input 
                type="text" 
                placeholder="ID Pixel"
                value={settings.pixels.tiktok}
                onChange={(e) => updateNested('pixels', { tiktok: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Les scripts sont injectés automatiquement. Compatible RGPD : les pixels ne sont chargés qu'après consentement utilisateur.
            </p>
          </div>
        </div>
      </section>

      {/* Intégrations & Webhooks */}
      <section>
        {sectionHeader(<Zap size={20}/>, "Intégrations", "Connectez votre funnel à votre stack technique")}
        <div className="bg-white border rounded-[32px] p-8 shadow-sm space-y-8">
          <div className="space-y-2">
            <label className={labelClass}>URL du Webhook (Zapier / Make)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://hooks.zapier.com/..."
                value={settings.integrations.webhookUrl}
                onChange={(e) => updateNested('integrations', { webhookUrl: e.target.value })}
                className={inputClass}
              />
              <button className="px-6 bg-gray-100 rounded-2xl font-bold text-xs hover:bg-gray-200 transition-colors">Test</button>
            </div>
          </div>
          <div className="space-y-4">
            <label className={labelClass}>Format du payload</label>
            <div className="bg-gray-900 rounded-2xl p-6 relative group">
              <pre className="text-xs text-gray-400 font-mono overflow-x-auto">
{`{
  "event": "lead_captured",
  "funnel_id": "4a23d209-be41-4a62-b27f-e51202dcb11d",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "score": 75,
    "segment": { "label": "Lead Chaud" }
  }
}`}
              </pre>
              <button className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Redirection & Branding */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {sectionHeader(<MousePointer2 size={20}/>, "Redirection de fin")}
          <div className="bg-white border rounded-[32px] p-8 shadow-sm space-y-6">
            <div className="flex gap-2">
              {['URL', 'WhatsApp', 'None'].map(type => (
                <button 
                  key={type}
                  onClick={() => updateNested('redirection', { type: type.toLowerCase() })}
                  className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${
                    settings.redirection.type === type.toLowerCase() ? 'border-[#FF4D00] bg-orange-50 text-[#FF4D00]' : 'bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              placeholder={settings.redirection.type === 'whatsapp' ? "+33612345678" : "https://mon-site.com/merci"}
              value={settings.redirection.value}
              onChange={(e) => updateNested('redirection', { value: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          {sectionHeader(<ImageIcon size={20}/>, "Personnalisation")}
          <div className="bg-white border rounded-[32px] p-8 shadow-sm space-y-6">
             <div className="space-y-2">
               <label className={labelClass}>Logo de l'entreprise (URL)</label>
               <input 
                 type="text" 
                 placeholder="https://..."
                 value={settings.branding.logoUrl}
                 onChange={(e) => updateNested('branding', { logoUrl: e.target.value })}
                 className={inputClass}
               />
               <p className="text-[10px] text-gray-400 italic">Le logo s'affichera en haut du funnel</p>
             </div>
          </div>
        </div>
      </section>

      {/* Social Networks */}
      <section>
        {sectionHeader(<Share2 size={20}/>, "Réseaux Sociaux")}
        <div className="bg-white border rounded-[32px] p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={labelClass}><Facebook size={12} className="inline mr-1"/> Facebook</label>
              <input 
                type="text" 
                placeholder="https://facebook.com/..."
                value={settings.socials.facebook}
                onChange={(e) => updateNested('socials', { facebook: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}><Instagram size={12} className="inline mr-1"/> Instagram</label>
              <input 
                type="text" 
                placeholder="https://instagram.com/..."
                value={settings.socials.instagram}
                onChange={(e) => updateNested('socials', { instagram: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}><Linkedin size={12} className="inline mr-1"/> LinkedIn</label>
              <input 
                type="text" 
                placeholder="https://linkedin.com/..."
                value={settings.socials.linkedin}
                onChange={(e) => updateNested('socials', { linkedin: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Multi-langue */}
      <section>
        {sectionHeader(<Languages size={20}/>, "Multi-langue")}
        <div className="bg-white border rounded-[32px] p-8 shadow-sm flex items-center justify-between">
           <div>
             <p className="font-bold text-sm">Activer le multi-langue</p>
             <p className="text-xs text-gray-400">Proposez votre funnel dans plusieurs langues.</p>
           </div>
           <button 
              onClick={() => updateNested('multiLanguage', { enabled: !settings.multiLanguage.enabled })}
              className={`w-12 h-6 rounded-full relative transition-all ${settings.multiLanguage.enabled ? 'bg-[#FF4D00]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.multiLanguage.enabled ? 'right-1' : 'left-1'}`} />
            </button>
        </div>
      </section>
    </div>
  );
};

export default FunnelSettingsPanel;
