
import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Eye, Edit, BarChart3, Trash2, Globe, Loader2, Sparkles } from 'lucide-react';
import { AppTheme, Funnel } from '../types';
import { storageService } from '../services/storageService';

interface FunnelsViewProps {
  theme: AppTheme;
  onEdit: (funnel: Funnel) => void;
}

const FunnelsView: React.FC<FunnelsViewProps> = ({ theme, onEdit }) => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    setLoading(true);
    try {
      const data = await storageService.getFunnels();
      setFunnels(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce funnel ?')) return;
    try {
      await storageService.deleteFunnel(id);
      setFunnels(prev => prev.filter(f => f.id !== id));
    } catch (e) {
      alert('Erreur suppression');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[var(--text-title)]">Mes Funnels AI</h2>
          <p className="text-[14px] text-[var(--text-muted)]">Gérez vos Lead Generation Machines connectées à l'IA.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            // @ts-ignore
            onClick={() => window.location.href = '#/lgm-wizard'} 
            className="bg-[var(--primary)] text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-orange-900/10"
          >
            <Sparkles size={18} /> CRÉER UN FUNNEL
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={48} className="animate-spin text-[var(--primary)]" />
          <p className="font-black text-[11px] text-[var(--text-muted)] tracking-[0.2em] uppercase">Chargement de vos stratégies...</p>
        </div>
      ) : funnels.length === 0 ? (
        <div className="text-center py-32 bg-[var(--bg-surface)] rounded-[48px] border-2 border-dashed border-[var(--border-color)]">
           <Sparkles size={48} className="mx-auto text-gray-200 mb-6" />
           <p className="text-[var(--text-muted)] font-bold mb-6">Aucun funnel n'a encore été élaboré par l'IA.</p>
           <button className="text-[var(--primary)] font-black uppercase text-xs tracking-widest hover:underline">Lancer le LGM Wizard maintenant</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {funnels.map(funnel => (
            <div key={funnel.id} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[40px] p-8 hover:shadow-2xl hover:border-[var(--primary)] transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
              <div className="flex items-start justify-between mb-8">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${funnel.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {funnel.status}
                </div>
                <button onClick={() => handleDelete(funnel.id)} className="p-2 hover:bg-red-500/10 text-gray-300 hover:text-red-500 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-[20px] text-[var(--text-title)] mb-3 group-hover:text-[var(--primary)] transition-colors">{funnel.name}</h3>
                <p className="text-[14px] text-[var(--text-muted)] font-medium line-clamp-2 mb-8">{funnel.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-t border-[var(--border-color)] mb-8">
                 <div>
                    <span className="block text-[24px] font-black text-[var(--text-title)]">{funnel.views}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Visiteurs</span>
                 </div>
                 <div className="border-l border-[var(--border-color)] pl-6">
                    <span className="block text-[24px] font-black text-[var(--text-title)]">{funnel.conversions}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Conversion</span>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => onEdit(funnel)} className="flex-1 py-3.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-title)] font-bold text-[13px] hover:bg-black/5 transition-all flex items-center justify-center gap-2">
                  <Edit size={16} /> Éditer
                </button>
                <button className="p-3.5 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm">
                  <BarChart3 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FunnelsView;
