
import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Mail, Phone, ExternalLink, Loader2 } from 'lucide-react';
import { AppTheme, Lead } from '../types';
import { storageService } from '../services/storageService';

interface LeadsViewProps {
  theme: AppTheme;
}

const LeadsView: React.FC<LeadsViewProps> = ({ theme }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await storageService.getLeads();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[var(--text-title)]">CRM Leads</h2>
          <p className="text-[14px] text-[var(--text-muted)]">Prospects capturés et synchronisés via Supabase.</p>
        </div>
        <button className="bg-white border border-[var(--border-color)] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all">
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      <div className="bg-white border border-[var(--border-color)] rounded-[32px] overflow-hidden shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
             <Loader2 className="animate-spin text-[var(--primary)]" />
             <p className="text-gray-400 font-medium">Récupération des leads...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-[var(--border-color)]">
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Prospect</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Score</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Statut</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Date</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[15px] text-[var(--text-title)]">{lead.name}</span>
                        <span className="text-[12px] text-[var(--text-muted)] flex items-center gap-1"><Mail size={12}/> {lead.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${lead.score > 80 ? 'bg-green-500' : lead.score > 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${lead.score}%` }}></div>
                         </div>
                         <span className="text-[13px] font-bold">{lead.score}/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {lead.status === 'new' ? 'Nouveau' : 'Converti'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[var(--text-muted)]">
                      {/* Fix: Use 'createdAt' property as defined in the Lead interface to resolve TypeScript error */}
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-white border rounded-lg transition-all text-[var(--text-body)]">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsView;
