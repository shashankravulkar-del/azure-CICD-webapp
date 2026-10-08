import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Terminal, ShieldAlert } from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface PipelineStagesProps {
  config: ProjectConfig;
}

interface StageDetail {
  id: number;
  name: string;
  stageGroup: string;
  taskName: string;
  objective: string;
  yamlCode: string;
  notes: string;
}

export const PipelineStages: React.FC<PipelineStagesProps> = ({ config }) => {
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [copiedStage, setCopiedStage] = useState<number | null>(null);

  const stages: StageDetail[] = [
    {
      id: 1,
      name: 'Checkout Source Code',
      stageGroup: 'Stage 1: Build & Validate',
      taskName: 'checkout: self',
      objective: 'Retrieves the latest commit from the GitHub repository into the build agent workspace.',
      yamlCode: `- checkout: self
  displayName: '1. Checkout Source Code'
  clean: true
  fetchDepth: 1`,
      notes: 'Ensures a pristine workspace on the Ubuntu agent with shallow depth for lightning-fast checkouts.',
    },
    {
      id: 2,
      name: 'Install / Setup Required Tools',
      stageGroup: 'Stage 1: Build & Validate',
      taskName: 'Bash@3 (Tooling Verification)',
      objective: 'Validates that Docker Engine, curl, and necessary CLI tools are ready on the runner.',
      yamlCode: `- task: Bash@3
  displayName: '2. Verify Tooling & Workspace Structure'
  inputs:
    targetType: 'inline'
    script: |
      echo "Validating Docker Engine version..."
      docker --version
      echo "Verifying required source files..."
      test -f Dockerfile || { echo "ERROR: Dockerfile missing!"; exit 1; }
      test -f nginx.conf || { echo "ERROR: nginx.conf missing!"; exit 1; }
      test -f src/index.html || { echo "ERROR: src/index.html missing!"; exit 1; }
      echo "All build prerequisites satisfied."`,
      notes: 'Prevents obscure runtime failures early by validating file paths and dependencies before invoking Docker.',
    },
    {
      id: 3,
      name: 'Build Docker Image',
      stageGroup: 'Stage 1: Build & Validate',
      taskName: 'Docker@2 (build)',
      objective: 'Executes docker build using Dockerfile, targeting Nginx Alpine and creating immutable image layers.',
      yamlCode: `- task: Docker@2
  displayName: '3. Build Docker Image'
  inputs:
    command: 'build'
    dockerfile: '$(Build.SourcesDirectory)/Dockerfile'
    repository: '$(ACR_NAME).azurecr.io/$(IMAGE_NAME)'
    tags: |
      $(IMAGE_TAG)
      latest`,
      notes: 'Builds the image with both the unique build ID tag and latest tag. Employs caching for fast iterations.',
    },
    {
      id: 4,
      name: 'Run Basic Validation / Tests',
      stageGroup: 'Stage 1: Build & Validate',
      taskName: 'Bash@3 (Health Probe)',
      objective: 'Spins up an ephemeral container on the build agent to verify the Nginx /health endpoint returns HTTP 200.',
      yamlCode: `- task: Bash@3
  displayName: '4. Run Health Probe Verification'
  inputs:
    targetType: 'inline'
    script: |
      echo "Starting test container on ephemeral port 8080..."
      docker run -d --name test-container -p 8080:80 \\
        $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)
      sleep 3
      
      echo "Probing /health route..."
      RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)
      
      echo "Healthcheck status returned: $RESPONSE_CODE"
      docker stop test-container && docker rm test-container
      
      if [ "$RESPONSE_CODE" -ne 200 ]; then
        echo "Health verification failed! Failing pipeline."
        exit 1
      fi
      echo "Validation passed successfully."`,
      notes: 'Guarantees broken images or corrupted nginx.conf files are caught before anything reaches the registry.',
    },
    {
      id: 5,
      name: 'Login to Azure Container Registry',
      stageGroup: 'Stage 2: Publish to ACR',
      taskName: 'AzureCLI@2 (az acr login)',
      objective: 'Securely authenticates Docker daemon with Azure Container Registry using the Azure DevOps Service Connection.',
      yamlCode: `- task: AzureCLI@2
  displayName: '5. Login to Azure Container Registry'
  inputs:
    azureSubscription: '$(AZURE_SERVICE_CONNECTION)'
    scriptType: 'bash'
    scriptLocation: 'inline'
    inlineScript: |
      echo "Authenticating Docker with ACR: $(ACR_NAME)..."
      az acr login --name $(ACR_NAME)`,
      notes: 'No raw secrets or credentials in the code. Authentication uses Azure Service Principal via Service Connection.',
    },
    {
      id: 6,
      name: 'Tag Docker Image',
      stageGroup: 'Stage 2: Publish to ACR',
      taskName: 'Docker@2 (tag)',
      objective: 'Tags the verified Docker image with ACR registry domain and specific commit/build identification.',
      yamlCode: `- task: Bash@3
  displayName: '6. Tag Image with Registry Domain'
  inputs:
    targetType: 'inline'
    script: |
      echo "Tagging image: $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)"
      docker tag $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG) \\
        $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)
      docker tag $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG) \\
        $(ACR_NAME).azurecr.io/$(IMAGE_NAME):latest`,
      notes: 'Dual tagging enables pinpoint rollbacks to earlier $(Build.BuildId) while keeping :latest pointer current.',
    },
    {
      id: 7,
      name: 'Push Docker Image to ACR',
      stageGroup: 'Stage 2: Publish to ACR',
      taskName: 'Bash@3 (docker push)',
      objective: 'Uploads the tagged image layers over high-speed Azure network backplane into private ACR storage.',
      yamlCode: `- task: Bash@3
  displayName: '7. Push Docker Image to ACR'
  inputs:
    targetType: 'inline'
    script: |
      echo "Pushing immutable build tag..."
      docker push $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)
      
      echo "Pushing latest tag..."
      docker push $(ACR_NAME).azurecr.io/$(IMAGE_NAME):latest`,
      notes: 'Only modified layers are transmitted thanks to Docker layer caching, optimizing bandwidth and deployment latency.',
    },
    {
      id: 8,
      name: 'Deploy Container to Azure App Service',
      stageGroup: 'Stage 3: Deploy to App Service',
      taskName: 'AzureWebAppContainer@1 & AzureCLI@2',
      objective: 'Points Azure App Service to the newly uploaded image in ACR, sets WEBSITES_PORT=80, and restarts.',
      yamlCode: `- task: AzureWebAppContainer@1
  displayName: '8. Deploy Container to Azure App Service'
  inputs:
    azureSubscription: '$(AZURE_SERVICE_CONNECTION)'
    appName: '$(WEBAPP_NAME)'
    imageName: '$(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)'

- task: AzureCLI@2
  displayName: 'Configure Port and Restart App Service'
  inputs:
    azureSubscription: '$(AZURE_SERVICE_CONNECTION)'
    scriptType: 'bash'
    scriptLocation: 'inline'
    inlineScript: |
      az webapp config appsettings set \\
        --name $(WEBAPP_NAME) \\
        --resource-group "${config.resourceGroup}" \\
        --settings WEBSITES_PORT=80
      az webapp restart --name $(WEBAPP_NAME) --resource-group "${config.resourceGroup}"`,
      notes: 'Executes automated zero-downtime container swap on Azure App Service.',
    },
  ];

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStage(id);
    setTimeout(() => setCopiedStage(null), 1500);
  };

  const activeStage = stages.find((s) => s.id === selectedStage) || stages[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">CI/CD Pipeline Stages</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            The 8 core stages implemented in <code className="text-cyan-400">azure-pipelines.yml</code>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Agent: ubuntu-latest</span>
          <span>·</span>
          <span>Syntax: Azure Pipelines YAML</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stages Sidebar */}
        <div className="lg:col-span-5 space-y-2">
          {stages.map((stage) => {
            const isSelected = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stage.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {stage.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {stage.stageGroup}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  {activeStage.stageGroup} · Step 0{activeStage.id}
                </span>
                <h4 className="text-sm font-semibold text-white mt-0.5">
                  {activeStage.name}
                </h4>
              </div>
              <button
                onClick={() => handleCopy(activeStage.id, activeStage.yamlCode)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                title="Copy YAML snippet"
              >
                {copiedStage === activeStage.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy YAML</span>
                  </>
                )}
              </button>
            </div>

            <div className="py-3 text-xs space-y-2">
              <p className="text-slate-300">
                <strong className="text-white">Objective:</strong> {activeStage.objective}
              </p>
              <div className="text-slate-400 flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-500">Task Definition:</span>
                <span className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  {activeStage.taskName}
                </span>
              </div>
            </div>

            {/* YAML Code Preview */}
            <div className="relative mt-2">
              <pre className="p-3.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <code>{activeStage.yamlCode}</code>
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <span className="text-cyan-400 font-bold">ℹ</span>
            <span>{activeStage.notes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
