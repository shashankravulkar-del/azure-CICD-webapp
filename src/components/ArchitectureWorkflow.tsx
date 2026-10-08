import React, { useState } from 'react';
import {
  Laptop,
  GitBranch,
  Terminal,
  Layers,
  Archive,
  Cloud,
  Globe,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface ArchitectureWorkflowProps {
  config: ProjectConfig;
}

interface WorkflowNode {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  inputs: string[];
  outputs: string[];
  keyCommand?: string;
}

export const ArchitectureWorkflow: React.FC<ArchitectureWorkflowProps> = ({ config }) => {
  const [selectedNode, setSelectedNode] = useState<string>('github');

  const nodes: WorkflowNode[] = [
    {
      id: 'developer',
      title: 'Developer',
      subtitle: 'Local Workstation',
      icon: Laptop,
      description: 'DevOps engineer creates HTML/CSS/JS or Python web source, configures Dockerfile and azure-pipelines.yml, and commits code.',
      inputs: ['Source Code', 'Dockerfile', 'Nginx Config'],
      outputs: ['Git Commit', 'Git Push to main'],
      keyCommand: `git commit -m "feat: automated container delivery" && git push origin main`,
    },
    {
      id: 'github',
      title: 'GitHub',
      subtitle: 'Source Control',
      icon: GitBranch,
      description: 'Central version control repository. Webhooks notify Azure DevOps Pipelines automatically whenever commits land on the main branch.',
      inputs: ['Developer Push', 'Pull Requests'],
      outputs: ['Webhook Event', 'Source Code Checkout'],
      keyCommand: `git remote add origin https://github.com/<USER>/azure-cicd-webapp.git`,
    },
    {
      id: 'pipeline',
      title: 'Azure Pipeline',
      subtitle: 'Ubuntu Build Agent',
      icon: Terminal,
      description: 'Azure DevOps triggers a fresh Linux container agent (ubuntu-latest), sets up environment variables, and parses azure-pipelines.yml.',
      inputs: ['Webhook Trigger', 'azure-pipelines.yml', 'Service Connection: ' + config.serviceConnection],
      outputs: ['Build Logs', 'Artifact Validation', 'Health Probe Verification'],
    },
    {
      id: 'docker',
      title: 'Docker Build',
      subtitle: 'Containerization',
      icon: Layers,
      description: 'Compiles lightweight Nginx Alpine container image (<25MB), runs internal unit verification, and tags the artifact with $(Build.BuildId).',
      inputs: ['Dockerfile', 'nginx.conf', 'src/ directory'],
      outputs: [`${config.imageName}:${config.imageTag}`, `${config.imageName}:latest`],
      keyCommand: `docker build -t ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag} .`,
    },
    {
      id: 'acr',
      title: 'Azure Container Registry',
      subtitle: 'Private Docker Registry',
      icon: Archive,
      description: 'Enterprise container registry securely holds immutable Docker image tags. Provides rapid network transfer within the Azure backbone.',
      inputs: ['az acr login', 'Docker Push'],
      outputs: ['Stored OCI Artifacts', 'Webhook Events to App Service'],
      keyCommand: `docker push ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}`,
    },
    {
      id: 'appservice',
      title: 'Azure App Service',
      subtitle: 'Linux Web App',
      icon: Cloud,
      description: 'Managed PaaS web host pulling container image from ACR via AzureWebAppContainer task. Exposes HTTP port 80 and manages SSL & scaling.',
      inputs: ['Image Pull from ACR', 'WEBSITES_PORT=80 App Setting'],
      outputs: ['Running Container Host', 'Application Logs'],
      keyCommand: `az webapp config appsettings set --name ${config.webAppName} --settings WEBSITES_PORT=80`,
    },
    {
      id: 'live',
      title: 'Live Web App',
      subtitle: 'Global End-User Access',
      icon: Globe,
      description: 'High-availability public web interface accessible over HTTPS. Delivers the Cloud DevOps Dashboard to users worldwide.',
      inputs: ['HTTP Requests via Port 80/443'],
      outputs: ['Rendered Web Dashboard', 'Real-time Health Probes'],
      keyCommand: `curl https://${config.webAppName}.azurewebsites.net/health`,
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">End-to-End CI/CD Architecture Flow</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive visualization of the continuous integration and delivery lifecycle. Click any stage to inspect.
          </p>
        </div>
        <div className="text-xs text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded">
          Automated · Zero Downtime
        </div>
      </div>

      {/* Workflow Chain Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {nodes.map((node, idx) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;
          return (
            <div key={node.id} className="relative flex flex-col">
              <button
                onClick={() => setSelectedNode(node.id)}
                className={`p-3 rounded-lg border text-left transition-all h-full flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-medium">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 leading-snug">
                    {node.title}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {node.subtitle}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Node Deep Dive Inspector */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <activeNodeData.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {activeNodeData.title}
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({activeNodeData.subtitle})
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeNodeData.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                  Inputs & Dependencies
                </span>
                <ul className="space-y-1">
                  {activeNodeData.inputs.map((inp, i) => (
                    <li key={i} className="text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-cyan-400">›</span> {inp}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                  Outputs & Downstream Actions
                </span>
                <ul className="space-y-1">
                  {activeNodeData.outputs.map((out, i) => (
                    <li key={i} className="text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-emerald-400">›</span> {out}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {activeNodeData.keyCommand && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                  Associated CLI / Git Action
                </span>
                <div className="bg-slate-900 border border-slate-800 rounded px-3 py-2 font-mono text-xs text-cyan-300 overflow-x-auto select-all">
                  {activeNodeData.keyCommand}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
