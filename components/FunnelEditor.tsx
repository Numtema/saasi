
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Plus, Trash2, Video, 
  HelpCircle, MessageSquare, UserPlus, 
  Calendar, Sparkles, ChevronUp, ChevronDown,
  Eye, Loader2, Check, X, Image as ImageIcon, PlayCircle, Settings as SettingsIcon, Layout, ListChecks, Link, Globe, Share2, Film
} from 'lucide-react';
import { AppTheme, Funnel, FunnelStep, StepType, FunnelSettings, QuestionOption } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import FunnelPreview from './FunnelPreview';
import FunnelSettingsPanel from './FunnelSettingsPanel';

interface FunnelEditorProps {
  funnel: Funnel;
  theme: AppTheme;
  onBack: () => void;
}

const DEFAULT_SETTINGS: FunnelSettings = {
  scoring: {
    enabled: true,
    maxScore: 100,
    showSegment: true,
    segments: [
      { id: '1', label: 'Froid', min: 0, max: 30 },
      { id: '2', label: 'Tiède', min: 31, max: 70 },
      { id: '3', label: 'Chaud', min: 71, max: 100 }
    ]
  },
  integrations: { webhookUrl: '', calendarUrl: '' },
  pixels: { facebook: '', google: '', tiktok: '' },
  multiLanguage: { enabled: false, languages: ['fr'] },
  whatsapp: { enabled: false, number: '', message: '' },
  redirection: { type: 'none', value: '' },
  branding: { logoUrl: '' },
  socials: { facebook: '', instagram: '', linkedin: '' }
};

