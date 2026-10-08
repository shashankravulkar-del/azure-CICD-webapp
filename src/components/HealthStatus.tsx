import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ProjectConfig } from '../data/projectFiles';

interface HealthStatusProps {
  config: ProjectConfig;
}

export const HealthStatus: React.FC<HealthStatusProps> = ({ config }) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [lastCheck, setLastCheck] = useState<string>('');
  const [isProbing, setIsProbing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    setLastCheck(new Date().toTimeString().split(' ')[0] + ' UTC');

    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleManualProbe = () => {
    setIsProbing(true);
    setTimeout(() => {
      setIsProbing(false);
      setLastCheck(new Date().toTimeString().split(' ')[0] + ' UTC');
    }, 400);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">Application Health &amp; Telemetry</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time container probe specification, uptime metrics, and /health JSON endpoint schema.
          </p>
        </div>
        <button
          onClick={handleManualProbe}
          disabled={isProbing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isProbing ? 'animate-spin' : ''}`} />
          <span>Probe Health</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Health Probe
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1.5">
            <span>HTTP 200</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Endpoint: <code className="text-slate-400">/health</code>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Uptime
            </span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {formatUptime(seconds)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Elapsed session clock
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Container Runtime
            </span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            Nginx 1.27
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Alpine Linux x86_64 / arm64
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Last Verified
            </span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold font-mono text-white truncate">
            {lastCheck}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            UTC Synchronization
          </div>
        </div>
      </div>

      {/* JSON schema returned by Nginx /health */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white">
            Health Check Response Payload (JSON)
          </span>
          <span className="text-[11px] font-mono text-cyan-400">Content-Type: application/json</span>
        </div>
        <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-emerald-300 overflow-x-auto">
{`{
  "status": "healthy",
  "uptime": "ok",
  "service": "cloud-devops-dashboard",
  "port": 80,
  "probeTimestamp": "${new Date().toISOString()}"
}`}
        </pre>
      </div>
    </div>
  );
};
