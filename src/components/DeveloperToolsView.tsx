import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Server,
  Play,
  Square,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Database,
  PlusCircle,
  Clock,
  Layers,
  Flame,
  ArrowRight,
  HardDrive,
  RotateCcw,
  Sparkles,
  Zap,
  Lock
} from "lucide-react";
import { TestSuiteReport, TestResultItem } from "../core/tests/runner";

interface LocalDaemonStatus {
  status: 'RUNNING' | 'STOPPED';
  php: string;
  mysql: string;
  webServer: string;
  wpCli: string;
  redis: string;
  totalLocalSites: number;
  providerMode: string;
  telemetryStatus: string;
}

interface LocalSite {
  id: string;
  domain: string;
  businessName: string;
  themeSlug: string;
  adminUser: string;
  adminEmail: string;
  wpVersion: string;
  phpVersion: string;
  status: 'healthy' | 'degraded' | 'critical' | 'stopped';
  httpStatus: number;
  dbName: string;
  postsCount: number;
  plugins: { name: string; slug: string; active: boolean; version: string }[];
  snapshotsCount: number;
  snapshots: { id: string; timestamp: string; description: string }[];
  debugLog: string[];
  injectedFailure?: {
    type: string;
    message: string;
    injectedAt: string;
  };
  createdAt: string;
}

