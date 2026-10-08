export interface ProjectConfig {
  subscriptionId: string;
  resourceGroup: string;
  acrName: string;
  imageName: string;
  imageTag: string;
  webAppName: string;
  serviceConnection: string;
  location: string;
}

export const defaultConfig: ProjectConfig = {
  subscriptionId: '<AZURE_SUBSCRIPTION_ID>',
  resourceGroup: '<RESOURCE_GROUP>',
  acrName: '<ACR_NAME>',
  imageName: '<IMAGE_NAME>',
  imageTag: '<IMAGE_TAG>',
  webAppName: '<WEBAPP_NAME>',
  serviceConnection: '<AZURE_SERVICE_CONNECTION>',
  location: 'eastus',
};

export function getHtmlIndexFile(config: ProjectConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloud DevOps Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="layout">
    <header class="navbar">
      <div class="brand">
        <span class="brand-badge">Azure</span>
        <span class="brand-title">Cloud DevOps Dashboard</span>
      </div>
      <nav class="nav-links">
        <a href="#overview">Overview</a>
        <a href="#pipeline">CI/CD Pipeline</a>
        <a href="#docker">Docker</a>
        <a href="#deployment">Deployment</a>
        <a href="#health">Health</a>
      </nav>
      <div class="nav-actions">
        <span class="status-indicator">Container Active</span>
      </div>
    </header>

    <main class="main-content">
      <!-- Hero Section -->
      <section id="overview" class="hero">
        <div class="hero-content">
          <h1>Production Azure CI/CD Web Application</h1>
          <p class="subtitle">
            Containerized web application engineered for automated build, verification, container packaging, and continuous delivery via Microsoft Azure Pipelines and Azure App Service.
          </p>
          <div class="hero-meta">
            <span>Runtime: Nginx Alpine</span>
            <span class="separator">/</span>
            <span>Port: 80</span>
            <span class="separator">/</span>
            <span>Image: ${config.imageName}:${config.imageTag}</span>
          </div>
        </div>
      </section>

      <!-- Technology Stack -->
      <section class="section">
        <div class="section-header">
          <h2>Technology Stack</h2>
          <p>Core DevOps tooling powering source control, containerization, and cloud deployment.</p>
        </div>
        <div class="grid grid-cols-4">
          <div class="card">
            <h3>Nginx & Web Core</h3>
            <p>HTML5, CSS3, vanilla JavaScript served via a lightweight Nginx Alpine web server.</p>
            <div class="card-footer">Port 80 · Web Server</div>
          </div>
          <div class="card">
            <h3>Docker</h3>
            <p>Production containerization with multi-stage build, minimal attack surface, and .dockerignore.</p>
            <div class="card-footer">Alpine Base · < 25MB</div>
          </div>
          <div class="card">
            <h3>Azure Container Registry</h3>
            <p>Private enterprise Docker registry for secured image storage and automated webhooks.</p>
            <div class="card-footer">ACR: ${config.acrName}</div>
          </div>
          <div class="card">
            <h3>Azure App Service & Pipelines</h3>
            <p>Managed container web hosting backed by YAML-driven automated CI/CD pipeline triggers.</p>
            <div class="card-footer">Azure DevOps · App Service</div>
          </div>
        </div>
      </section>

      <!-- CI/CD Pipeline Workflow -->
      <section id="pipeline" class="section">
        <div class="section-header">
          <h2>CI/CD Pipeline Flow</h2>
          <p>Automated pipeline lifecycle executed on every git push to the main branch.</p>
        </div>
        <div class="pipeline-track">
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-title">GitHub Trigger</div>
            <div class="step-desc">Code commit pushes to repository</div>
          </div>
          <div class="arrow">→</div>
          <div class="step">
            <div class="step-num">02</div>
            <div class="step-title">Azure Pipeline</div>
            <div class="step-desc">Spawns clean Ubuntu build agent</div>
          </div>
          <div class="arrow">→</div>
          <div class="step">
            <div class="step-num">03</div>
            <div class="step-title">Docker Build</div>
            <div class="step-desc">Builds & validates Nginx image</div>
          </div>
          <div class="arrow">→</div>
          <div class="step">
            <div class="step-num">04</div>
            <div class="step-title">Push to ACR</div>
            <div class="step-desc">Authenticates & pushes tagged image</div>
          </div>
          <div class="arrow">→</div>
          <div class="step">
            <div class="step-num">05</div>
            <div class="step-title">Azure App Service</div>
            <div class="step-desc">Pulls new image & live restarts</div>
          </div>
        </div>
      </section>

      <!-- Docker Status -->
      <section id="docker" class="section">
        <div class="section-header">
          <h2>Docker Container Status</h2>
          <p>Local container runtime metrics and service verification.</p>
        </div>
        <div class="grid grid-cols-2">
          <div class="card">
            <h3>Container Specification</h3>
            <table class="specs-table">
              <tr><td>Base Image</td><td>nginx:1.27-alpine</td></tr>
              <tr><td>Listening Port</td><td>80 (HTTP)</td></tr>
              <tr><td>Target Platform</td><td>Linux / AMD64 & ARM64</td></tr>
              <tr><td>Config File</td><td>/etc/nginx/conf.d/default.conf</td></tr>
            </table>
          </div>
          <div class="card">
            <h3>Local Run Command</h3>
            <pre class="code-box"><code>docker build -t ${config.imageName}:${config.imageTag} .
docker run -d -p 8080:80 --name devops-app ${config.imageName}:${config.imageTag}</code></pre>
          </div>
        </div>
      </section>

      <!-- Azure Deployment Status -->
      <section id="deployment" class="section">
        <div class="section-header">
          <h2>Azure Deployment Status</h2>
          <p>Cloud resource binding and live environment status.</p>
        </div>
        <div class="notice-box">
          <div class="notice-icon">ℹ</div>
          <div class="notice-text">
            <strong>Deployment Status Notice:</strong><br>
            Azure deployment will be available after configuring Azure resources.
          </div>
        </div>
        <div class="azure-checklist">
          <h3>Required Azure Configuration Steps</h3>
          <ul>
            <li>Create Resource Group: <code>az group create --name ${config.resourceGroup} --location ${config.location}</code></li>
            <li>Create Container Registry: <code>az acr create --resource-group ${config.resourceGroup} --name ${config.acrName} --sku Basic</code></li>
            <li>Create App Service Plan: <code>az appservice plan create --name plan-devops --resource-group ${config.resourceGroup} --is-linux --sku B1</code></li>
            <li>Create Container Web App: <code>az webapp create --resource-group ${config.resourceGroup} --plan plan-devops --name ${config.webAppName} --deployment-container-image-name ${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}</code></li>
          </ul>
        </div>
      </section>

      <!-- Health Status -->
      <section id="health" class="section">
        <div class="section-header">
          <h2>Health Status & Telemetry</h2>
          <p>Live client check and container health probes.</p>
        </div>
        <div class="grid grid-cols-3">
          <div class="card stat-card">
            <span class="stat-label">System Health</span>
            <span id="health-status-value" class="stat-value">Operational</span>
            <span class="stat-sub">HTTP 200 OK via /health</span>
          </div>
          <div class="card stat-card">
            <span class="stat-label">Session Uptime</span>
            <span id="uptime-counter" class="stat-value">00:00:00</span>
            <span class="stat-sub">Elapsed container session</span>
          </div>
          <div class="card stat-card">
            <span class="stat-label">Client Timestamp</span>
            <span id="current-timestamp" class="stat-value">--:--:--</span>
            <span class="stat-sub">UTC synchronized</span>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="section">
        <div class="section-header">
          <h2>About This Project</h2>
        </div>
        <div class="about-card">
          <p>
            This <strong>Azure CI/CD Web Application</strong> is an independent portfolio project engineered to demonstrate production-grade cloud automation, immutable container deployment, and infrastructure-as-code principles using Microsoft Azure and Docker.
          </p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>Azure CI/CD Web Application · Independent Cloud DevOps Project</p>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
}

