import JSZip from 'jszip';
import {
  ProjectConfig,
  getHtmlIndexFile,
  getCssFile,
  getJsFile,
  getDockerfile,
  getDockerignore,
  getNginxConf,
  getDockerCompose,
  getGitignore,
  getAzurePipelinesYml,
  getReadme,
  getPythonAppFile,
  getPythonDockerfile,
  getPythonRequirements,
} from '../data/projectFiles';

export async function exportNginxProjectZip(config: ProjectConfig): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('azure-cicd-webapp') || zip;

  // Add src folder files
  const srcFolder = folder.folder('src');
  if (srcFolder) {
    srcFolder.file('index.html', getHtmlIndexFile(config));
    srcFolder.file('style.css', getCssFile());
    srcFolder.file('script.js', getJsFile());
  }

  // Add root files
  folder.file('Dockerfile', getDockerfile());
  folder.file('.dockerignore', getDockerignore());
  folder.file('nginx.conf', getNginxConf());
  folder.file('azure-pipelines.yml', getAzurePipelinesYml(config));
  folder.file('docker-compose.yml', getDockerCompose(config));
  folder.file('README.md', getReadme(config));
  folder.file('.gitignore', getGitignore());

  // Generate blob and trigger browser download
  const content = await zip.generateAsync({ type: 'blob' });
  triggerDownload(content, 'azure-cicd-webapp.zip');
}

export async function exportPythonProjectZip(config: ProjectConfig): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('azure-cicd-python-webapp') || zip;

  folder.file('app.py', getPythonAppFile());
  folder.file('requirements.txt', getPythonRequirements());
  folder.file('Dockerfile', getPythonDockerfile());
  folder.file('.dockerignore', getDockerignore());
  folder.file('azure-pipelines.yml', getAzurePipelinesYml(config));
  folder.file('docker-compose.yml', getDockerCompose(config));
  folder.file('README.md', getReadme(config));
  folder.file('.gitignore', getGitignore());

  const content = await zip.generateAsync({ type: 'blob' });
  triggerDownload(content, 'azure-cicd-python-webapp.zip');
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
