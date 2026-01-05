
import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Eye, Edit, BarChart3, Trash2, Globe, Loader2 } from 'lucide-react';
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
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[var(--text-title)]">Mes Funnels AI</h2>
          <p className="text-[14px] text-[var(--text-muted)]">Gérez vos tunnels de vente connectés à Supabase.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-md">
            <Plus size={20} /> Créer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="animate-spin text-[var(--primary)]" />
          <p className="font-bold text-gray-400">Synchronisation avec Supabase...</p>
        </div>
      ) : funnels.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed">
           <p className="text-gray-400 mb-4">Aucun funnel trouvé dans la base de données.</p>
           <button className="text-[var(--primary)] font-bold">Lancer l'assistant LGM</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funnels.map(funnel => (
            <div key={funnel.id} className="bg-white border border-[var(--border-color)] rounded-[32px] p-6 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${funnel.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Globe size={20} />
                </div>
                <button onClick={() => handleDelete(funnel.id)} className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-[18px] text-[var(--text-title)] mb-2 group-hover:text-[var(--primary)] transition-colors">{funnel.name}</h3>
                <p className="text-[13px] text-[var(--text-muted)] line-clamp-2 mb-6">{funnel.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-[var(--border-color)] mb-6">
                 <div className="text-center">
                    <span className="block text-[18px] font-bold text-[var(--text-title)]">{funnel.views}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Vues</span>
                 </div>
                 <div className="text-center border-l border-[var(--border-color)]">
                    <span className="block text-[18px] font-bold text-[var(--text-title)]">{funnel.conversions}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Leads</span>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(funnel)} className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-title)] font-bold text-[13px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Edit size={16} /> Éditer
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] font-bold text-[13px] hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-2">
                  <BarChart3 size={16} /> Stats
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