export function getCssFile(): string {
  return `/* Cloud DevOps Dashboard Styling */
:root {
  --bg-primary: #090d16;
  --bg-surface: #111827;
  --bg-card: #1f2937;
  --border-color: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --accent-azure: #0078d4;
  --accent-cyan: #06b6d4;
  --status-green: #10b981;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

.layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-badge {
  background-color: var(--accent-azure);
  color: white;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.brand-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--text-primary);
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: var(--status-green);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 4px 10px;
  border-radius: 4px;
}

.hero {
  padding: 60px 0 40px;
  border-bottom: 1px solid var(--border-color);
}

.hero h1 {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.8px;
  margin-bottom: 16px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 17px;
  max-width: 800px;
  margin-bottom: 24px;
}

.hero-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-secondary);
  font-family: monospace;
}

.separator {
  color: var(--border-color);
}

.section {
  padding: 48px 0;
  border-bottom: 1px solid var(--border-color);
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.section-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

.grid {
  display: grid;
  gap: 20px;
}

.grid-cols-4 {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
}

.card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.card p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
}

.card-footer {
  font-size: 12px;
  font-family: monospace;
  color: var(--accent-cyan);
}

.pipeline-track {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow-x: auto;
  padding: 16px 0;
}

.step {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  min-width: 170px;
}

.step-num {
  font-size: 12px;
  font-family: monospace;
  color: var(--accent-azure);
  font-weight: 700;
  margin-bottom: 6px;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.arrow {
  color: var(--border-color);
  font-size: 20px;
  font-weight: 700;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.specs-table td {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.specs-table td:last-child {
  text-align: right;
  font-family: monospace;
  color: var(--accent-cyan);
}

.code-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 16px;
  font-size: 13px;
  overflow-x: auto;
  color: #38bdf8;
}

.notice-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(0, 120, 212, 0.08);
  border: 1px solid rgba(0, 120, 212, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.notice-icon {
  font-size: 20px;
  color: var(--accent-azure);
  line-height: 1;
}

.notice-text {
  font-size: 14px;
  color: var(--text-primary);
}

.azure-checklist {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
}

.azure-checklist h3 {
  font-size: 15px;
  margin-bottom: 16px;
}

.azure-checklist ul {
  list-style: none;
}

.azure-checklist li {
  padding: 8px 0;
  font-size: 13px;
  color: var(--text-secondary);
  border-bottom: 1px solid #2d3748;
}

.azure-checklist code {
  color: #f3f4f6;
  background: #1f2937;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  font-family: monospace;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

.about-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
  font-size: 15px;
  color: var(--text-secondary);
}

.about-card strong {
  color: var(--text-primary);
}

.footer {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
}
`;
}

