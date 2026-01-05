
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, ComposedChart, Line
} from 'recharts';
import { AppTheme } from '../types';
import { Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  theme: AppTheme;
}

const DATA_TRAFFIC = [
  { name: 'Lun', views: 400, leads: 24 },
  { name: 'Mar', views: 300, leads: 18 },
  { name: 'Mer', views: 600, leads: 45 },
  { name: 'Jeu', views: 800, leads: 62 },
  { name: 'Ven', views: 500, leads: 32 },
  { name: 'Sam', views: 200, leads: 10 },
  { name: 'Dim', views: 300, leads: 20 },
];

const DATA_FUNNEL = [
  { step: 'Attract', value: 100 },
  { step: 'Engage', value: 75 },
  { step: 'Qualify', value: 45 },
  { step: 'Convert', value: 20 },
  { step: 'Close', value: 11 },
];

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ theme }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[var(--text-title)]">Performance LGM</h2>
          <p className="text-[14px] text-[var(--text-muted)]">Analysez la conversion de votre Lead Generation Machine.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-[var(--border-color)] px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all text-[14px]">
            <Calendar size={18} /> Derniers 30 jours
          </button>
          <button className="bg-[var(--primary)] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-lg transition-all text-[14px]">
            <Download size={18} /> Exporter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Visiteurs Uniques', value: '12,840', trend: '+12.5%', isUp: true },
          { label: 'Vidéos Visionnées', value: '45,201', trend: '+45.1%', isUp: true },
          { label: 'Taux de Rétention', value: '68%', trend: '-2.2%', isUp: false },
          { label: 'Cout par Lead AI', value: '1.24€', trend: '-8.4%', isUp: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-[var(--border-color)] rounded-[32px] p-8 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-[var(--text-title)]">{stat.value}</span>
              <span className={`text-[12px] font-bold flex items-center gap-0.5 ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white border border-[var(--border-color)] rounded-[32px] p-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-[var(--text-title)]">Santé du Funnel (Entonnoir)</h3>
              <TrendingUp className="text-[var(--primary)]" />
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={DATA_FUNNEL}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 600, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="value" barSize={60} radius={[30, 30, 0, 0]}>
                    {DATA_FUNNEL.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#FF4D00' : index === 4 ? '#111827' : '#F97316'} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="value" stroke="#FF4D00" strokeWidth={3} dot={{ r: 6, fill: '#FF4D00', strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white border border-[var(--border-color)] rounded-[32px] p-10 flex flex-col">
            <h3 className="text-xl font-bold text-[var(--text-title)] mb-10">Meilleures Sources</h3>
            <div className="space-y-6 flex-1">
               {[
                 { name: 'Instagram Ads', val: 42, color: 'bg-pink-500' },
                 { name: 'TikTok Organic', val: 31, color: 'bg-black' },
                 { name: 'YouTube Shorts', val: 18, color: 'bg-red-500' },
                 { name: 'Google Search', val: 9, color: 'bg-blue-500' },
               ].map((source, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                       <span>{source.name}</span>
                       <span>{source.val}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className={`h-full ${source.color} rounded-full`} style={{ width: `${source.val}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-10 p-4 bg-[var(--primary-soft)] rounded-2xl">
               <p className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-widest mb-1">Optimisation IA</p>
               <p className="text-xs text-[var(--text-body)]">Le trafic Instagram a augmenté de 12% grâce au nouveau script Veo.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
