import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  Copy,
  Check,
  Download,
  Terminal,
  Settings,
  Archive,
  Layers,
} from 'lucide-react';
import {
  ProjectConfig,
  getHtmlIndexFile,
  getCssFile,
  getJsFile,
  getDockerfile,
  getDockerignore,
  getNginxConf,
  getAzurePipelinesYml,
  getDockerCompose,
  getReadme,
  getGitignore,
  getPythonAppFile,
  getPythonDockerfile,
  getPythonRequirements,
} from '../data/projectFiles';
import { exportNginxProjectZip, exportPythonProjectZip } from '../utils/zipExport';

interface RepositoryExplorerProps {
  config: ProjectConfig;
}

export const RepositoryExplorer: React.FC<RepositoryExplorerProps> = ({ config }) => {
  const [projectType, setProjectType] = useState<'nginx' | 'python'>('nginx');
  const [selectedFile, setSelectedFile] = useState<string>('azure-pipelines.yml');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Files for Nginx project
  const nginxFiles: Record<string, { name: string; path: string; content: string; icon: any }> = {
    'azure-pipelines.yml': {
      name: 'azure-pipelines.yml',
      path: 'azure-pipelines.yml',
      content: getAzurePipelinesYml(config),
      icon: Terminal,
    },
    'Dockerfile': {
      name: 'Dockerfile',
      path: 'Dockerfile',
      content: getDockerfile(),
      icon: Layers,
    },
    'nginx.conf': {
      name: 'nginx.conf',
      path: 'nginx.conf',
      content: getNginxConf(),
      icon: Settings,
    },
    'docker-compose.yml': {
      name: 'docker-compose.yml',
      path: 'docker-compose.yml',
      content: getDockerCompose(config),
      icon: Archive,
    },
    'src/index.html': {
      name: 'index.html',
      path: 'src/index.html',
      content: getHtmlIndexFile(config),
      icon: FileCode,
    },
    'src/style.css': {
      name: 'style.css',
      path: 'src/style.css',
      content: getCssFile(),
      icon: FileCode,
    },
    'src/script.js': {
      name: 'script.js',
      path: 'src/script.js',
      content: getJsFile(),
      icon: FileCode,
    },
    'README.md': {
      name: 'README.md',
      path: 'README.md',
      content: getReadme(config),
      icon: FileText,
    },
    '.dockerignore': {
      name: '.dockerignore',
      path: '.dockerignore',
      content: getDockerignore(),
      icon: FileText,
    },
    '.gitignore': {
      name: '.gitignore',
      path: '.gitignore',
      content: getGitignore(),
      icon: FileText,
    },
  };

  // Files for Python project
  const pythonFiles: Record<string, { name: string; path: string; content: string; icon: any }> = {
    'app.py': {
      name: 'app.py',
      path: 'app.py',
      content: getPythonAppFile(),
      icon: FileCode,
    },
    'requirements.txt': {
      name: 'requirements.txt',
      path: 'requirements.txt',
      content: getPythonRequirements(),
      icon: FileText,
    },
    'Dockerfile': {
      name: 'Dockerfile',
      path: 'Dockerfile',
      content: getPythonDockerfile(),
      icon: Layers,
    },
    'azure-pipelines.yml': {
      name: 'azure-pipelines.yml',
      path: 'azure-pipelines.yml',
      content: getAzurePipelinesYml(config),
      icon: Terminal,
    },
    'docker-compose.yml': {
      name: 'docker-compose.yml',
      path: 'docker-compose.yml',
      content: getDockerCompose(config),
      icon: Archive,
    },
    'README.md': {
      name: 'README.md',
      path: 'README.md',
      content: getReadme(config),
      icon: FileText,
    },
    '.dockerignore': {
      name: '.dockerignore',
      path: '.dockerignore',
      content: getDockerignore(),
      icon: FileText,
    },
    '.gitignore': {
      name: '.gitignore',
      path: '.gitignore',
      content: getGitignore(),
      icon: FileText,
    },
  };

  const currentFiles = projectType === 'nginx' ? nginxFiles : pythonFiles;
  const activeFile = currentFiles[selectedFile] || Object.values(currentFiles)[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      if (projectType === 'nginx') {
        await exportNginxProjectZip(config);
      } else {
        await exportPythonProjectZip(config);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Repository File Inspector</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete production repository files. Inspect, copy, or download as an exportable ZIP for GitHub.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Project Type Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => {
                setProjectType('nginx');
                setSelectedFile('azure-pipelines.yml');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                projectType === 'nginx' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nginx Alpine (HTML/JS)
            </button>
            <button
              onClick={() => {
                setProjectType('python');
                setSelectedFile('app.py');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                projectType === 'python' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Python Template (Flask)
            </button>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* File Tree Left Pane */}
        <div className="md:col-span-4 bg-slate-950 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-slate-300 border-b border-slate-800/80 mb-2">
            <Folder className="w-4 h-4 text-cyan-400" />
            <span>{projectType === 'nginx' ? 'azure-cicd-webapp/' : 'azure-cicd-python-webapp/'}</span>
          </div>

          <div className="space-y-1">
            {Object.keys(currentFiles).map((fileKey) => {
              const fileObj = currentFiles[fileKey];
              const isSelected = selectedFile === fileKey;
              const Icon = fileObj.icon;
              return (
                <button
                  key={fileKey}
                  onClick={() => setSelectedFile(fileKey)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left text-xs font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 font-medium'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{fileObj.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewer Right Pane */}
        <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
          {/* File Toolbar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-200">
              <span className="text-cyan-400">/</span>
              <span>{activeFile.path}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
                title="Download this single file"
              >
                <Download className="w-3 h-3" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          {/* File Content with Line Numbers */}
          <div className="p-4 overflow-x-auto max-h-[500px] text-xs font-mono text-slate-300 leading-relaxed">
            <pre className="select-all">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