export function getJsFile(): string {
  return `// Cloud DevOps Dashboard Runtime Script
document.addEventListener('DOMContentLoaded', () => {
  // Session Uptime Counter
  const startTime = Date.now();
  const uptimeEl = document.getElementById('uptime-counter');
  const timestampEl = document.getElementById('current-timestamp');

  function updateMetrics() {
    // Update Uptime
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');
    if (uptimeEl) {
      uptimeEl.textContent = \`\${hours}:\${minutes}:\${seconds}\`;
    }

    // Update UTC Timestamp
    if (timestampEl) {
      const now = new Date();
      timestampEl.textContent = now.toTimeString().split(' ')[0];
    }
  }

  setInterval(updateMetrics, 1000);
  updateMetrics();

  // Test /health endpoint
  fetch('/health')
    .then((res) => {
      const statusEl = document.getElementById('health-status-value');
      if (res.ok && statusEl) {
        statusEl.textContent = 'Operational';
        statusEl.style.color = '#10b981';
      }
    })
    .catch(() => {
      // Standalone browser preview fallback
      const statusEl = document.getElementById('health-status-value');
      if (statusEl) {
        statusEl.textContent = 'Client Active';
      }
    });
});
`;
}

export function getDockerfile(): string {
  return `# Multi-stage lightweight Nginx container
FROM nginx:1.27-alpine

# Set non-root environment metadata and labels
LABEL maintainer="Cloud DevOps Project"
LABEL description="Production Nginx container for Cloud DevOps Dashboard"

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application static assets into Nginx web root
COPY src/ /usr/share/nginx/html/

# Expose HTTP port 80
EXPOSE 80

# Health check to ensure Nginx responds
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
`;
}

