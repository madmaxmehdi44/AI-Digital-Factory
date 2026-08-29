import React, { useState } from "react";
import {
  Activity,
  Server,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Database,
  Lock,
  Zap,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  HardDrive
} from "lucide-react";
import { FleetSite, HostingType } from "../types";

interface OperationsDashboardProps {
  fleet: FleetSite[];
  onTriggerFleetAudit: () => void;
  onFlushFleetCache: () => void;
  onUpdateSite: (updated: FleetSite) => void;
  onNavigateToTroubleshoot: (domain: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  fleet,
  onTriggerFleetAudit,
  onFlushFleetCache,
  onUpdateSite,
  onNavigateToTroubleshoot
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "warning" | "critical">("all");
  const [selectedSite, setSelectedSite] = useState<FleetSite | null>(fleet[0] || null);
  const [bulkActionNotice, setBulkActionNotice] = useState<string | null>(null);

  const filteredSites = fleet.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const healthyCount = fleet.filter(s => s.status === "healthy").length;
  const warningCount = fleet.filter(s => s.status === "warning").length;
  const criticalCount = fleet.filter(s => s.status === "critical").length;

  const handleBulkAction = (action: string) => {
    setBulkActionNotice(`Executing bulk action: "${action}" across ${fleet.length} instances...`);
    setTimeout(() => {
      setBulkActionNotice(`✓ "${action}" completed successfully with 0 errors.`);
      setTimeout(() => setBulkActionNotice(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Bento Grid Top Telemetry Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Fleet Health Tile (3 cols) */}
        <div className="md:col-span-3 bento-card flex flex-col justify-between">
          <div>
            <h2 className="text-slate-500 text-xs font-mono mb-3 uppercase tracking-widest">Fleet Health</h2>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-mono text-green-400">{healthyCount}</span>
              <span className="text-xs text-slate-400 uppercase font-mono">/ {fleet.length} Sites Live</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              {warningCount > 0 ? `${warningCount} non-critical warnings detected.` : "All instances operating within optimal parameters."}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>24H UPTIME</span>
            <span className="text-green-400 font-bold">99.98%</span>
          </div>
        </div>

        {/* Resource Allocation & Infrastructure (6 cols) */}
        <div className="md:col-span-6 bento-card flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-slate-500 text-xs font-mono uppercase tracking-widest">Resource Allocation & Engine Infrastructure</h2>
              <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-mono">
                AUTOPILOT V2
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              <div className="bg-[#0A0A0C] p-2.5 rounded-lg border border-[#27272A]">
                <div className="text-[10px] text-slate-500 font-mono">CPU LOAD</div>
                <div className="text-sm font-bold font-mono text-slate-200 mt-1">14.2%</div>
                <div className="stat-bar mt-1.5"><div className="stat-progress" style={{ width: "14%" }}></div></div>
              </div>
              <div className="bg-[#0A0A0C] p-2.5 rounded-lg border border-[#27272A]">
                <div className="text-[10px] text-slate-500 font-mono">MEMORY</div>
                <div className="text-sm font-bold font-mono text-slate-200 mt-1">2.4 / 16 GB</div>
                <div className="stat-bar mt-1.5"><div className="stat-progress" style={{ width: "24%" }}></div></div>
              </div>
              <div className="bg-[#0A0A0C] p-2.5 rounded-lg border border-[#27272A]">
                <div className="text-[10px] text-slate-500 font-mono">DB TX/s</div>
                <div className="text-sm font-bold font-mono text-sky-400 mt-1">480 /s</div>
                <div className="stat-bar mt-1.5"><div className="stat-progress" style={{ width: "65%" }}></div></div>
              </div>
              <div className="bg-[#0A0A0C] p-2.5 rounded-lg border border-[#27272A]">
                <div className="text-[10px] text-slate-500 font-mono">I/O SPEED</div>
                <div className="text-sm font-bold font-mono text-green-400 mt-1">820 MB/s</div>
                <div className="stat-bar mt-1.5"><div className="stat-progress" style={{ width: "82%" }}></div></div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#27272A] text-[10px] font-mono text-slate-500">
            <span>WP-CLI RUNNER: ACTIVE (DAEMON 492)</span>
            <span className="text-sky-400">CONNECTORS: DOCKER, CPANEL, SSH, PLESK</span>
          </div>
        </div>

        {/* Backup Status (3 cols) */}
        <div className="md:col-span-3 bento-card flex flex-col justify-between">
          <div>
            <h2 className="text-slate-500 text-xs font-mono mb-3 uppercase tracking-widest">Backup & DR Status</h2>
            <div className="text-xs text-slate-300 mb-2 font-mono">SYSTEM SNAPSHOT</div>
            <div className="text-[11px] text-slate-400 font-mono mb-4 leading-relaxed">
              Auto-snapshot taken 14 mins ago.<br />
              Integrity checksum: <span className="text-sky-400">SHA-256 (VALID)</span>
            </div>
          </div>
          <button
            onClick={() => handleBulkAction("Create System-Wide Fleet Snapshot")}
            className="w-full py-2 bg-[#0A0A0C] hover:bg-[#1c1c21] border border-[#27272A] rounded-lg text-xs font-mono text-slate-300 transition-colors uppercase tracking-wider"
          >
            Force Instant Snapshot
          </button>
        </div>
      </div>

      {/* Header & Bulk Actions */}
      <div className="bento-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">Fleet Operations Management</h2>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono font-bold">
              100 Instance Quorum
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry, core updates, plugin vulnerability scans, and self-healing hooks.</p>
        </div>

        {/* Bulk Operations Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleBulkAction("Auto-Update Safe Plugins")}
            className="px-3 py-1.5 rounded-lg bg-[#0A0A0C] hover:bg-[#1c1c21] border border-[#27272A] text-xs font-mono text-slate-300 transition-colors"
          >
            Auto-Update Safe Plugins
          </button>

          <button
            onClick={() => handleBulkAction("Purge Global Edge & Redis Caches")}
            className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-black font-mono uppercase tracking-wider shadow-md shadow-sky-500/20"
          >
            Purge Edge & Redis
          </button>
        </div>
      </div>

      {/* Bulk Action Notice Banner */}
      {bulkActionNotice && (
        <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/30 text-xs font-mono text-sky-300 flex items-center justify-between animate-in fade-in duration-150">
          <span>{bulkActionNotice}</span>
          <span className="text-[10px] text-sky-400">WP-CLI Distributed Task</span>
        </div>
      )}

      {/* Main Fleet Table & Site Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fleet Table (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by domain, name, or version..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141417] border border-[#27272A] text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#141417] border border-[#27272A] text-xs font-mono">
              {(["all", "healthy", "warning", "critical"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                    statusFilter === s
                      ? "bg-sky-500 text-black font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sites List */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredSites.map(site => {
              const isSelected = selectedSite?.id === site.id;
              const isCritical = site.status === "critical";
              const isWarning = site.status === "warning";

              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#141417] border-sky-500 shadow-md ring-1 ring-sky-500"
                      : isCritical
                      ? "bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50"
                      : isWarning
                      ? "bg-amber-950/10 border-amber-500/30 hover:border-amber-500/50"
                      : "bg-[#141417] border-[#27272A] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          site.status === "healthy"
                            ? "bg-green-400"
                            : isWarning
                            ? "bg-amber-400"
                            : "bg-rose-400 animate-ping"
                        }`}
                      />
                      <span className="font-bold text-xs text-slate-100">{site.name}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        site.status === "healthy"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : isWarning
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {site.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="truncate">{site.domain}</span>
                    <div className="flex items-center gap-3">
                      <span>{site.responseTimeMs}ms</span>
                      <span className="text-green-400">{site.uptimePercent}%</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0A0A0C] border border-[#27272A] text-[10px] uppercase text-sky-400">
                        {site.hostingType}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Site Detail Drawer (5 cols) */}
        {selectedSite && (
          <div className="lg:col-span-5 p-5 bento-card space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div>
                <h3 className="font-extrabold text-base text-slate-100">{selectedSite.name}</h3>
                <a
                  href={`https://${selectedSite.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>{selectedSite.domain}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {selectedSite.status === "critical" && (
                <button
                  onClick={() => onNavigateToTroubleshoot(selectedSite.domain)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md shadow-rose-600/30 animate-pulse font-mono uppercase"
                >
                  Diagnose Crash
                </button>
              )}
            </div>

            {/* Vitals Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#27272A] space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500">WordPress Version</span>
                <div className="font-bold font-mono text-slate-200">v{selectedSite.wpVersion}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#27272A] space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500">PHP Runtime</span>
                <div className="font-bold font-mono text-slate-200">PHP {selectedSite.phpVersion}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#27272A] space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500">Core Web Vitals</span>
                <div className="font-bold font-mono text-green-400">{selectedSite.coreVitalsScore}/100</div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#27272A] space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500">SSL Expiration</span>
                <div className="font-bold font-mono text-slate-200">{selectedSite.sslExpiryDays} Days left</div>
              </div>
            </div>

            {/* Plugin Status & Updates */}
            <div className="p-3.5 rounded-lg bg-[#0A0A0C] border border-[#27272A] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 font-mono">Installed Plugins ({selectedSite.pluginsCount})</span>
                {selectedSite.updatesAvailable > 0 ? (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    {selectedSite.updatesAvailable} Updates Pending
                  </span>
                ) : (
                  <span className="text-[10px] text-green-400 font-mono">All Plugins Clean</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Last verified backup snapshot: <span className="text-slate-200">{selectedSite.lastBackup}</span>
              </div>
            </div>

            {/* Operational Actions */}
            <div className="space-y-2 pt-2 border-t border-[#27272A]">
              <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Instant Operational Actions:</div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <button
                  onClick={() => handleBulkAction(`Flush Cache for ${selectedSite.domain}`)}
                  className="p-2 rounded-lg bg-[#0A0A0C] hover:bg-[#1c1c21] border border-[#27272A] text-xs font-semibold text-slate-300 text-center"
                >
                  Flush Cache
                </button>

                <button
                  onClick={() => handleBulkAction(`Take Snapshot of ${selectedSite.domain}`)}
                  className="p-2 rounded-lg bg-[#0A0A0C] hover:bg-[#1c1c21] border border-[#27272A] text-xs font-semibold text-slate-300 text-center"
                >
                  Take Snapshot
                </button>

                <button
                  onClick={() => handleBulkAction(`Rollback ${selectedSite.domain}`)}
                  className="p-2 rounded-lg bg-[#0A0A0C] hover:bg-[#1c1c21] border border-[#27272A] text-xs font-semibold text-slate-300 text-center"
                >
                  Rollback Prev
                </button>

                <button
                  onClick={() => onNavigateToTroubleshoot(selectedSite.domain)}
                  className="p-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-black text-center uppercase tracking-wider"
                >
                  AI Diagnostics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
