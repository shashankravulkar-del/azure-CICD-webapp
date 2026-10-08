import React from 'react';
import {
  Code,
  Layers,
  Archive,
  Cloud,
  Terminal,
  GitBranch,
  FileCode2,
  Cpu,
  Globe,
} from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface TechStackGridProps {
  config: ProjectConfig;
}

export const TechStackGrid: React.FC<TechStackGridProps> = ({ config }) => {
  const stack = [
    {
      name: 'HTML5 & CSS3',
      category: 'Frontend UI',
      icon: Code,
      badge: 'Semantic & Responsive',
      description: 'Clean responsive dashboard layout with modular stylesheets and cross-device support.',
    },
    {
      name: 'JavaScript',
      category: 'Client Scripting',
      icon: Globe,
      badge: 'ES6+ Native',
      description: 'Lightweight client-side telemetry, health check validation, and uptime metrics.',
    },
    {
      name: 'Docker',
      category: 'Container Engine',
      icon: Layers,
      badge: 'Alpine Linux · Port 80',
      description: 'Production containerization using lightweight Nginx Alpine base image (< 25MB).',
    },
    {
      name: 'Azure Container Registry',
      category: 'Private Cloud Registry',
      icon: Archive,
      badge: `ACR: ${config.acrName}`,
      description: 'Enterprise OCI image store integrated with Azure Active Directory and RBAC.',
    },
    {
      name: 'Azure App Service',
      category: 'Cloud PaaS Hosting',
      icon: Cloud,
      badge: 'Linux Container Plan',
      description: 'Managed web hosting service with continuous deployment triggers and SSL termination.',
    },
    {
      name: 'Azure Pipelines',
      category: 'CI/CD Automation',
      icon: Terminal,
      badge: 'Multi-Stage YAML',
      description: 'Automated continuous integration pipeline executing on Ubuntu VM agents.',
    },
    {
      name: 'GitHub',
      category: 'Source Control',
      icon: GitBranch,
      badge: 'Git Webhooks',
      description: 'Version control repository triggering Azure DevOps builds on code push.',
    },
    {
      name: 'YAML',
      category: 'Pipeline as Code',
      icon: FileCode2,
      badge: 'Declarative Config',
      description: 'Syntactically structured pipeline-as-code definition in azure-pipelines.yml.',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white">Technology Stack</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          End-to-end tooling powering source control, container build, image registry, and cloud hosting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stack.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">
                  {item.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900">
                <span className="text-[10px] font-mono text-cyan-400 truncate block">
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