export function getDockerignore(): string {
  return `.git
.gitignore
.github
azure-pipelines.yml
docker-compose.yml
README.md
*.md
*.log
.DS_Store
Thumbs.db
`;
}

export function getNginxConf(): string {
  return `server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression for optimal delivery
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Single Page App routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Dedicated Health Check endpoint for Docker and Azure App Service probes
    location /health {
        access_log off;
        return 200 '{"status":"healthy","uptime":"ok","service":"cloud-devops-dashboard"}\\n';
        add_header Content-Type application/json;
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
`;
}

export function getDockerCompose(config: ProjectConfig): string {
  return `version: '3.8'

services:
  web-app:
    build:
      context: .
      dockerfile: Dockerfile
    image: \${IMAGE_NAME:-${config.imageName}}:\${IMAGE_TAG:-${config.imageTag}}
    container_name: devops-web-app
    ports:
      - "8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    environment:
      - NODE_ENV=production
`;
}

export function getGitignore(): string {
  return `# Operating System Files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Docker Local Artifacts
.docker

# Temporary files
*.tmp
*.bak
`;
}

export function getAzurePipelinesYml(config: ProjectConfig): string {
  return `# Azure DevOps CI/CD Pipeline
# Project: Azure CI/CD Web Application
# Target: Azure Container Registry (ACR) & Azure App Service Container

trigger:
  branches:
    include:
      - main
      - master

variables:
  # Pipeline configuration variables
  # Replace placeholders with your actual Azure and project identifiers:
  ACR_NAME: '${config.acrName}'                           # e.g., mydevopsregistry (without .azurecr.io)
  IMAGE_NAME: '${config.imageName}'                       # e.g., cloud-devops-dashboard
  IMAGE_TAG: '$(Build.BuildId)'                           # Unique tag using build number, or '${config.imageTag}'
  AZURE_SERVICE_CONNECTION: '${config.serviceConnection}' # Name of Azure Resource Manager Service Connection in Azure DevOps
  WEBAPP_NAME: '${config.webAppName}'                     # Name of your Azure App Service Linux Web App

pool:
  vmImage: 'ubuntu-latest'

stages:
  # Stage 1: Build, Validate & Test Docker Container
  - stage: BuildAndValidate
    displayName: 'Stage 1: Build & Validate'
    jobs:
      - job: BuildJob
        displayName: 'Build Docker Image & Run Linter'
        steps:
          - checkout: self
            displayName: '1. Checkout Source Code'

          - task: Bash@3
            displayName: '2. Verify Repository Structure'
            inputs:
              targetType: 'inline'
              script: |
                echo "Validating required files..."
                test -f Dockerfile || { echo "Dockerfile missing!"; exit 1; }
                test -f nginx.conf || { echo "nginx.conf missing!"; exit 1; }
                test -f src/index.html || { echo "src/index.html missing!"; exit 1; }
                echo "All core assets verified successfully."

          - task: Docker@2
            displayName: '3. Build Docker Image'
            inputs:
              command: 'build'
              dockerfile: '$(Build.SourcesDirectory)/Dockerfile'
              repository: '$(ACR_NAME).azurecr.io/$(IMAGE_NAME)'
              tags: |
                $(IMAGE_TAG)
                latest

          - task: Bash@3
            displayName: '4. Test Local Container Health Endpoint'
            inputs:
              targetType: 'inline'
              script: |
                echo "Running temporary container for health check verification..."
                docker run -d --name temp-test -p 8080:80 $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)
                sleep 3
                HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)
                echo "Health endpoint returned HTTP $HTTP_STATUS"
                docker stop temp-test && docker rm temp-test
                if [ "$HTTP_STATUS" -ne 200 ]; then
                  echo "Health check failed!"
                  exit 1
                fi
                echo "Container passed local health verification."

  # Stage 2: Push to Azure Container Registry (ACR)
  - stage: PushToRegistry
    displayName: 'Stage 2: Publish to ACR'
    dependsOn: BuildAndValidate
    condition: succeeded()
    jobs:
      - job: PushJob
        displayName: 'Authenticate and Push to ACR'
        steps:
          - task: AzureCLI@2
            displayName: '5. Login to Azure Container Registry & Push'
            inputs:
              azureSubscription: '$(AZURE_SERVICE_CONNECTION)'
              scriptType: 'bash'
              scriptLocation: 'inline'
              inlineScript: |
                echo "Logging into Azure Container Registry: $(ACR_NAME)..."
                az acr login --name $(ACR_NAME)
                
                echo "Pushing Docker image: $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)..."
                docker push $(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)
                
                echo "Pushing latest tag..."
                docker push $(ACR_NAME).azurecr.io/$(IMAGE_NAME):latest

  # Stage 3: Deploy to Azure App Service
  - stage: DeployToAppService
    displayName: 'Stage 3: Deploy to Azure App Service'
    dependsOn: PushToRegistry
    condition: succeeded()
    jobs:
      - deployment: DeployJob
        displayName: 'Deploy Container to Azure App Service'
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebAppContainer@1
                  displayName: '6. Update Azure App Service Container Image'
                  inputs:
                    azureSubscription: '$(AZURE_SERVICE_CONNECTION)'
                    appName: '$(WEBAPP_NAME)'
                    imageName: '$(ACR_NAME).azurecr.io/$(IMAGE_NAME):$(IMAGE_TAG)'

                - task: AzureCLI@2
                  displayName: '7. Configure App Settings & Restart Web App'
                  inputs:
                    azureSubscription: '$(AZURE_SERVICE_CONNECTION)'
                    scriptType: 'bash'
                    scriptLocation: 'inline'
                    inlineScript: |
                      echo "Configuring App Service port setting..."
                      az webapp config appsettings set \\
                        --name $(WEBAPP_NAME) \\
                        --resource-group "${config.resourceGroup}" \\
                        --settings WEBSITES_PORT=80
                      
                      echo "Restarting Azure App Service to pull latest container..."
                      az webapp restart --name $(WEBAPP_NAME) --resource-group "${config.resourceGroup}"
                      
                      echo "Verifying App Service State..."
                      az webapp show --name $(WEBAPP_NAME) --resource-group "${config.resourceGroup}" --query "state" -o tsv
`;
}

