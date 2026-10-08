import React, { useState } from 'react';
import {
  Cloud,
  Copy,
  Check,
  Info,
  ExternalLink,
  ShieldCheck,
  Server,
  Archive,
  Terminal,
  Activity,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface AzureDeploymentSectionProps {
  config: ProjectConfig;
  onOpenConfig: () => void;
}

export const AzureDeploymentSection: React.FC<AzureDeploymentSectionProps> = ({
  config,
  onOpenConfig,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'acr' | 'appservice' | 'verification'>('acr');

  const copyToClipboard = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const acrSteps = [
    {
      id: 'acr-1',
      title: '1. Create an Azure Container Registry (ACR)',
      desc: 'Provision a managed private OCI registry in your target resource group.',
      cmd: `az acr create --resource-group "${config.resourceGroup}" --name "${config.acrName}" --sku Basic --admin-enabled true`,
    },
    {
      id: 'acr-2',
      title: '2. Authenticate Docker with ACR',
      desc: 'Log in to your private registry instance using the Azure CLI credentials.',
      cmd: `az acr login --name "${config.acrName}"`,
    },
    {
      id: 'acr-3',
      title: '3. Build the Docker Image',
      desc: 'Compile your Dockerfile into a local image.',
      cmd: `docker build -t ${config.imageName}:${config.imageTag} .`,
    },
    {
      id: 'acr-4',
      title: '4. Tag the Image for ACR',
      desc: 'Tag your local image with the fully qualified ACR registry hostname.',
      cmd: `docker tag ${config.imageName}:${config.imageTag} ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}`,
    },
    {
      id: 'acr-5',
      title: '5. Push the Image to ACR',
      desc: 'Upload the tagged image layers over Azure private backbone.',
      cmd: `docker push ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}`,
    },
    {
      id: 'acr-6',
      title: '6. Verify the Image in ACR',
      desc: 'Query ACR repository to confirm image tag is securely registered.',
      cmd: `az acr repository show-tags --name "${config.acrName}" --repository "${config.imageName}" --output table`,
    },
  ];

  const appServiceSteps = [
    {
      id: 'app-1',
      title: '1. Create Linux App Service Plan',
      desc: 'Create an App Service Plan specifying Linux runtime and pricing tier (e.g., B1 Basic).',
      cmd: `az appservice plan create --name "plan-devops-linux" --resource-group "${config.resourceGroup}" --is-linux --sku B1`,
    },
    {
      id: 'app-2',
      title: '2. Create Container Web App',
      desc: 'Deploy the App Service pointing to your initial Docker image in ACR.',
      cmd: `az webapp create --resource-group "${config.resourceGroup}" --plan "plan-devops-linux" --name "${config.webAppName}" --deployment-container-image-name "${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}"`,
    },
    {
      id: 'app-3',
      title: '3. Connect App Service to ACR Credentials',
      desc: 'Grant App Service permission to pull private images from ACR via admin credentials or Managed Identity.',
      cmd: `az webapp config container set --name "${config.webAppName}" --resource-group "${config.resourceGroup}" --docker-custom-image-name "${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}" --docker-registry-server-url "https://${config.acrName}.azurecr.io"`,
    },
    {
      id: 'app-4',
      title: '4. Configure Required Application Settings (WEBSITES_PORT)',
      desc: 'Notify Azure App Service that Nginx is listening on container port 80.',
      cmd: `az webapp config appsettings set --resource-group "${config.resourceGroup}" --name "${config.webAppName}" --settings WEBSITES_PORT=80`,
    },
    {
      id: 'app-5',
      title: '5. Restart the App Service',
      desc: 'Trigger a clean container pull and service restart to apply configurations.',
      cmd: `az webapp restart --name "${config.webAppName}" --resource-group "${config.resourceGroup}"`,
    },
    {
      id: 'app-6',
      title: '6. Stream Container Logs',
      desc: 'Inspect real-time Docker runtime logs from the App Service host.',
      cmd: `az webapp log tail --name "${config.webAppName}" --resource-group "${config.resourceGroup}"`,
    },
    {
      id: 'app-7',
      title: '7. Verify the Deployed Website',
      desc: 'Check live HTTP response from the deployed Azure Web App endpoint.',
      cmd: `curl -I https://${config.webAppName}.azurewebsites.net/health`,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">Azure Deployment Management</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Azure Container Registry &amp; Azure App Service Linux Container configuration.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenConfig}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
          >
            Edit Placeholders →
          </button>
        </div>
      </div>

      {/* MANDATORY PROMPT REQUIREMENT: Clearly display status notice */}
      <div className="bg-blue-950/40 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3.5">
        <div className="p-2 bg-blue-900/50 rounded text-blue-400 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <div className="font-semibold text-white text-sm mb-1">
            Azure Deployment Status
          </div>
          <p className="text-blue-200 text-sm font-medium leading-relaxed mb-2">
            "Azure deployment will be available after configuring Azure resources."
          </p>
          <p className="text-slate-400 leading-normal">
            To make this application live on Azure, provision your Azure Container Registry (ACR) and Azure App Service using the exact CLI steps below, then run the Azure Pipeline. No fake deployment status is shown until cloud resources are actually deployed by you.
          </p>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 w-fit">
        <button
          onClick={() => setSubTab('acr')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
            subTab === 'acr' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Azure Container Registry (ACR)</span>
        </button>
        <button
          onClick={() => setSubTab('appservice')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
            subTab === 'appservice' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Azure App Service</span>
        </button>
        <button
          onClick={() => setSubTab('verification')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
            subTab === 'verification' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Verification &amp; Logs</span>
        </button>
      </div>

      {/* ACR Documentation Steps */}
      {subTab === 'acr' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-300">
            Follow these 6 exact steps to provision and authenticate your Azure Container Registry:
          </div>
          <div className="space-y-3">
            {acrSteps.map((step) => (
              <div
                key={step.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">
                    {step.desc}
                  </div>
                  <code className="block bg-slate-900 border border-slate-800 rounded px-3 py-1.5 font-mono text-xs text-cyan-300 select-all overflow-x-auto">
                    {step.cmd}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(step.cmd, step.id)}
                  className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors shrink-0"
                >
                  {copiedCmd === step.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App Service Documentation Steps */}
      {subTab === 'appservice' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-300">
            Follow these 7 exact steps to host and bind your Docker container on Azure App Service:
          </div>
          <div className="space-y-3">
            {appServiceSteps.map((step) => (
              <div
                key={step.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">
                    {step.desc}
                  </div>
                  <code className="block bg-slate-900 border border-slate-800 rounded px-3 py-1.5 font-mono text-xs text-cyan-300 select-all overflow-x-auto">
                    {step.cmd}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(step.cmd, step.id)}
                  className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors shrink-0"
                >
                  {copiedCmd === step.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification & Logs */}
      {subTab === 'verification' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Live Log Streaming
              </h4>
              <p className="text-slate-400 text-[11px]">
                Stream live Docker container stdout/stderr output from the App Service host machine:
              </p>
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-cyan-300 overflow-x-auto select-all">
                az webapp log tail --name "{config.webAppName}" --resource-group "{config.resourceGroup}"
              </pre>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Health Probe Verification
              </h4>
              <p className="text-slate-400 text-[11px]">
                Test the public App Service HTTPS URL and health endpoint:
              </p>
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-cyan-300 overflow-x-auto select-all">
                curl -i https://{config.webAppName}.azurewebsites.net/health
              </pre>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Target Deployment Endpoint Preview</h4>
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800 font-mono text-xs">
              <span className="text-slate-300">
                https://{config.webAppName}.azurewebsites.net
              </span>
              <span className="text-amber-400 text-[11px] font-sans">
                Pending Cloud Provisioning
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
