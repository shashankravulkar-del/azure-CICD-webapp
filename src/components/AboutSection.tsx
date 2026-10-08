import React from 'react';
import { ShieldCheck, BookOpen, Layers, CheckCircle2, Cloud } from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface AboutSectionProps {
  config: ProjectConfig;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ config }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">About Azure CI/CD Web Application</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Independent cloud engineering portfolio project demonstrating enterprise DevOps principles.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Independent Portfolio Project
        </div>
      </div>

      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-white text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Project Mission &amp; Overview
          </h4>
          <p>
            The <strong>Azure CI/CD Web Application</strong> is designed as a complete, real-world demonstration of modern cloud DevOps automation. It bridges local container engineering with hyperscale cloud delivery on <strong>Microsoft Azure</strong>, packaging a high-performance web dashboard into a lightweight Alpine container and releasing it through a fully declarative YAML pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Core Architecture Decisions
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Minimal Attack Surface:</strong> Using Alpine Linux keeps the container image under 25MB and reduces Common Vulnerabilities and Exposures (CVEs).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Immutable Deployments:</strong> Every build generates a distinct build ID tag (<code className="text-slate-300">$(Build.BuildId)</code>) alongside the <code className="text-slate-300">latest</code> tag in Azure Container Registry.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Pre-Flight Container Validation:</strong> Pipelines test the <code className="text-slate-300">/health</code> endpoint on the build agent before publishing to registry.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security &amp; Secret Management
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Hardcoded Credentials:</strong> Passwords, API keys, and subscription tokens never reside in source code or Git history.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Service Connections:</strong> Azure DevOps uses automated service principals with role-based access control (RBAC) restricted to the target Resource Group.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Managed Identities:</strong> In production, Azure App Service pulls images from ACR using Azure Managed Identity (<code className="text-slate-300">AcrPull</code> role), avoiding static passwords completely.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-white">DevOps Engineering Competencies Demonstrated</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-cyan-300">
              Containerization
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-cyan-300">
              Pipeline as Code
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-cyan-300">
              Cloud Infrastructure
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-cyan-300">
              Zero-Downtime Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
