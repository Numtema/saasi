
import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, Trash2, Video, 
  HelpCircle, MessageSquare, UserPlus, 
  Calendar, Sparkles, ChevronUp, ChevronDown,
  Eye, Loader2, Check, X, Image as ImageIcon, PlayCircle, Settings as SettingsIcon, Layout
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
  scoring: { enabled: true, maxScore: 40, showSegment: true, segments: [] },
  integrations: { webhookUrl: '', calendarUrl: '' },
  pixels: { facebook: '', google: '', tiktok: '' },
  multiLanguage: { enabled: false, languages: ['fr'] },
  whatsapp: { enabled: true, number: '33649653186', message: 'bonjour je veux les informations sur l\'accompagnement "Formule « Renaissance » Accompagnement sur 3 mois"' },
  redirection: { type: 'whatsapp', value: '+33649653186' },
  branding: { logoUrl: '' },
  socials: { facebook: '', instagram: '', linkedin: '' }
};

const FunnelEditor: React.FC<FunnelEditorProps> = ({ funnel, theme, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const initialSteps = (funnel.steps || []).map(step => ({
    ...step,
    media: step.media || { type: 'none', url: '' }
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
      buttonText: 'Continuer'
    };
    setSteps([...steps, newStep]);
    setSelectedStepId(newStep.id);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleDeleteStep = () => {
    if (!activeStep) return;
    const remainingSteps = steps.filter(s => s.id !== activeStep.id);
    setSteps(remainingSteps);
    if (remainingSteps.length > 0) {
      setSelectedStepId(remainingSteps[0].id);
    } else {
      setSelectedStepId('');
    }
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
               <button 
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'content' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}
               >
                 <Layout size={14} /> Étapes
               </button>
               <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'settings' ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-gray-500'}`}
               >
                 <SettingsIcon size={14} /> Paramètres
               </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPreview(true)}
            className="px-6 py-2.5 rounded-xl border font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Eye size={18} /> Aperçu
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl ${
              saveSuccess ? 'bg-green-500 text-white' : 'bg-[var(--primary)] text-white hover:scale-[1.02]'
            }`}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
            {saveSuccess ? 'Enregistré' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      {activeTab === 'content' ? (
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden animate-fade-in">
          {/* Sidebar Structure */}
          <div className="w-80 bg-white border border-[var(--border-color)] rounded-[40px] flex flex-col p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[13px] uppercase tracking-widest text-[var(--text-muted)]">Structure</h3>
              <div className="flex gap-1">
                 <button onClick={() => addStep(StepType.Question)} className="p-1.5 bg-[var(--primary-soft)] text-[var(--primary)] rounded-lg hover:scale-110 transition-all">
                    <Plus size={16} />
                 </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {steps.map((step, index) => (
                <div key={step.id} className="relative group">
                  <button 
                    onClick={() => setSelectedStepId(step.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                      selectedStepId === step.id ? 'border-[var(--primary)] bg-[var(--primary-soft)] ring-1 ring-[var(--primary)]' : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      selectedStepId === step.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.type === StepType.Welcome && <Video size={18} />}
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
                  {selectedStepId === step.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => {e.stopPropagation(); moveStep(index, 'up')}} className="p-1 hover:bg-white rounded"><ChevronUp size={12}/></button>
                      <button onClick={(e) => {e.stopPropagation(); moveStep(index, 'down')}} className="p-1 hover:bg-white rounded"><ChevronDown size={12}/></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor Content */}
          {activeStep ? (
            <div className="flex-1 bg-white border border-[var(--border-color)] rounded-[40px] overflow-y-auto p-10 space-y-10 shadow-sm">
              <div className="flex items-center justify-between border-b pb-6">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mb-1 block">Étape Active</span>
                    <h3 className="text-2xl font-bold text-[var(--text-title)]">Éditer le contenu</h3>
                  </div>
                  <button 
                    onClick={handleDeleteStep}
                    className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[13px] font-bold"
                  >
                    <Trash2 size={16} /> Supprimer l'étape
                  </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <label className="font-bold text-sm">Titre de l'étape</label>
                          <button onClick={() => handleEnhance('title')} disabled={isEnhancing} className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline">
                            <Sparkles size={12} /> {isEnhancing ? 'IA...' : 'Améliorer'}
                          </button>
                      </div>
                      <input 
                          value={activeStep.title}
                          onChange={(e) => updateStep(selectedStepId, { title: e.target.value })}
                          className="w-full p-4 border rounded-2xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <label className="font-bold text-sm">Texte ou Script Vidéo</label>
                          <button onClick={() => handleEnhance('description')} disabled={isEnhancing} className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline">
                            <Sparkles size={12} /> {isEnhancing ? 'IA...' : 'Améliorer'}
                          </button>
                      </div>
                      <textarea 
                          value={activeStep.description}
                          onChange={(e) => updateStep(selectedStepId, { description: e.target.value })}
                          className="w-full h-40 p-4 border rounded-2xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none resize-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-bold text-sm">Texte du bouton d'action</label>
                      <input 
                          value={activeStep.buttonText}
                          onChange={(e) => updateStep(selectedStepId, { buttonText: e.target.value })}
                          className="w-full p-4 border rounded-2xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="font-bold text-sm flex items-center gap-2"><ImageIcon size={18}/> Média de fond</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['none', 'video', 'image'].map(type => (
                            <button 
                              key={type}
                              onClick={() => updateStep(selectedStepId, { media: { ...(activeStep.media || { type: 'none', url: '' }), type: type as any } })}
                              className={`p-3 rounded-xl border text-[11px] font-bold uppercase transition-all ${
                                (activeStep.media?.type || 'none') === type ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]' : 'bg-gray-50'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        
                        {activeStep.media?.type && activeStep.media.type !== 'none' && (
                          <div className="space-y-2 animate-fade-in">
                            <input 
                              type="text"
                              placeholder="URL du média (YouTube, MP4, JPEG...)"
                              value={activeStep.media.url || ''}
                              onChange={(e) => updateStep(selectedStepId, { media: { ...activeStep.media, url: e.target.value } })}
                              className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                            />
                            <p className="text-[10px] text-[var(--text-muted)] italic">Conseil : Utilisez une vidéo de 10-20 secondes pour un impact maximal.</p>
                          </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 text-center space-y-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-400">
                          {activeStep.type === StepType.Question ? <HelpCircle size={24}/> : <PlayCircle size={24}/>}
                        </div>
                        <p className="text-xs font-medium text-[var(--text-body)]">Configuration spécifique pour <b>{activeStep.type}</b> disponible dans la version Pro.</p>
                        <button className="text-[var(--primary)] font-bold text-[11px] uppercase hover:underline">En savoir plus</button>
                    </div>
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

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fade-in">
           <button 
            onClick={() => setShowPreview(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all z-[110]"
           >
             <X size={24} />
           </button>
           <div className="w-full h-full max-w-6xl max-h-[800px] bg-white rounded-[40px] overflow-hidden shadow-2xl relative">
              <FunnelPreview steps={steps} onClose={() => setShowPreview(false)} />
           </div>
        </div>
      )}
    </div>
  );
};

export default FunnelEditor;
