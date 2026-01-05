
import React, { useEffect, useState } from 'react';
import { Key, ShieldAlert, ExternalLink, ArrowRight } from 'lucide-react';

interface AIStudioKeyGateProps {
  onKeySelected: () => void;
  children: React.ReactNode;
}

const AIStudioKeyGate: React.FC<AIStudioKeyGateProps> = ({ onKeySelected, children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    // @ts-ignore
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleOpenSelect = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasKey(true);
    onKeySelected();
  };

  if (hasKey === null) return null;

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[40px] border-2 border-dashed border-orange-200">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mb-6">
          <Key size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Clé API Requise pour le Studio Pro</h2>
        <p className="text-gray-500 max-w-md mb-8">
          Pour utiliser la génération vidéo Veo et les modèles Pro, vous devez sélectionner une clé API liée à un projet GCP avec facturation activée.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={handleOpenSelect}
            className="w-full py-4 bg-[#FF4D00] text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Sélectionner ma Clé <ArrowRight size={20} />
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="text-sm font-bold text-orange-600 flex items-center justify-center gap-1 hover:underline"
          >
            Documentation Facturation <ExternalLink size={14} />
          </a>
        </div>
        <div className="mt-12 flex items-center gap-2 text-gray-400 text-xs">
          <ShieldAlert size={14} />
          <span>Vos données sont sécurisées via l'infrastructure Google AI Studio</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AIStudioKeyGate;
