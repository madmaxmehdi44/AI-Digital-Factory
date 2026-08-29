import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Laptop,
  Tablet,
  Smartphone,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Palette,
  Eye,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Zap,
  Globe,
  Grid
} from "lucide-react";
import { WordPressTheme, DesignSystem, BusinessStrategy, BusinessInput } from "../types";

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessInput;
  theme: WordPressTheme | null;
  designSystem: DesignSystem | null;
  strategy: BusinessStrategy | null;
  targetDomain: string;
  onConfirmDeploy?: () => void;
}

export type PreviewTemplate = "front_page" | "solutions" | "pricing" | "case_studies" | "contact";

export const SitePreviewModal: React.FC<SitePreviewModalProps> = ({
  isOpen,
  onClose,
  business,
  theme,
  designSystem,
  strategy,
  targetDomain,
  onConfirmDeploy
}) => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTemplate, setActiveTemplate] = useState<PreviewTemplate>("front_page");
  const [selectedBlockHighlight, setSelectedBlockHighlight] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showWireframeGrid, setShowWireframeGrid] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const primaryColor = designSystem?.colors?.primary || "#10b981";
  const primaryHover = designSystem?.colors?.primaryHover || "#059669";
  const bgColor = designSystem?.colors?.background || "#090d16";
  const surfaceColor = designSystem?.colors?.surface || "#111827";
  const borderColor = designSystem?.colors?.surfaceBorder || "#1f2937";
  const textColor = designSystem?.colors?.textPrimary || "#f8fafc";
  const textMuted = designSystem?.colors?.textSecondary || "#94a3b8";

  // Template definitions with thumbnail blueprints
  const templateList: {
    id: PreviewTemplate;
    name: string;
    description: string;
    blocksCount: number;
    fseFile: string;
  }[] = [
    {
      id: "front_page",
      name: "Front Page Template",
      description: "Hero telemetry, value proposition, live cockpit bento, and conversion triggers",
      blocksCount: 8,
      fseFile: "templates/front-page.html"
    },
    {
      id: "solutions",
      name: "Solutions & Architecture",
      description: "Algorithmic pipelines, telematics integrations, and interactive system topology",
      blocksCount: 6,
      fseFile: "templates/page-solutions.html"
    },
    {
      id: "pricing",
      name: "Pricing & Fleet Tiers",
      description: "Tiered SaaS specification matrix, ROI calculators, and enterprise SLA guarantee",
      blocksCount: 5,
      fseFile: "templates/page-pricing.html"
    },
    {
      id: "case_studies",
      name: "Verified Case Studies",
      description: "Quantified metric outcomes, video spotlights, and downloadable architecture docs",
      blocksCount: 4,
      fseFile: "templates/page-case-studies.html"
    },
    {
      id: "contact",
      name: "Executive Demo & Inbound",
      description: "Multi-step qualification gate, calendar booking, and encrypted NDA handshake",
      blocksCount: 3,
      fseFile: "templates/page-contact.html"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0D0D11] border border-[#27272A] rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-black/80">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-[#121217] border-b border-[#232327] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Left info badge */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  Pre-Deployment WordPress Block Theme Live Simulator
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                  Gutenberg FSE 6.7
                </span>
                <span className="hidden md:inline px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                  {theme?.themeSlug || "wp-factory-theme"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Virtual representation rendered from theme.json tokens before writing to production server.
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Viewport Resizer Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#0A0A0C] border border-[#27272A]">
              <button
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewport === "desktop"
                    ? "bg-sky-500 text-black font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Desktop 1280px"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewport === "tablet"
                    ? "bg-sky-500 text-black font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Tablet 768px"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewport === "mobile"
                    ? "bg-sky-500 text-black font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Mobile 390px"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Grid toggle */}
            <button
              onClick={() => setShowWireframeGrid(!showWireframeGrid)}
              className={`p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                showWireframeGrid
                  ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                  : "bg-[#0A0A0C] border-[#27272A] text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle Gutenberg Block Hierarchy Wireframe"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-[#0A0A0C] border border-[#27272A] text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Refresh Virtual DOM Canvas"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-400" : ""}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-[#1a1a22] hover:bg-[#252530] border border-[#27272A] text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              Exit Preview
            </button>
          </div>
        </div>

        {/* Main Content Area: Left Thumbnail Blueprint Rail + Center Canvas */}
        <div className="flex-1 flex overflow-hidden">
          {/* 1. Left Thumbnail-Based Virtual Representation Rail */}
          <div className="w-72 sm:w-80 bg-[#0A0A0C] border-r border-[#232327] p-3.5 overflow-y-auto space-y-3 shrink-0 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Block Template Thumbnails
                </span>
                <span className="text-[10px] font-mono text-sky-400 font-semibold">
                  {templateList.length} FSE Blueprints
                </span>
              </div>

              {/* Thumbnail Cards List */}
              <div className="space-y-2.5">
                {templateList.map(tmpl => {
                  const isSelected = activeTemplate === tmpl.id;

                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setActiveTemplate(tmpl.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer group text-left ${
                        isSelected
                          ? "bg-[#16161D] border-sky-500 shadow-md shadow-sky-500/10"
                          : "bg-[#0F0F13] border-[#222228] hover:border-slate-600"
                      }`}
                    >
                      {/* Virtual Block Thumbnail Graphic */}
                      <div
                        className="w-full h-20 rounded-lg p-2 mb-2 border overflow-hidden relative flex flex-col justify-between select-none"
                        style={{
                          backgroundColor: bgColor,
                          borderColor: isSelected ? `${primaryColor}60` : borderColor
                        }}
                      >
                        {/* Mini Header */}
                        <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: `${borderColor}80` }}>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-sm"
                              style={{ backgroundColor: primaryColor }}
                            />
                            <div className="w-10 h-1 rounded bg-slate-700" />
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-1 rounded bg-slate-700" />
                            <div className="w-4 h-1 rounded bg-slate-700" />
                            <div
                              className="w-5 h-1.5 rounded"
                              style={{ backgroundColor: primaryColor }}
                            />
                          </div>
                        </div>

                        {/* Mini Body Layout Blueprint Graphic */}
                        {tmpl.id === "front_page" && (
                          <div className="grid grid-cols-3 gap-1 my-auto">
                            <div className="col-span-2 space-y-1">
                              <div className="w-16 h-1.5 rounded bg-slate-200" />
                              <div className="w-20 h-1 rounded bg-slate-500" />
                              <div className="flex gap-1 pt-0.5">
                                <div
                                  className="w-6 h-1.5 rounded"
                                  style={{ backgroundColor: primaryColor }}
                                />
                                <div className="w-6 h-1.5 rounded bg-slate-700" />
                              </div>
                            </div>
                            <div
                              className="col-span-1 rounded p-1 border flex flex-col justify-center items-center"
                              style={{ backgroundColor: surfaceColor, borderColor }}
                            >
                              <div className="w-3 h-3 rounded-full bg-emerald-400/20 flex items-center justify-center text-[6px] text-emerald-400 font-bold">
                                99
                              </div>
                            </div>
                          </div>
                        )}

                        {tmpl.id === "solutions" && (
                          <div className="grid grid-cols-3 gap-1 my-auto">
                            <div className="rounded p-1 border bg-slate-900 border-slate-700" />
                            <div className="rounded p-1 border bg-slate-900 border-slate-700" />
                            <div className="rounded p-1 border bg-slate-900 border-slate-700" />
                          </div>
                        )}

                        {tmpl.id === "pricing" && (
                          <div className="grid grid-cols-3 gap-1 my-auto">
                            <div className="rounded p-1 border bg-slate-900 border-slate-700 h-8" />
                            <div
                              className="rounded p-1 border h-9 relative -top-0.5"
                              style={{ backgroundColor: `${primaryColor}20`, borderColor: primaryColor }}
                            />
                            <div className="rounded p-1 border bg-slate-900 border-slate-700 h-8" />
                          </div>
                        )}

                        {tmpl.id === "case_studies" && (
                          <div className="grid grid-cols-2 gap-1 my-auto">
                            <div className="rounded p-1 border bg-slate-900 border-slate-700 h-8 space-y-0.5">
                              <div className="w-8 h-1 rounded bg-emerald-400" />
                              <div className="w-12 h-1 rounded bg-slate-600" />
                            </div>
                            <div className="rounded p-1 border bg-slate-900 border-slate-700 h-8 space-y-0.5">
                              <div className="w-8 h-1 rounded bg-sky-400" />
                              <div className="w-12 h-1 rounded bg-slate-600" />
                            </div>
                          </div>
                        )}

                        {tmpl.id === "contact" && (
                          <div className="space-y-1 my-auto max-w-[120px] mx-auto">
                            <div className="w-full h-1.5 rounded bg-slate-700" />
                            <div className="w-full h-1.5 rounded bg-slate-700" />
                            <div
                              className="w-14 h-2 rounded mx-auto"
                              style={{ backgroundColor: primaryColor }}
                            />
                          </div>
                        )}

                        {/* Mini Footer */}
                        <div className="flex items-center justify-between border-t pt-0.5" style={{ borderColor: `${borderColor}60` }}>
                          <div className="w-12 h-0.5 rounded bg-slate-800" />
                          <div className="w-6 h-0.5 rounded bg-emerald-500/40" />
                        </div>

                        {/* Active Badge Overlay */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded bg-sky-500 text-black font-mono font-bold text-[8px] uppercase shadow">
                            Active Preview
                          </div>
                        )}
                      </div>

                      {/* Text details */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs font-bold font-sans transition-colors ${
                              isSelected ? "text-sky-300" : "text-slate-200 group-hover:text-slate-100"
                            }`}
                          >
                            {tmpl.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500">
                            {tmpl.blocksCount} Blocks
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-tight">
                          {tmpl.description}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-slate-500">
                          <span className="text-slate-400 font-semibold">{tmpl.fseFile}</span>
                          <span className="text-emerald-400">✓ Validated</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Design Tokens Pill Strip */}
            <div className="p-3 rounded-xl bg-[#121216] border border-[#232327] space-y-2 mt-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-sky-400" />
                  <span>theme.json Color Tokens</span>
                </span>
                <span className="text-slate-500 font-bold uppercase">{designSystem?.themeMode || "dark"}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                  title={`Primary: ${primaryColor}`}
                />
                <div
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                  style={{ backgroundColor: designSystem?.colors?.secondary || "#06b6d4" }}
                  title="Secondary Accent"
                />
                <div
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                  style={{ backgroundColor: surfaceColor }}
                  title="Surface Background"
                />
                <div
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                  style={{ backgroundColor: bgColor }}
                  title="Canvas Background"
                />
                <span className="text-[10px] font-mono text-slate-400 ml-auto">
                  {designSystem?.typography?.fontHeading?.split(",")[0] || "Plus Jakarta Sans"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Center Live Visual Simulation Stage */}
          <div className="flex-1 bg-[#070709] p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-start">
            {/* Viewport Frame */}
            <div
              className={`rounded-2xl border transition-all duration-300 shadow-2xl flex flex-col overflow-hidden bg-[#0A0A0C] ${
                viewport === "desktop"
                  ? "w-full max-w-5xl"
                  : viewport === "tablet"
                  ? "w-[768px] max-w-full"
                  : "w-[390px] max-w-full"
              }`}
              style={{
                borderColor: "#27272A"
              }}
            >
              {/* Virtual Browser Top Nav Chrome */}
              <div className="px-4 py-2.5 bg-[#141419] border-b border-[#232327] flex items-center justify-between text-xs text-slate-400 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>

                {/* Simulated URL Bar */}
                <div className="flex items-center gap-2 font-mono text-[11px] px-4 py-1 rounded-lg bg-[#0A0A0C] text-slate-300 border border-[#27272A] w-1/2 justify-center truncate">
                  <span className="text-emerald-400 font-bold">https://</span>
                  <span className="truncate">{targetDomain}</span>
                  <span className="text-slate-500">
                    /{activeTemplate === "front_page" ? "" : activeTemplate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 hidden sm:inline">
                    ● REST API READY
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[9px] font-bold">
                    PREVIEW
                  </span>
                </div>
              </div>

              {/* VIRTUAL THEME RENDERING CANVAS */}
              <div
                className={`p-6 md:p-8 space-y-12 transition-all duration-300 relative select-text ${
                  showWireframeGrid ? "outline outline-1 outline-dashed outline-sky-500/40" : ""
                }`}
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  fontFamily: designSystem?.typography?.fontBody || "Plus Jakarta Sans, sans-serif"
                }}
              >
                {/* 1. Header Block Template Part */}
                <header
                  className={`flex items-center justify-between pb-4 border-b transition-all ${
                    showWireframeGrid ? "p-2 border-indigo-500/40 bg-indigo-500/5 rounded-lg" : ""
                  }`}
                  style={{ borderColor: `${borderColor}80` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-md"
                      style={{
                        backgroundColor: primaryColor,
                        color: "#ffffff"
                      }}
                    >
                      {business.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-extrabold text-base tracking-tight block">
                        {business.name}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: textMuted }}>
                        {business.industry.split("&")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="hidden md:flex items-center gap-6 text-xs font-medium" style={{ color: textMuted }}>
                    <button
                      onClick={() => setActiveTemplate("front_page")}
                      className={`transition-colors cursor-pointer ${
                        activeTemplate === "front_page" ? "font-bold" : "hover:text-slate-100"
                      }`}
                      style={{ color: activeTemplate === "front_page" ? primaryColor : undefined }}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => setActiveTemplate("solutions")}
                      className={`transition-colors cursor-pointer ${
                        activeTemplate === "solutions" ? "font-bold" : "hover:text-slate-100"
                      }`}
                      style={{ color: activeTemplate === "solutions" ? primaryColor : undefined }}
                    >
                      Solutions
                    </button>
                    <button
                      onClick={() => setActiveTemplate("pricing")}
                      className={`transition-colors cursor-pointer ${
                        activeTemplate === "pricing" ? "font-bold" : "hover:text-slate-100"
                      }`}
                      style={{ color: activeTemplate === "pricing" ? primaryColor : undefined }}
                    >
                      Pricing
                    </button>
                    <button
                      onClick={() => setActiveTemplate("case_studies")}
                      className={`transition-colors cursor-pointer ${
                        activeTemplate === "case_studies" ? "font-bold" : "hover:text-slate-100"
                      }`}
                      style={{ color: activeTemplate === "case_studies" ? primaryColor : undefined }}
                    >
                      Case Studies
                    </button>
                  </nav>

                  {/* Primary CTA Button */}
                  <button
                    onClick={() => setActiveTemplate("contact")}
                    className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {strategy?.conversionStrategy?.primaryCTA || "Get Started"}
                  </button>
                </header>

                {/* 2. BODY CONTENT ACCORDING TO SELECTED TEMPLATE */}

                {/* TEMPLATE A: FRONT PAGE */}
                {activeTemplate === "front_page" && (
                  <div className="space-y-12">
                    {/* Hero Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
                      <div className="lg:col-span-7 space-y-4">
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border"
                          style={{
                            borderColor: `${primaryColor}40`,
                            backgroundColor: `${primaryColor}10`,
                            color: primaryColor
                          }}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Enterprise Autonomous Infrastructure</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                          {business.name}
                        </h1>

                        <p className="text-sm leading-relaxed max-w-xl" style={{ color: textMuted }}>
                          {strategy?.valueProposition ||
                            "Autonomous high-performance digital business architecture engineered for 10x scalability and zero operational overhead."}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => setActiveTemplate("contact")}
                            className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <span>{strategy?.conversionStrategy?.primaryCTA || "Deploy Autonomous System"}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setActiveTemplate("solutions")}
                            className="px-5 py-2.5 text-xs font-bold rounded-xl border hover:bg-white/5 transition-all cursor-pointer"
                            style={{ borderColor }}
                          >
                            Explore Architecture
                          </button>
                        </div>
                      </div>

                      {/* Right Telemetry Bento Card */}
                      <div className="lg:col-span-5">
                        <div
                          className="p-6 rounded-2xl border space-y-4 shadow-2xl"
                          style={{
                            backgroundColor: surfaceColor,
                            borderColor
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              LIVE WP TELEMETRY
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">WP-CLI v2.9</span>
                          </div>

                          <div>
                            <div className="text-3xl font-black text-slate-100">99.98%</div>
                            <p className="text-xs" style={{ color: textMuted }}>
                              Fleet Uptime & Sub-20ms Edge Routing
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-black/40 font-mono text-[11px] text-sky-300 border border-white/5 space-y-1">
                            <div>$ wp core is-installed --network</div>
                            <div className="text-emerald-400">Status: Active | Cache: Redis L1</div>
                            <div className="text-slate-400">Memory: 1024M | SSL: Let&apos;s Encrypt</div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Features Bento Row */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          title: "Sub-Second Query Pipeline",
                          desc: "Pre-compiled Gutenberg block patterns with zero redundant runtime queries."
                        },
                        {
                          title: "Autonomous Self-Healing",
                          desc: "Active heartbeat monitoring with automated rollback upon core PHP fatal exceptions."
                        },
                        {
                          title: "100/100 Core Web Vitals",
                          desc: "Pre-rendered critical CSS and AVIF next-gen asset optimization."
                        }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl border space-y-2"
                          style={{ backgroundColor: surfaceColor, borderColor }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mb-2"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                          >
                            0{idx + 1}
                          </div>
                          <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                          <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </section>
                  </div>
                )}

                {/* TEMPLATE B: SOLUTIONS & ARCHITECTURE */}
                {activeTemplate === "solutions" && (
                  <div className="space-y-8">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase" style={{ color: primaryColor }}>
                        Technical Architecture
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-1">
                        High-Performance Autonomous Network
                      </h2>
                      <p className="text-xs mt-1" style={{ color: textMuted }}>
                        Deep dive into our full-stack WordPress Gutenberg deployment topology.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: surfaceColor, borderColor }}>
                        <h4 className="text-sm font-bold text-slate-100">Edge Compute & Caching Layer</h4>
                        <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                          Integrated with Redis object caching and global Cloudflare CDN for instantaneous response times across 300+ edge nodes.
                        </p>
                        <div className="pt-2 text-[11px] font-mono text-emerald-400">✓ TTFB: 24ms Average</div>
                      </div>

                      <div className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: surfaceColor, borderColor }}>
                        <h4 className="text-sm font-bold text-slate-100">Schema.org JSON-LD Enrichment</h4>
                        <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                          Automatically injects Google-compliant Medical, Organization, FAQ, and Breadcrumb markup for optimal SERP positioning.
                        </p>
                        <div className="pt-2 text-[11px] font-mono text-sky-400">✓ 100% Rich Snippet Verified</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TEMPLATE C: PRICING & FLEET TIERS */}
                {activeTemplate === "pricing" && (
                  <div className="space-y-8">
                    <div className="text-center max-w-md mx-auto space-y-1">
                      <span className="text-xs font-mono font-bold uppercase" style={{ color: primaryColor }}>
                        Enterprise Investment
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                        Scalable Fleet Deployment Tiers
                      </h2>
                      <p className="text-xs" style={{ color: textMuted }}>
                        Transparent pricing tailored to enterprise workload scale.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { tier: "Pro Pilot", price: "$490", period: "/mo", desc: "For single high-traffic production portals", highlight: false },
                        { tier: "Fleet Scale", price: "$1,890", period: "/mo", desc: "For multi-site national operations & clusters", highlight: true },
                        { tier: "Sovereign Enterprise", price: "$4,500", period: "/mo", desc: "Dedicated bare-metal with air-gapped security", highlight: false }
                      ].map((pkg, idx) => (
                        <div
                          key={idx}
                          className="p-6 rounded-2xl border space-y-4 flex flex-col justify-between"
                          style={{
                            backgroundColor: surfaceColor,
                            borderColor: pkg.highlight ? primaryColor : borderColor
                          }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-slate-100">{pkg.tier}</h4>
                              {pkg.highlight && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <div className="text-2xl font-black text-slate-100">
                              {pkg.price} <span className="text-xs font-normal text-slate-400">{pkg.period}</span>
                            </div>
                            <p className="text-xs" style={{ color: textMuted }}>{pkg.desc}</p>
                          </div>

                          <button
                            onClick={() => setActiveTemplate("contact")}
                            className="w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            style={{
                              backgroundColor: pkg.highlight ? primaryColor : "transparent",
                              color: pkg.highlight ? "#ffffff" : textColor,
                              border: pkg.highlight ? "none" : `1px solid ${borderColor}`
                            }}
                          >
                            Select Plan
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TEMPLATE D: CASE STUDIES */}
                {activeTemplate === "case_studies" && (
                  <div className="space-y-8">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase" style={{ color: primaryColor }}>
                        Verified ROI Outcomes
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-1">
                        Enterprise Performance Spotlights
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: surfaceColor, borderColor }}>
                        <div className="text-2xl font-black text-emerald-400">34% Cost Reduction</div>
                        <h4 className="text-sm font-bold text-slate-100">Global Freight Conglomerate</h4>
                        <p className="text-xs" style={{ color: textMuted }}>
                          Migrated 40+ regional sub-domains to automated Gutenberg block themes with zero server outages during peak holiday season.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: surfaceColor, borderColor }}>
                        <div className="text-2xl font-black text-sky-400">4.2x Faster Turnaround</div>
                        <h4 className="text-sm font-bold text-slate-100">BioTech Clinical Diagnostics</h4>
                        <p className="text-xs" style={{ color: textMuted }}>
                          Reduced telehealth portal latency by 82% utilizing Redis micro-caching and automated Schema.org FAQ indexing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TEMPLATE E: CONTACT & INBOUND DEMO */}
                {activeTemplate === "contact" && (
                  <div className="max-w-md mx-auto p-6 rounded-2xl border space-y-4" style={{ backgroundColor: surfaceColor, borderColor }}>
                    <div className="space-y-1 text-center">
                      <h3 className="text-lg font-bold text-slate-100">Schedule Executive Briefing</h3>
                      <p className="text-xs" style={{ color: textMuted }}>
                        Connect with our solutions architects to tailor an autonomous WordPress cluster.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">Work Email</label>
                        <input
                          type="email"
                          placeholder="architect@company.com"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-slate-100 focus:outline-none"
                          style={{ borderColor }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">Fleet Scope</label>
                        <select
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border text-xs text-slate-100 focus:outline-none"
                          style={{ borderColor }}
                        >
                          <option>1-5 Enterprise Production Sites</option>
                          <option>10-50 WordPress Nodes</option>
                          <option>50+ Multi-Region Cluster</option>
                        </select>
                      </div>

                      <button
                        className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Confirm Briefing Request
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Footer Block Template Part */}
                <footer
                  className={`pt-8 border-t text-xs flex flex-col md:flex-row items-center justify-between gap-4 ${
                    showWireframeGrid ? "p-2 border-indigo-500/40 bg-indigo-500/5 rounded-lg" : ""
                  }`}
                  style={{ borderColor: `${borderColor}80`, color: textMuted }}
                >
                  <div>© 2026 {business.name}. Autonomous WordPress Operating System.</div>
                  <div className="text-emerald-400 font-mono text-[11px]">
                    ● 100/100 Core Web Vitals Guaranteed
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Launch Actions */}
        <div className="px-5 py-3 bg-[#121217] border-t border-[#232327] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Virtual Theme Validated: Ready for Zero-Downtime Deployment</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a1a22] hover:bg-[#252530] border border-[#27272A] text-xs font-mono text-slate-300 transition-all cursor-pointer"
            >
              Back to Configuration
            </button>

            {onConfirmDeploy && (
              <button
                onClick={() => {
                  onClose();
                  onConfirmDeploy();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs font-bold text-white shadow-lg shadow-amber-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Deploy to Production Server</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
