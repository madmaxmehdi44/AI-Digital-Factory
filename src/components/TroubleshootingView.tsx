import React, { useState } from "react";
import {
  Stethoscope,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Terminal,
  CheckCircle2,
  Bug,
  RefreshCw,
  Zap,
  Play,
  FileCode
} from "lucide-react";
import { IncidentRecord } from "../types";
import { fetchTroubleshootingAnalysis } from "../lib/geminiClient";

interface TroubleshootingViewProps {
  initialDomain?: string;
  incidents: IncidentRecord[];
  onAddIncident: (inc: IncidentRecord) => void;
}

export const TroubleshootingView: React.FC<TroubleshootingViewProps> = ({
  initialDomain = "velocehealth.org",
  incidents,
  onAddIncident
}) => {
  const [siteDomain, setSiteDomain] = useState<string>(initialDomain);
  const [selectedPreset, setSelectedPreset] = useState<string>("fatal_plugin");
  const [customErrorLog, setCustomErrorLog] = useState<string>(
    "PHP Fatal error: Uncaught Error: Call to undefined function wp_cache_get_multi() in /var/www/html/wp-content/plugins/seo-optimizer/includes/cache.php:142\nStack trace: #0 /var/www/html/wp-includes/class-wp-hook.php(324): seo_cache_init()"
  );
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const errorPresets = [
    {
      id: "fatal_plugin",
      title: "HTTP 500 Fatal Error (Plugin Conflict)",
      log: "PHP Fatal error: Uncaught Error: Call to undefined function wp_cache_get_multi() in /var/www/html/wp-content/plugins/seo-optimizer/includes/cache.php:142\nStack trace: #0 /var/www/html/wp-includes/class-wp-hook.php(324): seo_cache_init()"
    },
    {
      id: "memory_exhaustion",
      title: "Fatal: Allowed Memory Size Exhausted (128MB)",
      log: "PHP Fatal error: Allowed memory size of 134217728 bytes exhausted (tried to allocate 20480 bytes) in /var/www/html/wp-content/themes/legacy/inc/slider.php on line 88"
    },
    {
      id: "mysql_deadlock",
      title: "MySQL 1205: Lock Wait Timeout Exceeded",
      log: "WordPress database error Lock wait timeout exceeded; try restarting transaction for query UPDATE `wp_options` SET `option_value` = '...' WHERE `option_name` = 'cron' made by shutdown_action_hook"
    },
    {
      id: "wsod_theme",
      title: "White Screen of Death (Missing closing bracket)",
      log: "PHP Parse error: syntax error, unexpected end of file, expecting variable or '{' or '$' in /var/www/html/wp-content/themes/custom-theme/functions.php on line 214"
    }
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const found = errorPresets.find(p => p.id === presetId);
    if (found) {
      setCustomErrorLog(found.log);
    }
  };

  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    setCurrentDiagnosis(null);
    setActiveStep(0);

    try {
      // Step 1: Taking safety snapshot
      setActiveStep(1);
      await new Promise(r => setTimeout(r, 600));

      // Step 2: Query Gemini AI for Root Cause
      setActiveStep(2);
      const res = await fetchTroubleshootingAnalysis({
        errorLog: customErrorLog,
        problemType: selectedPreset,
        siteDomain: siteDomain
      });

      setCurrentDiagnosis(res.data);

      // Step 3: Simulating autonomous remediation steps
      setActiveStep(3);
      await new Promise(r => setTimeout(r, 800));

      // Step 4: Synthetic probe verification
      setActiveStep(4);
      await new Promise(r => setTimeout(r, 600));

      // Register new resolved incident in history
      const newInc: IncidentRecord = {
        id: `inc_${Date.now()}`,
        siteDomain: siteDomain,
        timestamp: "Just now",
        problemTitle: res.data.problemTitle,
        rootCauseAnalysis: res.data.rootCauseAnalysis,
        affectedComponent: res.data.affectedComponent,
        severity: res.data.severity || "CRITICAL",
        status: "RESOLVED",
        safetyTransaction: res.data.safetyTransaction || {
          snapshotId: `snap_safe_${Date.now()}`,
          backupScope: "Automated snapshot of MySQL DB & wp-content directory before remediation."
        },
        autonomousRemediationSteps: res.data.autonomousRemediationSteps || [],
        preventionRecommendation: res.data.preventionRecommendation || "",
        rollbackScript: res.data.rollbackScript || ""
      };

      onAddIncident(newInc);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsDiagnosing(false);
      setActiveStep(5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bento-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">AI Troubleshooting & Self-Healing Engine</h2>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold">
              Autonomous Remediation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous diagnosis, safe snapshots, plugin isolation, database table repair, and one-click rollback.
          </p>
        </div>
      </div>

      {/* 1. Incident Simulator & Log Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Presets (5 cols) */}
        <div className="lg:col-span-5 bento-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
            <span className="text-xs font-mono font-bold uppercase text-slate-300">Incident Simulation Setup</span>
            <span className="text-[10px] text-green-400 font-mono">Autonomous Safe Mode</span>
          </div>

          <div className="space-y-1.5 font-mono">
            <label className="text-xs font-semibold text-slate-300">Affected Site Domain</label>
            <input
              type="text"
              value={siteDomain}
              onChange={e => setSiteDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-2 font-mono">
            <label className="text-xs font-semibold text-slate-300">Choose Error Scenario Preset:</label>
            <div className="space-y-1.5">
              {errorPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    selectedPreset === preset.id
                      ? "bg-sky-500/10 border-sky-500 text-sky-200 font-semibold"
                      : "bg-[#0A0A0C] border-[#27272A] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 font-mono">
            <label className="text-xs font-semibold text-slate-300">WordPress Error Log (debug.log / nginx error.log)</label>
            <textarea
              rows={4}
              value={customErrorLog}
              onChange={e => setCustomErrorLog(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-xs font-mono text-rose-300 focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleRunDiagnosis}
            disabled={isDiagnosing}
            className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-black font-mono uppercase tracking-wider shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isDiagnosing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Self-Healing in Progress...</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                <span>Run Autonomous AI Diagnosis & Repair</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Live Remediation Pipeline & Post-Mortem (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step Progress Bar */}
          <div className="bento-card space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-slate-300">
              Autonomous Transaction Pipeline (Snapshot → Remediate → Verify)
            </div>

            <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
              {[
                { step: 1, label: "1. Take Snapshot" },
                { step: 2, label: "2. AI Root Cause" },
                { step: 3, label: "3. Auto Repair" },
                { step: 4, label: "4. Health Verify" }
              ].map(s => {
                const isPast = activeStep > s.step;
                const isCurrent = activeStep === s.step;

                return (
                  <div
                    key={s.step}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isPast
                        ? "bg-green-950/20 border-green-500/40 text-green-300"
                        : isCurrent
                        ? "bg-sky-500/20 border-sky-500 text-sky-200 animate-pulse font-bold"
                        : "bg-[#0A0A0C] border-[#27272A] text-slate-500"
                    }`}
                  >
                    {s.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnosis Result Card */}
          {currentDiagnosis ? (
            <div className="bento-card border-green-500/30 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-sm text-slate-100 font-mono">{currentDiagnosis.problemTitle}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-mono font-bold">
                  AUTONOMOUSLY RESOLVED
                </span>
              </div>

              {/* Root Cause */}
              <div className="p-3.5 rounded-lg bg-[#0A0A0C] border border-[#27272A] space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase font-bold text-sky-400">AI Root Cause Analysis</span>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px]">{currentDiagnosis.rootCauseAnalysis}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Affected: <span className="text-rose-400">{currentDiagnosis.affectedComponent}</span>
                </div>
              </div>

              {/* Safety Snapshot Taken */}
              <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#27272A] flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span>Safety Snapshot: {currentDiagnosis.safetyTransaction?.snapshotId}</span>
                </div>
                <span className="text-green-400">Encrypted</span>
              </div>

              {/* Remediation Steps Applied */}
              <div className="space-y-1.5 text-xs font-mono">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Remediation Steps Applied:</span>
                {currentDiagnosis.autonomousRemediationSteps?.map((step: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#0A0A0C] border border-[#27272A] flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    <span className="text-sky-400 font-bold">[{step.action}]</span>
                    <span className="truncate">{step.detail}</span>
                  </div>
                ))}
              </div>

              {/* Rollback Script */}
              {currentDiagnosis.rollbackScript && (
                <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#27272A] space-y-1 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">One-Click Rollback Script (If required)</span>
                  <div className="p-2 rounded bg-[#0A0A0C] border border-[#27272A] font-mono text-green-300 text-[11px]">
                    $ {currentDiagnosis.rollbackScript}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bento-card text-center text-xs text-slate-400 space-y-2 font-mono">
              <Bug className="w-8 h-8 text-slate-500 mx-auto" />
              <p>Select a scenario on the left and click "Run Autonomous AI Diagnosis" to test the self-healing system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