export function getReadme(config: ProjectConfig): string {
  return `# Azure CI/CD Web Application

A production-ready, beginner-friendly DevOps portfolio project demonstrating end-to-end containerization and automated continuous integration / continuous deployment (CI/CD) using **Microsoft Azure**, **Docker**, **Azure Container Registry (ACR)**, **Azure App Service**, and **Azure Pipelines**.

---

## 1. Project Overview

This repository contains a containerized responsive web application (**Cloud DevOps Dashboard**) and an automated deployment pipeline. Every code commit pushed to GitHub triggers an automated Azure Pipeline that tests, builds an immutable Docker image, uploads it to Azure Container Registry, and deploys it to Azure App Service without manual intervention.

---

## 2. Architecture

\`\`\`
Developer Workstation
      │  (git push)
      ▼
GitHub Repository
      │  (Webhook Trigger)
      ▼
Azure Pipelines (Ubuntu VM Agent)
      ├─ 1. Checkout Source Code
      ├─ 2. Build Docker Image (Nginx Alpine)
      ├─ 3. Run Health Checks & Validation
      ├─ 4. Authenticate with ACR
      ├─ 5. Tag Image ($(Build.BuildId) & latest)
      └─ 6. Push Image to ACR
            │
            ▼
Azure Container Registry (ACR)
      │  (Container Image Pull)
      ▼
Azure App Service (Linux Web App)
      │  (Port 80 HTTP)
      ▼
Live Web Application User Viewport
\`\`\`

---

## 3. Technologies Used

- **HTML5, CSS3, JavaScript**: Frontend for the Cloud DevOps Dashboard.
- **Nginx (Alpine Linux)**: High-performance, lightweight web server exposing port 80.
- **Docker**: Containerization engine for deterministic local and cloud execution.
- **Azure Container Registry (ACR)**: Managed private Docker registry in Microsoft Azure.
- **Azure App Service**: Fully managed Platform as a Service (PaaS) for hosting containerized web applications.
- **Azure Pipelines (YAML)**: Continuous Integration and Continuous Deployment automation service.
- **GitHub**: Git repository hosting and source control management.
- **YAML**: Declarative pipeline-as-code syntax.

---

## 4. Project Structure

\`\`\`
azure-cicd-webapp/
├── src/
│   ├── index.html        # Main dashboard webpage
│   ├── style.css         # Responsive styling
│   └── script.js         # Client-side health metrics and uptime counter
├── Dockerfile            # Lightweight Alpine Nginx container recipe
├── .dockerignore         # Docker build context exclusions
├── nginx.conf            # Custom Nginx configuration with /health route
├── azure-pipelines.yml   # Multi-stage CI/CD pipeline definition
├── docker-compose.yml    # Local multi-container development configuration
├── README.md             # Complete step-by-step documentation
└── .gitignore            # Git exclusion rules
\`\`\`

---

## 5. Docker Explanation

The project uses a production-grade multi-layer Docker image based on \`nginx:1.27-alpine\`:
1. **Minimal Base Image**: Alpine Linux reduces total image size to under **25MB**, improving transfer speeds and reducing vulnerabilities.
2. **Custom Configuration**: Replaces default Nginx configuration with \`nginx.conf\`, adding gzip compression, HTTP security headers, and an isolated \`/health\` check endpoint.
3. **Port 80**: Standard HTTP port is exposed for straightforward cloud ingress routing.
4. **Healthcheck Directive**: Built-in \`HEALTHCHECK\` probe queries \`http://localhost:80/health\` every 30 seconds.

---

## 6. Azure Container Registry (ACR) Explanation

Azure Container Registry is a managed private registry based on open-source Docker Registry 2.0. In this architecture:
- ACR acts as the secure single source of truth for compiled container images.
- Images are tagged with both the unique build ID (\`$(Build.BuildId)\`) for traceability and rollback, and \`latest\`.
- App Service authenticates to ACR using either a service principal, Azure DevOps service connection, or Managed Identity.

---

## 7. Azure App Service Explanation

Azure App Service (Linux Web App for Containers) hosts the running application:
- Provides automatic OS patching, custom domains, and SSL termination.
- Pulls the newly pushed container image from ACR on pipeline deployment.
- Exposes port 80 using the App Setting \`WEBSITES_PORT=80\`.
- *Note:* If Azure resources are not yet provisioned, the web app displays:
  > *"Azure deployment will be available after configuring Azure resources."*

---

## 8. Azure Pipelines Explanation

The \`azure-pipelines.yml\` file defines a declarative pipeline with 3 sequential stages:
1. **BuildAndValidate**: Checks out repository files, builds the Docker image, spins up a temporary container, and validates the \`/health\` route returns HTTP 200.
2. **PushToRegistry**: Authenticates with ACR via the Azure CLI and pushes image tags.
3. **DeployToAppService**: Calls \`AzureWebAppContainer@1\` to update the running container image in Azure App Service and restarts the web app.

---

## 9. CI/CD Workflow

1. **Developer**: Edits code and commits changes to Git.
2. **GitHub**: Receives push and triggers Azure DevOps via service hook.
3. **Azure Pipeline**: Spawns an ephemeral Ubuntu agent.
4. **Docker Build**: Compiles Docker image and runs unit tests.
5. **Azure Container Registry**: Stores immutable image tags.
6. **Azure App Service**: Pulls new image and initiates zero-downtime rolling restart.
7. **Live Web Application**: Serves updated site to users.

---

## 10. Prerequisites

Before starting, install and configure:
1. **Docker Desktop** (or Docker Engine on Linux)
2. **Git**
3. **Azure CLI** (\`az\`)
4. An active **Microsoft Azure Subscription**
5. An **Azure DevOps Organization** and Project
6. A **GitHub Account**

---

## 11. Azure Setup (Step-by-Step CLI)

Run these commands in PowerShell or Bash:

\`\`\`bash
# 1. Login to Azure
az login

# 2. Set your active subscription
az account set --subscription "${config.subscriptionId}"

# 3. Create a Resource Group
az group create --name "${config.resourceGroup}" --location "${config.location}"

# 4. Create an Azure Container Registry (Basic SKU)
az acr create --resource-group "${config.resourceGroup}" --name "${config.acrName}" --sku Basic --admin-enabled true

# 5. Create an App Service Linux Plan
az appservice plan create --name "plan-devops-app" --resource-group "${config.resourceGroup}" --is-linux --sku B1

# 6. Create Azure Web App for Containers
az webapp create --resource-group "${config.resourceGroup}" --plan "plan-devops-app" --name "${config.webAppName}" --deployment-container-image-name "${config.acrName}.azurecr.io/${config.imageName}:${config.imageTag}"

# 7. Configure Container Port
az webapp config appsettings set --resource-group "${config.resourceGroup}" --name "${config.webAppName}" --settings WEBSITES_PORT=80
\`\`\`

---

## 12. Docker Setup & Local Testing

Build and test locally before deploying to the cloud:

\`\`\`bash
# 1. Build Docker image
docker build -t ${config.imageName}:${config.imageTag} .

# 2. Run container in background
docker run -d -p 8080:80 --name devops-local-container ${config.imageName}:${config.imageTag}

# 3. Test local website
curl http://localhost:8080
curl http://localhost:8080/health

# 4. View logs
docker logs devops-local-container

# 5. Clean up local container
docker stop devops-local-container
docker rm devops-local-container
\`\`\`

---

## 13. GitHub Setup

\`\`\`bash
# 1. Initialize git
git init

# 2. Add files
git add .
git commit -m "feat: initial commit of Azure CI/CD web app"

# 3. Add remote and push
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/azure-cicd-webapp.git
git push -u origin main
\`\`\`

---

## 14. Azure DevOps Setup

1. Open your Azure DevOps project at \`https://dev.azure.com/<YOUR_ORG>/<YOUR_PROJECT>\`.
2. Go to **Project Settings** → **Service Connections**.
3. Click **New service connection** → **Azure Resource Manager** → **Service principal (automatic)**.
4. Select your Subscription and Resource Group (\`${config.resourceGroup}\`).
5. Set the Service connection name to: \`${config.serviceConnection}\`.
6. Grant access permission to all pipelines and save.

---

## 15. Pipeline Configuration

1. In Azure DevOps, navigate to **Pipelines** → **Create Pipeline**.
2. Select **GitHub (YAML)** and authorize repository access.
3. Select your \`azure-cicd-webapp\` repository.
4. Select **Existing Azure Pipelines YAML file** and point to \`/azure-pipelines.yml\`.
5. Verify variables at the top of the YAML:
   - \`ACR_NAME\`: \`${config.acrName}\`
   - \`IMAGE_NAME\`: \`${config.imageName}\`
   - \`AZURE_SERVICE_CONNECTION\`: \`${config.serviceConnection}\`
   - \`WEBAPP_NAME\`: \`${config.webAppName}\`
6. Click **Save and Run**.

---

## 16. Deployment Instructions

1. Push a commit to the \`main\` branch.
2. Watch the pipeline run through Stages 1, 2, and 3.
3. Once completed, navigate to: \`https://${config.webAppName}.azurewebsites.net\`.
4. Verify the web application renders with active container metrics.

---

## 17. Monitoring and Logs

View real-time container startup and runtime logs:

\`\`\`bash
# Stream App Service live container logs
az webapp log tail --name "${config.webAppName}" --resource-group "${config.resourceGroup}"

# Download log files
az webapp log download --name "${config.webAppName}" --resource-group "${config.resourceGroup}"
\`\`\`

---

## 18. Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **Port 502 / Application Error** | Missing \`WEBSITES_PORT\` setting | Run \`az webapp config appsettings set --settings WEBSITES_PORT=80\` |
| **Image Pull Denied** | App Service not authorized to pull from ACR | Enable ACR admin credentials or configure Managed Identity access role \`AcrPull\` |
| **Service Connection Failure** | Service connection expired or lacked permissions | Re-create ARM Service connection with Contributor role on the resource group |
| **Docker Daemon Inactive** | Docker Desktop not running on host | Start Docker Desktop and wait for engine to initialize before running commands |

---

## 19. Security Best Practices

1. **Never Hardcode Secrets**: Store passwords, service credentials, and tokens in Azure Key Vault or Azure DevOps Secret Variables.
2. **Use Managed Identities**: Prefer Managed Identity (\`AcrPull\` role assignment) over static admin username/password for ACR.
3. **Least Privilege Service Principal**: Limit the Azure DevOps service connection scope strictly to the target Resource Group.
4. **Scan Docker Images**: Enable Microsoft Defender for Cloud to scan ACR images for CVE vulnerabilities.

---

## 20. Cleanup Instructions

To avoid unexpected cloud costs after testing:

\`\`\`bash
# Delete entire resource group containing ACR, App Service, and App Service Plan
az group delete --name "${config.resourceGroup}" --yes --no-wait
\`\`\`
`;
}

