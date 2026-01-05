
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, TrendingUp, Clock, ArrowLeft, 
  MousePointerClick, TrendingDown, Timer, Calendar, Download,
  Smartphone
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { AppTheme } from '../types';

interface FunnelAnalyticsProps {
  funnelId: string;
  theme: AppTheme;
  onBack: () => void;
}

const FunnelAnalytics: React.FC<FunnelAnalyticsProps> = ({ funnelId, theme, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30');

  // Simulation de données haute fidélité
  const stats = {
    totalSessions: 1240,
    totalSubmissions: 142,
    conversionRate: 11.4,
    avgTime: 45
  };

  const sessionsData = [
    { date: '01/10', count: 45 }, { date: '05/10', count: 52 },
    { date: '10/10', count: 68 }, { date: '15/10', count: 110 },
    { date: '20/10', count: 85 }, { date: '25/10', count: 124 },
    { date: '30/10', count: 145 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 65, color: '#FF4D00' },
    { name: 'Desktop', value: 28, color: '#111827' },
    { name: 'Tablet', value: 7, color: '#9CA3AF' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-xl text-[var(--text-title)]"><ArrowLeft size={20}/></button>
           <div>
              <h2 className="text-2xl font-bold text-[var(--text-title)]">Performances Détaillées</h2>
              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">ID Funnel: {funnelId}</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <select 
             value={dateRange} 
             onChange={(e) => setDateRange(e.target.value)}
             className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-title)] text-xs font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none"
           >
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
           </select>
           <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"><Download size={14}/> Export PDF</button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Visiteurs', val: stats.totalSessions, icon: <Users size={18}/> },
           { label: 'Leads', val: stats.totalSubmissions, icon: <TrendingUp size={18}/> },
           { label: 'Taux Conv.', val: `${stats.conversionRate}%`, icon: <BarChart3 size={18}/> },
           { label: 'Temps Moy.', val: `${stats.avgTime}s`, icon: <Timer size={18}/> },
         ].map((kpi, i) => (
           <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-[32px] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{kpi.label}</span>
                 <div className="text-[var(--primary)] opacity-50">{kpi.icon}</div>
              </div>
              <p className="text-3xl font-black text-[var(--text-title)]">{kpi.val}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* TRAFFIC CHART */}
         <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-[40px] shadow-sm">
            <h3 className="font-bold text-[var(--text-title)] mb-6 flex items-center gap-2"><BarChart3 size={18}/> Évolution du Trafic</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionsData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', color: 'var(--text-title)'}} 
                    />
                    <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* DEVICES CHART */}
         <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-[40px] shadow-sm">
            {/* Added Smartphone import to resolve "Cannot find name 'Smartphone'" error */}
            <h3 className="font-bold text-[var(--text-title)] mb-6 flex items-center gap-2"><Smartphone size={18}/> Appareils</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%" cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={10}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FunnelAnalytics;
