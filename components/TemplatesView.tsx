
import React from 'react';
import { Layers, Zap, GraduationCap, ShoppingBag, Rocket, ArrowRight, Copy } from 'lucide-react';
import { AppTheme, Funnel, StepType, FunnelSettings } from '../types';
import { storageService } from '../services/storageService';

interface TemplatesViewProps {
  theme: AppTheme;
  onUseTemplate: (funnel: Funnel) => void;
}

const TEMPLATES = [
  {
    id: 'tpl-coach',
    name: 'High-Ticket Coaching',
    description: 'Structure optimisée pour vendre des services d\'accompagnement à haute valeur ajoutée.',
    icon: <GraduationCap size={24} />,
    color: 'bg-blue-500',
    stepsCount: 9,
    category: 'Services'
  },
  {
    id: 'tpl-saas',
    name: 'SaaS Demo Funnel',
    description: 'Convertissez vos visiteurs en utilisateurs actifs via une démo interactive pilotée par l\'IA.',
    icon: <Rocket size={24} />,
    color: 'bg-purple-500',
    stepsCount: 7,
    category: 'Logiciel'
  },
  {
    id: 'tpl-ecommerce',
    name: 'E-com Flash Sale',
    description: 'Capturez l\'urgence et maximisez le panier moyen avec des étapes de vente psychologique.',
    icon: <ShoppingBag size={24} />,
    color: 'bg-green-500',
    stepsCount: 5,
    category: 'E-commerce'
  }
];

const TemplatesView: React.FC<TemplatesViewProps> = ({ theme, onUseTemplate }) => {
  const handleSelectTemplate = async (template: typeof TEMPLATES[0]) => {
    // Add default settings to satisfy the Funnel interface requirements
    const newFunnel: Funnel = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${template.name} (Copie)`,
      description: template.description,
      status: 'draft',
      views: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      steps: [
        {
          id: 'step-1',
          type: StepType.Welcome,
          title: 'Bienvenue dans notre univers',
          description: 'Ceci est l\'étape d\'attraction initiale du modèle.',
          buttonText: 'Commencer l\'expérience',
          media: { type: 'none', url: '' }
        }
      ],
      settings: {
        scoring: {
          enabled: false,
          maxScore: 100,
          showSegment: false,
          segments: []
        },
        integrations: {
          webhookUrl: '',
          calendarUrl: ''
        },
        pixels: {
          facebook: '',
          google: '',
          tiktok: ''
        },
        multiLanguage: {
          enabled: false,
          languages: ['fr']
        },
        whatsapp: {
          enabled: false,
          number: '',
          message: ''
        },
        redirection: {
          type: 'none',
          value: ''
        },
        branding: {
          logoUrl: ''
        },
        socials: {
          facebook: '',
          instagram: '',
          linkedin: ''
        }
      }
    };
    
    const saved = await storageService.saveFunnel(newFunnel);
    onUseTemplate(saved);
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-[28px] font-bold text-[var(--text-title)]">Bibliothèque de Templates</h2>
        <p className="text-[14px] text-[var(--text-muted)]">Utilisez nos frameworks LGM pré-configurés pour gagner du temps.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="bg-white border border-[var(--border-color)] rounded-[32px] p-8 hover:shadow-xl transition-all group flex flex-col h-full">
            <div className={`w-14 h-14 ${tpl.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
              {tpl.icon}
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{tpl.category}</span>
              <h3 className="text-xl font-bold mt-1 mb-3 text-[var(--text-title)]">{tpl.name}</h3>
              <p className="text-sm text-[var(--text-body)] leading-relaxed mb-6">
                {tpl.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-6 border-t mt-auto">
              <span className="text-xs font-bold text-[var(--text-muted)]">{tpl.stepsCount} Étapes AI</span>
              <button 
                onClick={() => handleSelectTemplate(tpl)}
                className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm hover:translate-x-1 transition-transform"
              >
                Utiliser ce modèle <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-[var(--primary)] transition-colors cursor-pointer min-h-[300px]">
           <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
             <Copy size={24} />
           </div>
           <p className="text-sm font-bold text-gray-400">D'autres modèles arrivent bientôt...</p>
        </div>
      </div>
    </div>
  );
};

export default TemplatesView;