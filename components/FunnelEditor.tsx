
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Plus, Trash2, Video, 
  HelpCircle, MessageSquare, UserPlus, 
  Calendar as CalendarIcon, Sparkles, ChevronUp, ChevronDown,
  Eye, Loader2, Check, X, Image as ImageIcon, PlayCircle, Settings as SettingsIcon, Layout, ListChecks, Link, Globe, Share2, Film, Home, Type
} from 'lucide-react';
import { AppTheme, Funnel, FunnelStep, StepType, FunnelSettings } from '../types';
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
  scoring: { enabled: true, maxScore: 100, showSegment: true, segments: [] },
  integrations: { webhookUrl: '', calendarUrl: '' },
  pixels: { facebook: '', google: '', tiktok: '' },
  multiLanguage: { enabled: false, languages: ['fr'] },
  whatsapp: { enabled: false, number: '', message: '' },
  redirection: { type: 'none', value: '' },
  branding: { logoUrl: '' },
  socials: { facebook: '', instagram: '', linkedin: '' }
};

const FunnelEditor: React.FC<FunnelEditorProps> = ({ funnel: initialFunnel, theme, onBack }) => {
  const [funnel, setFunnel] = useState<Funnel>({
    ...initialFunnel,
    settings: initialFunnel.settings || DEFAULT_SETTINGS
  });
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [activeSubTab, setActiveSubTab] = useState<'data' | 'media'>('data');
  const [selectedStepId, setSelectedStepId] = useState<string>(initialFunnel.steps[0]?.id || '');
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

  const handleAddStep = (type: StepType) => {
    const newStep: FunnelStep = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type === StepType.Welcome ? 'Bienvenue' : 'Nouvelle Étape',
      description: 'Ceci est votre nouveau contenu stratégique...',
      buttonText: 'Continuer',
      media: { type: 'none', url: '' },
      options: type === StepType.Question ? [{ id: 'opt1', text: 'Option 1', score: 10 }] : [],
      fields: type === StepType.LeadCapture ? ['name', 'email'] : []
    };
    setFunnel({ ...funnel, steps: [...funnel.steps, newStep] });
    setSelectedStepId(newStep.id);
  };

  const handleDeleteStep = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (funnel.steps.length <= 1) return;
    const newSteps = funnel.steps.filter(s => s.id !== id);
    setFunnel({ ...funnel, steps: newSteps });
    if (selectedStepId === id) setSelectedStepId(newSteps[0].id);
  };

  const moveStep = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const newSteps = [...funnel.steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setFunnel({ ...funnel, steps: newSteps });
  };

  const updateStep = (id: string, updates: Partial<FunnelStep>) => {
    setFunnel(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const handleAiAction = async (action: 'image' | 'video' | 'text') => {
    if (!activeStep) return;
    setIsAiLoading(action);
    try {
      if (action === 'image') {
        const url = await geminiService.generateImage(activeStep.description || activeStep.title);
        updateStep(selectedStepId, { media: { type: 'image', url } });
      } else if (action === 'video') {
        const url = await geminiService.generateVideo(activeStep.description || activeStep.title, setAiStatus);
        updateStep(selectedStepId, { media: { type: 'video', url } });
      } else {
        const enhanced = await geminiService.enhanceCopy(activeStep.description);
        updateStep(selectedStepId, { description: enhanced });
      }
    } catch (e) {
      alert("IA Error : " + (e as Error).message);
    } finally {
      setIsAiLoading(null);
      setAiStatus("");
    }
  };

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case StepType.Welcome: return <Home size={16} />;
      case StepType.Question: return <HelpCircle size={16} />;
      case StepType.LeadCapture: return <UserPlus size={16} />;
      case StepType.Calendar: return <CalendarIcon size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-xl text-[var(--text-title)] transition-colors"><ArrowLeft size={20} /></button>
          <div className="min-w-0">
            <h2 className="text-[20px] font-bold text-[var(--text-title)] truncate">{funnel.name}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${funnel.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{funnel.status}</p>
            </div>
          </div>
          <div className="hidden lg:flex bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-color)] ml-4">
             <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'content' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'}`}><Layout size={14} /> Étapes</button>
             <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'}`}><SettingsIcon size={14} /> Paramètres</button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(true)} className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] font-bold flex items-center gap-2 hover:bg-[var(--bg-surface)] transition-all text-xs text-[var(--text-title)]"><Eye size={18} /> Aperçu</button>
          <button onClick={handleSave} disabled={isSaving} className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-orange-900/10 ${saveSuccess ? 'bg-green-500 text-white' : 'bg-[var(--primary)] text-white hover:scale-[1.02]'}`}>
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
            {saveSuccess ? 'OK' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      {activeTab === 'content' ? (
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden animate-fade-in">
          {/* STRUCTURE SIDEBAR */}
          <div className="w-80 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[40px] flex flex-col p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Structure Funnel</h3>
              <div className="flex gap-1">
                 <button onClick={() => handleAddStep(StepType.Question)} className="p-2 hover:bg-[var(--primary-soft)] text-[var(--primary)] rounded-lg" title="Ajouter Question"><HelpCircle size={14}/></button>
                 <button onClick={() => handleAddStep(StepType.Calendar)} className="p-2 hover:bg-[var(--primary-soft)] text-[var(--primary)] rounded-lg" title="Ajouter Calendrier"><CalendarIcon size={14}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {funnel.steps.map((step, index) => (
                <div 
                  key={step.id} 
                  onClick={() => setSelectedStepId(step.id)}
                  className={`group w-full text-left p-4 rounded-[24px] border transition-all cursor-pointer relative ${selectedStepId === step.id ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-transparent hover:bg-black/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selectedStepId === step.id ? 'bg-[var(--primary)] text-white' : 'bg-black/10 text-[var(--text-muted)]'}`}>
                      {getStepIcon(step.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`block text-[13px] font-bold truncate ${selectedStepId === step.id ? 'text-[var(--primary)]' : 'text-[var(--text-title)]'}`}>{step.title}</span>
                      <span className="block text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest">{step.type}</span>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                       <button onClick={(e) => moveStep(index, 'up', e)} className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] disabled:opacity-20" disabled={index === 0}><ChevronUp size={14}/></button>
                       <button onClick={(e) => moveStep(index, 'down', e)} className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] disabled:opacity-20" disabled={index === funnel.steps.length - 1}><ChevronDown size={14}/></button>
                       <button onClick={(e) => handleDeleteStep(step.id, e)} className="p-1 text-[var(--text-muted)] hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
               <button onClick={() => handleAddStep(StepType.Message)} className="flex-1 py-3 bg-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-all">+ Message</button>
               <button onClick={() => handleAddStep(StepType.LeadCapture)} className="flex-1 py-3 bg-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-all">+ Capture</button>
            </div>
          </div>

          {/* EDITING CANVAS */}
          {activeStep ? (
            <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[40px] overflow-y-auto p-10 space-y-10 shadow-sm relative">
              {isAiLoading && (
                <div className="absolute inset-0 bg-[var(--bg-surface)]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-12">
                   <div className="w-16 h-16 bg-[var(--primary-soft)] rounded-2xl flex items-center justify-center text-[var(--primary)] animate-bounce mb-4"><Sparkles size={32}/></div>
                   <h3 className="text-xl font-bold text-[var(--text-title)] mb-2">L'IA est au travail...</h3>
                   <p className="text-[var(--text-muted)] max-w-xs">{aiStatus || "Optimisation de vos pixels stratégiques"}</p>
                </div>
              )}

              <div className="space-y-10">
                {/* Field Header */}
                <div className="flex items-center gap-4">
                   <div className="px-4 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{activeStep.type}</div>
                   <div className="h-px flex-1 bg-[var(--border-color)]"></div>
                </div>

                {/* Main Content Fields */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="font-bold text-sm text-[var(--text-title)]">Titre Accrocheur (Hook)</label>
                    <input 
                      value={activeStep.title} 
                      onChange={(e) => updateStep(selectedStepId, { title: e.target.value })} 
                      className="w-full p-5 bg-black/5 border-none rounded-2xl text-[20px] font-black text-[var(--text-title)] focus:ring-2 focus:ring-[var(--primary)] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-sm text-[var(--text-title)]">Contenu / Script</label>
                      <button onClick={() => handleAiAction('text')} className="text-[10px] font-black uppercase text-[var(--primary)] flex items-center gap-1 hover:underline"><Sparkles size={12}/> Optimiser IA</button>
                    </div>
                    <textarea 
                      value={activeStep.description} 
                      onChange={(e) => updateStep(selectedStepId, { description: e.target.value })} 
                      className="w-full h-48 p-5 bg-black/5 border-none rounded-2xl text-[16px] text-[var(--text-body)] focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none leading-relaxed" 
                    />
                  </div>
                </div>

                {/* Tabs for Data vs Media */}
                <div className="flex gap-8 border-b border-[var(--border-color)]">
                   {['data', 'media'].map((tab) => (
                     <button key={tab} onClick={() => setActiveSubTab(tab as any)} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                        {tab === 'data' ? 'Configuration' : 'Visuels & IA'}
                     </button>
                   ))}
                </div>

                <div className="py-2 animate-fade-in">
                   {activeSubTab === 'data' && (
                     <div className="space-y-8">
                        {/* Specific Step Configurations */}
                        {activeStep.type === StepType.Question && (
                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-[var(--text-title)]">Options de Diagnostic</h4>
                                <button onClick={() => {
                                  const newOptions = [...(activeStep.options || []), { id: Date.now().toString(), text: 'Nouvelle option', score: 10 }];
                                  updateStep(selectedStepId, { options: newOptions });
                                }} className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">+ Ajouter</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeStep.options?.map((opt, oIdx) => (
                                  <div key={opt.id} className="flex gap-2 items-center p-3 bg-black/5 rounded-2xl group border border-transparent hover:border-[var(--primary)] transition-all">
                                     <input 
                                        value={opt.text} 
                                        onChange={(e) => {
                                          const newOpts = [...(activeStep.options || [])];
                                          newOpts[oIdx].text = e.target.value;
                                          updateStep(selectedStepId, { options: newOpts });
                                        }} 
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-[var(--text-title)]" 
                                      />
                                     <div className="flex items-center gap-1 px-2 border-l border-black/10">
                                        <span className="text-[9px] font-black text-[var(--text-muted)]">SCORE</span>
                                        <input 
                                          type="number" 
                                          value={opt.score} 
                                          onChange={(e) => {
                                            const newOpts = [...(activeStep.options || [])];
                                            newOpts[oIdx].score = parseInt(e.target.value) || 0;
                                            updateStep(selectedStepId, { options: newOpts });
                                          }} 
                                          className="w-8 bg-transparent text-center font-bold text-xs text-[var(--primary)]" 
                                        />
                                     </div>
                                     <button onClick={() => updateStep(selectedStepId, { options: activeStep.options?.filter((_, i) => i !== oIdx) })} className="text-[var(--text-muted)] hover:text-red-500 transition-colors"><X size={14}/></button>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}

                        {activeStep.type === StepType.Calendar && (
                          <div className="space-y-4">
                            <label className="font-bold text-sm text-[var(--text-title)]">URL Calendly / Cal.com</label>
                            <input 
                              value={activeStep.calendarUrl || ''} 
                              onChange={(e) => updateStep(selectedStepId, { calendarUrl: e.target.value })} 
                              placeholder="https://calendly.com/votre-lien" 
                              className="w-full p-4 bg-black/5 rounded-2xl text-[var(--text-title)]" 
                            />
                          </div>
                        )}

                        {activeStep.type === StepType.LeadCapture && (
                          <div className="space-y-4">
                            <label className="font-bold text-sm text-[var(--text-title)]">Champs requis</label>
                            <div className="flex gap-4">
                               {['name', 'email', 'phone'].map(field => (
                                 <label key={field} className={`flex-1 p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${activeStep.fields?.includes(field as any) ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-black/5 bg-black/5'}`}>
                                   <span className="text-xs font-bold capitalize text-[var(--text-title)]">{field}</span>
                                   <input 
                                     type="checkbox" 
                                     checked={activeStep.fields?.includes(field as any)}
                                     onChange={(e) => {
                                       const current = activeStep.fields || [];
                                       const next = e.target.checked ? [...current, field] : current.filter(f => f !== field);
                                       updateStep(selectedStepId, { fields: next as any });
                                     }}
                                     className="rounded text-[var(--primary)] focus:ring-[var(--primary)]" 
                                   />
                                 </label>
                               ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                           <label className="font-bold text-sm text-[var(--text-title)]">Texte d'appel à l'action (CTA)</label>
                           <input 
                            value={activeStep.buttonText} 
                            onChange={(e) => updateStep(selectedStepId, { buttonText: e.target.value })} 
                            className="w-full p-4 bg-black/5 rounded-2xl font-black text-center text-[var(--text-title)]" 
                           />
                        </div>
                     </div>
                   )}

                   {activeSubTab === 'media' && (
                     <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <button onClick={() => handleAiAction('image')} className="p-8 rounded-[32px] border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center gap-3 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all group">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)]"><ImageIcon size={24}/></div>
                              <p className="font-bold text-sm text-[var(--text-title)]">Générer Image AI</p>
                           </button>
                           <button onClick={() => handleAiAction('video')} className="p-8 rounded-[32px] border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center gap-3 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all group">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)]"><Film size={24}/></div>
                              <p className="font-bold text-sm text-[var(--text-title)]">Générer Vidéo Veo</p>
                           </button>
                        </div>

                        {activeStep.media?.url && (
                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                               <h4 className="font-bold text-sm text-[var(--text-title)]">Aperçu du média</h4>
                               <button onClick={() => updateStep(selectedStepId, { media: { type: 'none', url: '' } })} className="text-red-500 font-bold text-xs">Supprimer</button>
                             </div>
                             <div className="rounded-[32px] overflow-hidden bg-black aspect-video shadow-2xl relative">
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
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-surface)] border border-dashed border-[var(--border-color)] rounded-[40px]">
              <Sparkles size={48} className="opacity-10 mb-4" />
              <p className="font-bold uppercase tracking-widest text-[11px]">SÉLECTIONNEZ UNE ÉTAPE</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[40px] overflow-y-auto p-10 shadow-sm">
          <FunnelSettingsPanel 
            settings={funnel.settings} 
            onChange={(updates) => setFunnel(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }))} 
          />
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in">
           <button onClick={() => setShowPreview(false)} className="absolute top-6 right-6 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 z-[110] transition-all"><X size={24} /></button>
           <div className="w-full h-full max-w-6xl bg-[var(--bg-surface)] rounded-[48px] overflow-hidden shadow-2xl border border-white/10">
              <FunnelPreview steps={funnel.steps} onClose={() => setShowPreview(false)} />
           </div>
        </div>
      )}
    </div>
  );
};

export default FunnelEditor;
