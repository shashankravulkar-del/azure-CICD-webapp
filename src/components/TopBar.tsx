import React from 'react';
import { Download, Sliders, Cloud, Check } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConfig: () => void;
  onExportZip: () => void;
  isExporting: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConfig,
  onExportZip,
  isExporting,
}) => {
  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'pipeline', label: 'Pipeline Stages' },
    { id: 'docker', label: 'Docker' },
    { id: 'azure', label: 'Azure Deployment' },
    { id: 'powershell', label: 'Windows PowerShell' },
    { id: 'files', label: 'Project Files' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            <Cloud className="w-4.5 h-4.5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
            Cloud DevOps Dashboard
          </span>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`text-xs font-medium transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                activeTab === link.id
                  ? 'border-cyan-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="Configure Azure placeholders and variables"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Variables</span>
          </button>

          <button
            onClick={onExportZip}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap font-semibold cursor-pointer disabled:opacity-60"
          >
            {isExporting ? (
              <Check className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export ZIP</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab scroll */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-2 overflow-x-auto border-t border-slate-900 bg-slate-950/95 scrollbar-none">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`text-xs font-medium whitespace-nowrap pb-1 border-b-2 cursor-pointer ${
              activeTab === link.id
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
