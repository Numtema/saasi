
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Info, Sparkles, TrendingUp, ShieldCheck, Eye, Target, Globe, ExternalLink } from 'lucide-react';
import { AppTheme } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardViewProps {
  theme: AppTheme;
  onNavigate: (tab: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ theme, onNavigate }) => {
  const [trends, setTrends] = useState<{text: string, sources: any[]}>({ text: '', sources: [] });
  const [isLoadingTrends, setIsLoadingTrends] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      const data = await geminiService.getMarketTrends();
      setTrends(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  return (
    <div className="space-y-10">
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
        <div className="border rounded-[32px] p-10 flex flex-col justify-center min-h-[220px] bg-[var(--bg-surface)] border-[var(--border-color)]">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-6xl font-bold text-[var(--text-title)]">1,284</span>
            <span className="text-xl font-bold text-[var(--text-muted)]">Vues</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Eye size={18} /></div>
            <span className="font-bold text-[14px]">Trafic global</span>
          </div>
        </div>

        <div className="border rounded-[32px] p-10 flex flex-col justify-center min-h-[220px] bg-[var(--bg-surface)] border-[var(--border-color)]">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-6xl font-bold text-[var(--text-title)]">142</span>
            <span className="text-xl font-bold text-[var(--text-muted)]">Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[var(--primary)]"><Target size={18} /></div>
            <span className="font-bold text-[14px]">Conversions capturées</span>
          </div>
        </div>

        <div className="border rounded-[32px] p-10 flex flex-col justify-center min-h-[220px] bg-[var(--bg-surface)] border-[var(--border-color)]">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-6xl font-bold text-[var(--text-title)]">11.2</span>
            <span className="text-xl font-bold text-[var(--text-muted)]">%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white"><TrendingUp size={18} /></div>
            <span className="font-bold text-[14px]">Taux de conversion</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="p-8 border rounded-[32px] flex items-center gap-6 bg-[var(--primary-soft)] border-[var(--primary)] border-opacity-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="font-bold text-[18px]">Générateur LGM Activé</h4>
                <p className="text-[14px]">Votre méthodologie en 9 étapes est prête à transformer vos scripts en tunnels automatisés.</p>
                <button onClick={() => onNavigate('lgm-wizard')} className="mt-3 text-[13px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline">
                  Lancer l'assistant AI <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            <div className="p-8 border rounded-[32px] bg-[var(--bg-surface)] border-[var(--border-color)]">
               <h3 className="font-bold text-[18px] mb-6 flex items-center gap-2">
                 <Globe size={20} className="text-blue-500" /> 
                 Veille Stratégique (AI News)
               </h3>
               {isLoadingTrends ? (
                 <div className="space-y-4">
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-[var(--text-body)]">{trends.text}</p>
                    <div className="pt-4 border-t flex flex-wrap gap-3">
                       {trends.sources.map((s: any, idx: number) => (
                         <a key={idx} href={s.web?.uri} target="_blank" className="text-[10px] font-bold text-blue-500 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                           {s.web?.title} <ExternalLink size={10} />
                         </a>
                       ))}
                    </div>
                 </div>
               )}
            </div>
         </div>

         <div className="p-8 border rounded-[32px] bg-[var(--bg-surface)] border-[var(--border-color)] h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[18px]">Crédits AI</h3>
              <span className="text-[14px] font-bold text-[var(--primary)]">42 / 100</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--primary)] h-full" style={{ width: '42%' }}></div>
            </div>
            <p className="text-[12px] text-[var(--text-muted)] mt-4">Vos crédits se réinitialisent le 1er du mois.</p>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