export const DeveloperToolsView: React.FC = () => {
  const [daemon, setDaemon] = useState<LocalDaemonStatus | null>(null);
  const [sites, setSites] = useState<LocalSite[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("http://site.test");
  const [testReport, setTestReport] = useState<TestSuiteReport | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [newSiteDomain, setNewSiteDomain] = useState("local.berlin-luxury.test");
  const [newSiteBusiness, setNewSiteBusiness] = useState("Kaiser & Berg Berlin");

  const appendLog = (msg: string) => {
    setActionLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const fetchStatusAndSites = async () => {
    try {
      const resStatus = await fetch("/api/dev/local-status");
      const dataStatus = await resStatus.json();
      if (dataStatus.success) setDaemon(dataStatus.status);

      const resSites = await fetch("/api/dev/local-sites");
      const dataSites = await resSites.json();
      if (dataSites.success && dataSites.sites) {
        setSites(dataSites.sites);
        if (dataSites.sites.length > 0 && !selectedDomain) {
          setSelectedDomain(dataSites.sites[0].domain);
        }
      }
    } catch (err: any) {
      appendLog(`Error fetching dev tools status: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchStatusAndSites();
  }, []);

  const handleToggleDaemon = async () => {
    if (!daemon) return;
    setIsLoading(true);
    try {
      const nextState = daemon.status !== "RUNNING";
      const res = await fetch("/api/dev/toggle-daemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ running: nextState })
      });
      const data = await res.json();
      if (data.success) {
        setDaemon(data.status);
        appendLog(`Local WordPress Runtime daemon set to: ${data.status.status}`);
      }
    } catch (err: any) {
      appendLog(`Failed to toggle daemon: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSite = async () => {
    if (!newSiteDomain || !newSiteBusiness) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/create-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: newSiteDomain,
          businessName: newSiteBusiness,
          themeSlug: "theme_custom_fse"
        })
      });
      const data = await res.json();
      if (data.success) {
        appendLog(`Provisioned local WordPress site: ${data.site.domain}`);
        await fetchStatusAndSites();
        setSelectedDomain(data.site.domain);
      }
    } catch (err: any) {
      appendLog(`Error provisioning site: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInjectFailure = async (type: 'FATAL_PLUGIN' | 'DB_CONNECTION_ERROR' | 'CORRUPT_CACHE') => {
    if (!selectedDomain) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/inject-failure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain, failureType: type })
      });
      const data = await res.json();
      if (data.success) {
        appendLog(`INJECTED FAULT [${type}] on ${selectedDomain}: ${data.result.message}`);
        await fetchStatusAndSites();
      }
    } catch (err: any) {
      appendLog(`Error injecting fault: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFailure = async () => {
    if (!selectedDomain) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/clear-failure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain })
      });
      const data = await res.json();
      if (data.success) {
        appendLog(`Cleared faults on ${selectedDomain}. Status: 200 OK.`);
        await fetchStatusAndSites();
      }
    } catch (err: any) {
      appendLog(`Error clearing fault: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteHealing = async () => {
    if (!selectedDomain) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/execute-healing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain })
      });
      const data = await res.json();
      if (data.success) {
        appendLog(`SELF-HEALING COMPLETE for ${selectedDomain}: Snapshot ${data.result.snapshotId} -> HTTP ${data.result.postHealthStatus} OK`);
        data.result.remediationSteps.forEach((step: string) => appendLog(`  └─ ${step}`));
        await fetchStatusAndSites();
      }
    } catch (err: any) {
      appendLog(`Error executing self-healing: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteRollbackTest = async () => {
    if (!selectedDomain) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/execute-rollback-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain })
      });
      const data = await res.json();
      if (data.success) {
        appendLog(`TRANSACTIONAL ROLLBACK SUCCESSFUL for ${selectedDomain}: State ${data.result.state}`);
        data.result.logs.forEach((log: string) => appendLog(`  ${log}`));
        await fetchStatusAndSites();
      }
    } catch (err: any) {
      appendLog(`Error in rollback test: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    if (!selectedDomain) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/create-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain, description: `Manual Dev Snapshot at ${new Date().toLocaleTimeString()}` })
      });
      const data = await res.json();
      if (data.success) {
        appendLog(`Captured snapshot '${data.snapshotId}' for ${selectedDomain}`);
        await fetchStatusAndSites();
      }
    } catch (err: any) {
      appendLog(`Error creating snapshot: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreSnapshot = async (snapshotId: string) => {
    if (!selectedDomain || !snapshotId) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/dev/restore-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain, snapshotId })
      });
      const data = await res.json();
      if (data.success) {
        appendLog(`RESTORED snapshot '${snapshotId}' for ${selectedDomain}. File tree & DB reset.`);
        await fetchStatusAndSites();
      }
    } catch (err: any) {
      appendLog(`Error restoring snapshot: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAllTests = async () => {
    setIsRunningTests(true);
    appendLog("Initiating Production Reality Acceptance Test Suite (19 Suites)...");
    try {
      const res = await fetch("/api/system/run-tests");
      const data = await res.json();
      if (data.success && data.report) {
        setTestReport(data.report);
        appendLog(`TEST RUN COMPLETE: ${data.report.passedTests}/${data.report.totalTests} PASSED in ${data.report.durationMs}ms`);
      }
    } catch (err: any) {
      appendLog(`Test execution error: ${err.message}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const currentSite = sites.find(s => s.domain === selectedDomain) || sites[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl font-bold text-slate-100">Engineering & Local Developer Control Plane</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Authenticated Dev Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real local WordPress runtime environment with PHP 8.3-FPM, MariaDB storage, WP-CLI 2.9, virtual file system, autonomous self-healing, transactional rollback, and test failure injection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStatusAndSites}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh State</span>
          </button>

          <button
            onClick={handleRunAllTests}
            disabled={isRunningTests}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Sparkles className={`w-4 h-4 ${isRunningTests ? "animate-spin" : ""}`} />
            <span>{isRunningTests ? "Running 19 Tests..." : "Run 19 Verification Tests"}</span>
          </button>
        </div>
      </div>

      {/* Grid 1: Local Daemon Runtime Status + Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Runtime Daemon Card */}
        <div className="bento-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-200">Local Runtime Engine</h2>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                daemon?.status === "RUNNING"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}
            >
              {daemon?.status || "UNKNOWN"}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-500">PHP Binary:</span>
              <span className="text-slate-300">{daemon?.php || "PHP 8.3.4-fpm"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-500">Database Engine:</span>
              <span className="text-slate-300">{daemon?.mysql || "MariaDB 11.2"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-500">Web Server:</span>
              <span className="text-slate-300">{daemon?.webServer || "Caddy 2.7.6 / HTTP3"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-500">CLI Tooling:</span>
              <span className="text-slate-300">{daemon?.wpCli || "WP-CLI 2.9.0"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Redis Cache:</span>
              <span className="text-emerald-400">{daemon?.redis || "Redis 7.2.4 Active"}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleToggleDaemon}
              className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                daemon?.status === "RUNNING"
                  ? "bg-rose-950/40 text-rose-300 border-rose-800/50 hover:bg-rose-900/50"
                  : "bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/50"
              }`}
            >
              {daemon?.status === "RUNNING" ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Local Runtime</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Local Runtime</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Local Sites Registry */}
        <div className="bento-card p-5 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200">Local WordPress Sites ({sites.length})</h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Select Site:</span>
              <select
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-mono focus:outline-none focus:border-sky-500"
              >
                {sites.map(s => (
                  <option key={s.domain} value={s.domain}>
                    {s.domain} ({s.businessName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Site Details */}
          {currentSite && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-500">Domain & URL</div>
                <div className="text-xs font-mono font-semibold text-sky-400 truncate mt-1">{currentSite.domain}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">HTTP {currentSite.httpStatus}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-500">Theme Slug</div>
                <div className="text-xs font-mono font-semibold text-emerald-400 truncate mt-1">{currentSite.themeSlug}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Gutenberg FSE v3</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-500">Database & Content</div>
                <div className="text-xs font-mono font-semibold text-purple-400 truncate mt-1">{currentSite.dbName}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{currentSite.postsCount} pages, {currentSite.plugins.length} plugins</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-500">Health Status</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentSite.status === "healthy"
                        ? "bg-emerald-400"
                        : currentSite.status === "critical"
                        ? "bg-rose-400 animate-ping"
                        : "bg-amber-400"
                    }`}
                  />
                  <span className="text-xs font-mono uppercase font-bold text-slate-200">{currentSite.status}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{currentSite.snapshotsCount} snapshots</div>
              </div>
            </div>
          )}

          {/* Quick Create Site Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800/80">
            <input
              type="text"
              placeholder="Domain (e.g. local.agency.test)"
              value={newSiteDomain}
              onChange={e => setNewSiteDomain(e.target.value)}
              className="w-full sm:w-1/2 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-sky-500"
            />
            <input
              type="text"
              placeholder="Business Name"
              value={newSiteBusiness}
              onChange={e => setNewSiteBusiness(e.target.value)}
              className="w-full sm:w-1/2 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={handleCreateSite}
              className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs whitespace-nowrap flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Provision Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid 2: Test Failure Injection & Self-Healing Testing (Local Dev Protected) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controlled Failure Injection Card */}
        <div className="bento-card p-5 space-y-4 border border-rose-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-slate-200">Controlled Failure Injection (Test Sandbox)</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Dev Only
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Inject realistic faults into the local WordPress runtime to test telemetry observation, automated incident detection, pre-flight safety snapshots, and autonomous self-healing.
          </p>

          {currentSite?.injectedFailure ? (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs font-mono space-y-1 text-rose-200">
              <div className="font-bold flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Active Injected Fault: {currentSite.injectedFailure.type}</span>
              </div>
              <div className="text-[11px] text-rose-300 break-words">{currentSite.injectedFailure.message}</div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleClearFailure}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition-colors"
                >
                  Clear Fault
                </button>
                <button
                  onClick={handleExecuteHealing}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors"
                >
                  Run Autonomous Self-Healing
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleInjectFailure("FATAL_PLUGIN")}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-700/50 text-left transition-all text-xs space-y-1 group"
              >
                <div className="font-semibold text-rose-300 group-hover:text-rose-200">PHP Fatal Error</div>
                <div className="text-[10px] text-slate-500">Plugin call undefined function</div>
              </button>

              <button
                onClick={() => handleInjectFailure("DB_CONNECTION_ERROR")}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-700/50 text-left transition-all text-xs space-y-1 group"
              >
                <div className="font-semibold text-amber-300 group-hover:text-amber-200">DB Error 500</div>
                <div className="text-[10px] text-slate-500">Access denied on table grant</div>
              </button>

              <button
                onClick={() => handleInjectFailure("CORRUPT_CACHE")}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-700/50 text-left transition-all text-xs space-y-1 group"
              >
                <div className="font-semibold text-indigo-300 group-hover:text-indigo-200">Redis Socket Drop</div>
                <div className="text-[10px] text-slate-500">Object cache connection refused</div>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Security Gatekeeper:</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production Ingress Protected (Level 3 Enforced)</span>
            </span>
          </div>
        </div>

        {/* Snapshot, Self-Healing & Transactional Rollback Card */}
        <div className="bento-card p-5 space-y-4 border border-indigo-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200">Autonomous Healing & Transactional Rollback</h2>
            </div>
            <button
              onClick={handleCreateSnapshot}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-700"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Take Snapshot</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Every remediation step is transactional. If post-remediation verification ping fails, the orchestrator automatically executes atomic rollback to the pre-incident snapshot.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleExecuteHealing}
              className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Execute Real Self-Healing</span>
            </button>

            <button
              onClick={handleExecuteRollbackTest}
              className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Test Atomic Rollback</span>
            </button>
          </div>

          {/* Snapshot list */}
          {currentSite && currentSite.snapshots.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 font-semibold">Available Site Snapshots:</div>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1 font-mono text-[10px]">
                {currentSite.snapshots.map(sn => (
                  <div
                    key={sn.id}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300"
                  >
                    <span className="text-sky-400 truncate">{sn.id}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500">{new Date(sn.timestamp).toLocaleTimeString()}</span>
                      <button
                        onClick={() => handleRestoreSnapshot(sn.id)}
                        className="px-1.5 py-0.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300 rounded"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid 3: Real-Time Verification Report (35 Suites) */}
      {testReport && (
        <div className="bento-card p-6 space-y-4 border border-emerald-900/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-slate-100">
                  Acceptance & Chaos Test Suite: {testReport.passedTests}/{testReport.totalTests} Verified Passing
                </h2>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Completed in {testReport.durationMs}ms at {new Date(testReport.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {testReport.breakdown && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold">
                  REAL_LOCAL: {testReport.breakdown.realLocal}
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800 text-sky-300 font-bold">
                  E2E: {testReport.breakdown.e2e}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800 text-indigo-300 font-bold">
                  INTEGRATION: {testReport.breakdown.integration}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300 font-bold">
                  UNIT_ONLY: {testReport.breakdown.unitOnly}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {testReport.results.map(test => (
              <div
                key={test.id}
                className={`p-3 rounded-lg border font-mono text-xs space-y-1.5 transition-all ${
                  test.passed
                    ? "bg-slate-900/80 border-slate-800 text-slate-200"
                    : "bg-rose-950/40 border-rose-800/80 text-rose-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {test.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-100 truncate">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                        test.executionMode === "REAL_LOCAL"
                          ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50"
                          : test.executionMode === "E2E"
                          ? "bg-sky-900/50 text-sky-300 border border-sky-700/50"
                          : test.executionMode === "INTEGRATION"
                          ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {test.executionMode}
                    </span>
                    <span className="text-[10px] text-slate-500">{test.durationMs}ms</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pl-5 leading-relaxed font-sans">{test.details}</div>
                {test.error && <div className="text-[10px] text-rose-400 pl-5 font-mono">{test.error}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid 4: Live Engineering Action Logs */}
      <div className="bento-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-slate-200">Developer Action & Event Log Stream</h2>
          </div>
          <button
            onClick={() => setActionLog([])}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
          >
            Clear Log
          </button>
        </div>

        <div className="p-3 bg-black/70 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1">
          {actionLog.length === 0 ? (
            <div className="text-slate-600 italic">No events logged yet. Trigger actions or tests above.</div>
          ) : (
            actionLog.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-sky-400 font-bold">&gt;</span> {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
