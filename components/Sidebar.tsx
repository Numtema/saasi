
import React, { useState } from 'react';
import { 
  LayoutDashboard, Video, Users, BarChart3, 
  Sparkles, Settings, ChevronRight, ChevronDown, ChevronsUpDown, 
  PlusCircle, BookOpen, Layers, Film
} from 'lucide-react';
import { SHARED_THEME } from '../theme';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, activeTab, setActiveTab }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    funnels: true,
  });

  const toggleSubmenu = (id: string) => {
    if (!isCollapsed) setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: "Tableau de bord" },
    { 
      id: 'funnels', icon: <Video size={18} />, label: "Funnels AI", hasSubmenu: true,
      subItems: [
        { id: 'funnels', label: 'Mes Funnels' },
        { id: 'lgm-wizard', label: 'Nouveau Funnel AI', icon: <Sparkles size={12} /> }
      ]
    },
    { id: 'video-gen', icon: <Film size={18} />, label: "Veo Studio" },
    { id: 'leads', icon: <Users size={18} />, label: "CRM Leads" },
    { id: 'analytics', icon: <BarChart3 size={18} />, label: "Analytique" },
    { id: 'templates', icon: <Layers size={18} />, label: "Templates" },
    { id: 'settings', icon: <Settings size={18} />, label: "Paramètres" },
  ];

  return (
    <aside 
      className="fixed top-0 left-0 h-full border-r flex flex-col transition-all duration-300 z-40"
      style={{ 
        width: isCollapsed ? SHARED_THEME.sidebarCollapsedWidth : SHARED_THEME.sidebarWidth,
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-sidebar)'
      }}
    >
      <div className={`p-6 pb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border bg-white flex items-center justify-center rounded-xl shadow-sm overflow-hidden shrink-0 border-gray-100">
             <img src="https://storage.googleapis.com/gpt-engineer-file-uploads/yKqrz6SPqfVJNDBF5KazpTaHwSp2/uploads/1765489788754-Nümtema-face-logo.png" alt="logo" className="w-8 h-8 object-contain" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <h2 className="font-bold text-[14px] tracking-tight text-[var(--text-title)]">Nümtema Face</h2>
              <p className="text-[10px] font-medium text-[var(--text-muted)]">AI Funnel Agency</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto mt-6 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            <button 
              onClick={() => {
                if (item.hasSubmenu) toggleSubmenu(item.id);
                else setActiveTab(item.id);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                activeTab === item.id ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-bold' : 'text-[var(--text-body)] hover:bg-gray-50'
              }`}
            >
              <span className={activeTab === item.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}>{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="text-[13px] font-medium flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu && (
                    <div className="opacity-40">
                      {expandedMenus[item.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  )}
                </>
              )}
            </button>

            {!isCollapsed && item.hasSubmenu && expandedMenus[item.id] && item.subItems && (
              <div className="mt-1 space-y-1">
                {item.subItems.map(subItem => (
                  <button 
                    key={subItem.id}
                    onClick={() => setActiveTab(subItem.id)}
                    className={`w-full text-left text-[12px] py-2 px-4 ml-6 rounded-lg transition-all flex items-center gap-2 ${
                      activeTab === subItem.id ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                    }`}
                  >
                    {subItem.icon}
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className={`flex items-center gap-2 p-2 rounded-2xl transition-all hover:bg-gray-50 ${isCollapsed ? 'justify-center' : ''}`}>
           <div className="w-9 h-9 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
             NF
           </div>
           {!isCollapsed && (
             <div className="flex-1 overflow-hidden ml-1">
               <h4 className="font-bold text-[12px] truncate text-[var(--text-title)]">Admin Team</h4>
               <p className="text-[10px] truncate text-[var(--text-muted)] font-medium">numtema-face.ai</p>
             </div>
           )}
           {!isCollapsed && <ChevronsUpDown size={14} className="text-[var(--text-muted)] ml-auto" />}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
