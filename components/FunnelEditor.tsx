
import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, Trash2, Video, 
  HelpCircle, MessageSquare, UserPlus, 
  Calendar, Sparkles, ChevronUp, ChevronDown,
  Eye, Loader2, Check
} from 'lucide-react';
import { AppTheme, Funnel, FunnelStep, StepType } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface FunnelEditorProps {
  funnel: Funnel;
  theme: AppTheme;
  onBack: () => void;
}

const FunnelEditor: React.FC<FunnelEditorProps> = ({ funnel, theme, onBack }) => {
  const [steps, setSteps] = useState<FunnelStep[]>(funnel.steps || []);
  const [selectedStepId, setSelectedStepId] = useState<string>(steps[0]?.id || '');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeStep = steps.find(s => s.id === selectedStepId);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await storageService.saveFunnel({
        ...funnel,
        steps: steps
      });
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

  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-[20px] font-bold text-[var(--text-title)]">{funnel.name}</h2>
            <p className="text-[12px] text-[var(--text-muted)]">Éditeur Supabase Cloud</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
            saveSuccess ? 'bg-green-500 text-white' : 'bg-[var(--primary)] text-white hover:opacity-90'
          }`}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
          {saveSuccess ? 'Enregistré' : 'Sauvegarder'}
        </button>
      </header>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        <div className="w-80 bg-white border border-[var(--border-color)] rounded-[32px] flex flex-col p-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="font-bold text-[14px] text-[var(--text-title)]">Structure ({steps.length})</h3>
            <button onClick={() => addStep(StepType.Question)} className="text-[var(--primary)] p-1 hover:bg-[var(--primary-soft)] rounded-lg transition-colors">
               <Plus size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {steps.map((step) => (
              <button 
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  selectedStepId === step.id ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedStepId === step.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.type === StepType.Welcome && <Video size={16} />}
                  {step.type === StepType.Question && <HelpCircle size={16} />}
                  {step.type === StepType.Message && <MessageSquare size={16} />}
                  {step.type === StepType.LeadCapture && <UserPlus size={16} />}
                  {step.type === StepType.Calendar && <Calendar size={16} />}
                </div>
                <div className="min-w-0">
                  <span className="block text-[13px] font-bold truncate text-[var(--text-title)]">{step.title}</span>
                  <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{step.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {activeStep ? (
          <div className="flex-1 bg-white border border-[var(--border-color)] rounded-[32px] overflow-y-auto p-8 space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[var(--text-title)]">Configuration</h3>
                <button className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all flex items-center gap-1 text-[13px] font-bold">
                  <Trash2 size={16} /> Supprimer
                </button>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <label className="font-bold text-sm">Titre de l'étape</label>
                      <button 
                        onClick={() => handleEnhance('title')}
                        disabled={isEnhancing}
                        className="text-[12px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline"
                      >
                        <Sparkles size={12} /> {isEnhancing ? 'IA...' : 'Améliorer'}
                      </button>
                   </div>
                   <input 
                      value={activeStep.title}
                      onChange={(e) => updateStep(selectedStepId, { title: e.target.value })}
                      className="w-full p-3 border rounded-xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                   />
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <label className="font-bold text-sm">Description / Script</label>
                      <button 
                        onClick={() => handleEnhance('description')}
                        disabled={isEnhancing}
                        className="text-[12px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline"
                      >
                        <Sparkles size={12} /> {isEnhancing ? 'IA...' : 'Améliorer'}
                      </button>
                   </div>
                   <textarea 
                      value={activeStep.description}
                      onChange={(e) => updateStep(selectedStepId, { description: e.target.value })}
                      className="w-full h-32 p-3 border rounded-xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none resize-none"
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-sm">Texte bouton</label>
                      <input 
                          value={activeStep.buttonText}
                          onChange={(e) => updateStep(selectedStepId, { buttonText: e.target.value })}
                          className="w-full p-3 border rounded-xl text-[15px] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                      />
                    </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
             Sélectionnez une étape pour l'éditer
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelEditor;
