import React, { useState } from 'react';
import {
  Download,
  Sliders,
  Terminal,
  Layers,
  Cloud,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Archive,
  Code,
  FileCode,
} from 'lucide-react';
import { TopBar } from './components/TopBar';
import { ArchitectureWorkflow } from './components/ArchitectureWorkflow';
import { PipelineStages } from './components/PipelineStages';
import { DockerSection } from './components/DockerSection';
import { AzureDeploymentSection } from './components/AzureDeploymentSection';
import { PowerShellGuide } from './components/PowerShellGuide';
import { RepositoryExplorer } from './components/RepositoryExplorer';
import { HealthStatus } from './components/HealthStatus';
import { TechStackGrid } from './components/TechStackGrid';
import { AboutSection } from './components/AboutSection';
import { ConfigModal } from './components/ConfigModal';
import { ProjectConfig, defaultConfig } from './data/projectFiles';
import { exportNginxProjectZip } from './utils/zipExport';

export default function App() {
  const [config, setConfig] = useState<ProjectConfig>(() => {
    const saved = localStorage.getItem('azure_devops_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleSaveConfig = (newConfig: ProjectConfig) => {
    setConfig(newConfig);
    localStorage.setItem('azure_devops_config', JSON.stringify(newConfig));
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      await exportNginxProjectZip(config);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar with Brand & Actions */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConfig={() => setIsConfigOpen(true)}
        onExportZip={handleExportZip}
        isExporting={isExporting}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Project: Azure CI/CD Web Application</span>
              <span>·</span>
              <span>Dashboard: Cloud DevOps Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Cloud DevOps Dashboard &amp; Azure CI/CD Pipeline
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              A production-ready DevOps implementation featuring lightweight Nginx Alpine containerization, private image distribution via Azure Container Registry (ACR), automated delivery via Azure Pipelines, and scalable hosting on Azure App Service.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportZip}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Project ZIP</span>
              </button>

              <button
                onClick={() => setActiveTab('powershell')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Windows PowerShell Steps</span>
              </button>

              <button
                onClick={() => setIsConfigOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Configure Variables</span>
              </button>
            </div>
          </div>

          {/* Quick Config Badges */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-slate-500">ACR:</span>{' '}
              <span className="text-cyan-300">{config.acrName}</span>
            </div>
            <div>
              <span className="text-slate-500">Image:</span>{' '}
              <span className="text-cyan-300">{config.imageName}:{config.imageTag}</span>
            </div>
            <div>
              <span className="text-slate-500">App Service:</span>{' '}
              <span className="text-cyan-300">{config.webAppName}</span>
            </div>
            <div>
              <span className="text-slate-500">Resource Group:</span>{' '}
              <span className="text-cyan-300">{config.resourceGroup}</span>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <ArchitectureWorkflow config={config} />
            <TechStackGrid config={config} />
            <HealthStatus config={config} />
            <AboutSection config={config} />
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-8">
            <PipelineStages config={config} />
            <ArchitectureWorkflow config={config} />
          </div>
        )}

        {activeTab === 'docker' && (
          <div className="space-y-8">
            <DockerSection config={config} />
            <HealthStatus config={config} />
          </div>
        )}

        {activeTab === 'azure' && (
          <div className="space-y-8">
            <AzureDeploymentSection config={config} onOpenConfig={() => setIsConfigOpen(true)} />
          </div>
        )}

        {activeTab === 'powershell' && (
          <div className="space-y-8">
            <PowerShellGuide config={config} />
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-8">
            <RepositoryExplorer config={config} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="text-white font-medium">Azure CI/CD Web Application</span>
            <span className="mx-2">·</span>
            <span>Cloud DevOps Dashboard</span>
          </div>
          <div>
            Independent Cloud DevOps Portfolio Project
          </div>
        </div>
      </footer>

      {/* Configuration Drawer/Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
