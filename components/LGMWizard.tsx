
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Wand2, Target, CheckCircle2 } from 'lucide-react';
import { AppTheme } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface LGMWizardProps {
  theme: AppTheme;
  onComplete: () => void;
}

const LGMWizard: React.FC<LGMWizardProps> = ({ theme, onComplete }) => {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await geminiService.generateStrategy(prompt);
      const newFunnel = {
        id: Math.random().toString(36).substr(2, 9),
        name: result.name || "Nouveau Funnel AI",
        description: result.description || prompt,
        steps: result.steps || [],
        status: 'draft' as const,
        views: 0,
        conversions: 0,
        createdAt: new Date().toISOString()
      };
      
      storageService.saveFunnel(newFunnel);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[var(--primary)] text-white' : 'bg-gray-200'}`}>1</div>
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[var(--primary)] text-white' : 'bg-gray-200'}`}>2</div>
        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-[var(--primary)] text-white' : 'bg-gray-200'}`}>3</div>
      </div>

      {step === 1 && (
        <div className="animate-fade-in space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Décrivez votre offre</h2>
            <p className="text-[var(--text-body)]">L'IA de Nümtema Face va structurer votre stratégie selon la méthodologie LGM en 9 étapes.</p>
          </div>
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[var(--border-color)]">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Je vends un programme de coaching pour entrepreneurs..."
              className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all resize-none text-[15px]"
            />
            <button onClick={() => setStep(2)} disabled={!prompt} className="w-full mt-6 py-4 rounded-xl bg-[var(--primary)] text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg">
              Étape suivante <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Analyse Stratégique</h2>
            <p className="text-[var(--text-body)]">Analyse en cours via Gemini Pro (Thinking Mode activé)...</p>
          </div>
          <div className="bg-white p-10 rounded-[32px] shadow-sm border text-center space-y-8">
            <div className="flex justify-center">
              {isGenerating ? (
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-t-[var(--primary)] rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--primary)]" size={32} />
                </div>
              ) : (
                <div className="w-24 h-24 bg-[var(--primary-soft)] rounded-full flex items-center justify-center text-[var(--primary)]"><Wand2 size={40} /></div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{isGenerating ? 'L\'IA élabore votre stratégie...' : 'Prêt à générer ?'}</h3>
              <p className="text-[var(--text-muted)] text-sm">Ceci utilise le modèle Pro pour une qualité maximale.</p>
            </div>
            {!isGenerating && (
              <button onClick={handleGenerate} className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg">
                Générer mon funnel AI <Sparkles size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in space-y-6 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm"><CheckCircle2 size={40} /></div>
          <h2 className="text-4xl font-bold">Stratégie Créée !</h2>
          <p className="text-[var(--text-body)] max-w-md mx-auto">Votre funnel a été généré et sauvegardé dans votre espace personnel.</p>
          <div className="pt-10">
            <button onClick={onComplete} className="px-10 py-4 rounded-xl bg-[var(--primary)] text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg">
              Accéder à mes funnels
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LGMWizard;
