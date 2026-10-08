import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface PowerShellGuideProps {
  config: ProjectConfig;
}

export const PowerShellGuide: React.FC<PowerShellGuideProps> = ({ config }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const psCommands = [
    {
      id: '1',
      title: '1. Check Docker',
      purpose: 'Verifies Docker CLI and engine status on Windows',
      cmd: `docker --version; docker info`,
      note: 'Ensure Docker Desktop for Windows is running with WSL 2 backend enabled.',
    },
    {
      id: '2',
      title: '2. Build the Docker Image',
      purpose: 'Builds the Alpine Nginx image from the local Dockerfile',
      cmd: `docker build -t ${config.imageName}:${config.imageTag} .`,
      note: 'Run inside the azure-cicd-webapp directory where Dockerfile resides.',
    },
    {
      id: '3',
      title: '3. Run the Container',
      purpose: 'Launches local container detached on port 8080',
      cmd: `docker run -d -p 8080:80 --name devops-app ${config.imageName}:${config.imageTag}`,
      note: 'Maps host port 8080 to container port 80.',
    },
    {
      id: '4',
      title: '4. Test the Local Website',
      purpose: 'Probes local HTTP server and opens browser in PowerShell',
      cmd: `Invoke-WebRequest -Uri http://localhost:8080/health -UseBasicParsing; Start-Process http://localhost:8080`,
      note: 'Invoke-WebRequest verifies HTTP 200 and Start-Process opens default browser.',
    },
    {
      id: '5',
      title: '5. Stop the Container',
      purpose: 'Gracefully sends SIGTERM to Nginx container',
      cmd: `docker stop devops-app`,
      note: 'Allows in-flight requests to complete before termination.',
    },
    {
      id: '6',
      title: '6. Remove the Container',
      purpose: 'Deletes stopped container to free port and name',
      cmd: `docker rm devops-app`,
      note: 'Prepares local environment for subsequent test iterations.',
    },
    {
      id: '7',
      title: '7. Tag the Image',
      purpose: 'Tags local Docker image for Azure Container Registry target',
      cmd: `docker tag ${config.imageName}:${config.imageTag} ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}`,
      note: 'Adds the required ACR namespace domain to the container metadata.',
    },
    {
      id: '8',
      title: '8. Login to Azure',
      purpose: 'Authenticates PowerShell session with Azure subscription',
      cmd: `az login`,
      note: 'Opens your default browser to complete Azure Active Directory login.',
    },
    {
      id: '9',
      title: '9. Login to Azure Container Registry',
      purpose: 'Authenticates local Docker client directly with private ACR',
      cmd: `az acr login --name ${config.acrName}`,
      note: 'Injects transient ACR OAuth bearer tokens into Docker CLI.',
    },
    {
      id: '10',
      title: '10. Push the Docker Image',
      purpose: 'Uploads container layers to Azure Container Registry',
      cmd: `docker push ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}`,
      note: 'Only sends new or modified layers. Verifiable in Azure Portal / ACR.',
    },
  ];

  const fullScript = `# Windows PowerShell Full Deployment & Test Script
# Project: Azure CI/CD Web Application
# Author: Cloud DevOps Project

Write-Host ">>> 1. Verifying Docker Engine..." -ForegroundColor Cyan
docker --version
docker info

Write-Host ">>> 2. Building Docker Image..." -ForegroundColor Cyan
docker build -t ${config.imageName}:${config.imageTag} .

Write-Host ">>> 3. Running Container Locally..." -ForegroundColor Cyan
docker run -d -p 8080:80 --name devops-app ${config.imageName}:${config.imageTag}

Write-Host ">>> 4. Testing Local Health Endpoint..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Invoke-WebRequest -Uri http://localhost:8080/health -UseBasicParsing

Write-Host ">>> 5 & 6. Stopping and Removing Container..." -ForegroundColor Cyan
docker stop devops-app
docker rm devops-app

Write-Host ">>> 7. Tagging Image for ACR..." -ForegroundColor Cyan
docker tag ${config.imageName}:${config.imageTag} ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}

Write-Host ">>> 8 & 9. Authenticating with Azure & ACR..." -ForegroundColor Cyan
az login
az acr login --name ${config.acrName}

Write-Host ">>> 10. Pushing Docker Image to ACR..." -ForegroundColor Cyan
docker push ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}

Write-Host ">>> Deployment script completed successfully!" -ForegroundColor Green
`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">
            Windows PowerShell Setup &amp; Execution Guide
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Exact PowerShell commands to build, test, tag, authenticate, and push to Azure from Windows.
          </p>
        </div>
        <button
          onClick={() => copyCommand(fullScript, 'full-script')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors self-start sm:self-auto font-semibold cursor-pointer"
        >
          {copiedId === 'full-script' ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Script Copied!</span>
            </>
          ) : (
            <>
              <FileCode className="w-3.5 h-3.5" />
              <span>Copy Full Script (.ps1)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {psCommands.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-white">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400">
                  · {item.purpose}
                </span>
              </div>
              <code className="block bg-slate-900 border border-slate-800 rounded px-3 py-1.5 font-mono text-xs text-cyan-300 select-all overflow-x-auto my-1.5">
                {item.cmd}
              </code>
              <p className="text-[11px] text-slate-500">
                {item.note}
              </p>
            </div>
            <button
              onClick={() => copyCommand(item.cmd, item.id)}
              className="self-start md:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors shrink-0"
            >
              {copiedId === item.id ? (
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
  );
};