const FunnelEditor: React.FC<FunnelEditorProps> = ({ funnel: initialFunnel, theme, onBack }) => {
  // Ensure settings exists to prevent crashes
  const initialData = {
    ...initialFunnel,
    settings: initialFunnel.settings || DEFAULT_SETTINGS
  };
  
  const [funnel, setFunnel] = useState<Funnel>(initialData);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [activeSubTab, setActiveSubTab] = useState<'data' | 'media' | 'design'>('data');
  const [selectedStepId, setSelectedStepId] = useState<string>(initialData.steps[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState("");

  const activeStep = funnel.steps.find(s => s.id === selectedStepId);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await storageService.saveFunnel(funnel);
      setFunnel(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const newStatus = funnel.status === 'published' ? 'draft' : 'published';
    const updated = { ...funnel, status: newStatus as any };
    setFunnel(updated);
    await storageService.saveFunnel(updated);
    alert(newStatus === 'published' ? "Funnel mis en ligne !" : "Funnel retiré du public.");
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/share/${funnel.id}`;
    navigator.clipboard.writeText(url);
    alert("Lien copié dans le presse-papier !");
  };

  const updateStep = (id: string, updates: Partial<FunnelStep>) => {
    const newSteps = funnel.steps.map(s => s.id === id ? { ...s, ...updates } : s);
    setFunnel({ ...funnel, steps: newSteps });
  };

  const handleAddOption = () => {
    if (!activeStep) return;
    const newOption: QuestionOption = { id: Math.random().toString(36).substr(2, 5), text: 'Nouvelle option', score: 0 };
    updateStep(selectedStepId, { options: [...(activeStep.options || []), newOption] });
  };

  const handleGenerateMedia = async (type: 'image' | 'video') => {
    if (!activeStep) return;
    setIsAiLoading(type);
    try {
      if (type === 'image') {
        const url = await geminiService.generateImage(activeStep.description || activeStep.title);
        updateStep(selectedStepId, { media: { type: 'image', url } });
      } else {
        const url = await geminiService.generateVideo(activeStep.description || activeStep.title, setAiStatus);
        updateStep(selectedStepId, { media: { type: 'video', url } });
      }
    } catch (e) {
      alert("Erreur lors de la génération IA");
    } finally {
      setIsAiLoading(null);
      setAiStatus("");
    }
  };

  const handleEnhanceText = async (field: 'title' | 'description') => {
    if (!activeStep) return;
    setIsAiLoading(field);
    try {
      const enhanced = await geminiService.enhanceCopy(activeStep[field]);
      updateStep(selectedStepId, { [field]: enhanced || activeStep[field] });
    } finally {
      setIsAiLoading(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h2 className="text-[20px] font-bold text-[var(--text-title)]">{funnel.name}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${funnel.status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{funnel.status}</p>
            </div>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 ml-4">
             <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'content' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}><Layout size={14} /> Étapes</button>
             <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}><SettingsIcon size={14} /> Paramètres</button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={copyPublicLink} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"><Share2 size={18} /></button>
          <button onClick={() => setShowPreview(true)} className="px-5 py-2.5 rounded-xl border font-bold flex items-center gap-2 hover:bg-gray-50 transition-all text-xs"><Eye size={18} /> Aperçu</button>
          <button onClick={handlePublish} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-xs ${funnel.status === 'published' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {funnel.status === 'published' ? 'Dépublier' : 'Publier'}
          </button>
          <button onClick={handleSave} disabled={isSaving} className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-orange-100 ${saveSuccess ? 'bg-green-500 text-white' : 'bg-[var(--primary)] text-white hover:scale-[1.02]'}`}>
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
            {saveSuccess ? 'OK' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      {activeTab === 'content' ? (
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden animate-fade-in">
          {/* List of Steps */}
          <div className="w-80 bg-white border border-[var(--border-color)] rounded-[40px] flex flex-col p-6 shadow-sm overflow-hidden">
            <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6">Structure du Funnel</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {funnel.steps.map((step, index) => (
                <button key={step.id} onClick={() => setSelectedStepId(step.id)} className={`w-full text-left p-4 rounded-[20px] border transition-all flex items-center gap-4 ${selectedStepId === step.id ? 'border-[var(--primary)] bg-orange-50/50' : 'border-transparent hover:bg-gray-50'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedStepId === step.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {step.type === StepType.Question ? <HelpCircle size={18} /> : step.type === StepType.LeadCapture ? <UserPlus size={18} /> : <MessageSquare size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold truncate text-[var(--text-title)]">{step.title}</span>
                    <span className="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">{index + 1}. {step.type.replace('_', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t flex gap-2">
               <button className="flex-1 py-3 bg-gray-50 rounded-xl flex items-center justify-center text-[var(--primary)] hover:bg-orange-50 transition-all"><Plus size={20}/></button>
            </div>
          </div>

          {/* Step Editor Content */}
          {activeStep ? (
            <div className="flex-1 bg-white border border-[var(--border-color)] rounded-[40px] overflow-y-auto p-10 space-y-10 shadow-sm relative">
              {isAiLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-12">
                   <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-[var(--primary)] animate-bounce mb-4"><Sparkles size={32}/></div>
                   <h3 className="text-xl font-bold mb-2">L'IA est au travail...</h3>
                   <p className="text-gray-500 max-w-xs">{aiStatus || "Optimisation de votre contenu en cours"}</p>
                </div>
              )}

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-orange-50 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest">{activeStep.type}</span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="font-bold text-sm">Titre accrocheur</label><button onClick={() => handleEnhanceText('title')} className="text-[10px] font-black uppercase text-[var(--primary)] flex items-center gap-1 hover:underline"><Sparkles size={12} /> IA</button></div>
                    <input value={activeStep.title} onChange={(e) => updateStep(selectedStepId, { title: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-[16px] font-medium focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="font-bold text-sm">Contenu émotionnel / Script</label><button onClick={() => handleEnhanceText('description')} className="text-[10px] font-black uppercase text-[var(--primary)] flex items-center gap-1 hover:underline"><Sparkles size={12} /> IA</button></div>
                    <textarea value={activeStep.description} onChange={(e) => updateStep(selectedStepId, { description: e.target.value })} className="w-full h-32 p-4 bg-gray-50 border-none rounded-2xl text-[15px] focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all resize-none" />
                  </div>
                </div>

                <div className="flex gap-6 border-b">
                   {['data', 'media', 'design'].map((tab) => (
                     <button key={tab} onClick={() => setActiveSubTab(tab as any)} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-400'}`}>
                        {tab === 'data' ? 'Configuration' : tab}
                     </button>
                   ))}
                </div>

                <div className="py-4 animate-fade-in">
                   {activeSubTab === 'data' && (
                     <div className="space-y-8">
                        {activeStep.type === StepType.Question && (
                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm flex items-center gap-2"><ListChecks size={18}/> Options de réponse</h4>
                                <button onClick={handleAddOption} className="text-[10px] font-black uppercase text-[var(--primary)] hover:underline">+ Ajouter</button>
                             </div>
                             <div className="space-y-2">
                                {activeStep.options?.map((opt) => (
                                  <div key={opt.id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                                     <input type="text" value={opt.text} className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium" />
                                     <div className="flex items-center gap-2 pr-2 border-r">
                                        <span className="text-[9px] font-black text-gray-400">SCORE</span>
                                        <input type="number" value={opt.score} className="w-8 bg-transparent text-center font-bold text-xs" />
                                     </div>
                                     <button className="text-gray-300 hover:text-red-500"><X size={14}/></button>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}

                        {activeStep.type === StepType.LeadCapture && (
                          <div className="space-y-4">
                             <h4 className="font-bold text-sm flex items-center gap-2"><UserPlus size={18}/> Champs du formulaire</h4>
                             <div className="grid grid-cols-3 gap-3">
                                {['Prénom', 'Email', 'Téléphone'].map(f => (
                                  <div key={f} className="p-4 rounded-2xl border flex items-center justify-between bg-white shadow-sm">
                                    <span className="text-xs font-bold">{f}</span>
                                    <input type="checkbox" defaultChecked={true} className="rounded text-[#FF4D00]" />
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}

                        <div className="space-y-2">
                           <label className="font-bold text-sm">Texte du bouton principal</label>
                           <input value={activeStep.buttonText} onChange={(e) => updateStep(selectedStepId, { buttonText: e.target.value })} className="w-full p-4 bg-gray-50 rounded-2xl font-bold" />
                        </div>
                     </div>
                   )}

                   {activeSubTab === 'media' && (
                     <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <button onClick={() => handleGenerateMedia('image')} className="p-8 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-orange-500 hover:bg-orange-50 transition-all group">
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors"><ImageIcon size={24}/></div>
                              <div className="text-center">
                                <p className="font-bold text-sm">Générer Image AI</p>
                                <p className="text-[10px] text-gray-400 font-medium">Gemini 2.5 Flash Image</p>
                              </div>
                           </button>
                           <button onClick={() => handleGenerateMedia('video')} className="p-8 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-orange-500 hover:bg-orange-50 transition-all group">
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors"><Film size={24}/></div>
                              <div className="text-center">
                                <p className="font-bold text-sm">Générer Vidéo AI</p>
                                <p className="text-[10px] text-gray-400 font-medium">Veo 3.1 Studio Engine</p>
                              </div>
                           </button>
                        </div>

                        {activeStep.media?.url && (
                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                               <h4 className="font-bold text-sm">Média actuel</h4>
                               <button onClick={() => updateStep(selectedStepId, { media: { type: 'none', url: '' } })} className="text-red-500 font-bold text-xs">Supprimer</button>
                             </div>
                             <div className="rounded-[32px] overflow-hidden bg-black aspect-video shadow-2xl relative group">
                                {activeStep.media.type === 'video' ? (
                                  <video src={activeStep.media.url} controls className="w-full h-full object-cover" />
                                ) : (
                                  <img src={activeStep.media.url} alt="" className="w-full h-full object-cover" />
                                )}
                             </div>
                          </div>
                        )}
                     </div>
                   )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white border border-dashed rounded-[40px]">
              <Sparkles size={48} className="opacity-10 mb-4" />
              <p className="font-medium">Sélectionnez une étape pour commencer l'édition magique.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 bg-white border border-[var(--border-color)] rounded-[40px] overflow-y-auto p-10 shadow-sm">
          <FunnelSettingsPanel 
            settings={funnel.settings} 
            onChange={(updates) => setFunnel(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }))} 
          />
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fade-in">
           <button onClick={() => setShowPreview(false)} className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 z-[110]"><X size={24} /></button>
           <div className="w-full h-full max-w-6xl bg-white rounded-[40px] overflow-hidden shadow-2xl relative">
              <FunnelPreview steps={funnel.steps} onClose={() => setShowPreview(false)} />
           </div>
        </div>
      )}
    </div>
  );
};

export default FunnelEditor;