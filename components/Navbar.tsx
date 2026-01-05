
import React from 'react';
import { LayoutGrid, Volume2, Moon, Sun, Bell, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, isDarkMode, toggleDarkMode }) => {
  return (
    <nav className="h-20 px-8 flex items-center justify-between transition-all duration-300">
      
      <div className="flex items-center gap-8">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <LayoutGrid size={18} className="text-gray-400" />
        </div>
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <span className="text-[var(--text-muted)] hover:text-[var(--text-title)] transition-colors cursor-pointer">Dashboard</span>
          <span className="text-gray-300 font-light">/</span>
          <span className="text-[var(--text-title)] font-bold capitalize">{activeTab.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 font-bold text-[12px] px-4 py-2 rounded-full border border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] transition-all hover:shadow-md">
          <Sparkles size={14} fill="currentColor" />
          Pro Plan
        </button>

        <div className="flex items-center gap-4 text-[var(--text-body)]">
          <button className="hover:text-[var(--primary)] transition-colors p-2"><Volume2 size={20} /></button>
          
          <button onClick={toggleDarkMode} className="hover:text-[var(--primary)] transition-colors p-2">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="hover:text-[var(--primary)] transition-colors relative p-2">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--bg-app)]"></span>
          </button>
        </div>

        <div className="h-8 w-px bg-[var(--border-color)]"></div>

        <div className="flex items-center gap-2 cursor-pointer hover:text-[var(--primary)] transition-colors">
          <span className="text-[14px] font-bold text-[var(--text-title)]">FR</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
