
import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, Trash2, Video, 
  HelpCircle, MessageSquare, UserPlus, 
  Calendar, Sparkles, ChevronUp, ChevronDown,
  Eye, Loader2, Check, X, Image as ImageIcon, PlayCircle, Settings as SettingsIcon, Layout, ListChecks, Type
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
  scoring: { enabled: true, maxScore: 40, showSegment: true, segments: [{ id: '1', label: 'Chaud', min: 30, max: 40 }] },
  integrations: { webhookUrl: '', calendarUrl: '' },
  pixels: { facebook: '', google: '', tiktok: '' },
  multiLanguage: { enabled: false, languages: ['fr'] },
  whatsapp: { enabled: true, number: '33649653186', message: 'Bonjour, je souhaite des infos.' },
  redirection: { type: 'whatsapp', value: '+33649653186' },
  branding: { logoUrl: '' },
  socials: { facebook: '', instagram: '', linkedin: '' }
};

const FunnelEditor: React.FC<FunnelEditorProps> = ({ funnel, theme, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [activeSubTab, setActiveSubTab] = useState<'data' | 'media' | 'design' | 'abtest'>('data');
  
  const initialSteps = (funnel.steps || []).map(step => ({
    ...step,
    media: step.media || { type: 'none', url: '' },
    options: step.options || [],
    fields: step.fields || ['name', 'email']
  }));

  const [steps, setSteps] = useState<FunnelStep[]>(initialSteps);
  const [settings, setSettings] = useState<FunnelSettings>(funnel.settings || DEFAULT_SETTINGS);
  const [selectedStepId, setSelectedStepId] = useState<string>(steps[0]?.id || '');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const activeStep = steps.find(s => s.id === selectedStepId);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await storageService.saveFunnel({ ...funnel, steps: steps, settings: settings });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const updateStep = (id: string, updates: Partial<FunnelStep>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddOption = () => {
    if (!activeStep) return;
    const newOption: QuestionOption = { id: Math.random().toString(36).substr(2, 5), text: 'Nouvelle option', score: 0 };
    updateStep(selectedStepId, { options: [...(activeStep.options || []), newOption] });
  };

  const handleUpdateOption = (optId: string, text: string, score: number) => {
    if (!activeStep) return;
    const newOptions = activeStep.options?.map(o => o.id === optId ? { ...o, text, score } : o);
    updateStep(selectedStepId, { options: newOptions });
  };

  const handleRemoveOption = (optId: string) => {
    if (!activeStep) return;
    updateStep(selectedStepId, { options: activeStep.options?.filter(o => o.id !== optId) });
  };

  const toggleField = (field: 'name' | 'email' | 'phone') => {
    if (!activeStep) return;
    const currentFields = activeStep.fields || [];
    const newFields = currentFields.includes(field) 
      ? currentFields.filter(f => f !== field)
      : [...currentFields, field];
    updateStep(selectedStepId, { fields: newFields as any });
  };

  const handleEnhance = async (field: 'title' | 'description') => {
    if (!activeStep) return;
    setIsEnhancing(true);
    try {
      const enhanced = await geminiService.enhanceCopy(activeStep[field] || '');
      updateStep(selectedStepId, { [field]: enhanced });
    } finally {
      setIsEnhancing(false);
    }
  };

  const addStep = (type: StepType) => {
    const newStep: FunnelStep = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: 'Nouvelle étape',
      description: 'Description de votre étape...',
      media: { type: 'none', url: '' },
      buttonText: 'Continuer',
      options: type === StepType.Question ? [{ id: '1', text: 'Option 1', score: 0 }] : [],
      fields: type === StepType.LeadCapture ? ['name', 'email'] : []
    };
    setSteps([...steps, newStep]);
    setSelectedStepId(newStep.id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <header className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-[20px] font-bold text-[var(--text-title)]">{funnel.name}</h2>
              <p className="text-[12px] text-[var(--text-muted)]">Configuration LGM en direct</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
               <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'content' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}><Layout size={14} /> Étapes</button>
               <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}><SettingsIcon size={14} /> Paramètres</button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(true)} className="px-6 py-2.5 rounded-xl border font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"><Eye size={18} /> Aperçu</button>
          <button onClick={handleSave} disabled={isSaving} className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl ${saveSuccess ? 'bg-green-500 text-white' : 'bg-[var(--primary)] text-white hover:scale-[1.02]'}`}>
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
            {saveSuccess ? 'Enregistré' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      {activeTab === 'content' ? (
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden animate-fade-in">
          {/* Sidebar Structure */}
          <div className="w-80 bg-white border border-[var(--border-color)] rounded-[40px] flex flex-col p-6 shadow-sm">
            <h3 className="font-bold text-[13px] uppercase tracking-widest text-[var(--text-muted)] mb-6">Structure</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {steps.map((step, index) => (
                <button key={step.id} onClick={() => setSelectedStepId(step.id)} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${selectedStepId === step.id ? 'border-[var(--primary)] bg-[var(--primary-soft)] ring-1 ring-[var(--primary)]' : 'border-transparent hover:bg-gray-50'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${selectedStepId === step.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {step.type === StepType.Welcome && <PlayCircle size={18} />}
                    {step.type === StepType.Question && <HelpCircle size={18} />}
                    {step.type === StepType.Message && <MessageSquare size={18} />}
                    {step.type === StepType.LeadCapture && <UserPlus size={18} />}
                    {step.type === StepType.Calendar && <Calendar size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold truncate text-[var(--text-title)]">{step.title}</span>
                    <span className="block text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">{index + 1}. {step.type}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
               {[StepType.Question, StepType.Message, StepType.LeadCapture].map(type => (
                 <button key={type} onClick={() => addStep(type)} className="p-2 bg-gray-100 rounded-lg hover:bg-[var(--primary-soft)] transition-colors"><Plus size={16} /></button>
               ))}
            </div>
          </div>

          {/* Editor Content */}
          {activeStep ? (
            <div className="flex-1 bg-white border border-[var(--border-color)] rounded-[40px] overflow-y-auto p-10 space-y-10 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-orange-50 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest">{activeStep.type}</span>
                  <button onClick={() => updateStep(selectedStepId, {})} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="font-bold text-sm">Titre de l'étape</label><button onClick={() => handleEnhance('title')} className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline"><Sparkles size={12} /> IA</button></div>
                    <input value={activeStep.title} onChange={(e) => updateStep(selectedStepId, { title: e.target.value })} className="w-full p-4 border rounded-2xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="font-bold text-sm">Description</label><button onClick={() => handleEnhance('description')} className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline"><Sparkles size={12} /> IA</button></div>
                    <textarea value={activeStep.description} onChange={(e) => updateStep(selectedStepId, { description: e.target.value })} className="w-full h-32 p-4 border rounded-2xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none resize-none transition-all" />
                  </div>
                </div>

                <div className="flex gap-4 border-b">
                   {['data', 'media', 'design', 'abtest'].map((tab) => (
                     <button key={tab} onClick={() => setActiveSubTab(tab as any)} className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all ${activeSubTab === tab ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-gray-400'}`}>
                        {tab === 'data' ? 'Contenu' : tab}
                     </button>
                   ))}
                </div>

                <div className="animate-fade-in py-4">
                   {activeSubTab === 'data' && (
                     <div className="space-y-8">
                        {activeStep.type === StepType.Question && (
                          <div className="space-y-6">
                             <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm flex items-center gap-2 text-[var(--text-title)]"><ListChecks size={18}/> Options de réponse</h4>
                                <button onClick={handleAddOption} className="text-xs font-bold text-[var(--primary)] flex items-center gap-1 hover:underline"><Plus size={14}/> Ajouter</button>
                             </div>
                             <div className="space-y-3">
                                {activeStep.options?.map((opt) => (
                                  <div key={opt.id} className="flex gap-3 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                                     <input type="text" value={opt.text} onChange={(e) => handleUpdateOption(opt.id, e.target.value, opt.score)} className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium" />
                                     <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400">Score</span>
                                        <input type="number" value={opt.score} onChange={(e) => handleUpdateOption(opt.id, opt.text, parseInt(e.target.value) || 0)} className="w-12 text-center bg-white border rounded-lg text-xs py-1" />
                                     </div>
                                     <button onClick={() => handleRemoveOption(opt.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"><X size={14}/></button>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}

                        {activeStep.type === StepType.LeadCapture && (
                          <div className="space-y-6">
                             <h4 className="font-bold text-sm flex items-center gap-2 text-[var(--text-title)]"><UserPlus size={18}/> Champs du formulaire</h4>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['name', 'email', 'phone'].map((field) => (
                                  <button key={field} onClick={() => toggleField(field as any)} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${activeStep.fields?.includes(field as any) ? 'bg-[var(--primary-soft)] border-[var(--primary)] text-[var(--primary)]' : 'bg-white grayscale opacity-60'}`}>
                                     <span className="text-xs font-bold capitalize">{field === 'name' ? 'Prénom' : field}</span>
                                     {activeStep.fields?.includes(field as any) ? <Check size={14}/> : <Plus size={14}/>}
                                  </button>
                                ))}
                             </div>
                          </div>
                        )}

                        <div className="space-y-2">
                           <label className="font-bold text-sm">Texte du bouton d'action</label>
                           <input value={activeStep.buttonText} onChange={(e) => updateStep(selectedStepId, { buttonText: e.target.value })} className="w-full p-4 border rounded-2xl text-[15px] focus:ring-2 focus:ring-[var(--primary)]" />
                        </div>
                     </div>
                   )}

                   {activeSubTab === 'media' && (
                     <div className="space-y-8">
                        <div className="grid grid-cols-3 gap-3">
                           {['none', 'video', 'image'].map(type => (
                             <button key={type} onClick={() => updateStep(selectedStepId, { media: { ...(activeStep.media), type: type as any } })} className={`p-4 rounded-2xl border text-[11px] font-bold uppercase transition-all ${(activeStep.media?.type || 'none') === type ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' : 'bg-gray-50'}`}>{type}</button>
                           ))}
                        </div>
                        {activeStep.media?.type !== 'none' && (
                           <div className="space-y-2">
                              <label className="font-bold text-sm">URL du média</label>
                              <input placeholder="https://..." value={activeStep.media?.url || ''} onChange={(e) => updateStep(selectedStepId, { media: { ...activeStep.media, url: e.target.value } })} className="w-full p-4 border rounded-2xl text-[15px] focus:ring-2 focus:ring-[var(--primary)]" />
                           </div>
                        )}
                     </div>
                   )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 bg-white border border-dashed border-[var(--border-color)] rounded-[40px]">
              <Sparkles size={48} className="opacity-20" />
              <p className="font-medium">Sélectionnez une étape dans la structure pour commencer l'édition.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 bg-white border border-[var(--border-color)] rounded-[40px] overflow-y-auto p-10 shadow-sm animate-fade-in">
          <FunnelSettingsPanel 
            settings={settings} 
            onChange={(updates) => setSettings(prev => ({ ...prev, ...updates }))} 
          />
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fade-in">
           <button onClick={() => setShowPreview(false)} className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all z-[110]"><X size={24} /></button>
           <div className="w-full h-full max-w-6xl max-h-[800px] bg-white rounded-[40px] overflow-hidden shadow-2xl relative">
              <FunnelPreview steps={steps} onClose={() => setShowPreview(false)} />
           </div>
        </div>
      )}
    </div>
  );
};

export default FunnelEditor;
