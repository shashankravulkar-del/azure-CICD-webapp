import React, { useState } from 'react';
import { Layers, Copy, Check, Terminal, AlertTriangle, ShieldCheck, Box } from 'lucide-react';
import { ProjectConfig, getDockerfile, getDockerignore, getNginxConf } from '../data/projectFiles';

interface DockerSectionProps {
  config: ProjectConfig;
}

export const DockerSection: React.FC<DockerSectionProps> = ({ config }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'commands' | 'dockerfile' | 'nginx' | 'troubleshoot'>('commands');

  const copyToClipboard = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const dockerCommands = [
    {
      id: 'build',
      title: 'Build Docker Image',
      desc: 'Builds the production-ready Alpine Nginx image with local tag',
      command: `docker build -t ${config.imageName}:${config.imageTag} .`,
    },
    {
      id: 'run',
      title: 'Run Container Locally',
      desc: 'Runs the container in background on localhost:8080 (maps host 8080 to container 80)',
      command: `docker run -d -p 8080:80 --name devops-app ${config.imageName}:${config.imageTag}`,
    },
    {
      id: 'logs',
      title: 'Inspect Container Logs',
      desc: 'Follow live Nginx access and error output',
      command: `docker logs -f devops-app`,
    },
    {
      id: 'health',
      title: 'Test Health Endpoint',
      desc: 'Verify /health endpoint returns HTTP 200 OK from inside or outside container',
      command: `curl -i http://localhost:8080/health`,
    },
    {
      id: 'stop',
      title: 'Stop & Clean Up',
      desc: 'Gracefully halts and removes the container',
      command: `docker stop devops-app && docker rm devops-app`,
    },
  ];

  const troubleshootingItems = [
    {
      issue: 'Port 8080 already allocated (bind: address already in use)',
      cause: 'Another process (web server, proxy, or old container) is occupying port 8080.',
      fix: 'Use a different host port: docker run -d -p 8081:80 --name devops-app ... or find and stop the process holding 8080.',
    },
    {
      issue: 'Docker daemon is not running (Cannot connect to the Docker daemon)',
      cause: 'Docker Desktop or dockerd service is stopped.',
      fix: 'On Windows/macOS, open Docker Desktop and wait until the whale icon is green. On Linux, run: sudo systemctl start docker.',
    },
    {
      issue: 'Container exits immediately with code 0 or 1',
      cause: 'Nginx might be daemonizing into background instead of running in foreground.',
      fix: 'Ensure the Dockerfile CMD includes ["nginx", "-g", "daemon off;"]. Check detailed failure reasons with: docker logs devops-app.',
    },
    {
      issue: '404 Not Found on routes or /health returns 404',
      cause: 'Custom nginx.conf was not mounted or copied into /etc/nginx/conf.d/default.conf.',
      fix: 'Verify Dockerfile has COPY nginx.conf /etc/nginx/conf.d/default.conf and rebuild without cache: docker build --no-cache -t ... .',
    },
    {
      issue: 'Permission denied when accessing assets in /usr/share/nginx/html',
      cause: 'Host file permissions prevented Nginx worker from reading static files.',
      fix: 'Ensure file permissions are readable (chmod -R 755 src/) before running docker build.',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Docker Containerization</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Production Nginx Alpine image, port 80 mapping, commands, and troubleshooting.
          </p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'commands' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Commands
          </button>
          <button
            onClick={() => setActiveTab('dockerfile')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'dockerfile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dockerfile
          </button>
          <button
            onClick={() => setActiveTab('nginx')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'nginx' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Nginx Config
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              activeTab === 'troubleshoot' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Troubleshooting
          </button>
        </div>
      </div>

      {/* Container Specs Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
          <span className="text-[11px] text-slate-400 block mb-1">Base Image</span>
          <span className="text-xs font-mono font-semibold text-cyan-400">nginx:1.27-alpine</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">&lt; 25MB footprint</span>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
          <span className="text-[11px] text-slate-400 block mb-1">Container Port</span>
          <span className="text-xs font-mono font-semibold text-emerald-400">80 (HTTP)</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Host mapping: 8080</span>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
          <span className="text-[11px] text-slate-400 block mb-1">Healthcheck</span>
          <span className="text-xs font-mono font-semibold text-cyan-400">GET /health</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">interval=30s timeout=3s</span>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
          <span className="text-[11px] text-slate-400 block mb-1">Process Supervisor</span>
          <span className="text-xs font-mono font-semibold text-purple-400">daemon off;</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Foreground lifecycle</span>
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'commands' && (
        <div className="space-y-3">
          {dockerCommands.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white mb-0.5">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 mb-2">
                  {item.desc}
                </div>
                <code className="block bg-slate-900 border border-slate-800 rounded px-3 py-1.5 font-mono text-xs text-cyan-300 select-all overflow-x-auto">
                  {item.command}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(item.command, item.id)}
                className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors shrink-0"
              >
                {copiedCmd === item.id ? (
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
      )}

      {activeTab === 'dockerfile' && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <span className="text-xs font-semibold text-white">Dockerfile</span>
              <span className="text-[11px] text-slate-400 ml-2">Production Alpine Nginx</span>
            </div>
            <button
              onClick={() => copyToClipboard(getDockerfile(), 'dockerfile')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
            >
              {copiedCmd === 'dockerfile' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
            <code>{getDockerfile()}</code>
          </pre>
        </div>
      )}

      {activeTab === 'nginx' && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <span className="text-xs font-semibold text-white">nginx.conf</span>
              <span className="text-[11px] text-slate-400 ml-2">Gzip · Security Headers · /health route</span>
            </div>
            <button
              onClick={() => copyToClipboard(getNginxConf(), 'nginx')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
            >
              {copiedCmd === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
            <code>{getNginxConf()}</code>
          </pre>
        </div>
      )}

      {activeTab === 'troubleshoot' && (
        <div className="space-y-3">
          {troubleshootingItems.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="font-semibold text-slate-200">{item.issue}</div>
                  <div className="text-slate-400"><strong className="text-slate-300">Cause:</strong> {item.cause}</div>
                  <div className="text-cyan-300 bg-slate-900 border border-slate-800/80 rounded p-2 font-mono text-[11px] select-all">
                    <strong className="text-slate-400 block font-sans text-[10px] uppercase">Solution:</strong>
                    {item.fix}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
