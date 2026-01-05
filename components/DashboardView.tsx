
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Sparkles, TrendingUp, ShieldCheck, Eye, Target, Globe, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';
import { AppTheme } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardViewProps {
  theme: AppTheme;
  onNavigate: (tab: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ theme, onNavigate }) => {
  const [trends, setTrends] = useState<{text: string, sources: any[]}>({ text: '', sources: [] });
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  // Le contenu stratégique fourni par l'utilisateur pour un rendu parfait
  const strategicContent = {
    intro: "Pour 2024-2025, le marketing vidéo et les tunnels de vente ne sont plus de simples étapes linéaires, mais des écosystèmes interactifs et hyper-personnalisés boostés par l'IA. Voici les 3 tendances majeures qui redéfinissent le secteur :",
    trends: [
      {
        title: "1. L'Hyper-Personnalisation Prédictive par l'IA",
        description: "Fini le temps où l'on envoyait la même vidéo à toute sa liste. L'IA générative permet désormais de créer des tunnels de vente dynamiques où le contenu s'adapte en temps réel.",
        details: "Grâce à des outils comme HeyGen ou Tavus, vous pouvez automatiser des messages où l'avatar s'adresse au prospect par son prénom et répond à ses besoins spécifiques.",
        impact: "Le taux de conversion explose car le prospect ressent une interaction humaine directe."
      },
      {
        title: "2. Le 'Shoppable Video' et l'Interactivité Totale",
        description: "La vidéo devient le point de vente direct. On supprime toute friction entre le visionnage et l'achat.",
        details: "Intégration de boutons d'achat et de formulaires de capture directement dans le lecteur vidéo. Le spectateur achète sans quitter l'expérience.",
        impact: "Le tunnel se raccourcit : on passe de la découverte à la conversion en une seule étape."
      },
      {
        title: "3. Le Funnel Omnicanal Conversationnel (Video-First)",
        description: "L'email n'est plus le seul pilier. Les tunnels se déplacent vers WhatsApp, Instagram DMs et SMS.",
        details: "Le prospect reçoit des messages automatisés contenant de courtes vidéos de démonstration ou de témoignages plutôt que du texte.",
        impact: "Taux d'ouverture 4 à 5 fois supérieur à l'email, misant sur l'authenticité et la proximité."
      }
    ],
    summary: "La tendance est à une vidéo moins parfaite mais plus utile, capable de vendre seule grâce à l'interactivité et de se cloner à l'infini grâce à l'IA.",
    sources: [
      { title: "medium.com", uri: "https://medium.com" },
      { title: "neilpatel.com", uri: "https://neilpatel.com" },
      { title: "actstrategic", uri: "#" }
    ]
  };

  return (
    <div className="space-y-10 pb-10">
      <header className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-[var(--primary-soft)] text-[var(--primary)]">
          <Sparkles size={32} />
        </div>
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-[var(--text-title)]">
            Bonjour, <span className="uppercase">Numtema Agent !</span>
          </h1>
          <p className="text-[14px] font-medium mt-1 text-[var(--text-muted)]">
            Votre Lead Generation Machine tourne à plein régime aujourd'hui.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-[40px] p-10 flex flex-col justify-center min-h-[220px] bg-white border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-6xl font-bold text-[var(--text-title)]">1,284</span>
            <span className="text-xl font-bold text-[var(--text-muted)] tracking-tight">Vues</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Eye size={18} /></div>
            <span className="font-bold text-[14px] text-[var(--text-title)]">Trafic global</span>
          </div>
        </div>

        <div className="border rounded-[40px] p-10 flex flex-col justify-center min-h-[220px] bg-white border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-6xl font-bold text-[var(--text-title)]">142</span>
            <span className="text-xl font-bold text-[var(--text-muted)] tracking-tight">Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[var(--primary)]"><Target size={18} /></div>
            <span className="font-bold text-[14px] text-[var(--text-title)]">Conversions capturées</span>
          </div>
        </div>

        <div className="border rounded-[40px] p-10 flex flex-col justify-center min-h-[220px] bg-white border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-6xl font-bold text-[var(--text-title)]">11.2</span>
            <span className="text-xl font-bold text-[var(--text-muted)]">%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white"><TrendingUp size={18} /></div>
            <span className="font-bold text-[14px] text-[var(--text-title)]">Taux de conversion</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="p-8 border rounded-[40px] flex items-center gap-6 bg-[var(--primary-soft)] border-[var(--primary)] border-opacity-10 shadow-sm">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="font-bold text-[18px] text-[var(--text-title)]">Générateur LGM Activé</h4>
                <p className="text-[14px] text-[var(--text-body)] mt-1">Votre méthodologie en 9 étapes est prête à transformer vos scripts en tunnels automatisés.</p>
                <button onClick={() => onNavigate('lgm-wizard')} className="mt-4 text-[13px] font-bold text-[var(--primary)] flex items-center gap-1 hover:translate-x-1 transition-transform">
                  Lancer l'assistant AI <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* SECTION VEILLE STRATEGIQUE AMELIOREE */}
            <div className="p-10 border rounded-[40px] bg-white border-[var(--border-color)] shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Globe size={24} />
                    </div>
                    <h3 className="font-bold text-2xl text-[var(--text-title)]">Veille Stratégique (AI News)</h3>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">Edition 2024-2025</div>
               </div>

               <div className="space-y-8">
                  <p className="text-[15px] leading-relaxed text-[var(--text-body)] font-medium">
                    {strategicContent.intro}
                  </p>

                  <div className="space-y-10">
                    {strategicContent.trends.map((trend, idx) => (
                      <div key={idx} className="group">
                        <h4 className="text-[18px] font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                           <Zap size={18} fill="currentColor" />
                           {trend.title}
                        </h4>
                        <div className="pl-7 space-y-3 border-l-2 border-orange-50 group-hover:border-orange-200 transition-colors">
                           <p className="text-[14px] text-[var(--text-title)] font-bold">{trend.description}</p>
                           <ul className="space-y-2">
                              <li className="text-[14px] text-[var(--text-body)] flex items-start gap-2">
                                <span className="text-[var(--primary)] mt-1">•</span>
                                <span><strong className="text-[var(--text-title)]">Le concept :</strong> {trend.details}</span>
                              </li>
                              <li className="text-[14px] text-[var(--text-body)] flex items-start gap-2">
                                <span className="text-[var(--primary)] mt-1">•</span>
                                <span><strong className="text-[var(--text-title)]">Impact sur le funnel :</strong> {trend.impact}</span>
                              </li>
                           </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 italic">
                    <p className="text-[14px] text-[var(--text-title)] font-bold mb-1 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" /> En résumé :
                    </p>
                    <p className="text-[14px] text-[var(--text-body)]">
                      {strategicContent.summary}
                    </p>
                  </div>

                  <div className="pt-6 border-t flex items-center flex-wrap gap-4">
                     <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mr-2">Sources vérifiées :</span>
                     {strategicContent.sources.map((s, idx) => (
                       <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-500 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                         {s.title} <ExternalLink size={12} />
                       </a>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-8 border rounded-[40px] bg-white border-[var(--border-color)] shadow-sm h-fit">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-[18px] text-[var(--text-title)]">Crédits AI</h3>
                 <span className="text-[14px] font-bold text-[var(--primary)]">42 / 100</span>
               </div>
               <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                 <div className="bg-[var(--primary)] h-full rounded-full transition-all duration-1000" style={{ width: '42%' }}></div>
               </div>
               <p className="text-[12px] text-[var(--text-muted)] mt-4 font-medium italic">Vos crédits se réinitialisent le 1er du mois.</p>
            </div>

            <div className="p-8 border rounded-[40px] bg-gradient-to-br from-gray-900 to-black text-white shadow-xl h-fit overflow-hidden relative">
               <div className="relative z-10">
                 <h3 className="font-bold text-[18px] mb-2 flex items-center gap-2"><Zap size={18} fill="currentColor"/> Upgrade Pro</h3>
                 <p className="text-[12px] text-gray-400 mb-6 leading-relaxed">Accédez à Veo 3.1 Ultra et aux analyses psychologiques avancées.</p>
                 <button className="w-full py-3 bg-white text-black font-black text-[13px] rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-lg">
                   DÉBLOQUER TOUT
                 </button>
               </div>
               <Sparkles size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
