import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Layers,
  Palette,
  Code2,
  Rocket,
  Activity,
  Stethoscope,
  DatabaseBackup,
  TrendingUp,
  Mic,
  Cpu,
  Shield,
  Server,
  FolderGit2,
  Terminal
} from "lucide-react";
import { ActiveTab } from "../types";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  compiledThemeReady: boolean;
  unresolvedIncidentsCount: number;
  availableOptimizationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  compiledThemeReady,
  unresolvedIncidentsCount,
  availableOptimizationsCount
}) => {
  const navSections = [
    {
      label: "Autonomous Creation",
      items: [
        {
          id: "factory_wizard" as ActiveTab,
          label: "Digital Factory Wizard",
          icon: Sparkles,
          badge: "Pipeline",
          badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
        },
        {
          id: "business_ai" as ActiveTab,
          label: "Business AI Strategy",
          icon: Layers,
          description: "Architecture & Conversion"
        },
        {
          id: "design_system" as ActiveTab,
          label: "Design System Studio",
          icon: Palette,
          description: "Tokens & Typography"
        },
        {
          id: "theme_compiler" as ActiveTab,
          label: "WordPress Theme Compiler",
          icon: Code2,
          badge: compiledThemeReady ? "Gutenberg FSE" : "Ready",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        },
        {
          id: "deployment" as ActiveTab,
          label: "Deployment Engine",
          icon: Rocket,
          badge: "cPanel/Docker/SSH",
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
        }
      ]
    },
    {
      label: "24/7 Operations & Maintenance",
      items: [
        {
          id: "operations_fleet" as ActiveTab,
          label: "Fleet Health & Ops",
          icon: Activity,
          badge: "100 Sites",
          badgeColor: "bg-slate-700 text-slate-300 border-slate-600"
        },
        {
          id: "troubleshooting" as ActiveTab,
          label: "AI Troubleshooting",
          icon: Stethoscope,
          badge: unresolvedIncidentsCount > 0 ? `${unresolvedIncidentsCount} Incidents` : "Healthy",
          badgeColor: unresolvedIncidentsCount > 0 ? "bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse" : "bg-emerald-500/20 text-emerald-300"
        },
        {
          id: "backup_vault" as ActiveTab,
          label: "Backup & Transactions",
          icon: DatabaseBackup,
          description: "Snapshot & Rollback"
        },
        {
          id: "optimization" as ActiveTab,
          label: "AI Growth & CRO",
          icon: TrendingUp,
          badge: availableOptimizationsCount > 0 ? `+${availableOptimizationsCount} Uplifts` : undefined,
          badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
        }
      ]
    },
    {
      label: "AI Audio & Studio",
      items: [
        {
          id: "voice_studio" as ActiveTab,
          label: "Voice AI Prompting",
          icon: Mic,
          badge: "Gemini Audio",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
        }
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[#27272A] bg-[#0A0A0C] flex flex-col justify-between overflow-y-auto select-none">
      <div className="p-3 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-slate-500">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                      isActive
                        ? "text-sky-400 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#141417]/80"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-sidebar-pill"
                        className="absolute inset-0 rounded-lg bg-sky-500/10 border border-sky-500/30 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32
                        }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`relative z-10 px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${
                          isActive
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                            : item.badgeColor || "bg-[#141417] text-slate-300 border-[#27272A]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Infrastructure Engine Status Bento Card */}
      <div className="p-3 m-3 bento-card text-[11px] space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Autonomous Engine</span>
          </div>
          <span className="text-green-500 font-mono text-[10px] font-bold">ONLINE</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-relaxed font-mono">
          WP Gutenberg FSE v6.7+<br />
          Orchestrator: Active (18ms)
        </div>
        <div className="pt-1.5 border-t border-[#27272A] flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Security Layer:</span>
          <span className="text-sky-400">AES-256</span>
        </div>
      </div>
    </aside>
  );
};
