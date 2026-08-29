import React, { useState } from "react";
import {
  Sparkles,
  Server,
  ShieldCheck,
  Zap,
  Mic,
  MessageSquareCode,
  Layers,
  ChevronDown,
  Plus,
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
  LogOut,
  ExternalLink
} from "lucide-react";
import { UserProfile, BusinessInput, PlanTier } from "../types";

interface HeaderProps {
  currentBusiness: BusinessInput;
  allBusinesses: BusinessInput[];
  onSelectBusiness: (biz: BusinessInput) => void;
  onNewBusiness: () => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenCopilot: () => void;
  onOpenVoiceModal: () => void;
  plan: PlanTier;
  onSelectPlan: (plan: PlanTier) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBusiness,
  allBusinesses,
  onSelectBusiness,
  onNewBusiness,
  user,
  onOpenAuth,
  onOpenCopilot,
  onOpenVoiceModal,
  plan,
  onSelectPlan
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [planMenuOpen, setPlanMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272A] bg-[#0A0A0C] px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      {/* Brand & Active Business Switcher */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-black shadow-lg shadow-sky-500/20">
            DF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
                AI DIGITAL FACTORY <span className="text-sky-500">/ ORCHESTRATOR</span>
              </h1>
            </div>
            <p className="text-[11px] font-mono text-slate-500 hidden sm:block">
              Autonomous WordPress Business & DevOps Operating System
            </p>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-[#27272A] hidden md:block" />

        {/* Business Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1c1c21] border border-[#27272A] hover:border-sky-500/40 text-xs font-medium text-slate-200 transition-all duration-150"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="max-w-[140px] truncate font-semibold">{currentBusiness.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-[#141417] border border-[#27272A] shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1 text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                Managed Digital Businesses
              </div>
              <div className="max-h-60 overflow-y-auto">
                {allBusinesses.map(biz => (
                  <button
                    key={biz.id}
                    onClick={() => {
                      onSelectBusiness(biz);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                      biz.id === currentBusiness.id
                        ? "bg-sky-500/15 text-sky-300 font-semibold border-l-2 border-sky-400"
                        : "text-slate-300 hover:bg-[#1f1f26]"
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium text-slate-200">{biz.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{biz.industry}</div>
                    </div>
                    {biz.id === currentBusiness.id && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#27272A] mt-1 pt-1 px-1">
                <button
                  onClick={() => {
                    onNewBusiness();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-sky-400 hover:bg-sky-500/10 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Digital Business
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Fleet Status & Nominal Badge */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-green-400 font-medium">SYSTEMS NOMINAL</span>
        </div>
        <div className="text-slate-500 text-xs font-mono hidden xl:block">
          v2.4.0-stable
        </div>
      </div>

      {/* Right Actions: Voice Studio, Low-Latency Copilot, Plan Tier, User */}
      <div className="flex items-center gap-2">
        {/* Voice Input Prompt Trigger */}
        <button
          onClick={onOpenVoiceModal}
          title="Transcribe Voice Prompt with Gemini AI"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1c1c21] border border-[#27272A] hover:border-sky-500/40 text-xs text-slate-300 transition-colors"
        >
          <Mic className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline font-medium">Voice AI</span>
        </button>

        {/* Low-Latency Copilot Assistant */}
        <button
          onClick={onOpenCopilot}
          title="Instant AI Operations Copilot (Low Latency)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-black shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Plan Tier Badge with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPlanMenuOpen(!planMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141417] border border-[#27272A] text-xs font-semibold text-sky-400 hover:border-sky-500/40 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{plan}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {planMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[#141417] border border-[#27272A] shadow-2xl py-1 z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                Select Platform Plan
              </div>
              {(["Starter", "Agency", "Enterprise"] as PlanTier[]).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    onSelectPlan(p);
                    setPlanMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    plan === p ? "text-sky-400 font-bold bg-sky-500/10" : "text-slate-300 hover:bg-[#1f1f26]"
                  }`}
                >
                  <span>{p} Tier</span>
                  {plan === p && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Account / Sign-In Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg bg-[#141417] hover:bg-[#1c1c21] border border-[#27272A] text-xs text-slate-200 transition-colors"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full object-cover ring-1 ring-sky-500" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-bold text-black">
              {user.displayName.charAt(0)}
            </div>
          )}
          <span className="font-medium hidden lg:inline max-w-[100px] truncate">{user.displayName}</span>
        </button>
      </div>
    </header>
  );
};