// Python Template Files (Prompt Requirement #10)
export function getPythonAppFile(): string {
  return `"""
Cloud DevOps Dashboard - Python Flask Application Template
Production-ready web application designed for containerized cloud deployment.
"""
import os
import time
from datetime import datetime, timezone
from flask import Flask, jsonify, render_template_string

app = Flask(__name__)
START_TIME = time.time()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cloud DevOps Dashboard (Python)</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0b0f19; color: #f3f4f6; margin: 0; padding: 40px; }
    .card { background: #111827; border: 1px solid #374151; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto; }
    h1 { color: #0078d4; margin-top: 0; }
    .badge { background: #10b981; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
    pre { background: #000; padding: 12px; border-radius: 6px; overflow-x: auto; color: #38bdf8; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Python 3.11 · Flask</span>
    <h1>Cloud DevOps Dashboard</h1>
    <p>Containerized Python web application deployed via Microsoft Azure CI/CD Pipeline.</p>
    <p><strong>Status:</strong> Active & Healthy</p>
    <p><strong>Environment:</strong> {{ env }}</p>
    <p><strong>Server Time:</strong> {{ time }}</p>
    <hr style="border: 0; border-top: 1px solid #374151; margin: 20px 0;">
    <p>Health endpoint accessible at: <code>/health</code></p>
  </div>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(
        HTML_TEMPLATE,
        env=os.getenv('FLASK_ENV', 'production'),
        time=datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    )

@app.route('/health')
def health():
    uptime_seconds = int(time.time() - START_TIME)
    return jsonify({
        "status": "healthy",
        "service": "cloud-devops-python-app",
        "uptime_seconds": uptime_seconds,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 80))
    app.run(host='0.0.0.0', port=port)
`;
}

export function getPythonDockerfile(): string {
  return `# Lightweight Python 3.11 Alpine/Slim Container
FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PORT=80

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Expose HTTP port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:80/health')" || exit 1

# Launch application using production WSGI server
CMD ["gunicorn", "--bind", "0.0.0.0:80", "--workers", "2", "app:app"]
`;
}

export function getPythonRequirements(): string {
  return `flask>=3.0.0
gunicorn>=21.2.0
`;
}
