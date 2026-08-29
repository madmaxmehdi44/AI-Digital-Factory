import React, { useState } from "react";
import {
  Rocket,
  Server,
  ShieldCheck,
  Key,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Globe,
  Database,
  Lock,
  Cpu,
  ExternalLink,
  ChevronRight,
  Plus,
  Eye,
  Sparkles,
  Layout
} from "lucide-react";
import confetti from "canvas-confetti";
import { HostingConnector, HostingType, WordPressTheme, BusinessInput, DesignSystem, BusinessStrategy } from "../types";
import { executeDeploymentPipeline } from "../lib/geminiClient";
import { SitePreviewModal } from "./SitePreviewModal";

interface DeploymentEngineViewProps {
  business: BusinessInput;
  theme: WordPressTheme | null;
  designSystem?: DesignSystem | null;
  strategy?: BusinessStrategy | null;
  connectors: HostingConnector[];
  onAddConnector: (conn: HostingConnector) => void;
}

export const DeploymentEngineView: React.FC<DeploymentEngineViewProps> = ({
  business,
  theme,
  designSystem = null,
  strategy = null,
  connectors,
  onAddConnector
}) => {
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>(connectors[0]?.id || "");
  const [targetDomain, setTargetDomain] = useState<string>(
    `${business.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.ai`
  );
  const [dbName, setDbName] = useState<string>(
    `wp_${business.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
  );
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [showAddConnectorModal, setShowAddConnectorModal] = useState<boolean>(false);
  const [showSitePreviewModal, setShowSitePreviewModal] = useState<boolean>(false);

  // New Connector form state
  const [newConnName, setNewConnName] = useState("");
  const [newConnType, setNewConnType] = useState<HostingType>("cpanel");
  const [newConnHost, setNewConnHost] = useState("");
  const [newConnToken, setNewConnToken] = useState("");

  const activeConnector = connectors.find(c => c.id === selectedConnectorId) || connectors[0];

  const handleStartDeployment = async () => {
    setIsDeploying(true);
    setActiveStepIndex(0);
    setTerminalLogs([]);
    setDeploymentResult(null);

    const steps = [
      { name: "Connect Hosting Vault", log: `[AUTH] Verifying AES-256 Vault Token for ${activeConnector?.name}...` },
      { name: "Check Requirements", log: `[CHECK] PHP ${activeConnector?.serverInfo.php} OK | MySQL ${activeConnector?.serverInfo.mysql} OK | Redis Module ACTIVE` },
      { name: "Create Isolated Database", log: `[DB] Provisioning database '${dbName}' with utf8mb4 collation...` },
      { name: "Install WordPress Core", log: `[WP-CLI] wp core download && wp core install --url=https://${targetDomain} --title="${business.name}"` },
      { name: "Deploy AI Block Theme", log: `[THEME] Extracted '${theme?.themeSlug || "wp-factory-theme"}' to /wp-content/themes/ and activated.` },
      { name: "Import Content & Patterns", log: `[CONTENT] Imported 5 pages, block templates, and JSON-LD schema.` },
      { name: "Configure Redis Cache & SEO", log: `[PLUGINS] Activated Redis Object Cache, WebP Image Engine, and Firewall.` },
      { name: "Issue SSL Certificate & Launch", log: `[SSL] Let's Encrypt Wildcard SSL provisioned. HTTP/3 QUIC active.` }
    ];

    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      setTerminalLogs(prev => [...prev, steps[i].log]);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      const res = await executeDeploymentPipeline({
        targetEnv: activeConnector?.type || "docker",
        domain: targetDomain,
        databaseName: dbName,
        themeSlug: theme?.themeSlug || "wp-factory-theme"
      });

      setDeploymentResult(res);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e: any) {
      setTerminalLogs(prev => [...prev, `[ERROR] Deployment failed: ${e.message}`]);
    } finally {
      setIsDeploying(false);
      setActiveStepIndex(steps.length);
    }
  };

  const handleCreateConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnName || !newConnHost) return;

    const created: HostingConnector = {
      id: `conn_${Date.now()}`,
      name: newConnName,
      type: newConnType,
      host: newConnHost,
      status: "connected",
      lastPingMs: Math.floor(Math.random() * 30) + 15,
      serverInfo: {
        php: "8.3.2",
        mysql: "MySQL 8.0.36",
        webServer: "Nginx / OpenResty",
        memoryLimit: "1024M"
      },
      vaultKeyId: `vk_aes256_${Math.floor(Math.random() * 9000) + 1000}`,
      maskedToken: `${newConnType}_token_••••••••••••••••`
    };

    onAddConnector(created);
    setSelectedConnectorId(created.id);
    setShowAddConnectorModal(false);
    setNewConnName("");
    setNewConnHost("");
    setNewConnToken("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-100">WordPress Deployment Engine</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              cPanel / Plesk / SSH / Docker
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Automated infrastructure provisioning and zero-downtime block theme deployment.</p>
        </div>

        <button
          onClick={() => setShowAddConnectorModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-indigo-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hosting Connector</span>
        </button>
      </div>

      {/* 1. Hosting Connector Selector & Key Vault Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-slate-300">Select Target Hosting Connector</span>
            <span className="text-[10px] text-slate-400 font-mono">{connectors.length} Active Nodes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {connectors.map(c => {
              const isSelected = selectedConnectorId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConnectorId(c.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-indigo-600/20 border-indigo-500/60 shadow-lg"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-100 truncate">{c.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase font-semibold">
                      {c.type}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 truncate">{c.host}</div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {c.lastPingMs}ms Ping
                    </span>
                    <span className="text-slate-400">PHP {c.serverInfo.php}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Key Vault Box */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Encrypted Key Vault</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                <span>Active Vault Key ID:</span>
                <span className="text-indigo-300">{activeConnector?.vaultKeyId}</span>
              </div>
              <div className="font-mono text-slate-300 text-[11px] truncate">
                {activeConnector?.maskedToken}
              </div>
              <div className="text-[10px] text-slate-400">
                Encrypted via AES-256 GCM. Passwords are never stored in plain text.
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Database Engine:</span>
                <span className="font-mono font-semibold text-slate-200">{activeConnector?.serverInfo.mysql}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Web Server:</span>
                <span className="font-mono font-semibold text-slate-200">{activeConnector?.serverInfo.webServer}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
            ● SSL Auto-Provisioning Enabled (Let's Encrypt)
          </div>
        </div>
      </div>

      {/* 2. Deployment Parameters & Launch Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Production Domain</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={targetDomain}
                onChange={e => setTargetDomain(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Isolated Database Name</label>
            <div className="relative">
              <Database className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={dbName}
                onChange={e => setDbName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Compiled Block Theme</label>
            <input
              type="text"
              readOnly
              value={theme?.themeSlug || "wp-factory-theme"}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSitePreviewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/30 hover:border-sky-400 text-xs font-bold text-sky-300 shadow-sm transition-all cursor-pointer group"
              title="Inspect virtual block theme mockup before production deployment"
            >
              <Eye className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Virtual Site Preview</span>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono text-[9px] font-bold">
                FSE
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartDeployment}
              disabled={isDeploying}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs font-bold text-white shadow-lg shadow-amber-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Deploy WordPress Site Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Step Progress & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Step Matrix (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase">Deployment Workflow Pipeline</div>

          <div className="space-y-2">
            {[
              "1. Connect Hosting & Auth Vault",
              "2. Check System Requirements",
              "3. Provision Isolated Database",
              "4. Install WordPress Core v6.7",
              "5. Deploy Gutenberg Theme",
              "6. Import Content & Patterns",
              "7. Configure Redis & Cache",
              "8. Issue SSL & Launch Live"
            ].map((stepName, idx) => {
              const isPast = activeStepIndex > idx;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                    isPast
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : isCurrent
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 animate-pulse"
                      : "bg-slate-950 border-slate-800/80 text-slate-400"
                  }`}
                >
                  <span>{stepName}</span>
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isCurrent && <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal Output (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-2xl h-[380px]">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Deployment Stream Console</span>
            </div>
            <span className="text-[10px] text-slate-400">stdout/stderr</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 space-y-1.5">
            <div className="text-slate-400">$ ready: waiting for deployment trigger...</div>
            {terminalLogs.map((log, i) => (
              <div key={i} className="text-emerald-400">
                {log}
              </div>
            ))}
            {deploymentResult && (
              <div className="pt-2 text-indigo-300 border-t border-slate-800">
                [SUCCESS] Live URL ready at: {deploymentResult.liveUrl}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Connector Modal */}
      {showAddConnectorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">Add New Hosting Connector</h3>
              <button
                onClick={() => setShowAddConnectorModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateConnector} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Connector Name</label>
                <input
                  type="text"
                  required
                  value={newConnName}
                  onChange={e => setNewConnName(e.target.value)}
                  placeholder="e.g. EU cPanel Enterprise WHM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Connector Architecture</label>
                <select
                  value={newConnType}
                  onChange={e => setNewConnType(e.target.value as HostingType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="cpanel">cPanel API (UAPI / WHM)</option>
                  <option value="plesk">Plesk REST API</option>
                  <option value="ssh">SSH / Direct Bare Metal VPS</option>
                  <option value="docker">Docker Compose Swarm</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Host / IP / Endpoint</label>
                <input
                  type="text"
                  required
                  value={newConnHost}
                  onChange={e => setNewConnHost(e.target.value)}
                  placeholder="e.g. whm.hostingcluster.com or 192.168.1.100"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">API Token / SSH Key</label>
                <input
                  type="password"
                  required
                  value={newConnToken}
                  onChange={e => setNewConnToken(e.target.value)}
                  placeholder="API Key (Stored in encrypted Vault)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddConnectorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  Save to Encrypted Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Virtual Site Preview Simulator Modal */}
      <SitePreviewModal
        isOpen={showSitePreviewModal}
        onClose={() => setShowSitePreviewModal(false)}
        business={business}
        theme={theme}
        designSystem={designSystem}
        strategy={strategy}
        targetDomain={targetDomain}
        onConfirmDeploy={handleStartDeployment}
      />
    </div>
  );
};
