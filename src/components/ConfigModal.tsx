import React, { useState } from 'react';
import { X, RefreshCw, Check } from 'lucide-react';
import { ProjectConfig, defaultConfig } from '../data/projectFiles';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProjectConfig;
  onSave: (newConfig: ProjectConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [form, setForm] = useState<ProjectConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key: keyof ProjectConfig, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setForm(defaultConfig);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Azure Project Variables</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize placeholders to generate tailored CLI commands, pipeline YAML, and ZIP exports.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Azure Subscription ID
              </label>
              <input
                type="text"
                value={form.subscriptionId}
                onChange={(e) => handleChange('subscriptionId', e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Used in az account set</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Resource Group Name
              </label>
              <input
                type="text"
                value={form.resourceGroup}
                onChange={(e) => handleChange('resourceGroup', e.target.value)}
                placeholder="rg-devops-eastus"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Container for all Azure resources</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Azure Container Registry (ACR) Name
              </label>
              <input
                type="text"
                value={form.acrName}
                onChange={(e) => handleChange('acrName', e.target.value)}
                placeholder="mydevopsregistry"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Without .azurecr.io suffix</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Azure Region / Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="eastus"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">e.g. eastus, westeurope</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Docker Image Name
              </label>
              <input
                type="text"
                value={form.imageName}
                onChange={(e) => handleChange('imageName', e.target.value)}
                placeholder="cloud-devops-dashboard"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Repository name in ACR</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Docker Image Tag
              </label>
              <input
                type="text"
                value={form.imageTag}
                onChange={(e) => handleChange('imageTag', e.target.value)}
                placeholder="v1.0"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Default tag for local testing</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Azure App Service Web App Name
              </label>
              <input
                type="text"
                value={form.webAppName}
                onChange={(e) => handleChange('webAppName', e.target.value)}
                placeholder="app-devops-prod-01"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Creates .azurewebsites.net URL</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                DevOps Service Connection Name
              </label>
              <input
                type="text"
                value={form.serviceConnection}
                onChange={(e) => handleChange('serviceConnection', e.target.value)}
                placeholder="Azure-ARM-Service-Connection"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Configured in Azure DevOps Project Settings</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Placeholders</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-slate-400 hover:text-white bg-slate-800 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-semibold text-xs transition-colors"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                <span>Apply Variables</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
