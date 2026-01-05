
import React from 'react';
import { 
  Target, Zap, Globe, MessageCircle, Link, 
  Instagram, Facebook, Linkedin, Code, 
  Settings, CheckCircle2, Copy, AlertCircle,
  Hash, Languages, MousePointer2, Share2, Image as ImageIcon, Plus, Trash2, Smartphone
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
    <div className="flex items-center gap-3 border-b pb-4 mb-8">
      <div className="p-3 bg-orange-100 text-[#FF4D00] rounded-2xl">{icon}</div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">{subtitle}</p>}
      </div>
    </div>
  );

  const cardClass = "bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow mb-10";
  const inputClass = "w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#FF4D00] focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all text-sm font-medium";
  const labelClass = "text-[11px] font-black uppercase text-gray-400 tracking-wider mb-2 block";

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      
      {/* Scoring & Routing */}
      <section>
        {sectionHeader(<Target size={24}/>, "Scoring & Routing", "Routing Avancé par Score")}
        <div className={cardClass}>
           <div className="flex items-center justify-between p-5 bg-orange-50 rounded-3xl border border-orange-100 mb-8">
              <div>
                 <p className="font-bold text-[15px] text-orange-900">Segmentez vos leads selon leurs réponses</p>
                 <p className="text-xs text-orange-700 opacity-80">Le score maximum est calculé automatiquement.</p>
              </div>
              <button 
                onClick={() => updateNested('scoring', { enabled: !settings.scoring.enabled })}
                className={`w-14 h-8 rounded-full relative transition-all ${settings.scoring.enabled ? 'bg-[#FF4D00]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${settings.scoring.enabled ? 'right-1' : 'left-1'}`} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <label className={labelClass}>Score maximum possible</label>
                 <div className="flex items-center gap-4">
                    <input type="number" value={settings.scoring.maxScore} onChange={(e) => updateNested('scoring', { maxScore: parseInt(e.target.value) })} className={inputClass} />
                    <span className="font-black text-gray-300">PTS</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="checkbox" checked={settings.scoring.showSegment} onChange={(e) => updateNested('scoring', { showSegment: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-[#FF4D00] focus:ring-[#FF4D00]" />
                    <span className="text-sm font-bold text-gray-600">Afficher le segment au visiteur</span>
                 </div>
              </div>
              <div className="space-y-6">
                 <label className={labelClass}>Modèles prédéfinis de segments</label>
                 <div className="grid grid-cols-2 gap-3">
                    {['Débutant / Expert', 'Froid / Chaud', 'Bronze / Or', 'Standard / Premium'].map(m => (
                      <button key={m} className="p-3 text-[11px] font-bold border rounded-xl hover:border-[#FF4D00] hover:text-[#FF4D00] transition-all bg-white">{m}</button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="mt-10 pt-8 border-t">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Segments ({settings.scoring.segments.length})</h4>
                 <button className="text-[var(--primary)] font-bold text-xs flex items-center gap-1 hover:underline"><Plus size={14}/> Ajouter un segment</button>
              </div>
              <div className="space-y-3">
                 {settings.scoring.segments.map(seg => (
                   <div key={seg.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-orange-200 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-orange-500 shadow-sm">{seg.min}-{seg.max}</div>
                      <input type="text" value={seg.label} className="flex-1 bg-transparent border-none font-bold text-sm focus:ring-0" />
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Intégrations & Webhooks */}
      <section>
        {sectionHeader(<Zap size={24}/>, "Intégrations & Webhooks", "Connectez votre funnel à votre stack")}
        <div className={cardClass}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className={labelClass}>URL du Webhook</label>
                    <div className="flex gap-2">
                       <input type="text" placeholder="https://hooks.zapier.com/..." value={settings.integrations.webhookUrl} onChange={(e) => updateNested('integrations', { webhookUrl: e.target.value })} className={inputClass} />
                       <button className="px-6 bg-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors">Test</button>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold italic">Les données seront envoyées à chaque capture de lead.</p>
                 </div>
                 <div className="space-y-2">
                    <label className={labelClass}>Lien Calendrier (Calendly/Cal.com)</label>
                    <input type="text" placeholder="https://calendly.com/..." value={settings.integrations.calendarUrl} onChange={(e) => updateNested('integrations', { calendarUrl: e.target.value })} className={inputClass} />
                 </div>
              </div>
              <div className="space-y-4">
                 <label className={labelClass}>Format du Payload JSON</label>
                 <div className="bg-gray-900 rounded-3xl p-6 relative group overflow-hidden">
                    <pre className="text-[11px] text-orange-400 font-mono leading-relaxed">
{`{
  "event": "lead_captured",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "score": 75,
    "segment": { "label": "Chaud" }
  }
}`}
                    </pre>
                    <button className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={14}/></button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Tracking Pixels */}
      <section>
        {sectionHeader(<Code size={24}/>, "Tracking Pixels", "Meta Ads, Google & TikTok")}
        <div className={cardClass}>
           <p className="text-sm text-gray-500 mb-8 leading-relaxed">Les scripts de tracking sont injectés automatiquement. Ils permettent de suivre vos conversions et optimiser vos campagnes publicitaires de manière RGPD-friendly.</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                 <label className={labelClass}><Facebook size={12} className="inline mr-1"/> Facebook Pixel</label>
                 <input type="text" placeholder="ID Pixel" value={settings.pixels.facebook} onChange={(e) => updateNested('pixels', { facebook: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-2">
                 <label className={labelClass}><Globe size={12} className="inline mr-1"/> Google Analytics 4</label>
                 <input type="text" placeholder="G-XXXXXXXX" value={settings.pixels.google} onChange={(e) => updateNested('pixels', { google: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-2">
                 <label className={labelClass}><Smartphone size={12} className="inline mr-1"/> TikTok Pixel</label>
                 <input type="text" placeholder="ID Pixel" value={settings.pixels.tiktok} onChange={(e) => updateNested('pixels', { tiktok: e.target.value })} className={inputClass} />
              </div>
           </div>
        </div>
      </section>

      {/* WhatsApp Marketing */}
      <section>
        {sectionHeader(<MessageCircle size={24}/>, "WhatsApp Marketing", "Activation Directe Mobile")}
        <div className={cardClass}>
           <div className="flex items-center justify-between mb-8 pb-8 border-b">
              <div>
                <p className="font-bold text-gray-900">Activer le bouton WhatsApp de fin</p>
                <p className="text-xs text-gray-400 font-medium">Permet aux leads de vous contacter en un clic après le funnel.</p>
              </div>
              <button onClick={() => updateNested('whatsapp', { enabled: !settings.whatsapp.enabled })} className={`w-14 h-8 rounded-full relative transition-all ${settings.whatsapp.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${settings.whatsapp.enabled ? 'right-1' : 'left-1'}`} />
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                 <label className={labelClass}>Numéro WhatsApp</label>
                 <input type="text" placeholder="+336..." value={settings.whatsapp.number} onChange={(e) => updateNested('whatsapp', { number: e.target.value })} className={inputClass} />
                 <p className="text-[10px] text-gray-400 font-bold italic">Format international (ex: 33649653186)</p>
              </div>
              <div className="space-y-2">
                 <label className={labelClass}>Message pré-rempli</label>
                 <textarea value={settings.whatsapp.message} onChange={(e) => updateNested('whatsapp', { message: e.target.value })} className={`${inputClass} h-24 resize-none`} placeholder="Bonjour, je souhaite..." />
              </div>
           </div>
        </div>
      </section>

      {/* Personnalisation & Réseaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <section>
            {sectionHeader(<ImageIcon size={24}/>, "Branding", "Logo & Identité")}
            <div className={cardClass}>
               <div className="space-y-2">
                  <label className={labelClass}>Logo de l'entreprise (URL)</label>
                  <input type="text" placeholder="https://..." value={settings.branding.logoUrl} onChange={(e) => updateNested('branding', { logoUrl: e.target.value })} className={inputClass} />
                  <p className="text-[10px] text-gray-400 font-bold italic mt-2">Le logo s'affichera en haut de chaque étape du funnel.</p>
               </div>
            </div>
         </section>
         <section>
            {sectionHeader(<Share2 size={24}/>, "Réseaux Sociaux", "Liens Publics")}
            <div className={cardClass}>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <Facebook size={16} className="text-blue-600 shrink-0"/>
                     <input type="text" placeholder="Lien Facebook" value={settings.socials.facebook} onChange={(e) => updateNested('socials', { facebook: e.target.value })} className={inputClass} />
                  </div>
                  <div className="flex items-center gap-3">
                     <Instagram size={16} className="text-pink-600 shrink-0"/>
                     <input type="text" placeholder="Lien Instagram" value={settings.socials.instagram} onChange={(e) => updateNested('socials', { instagram: e.target.value })} className={inputClass} />
                  </div>
                  <div className="flex items-center gap-3">
                     <Linkedin size={16} className="text-blue-800 shrink-0"/>
                     <input type="text" placeholder="Lien LinkedIn" value={settings.socials.linkedin} onChange={(e) => updateNested('socials', { linkedin: e.target.value })} className={inputClass} />
                  </div>
               </div>
            </div>
         </section>
      </div>

    </div>
  );
};

export default FunnelSettingsPanel;
