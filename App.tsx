
import React, { useState, useEffect } from 'react';
import { THEMES, SHARED_THEME } from './theme';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import FunnelsView from './components/FunnelsView';
import FunnelEditor from './components/FunnelEditor';
import LeadsView from './components/LeadsView';
import AnalyticsView from './components/AnalyticsView';
import LGMWizard from './components/LGMWizard';
import VideoGenView from './components/VideoGenView';
import TemplatesView from './components/TemplatesView';
import SettingsView from './components/SettingsView';
import LiveCoach from './components/LiveCoach';
import { Funnel, AppTheme } from './types';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState<Funnel | null>(null);

  useEffect(() => {
    const theme = isDarkMode ? THEMES.dark : THEMES.light;
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [isDarkMode]);

  const currentTheme: AppTheme = {
    colors: {
      primary: 'var(--primary)',
      primarySoft: 'var(--primary-soft)',
      surface: 'var(--bg-surface)',
      border: 'var(--border-color)',
      bg: 'var(--bg-app)',
      text: {
        title: 'var(--text-title)',
        body: 'var(--text-body)',
        muted: 'var(--text-muted)'
      }
    }
  };

  const handleEditFunnel = (funnel: Funnel) => {
    setEditingFunnel(funnel);
    setActiveTab('editor');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView theme={currentTheme} onNavigate={setActiveTab} />;
      case 'funnels': return <FunnelsView theme={currentTheme} onEdit={handleEditFunnel} />;
      case 'leads': return <LeadsView theme={currentTheme} />;
      case 'analytics': return <AnalyticsView theme={currentTheme} />;
      case 'video-gen': return <VideoGenView />;
      case 'templates': return <TemplatesView theme={currentTheme} onUseTemplate={handleEditFunnel} />;
      case 'settings': return <SettingsView theme={currentTheme} />;
      case 'lgm-wizard': return <LGMWizard theme={currentTheme} onComplete={() => setActiveTab('funnels')} />;
      case 'editor': return editingFunnel ? 
        <FunnelEditor funnel={editingFunnel} theme={currentTheme} onBack={() => setActiveTab('funnels')} /> : 
        <FunnelsView theme={currentTheme} onEdit={handleEditFunnel} />;
      default: return <DashboardView theme={currentTheme} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div 
      className="flex min-h-screen transition-colors duration-500 font-['Outfit']"
      style={{ backgroundColor: 'var(--bg-app)' }}
    >
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div 
        className="flex-1 transition-all duration-300 ease-in-out flex flex-col" 
        style={{ 
          marginLeft: isSidebarCollapsed ? SHARED_THEME.sidebarCollapsedWidth : SHARED_THEME.sidebarWidth 
        }}
      >
        <Navbar 
          activeTab={activeTab} 
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        
        <main className="p-8 flex-1 overflow-y-auto pb-24">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <LiveCoach />
    </div>
  );
};

export default App;
