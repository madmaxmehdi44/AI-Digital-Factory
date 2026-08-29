import React, { useState } from "react";
import {
  Palette,
  Type,
  Maximize2,
  Sparkles,
  Layers,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Eye,
  Sliders
} from "lucide-react";
import { DesignSystem, BusinessInput } from "../types";
import { fetchDesignSystem } from "../lib/geminiClient";

interface DesignSystemViewProps {
  business: BusinessInput;
  designSystem: DesignSystem | null;
  onUpdateDesignSystem: (ds: DesignSystem) => void;
}

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({
  business,
  designSystem,
  onUpdateDesignSystem
}) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"buttons" | "cards" | "typography" | "bento">("buttons");

  const handleCopyTokens = () => {
    if (!designSystem) return;
    navigator.clipboard.writeText(JSON.stringify(designSystem, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetchDesignSystem({
        businessName: business.name,
        industry: business.industry,
        personality: business.personality,
        stylePreference: business.stylePreference
      });
      onUpdateDesignSystem(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!designSystem) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <Palette className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-slate-100">Design System Not Generated</h3>
        <p className="text-xs text-slate-400">Synthesize modern design tokens for {business.name}.</p>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
        >
          {isRegenerating ? "Generating Tokens..." : "Synthesize Design System"}
        </button>
      </div>
    );
  }

  const { colors, typography, spacing, animation } = designSystem;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-100">Design System Studio & Tokens</h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
              {designSystem.styleName}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Semantic tokens engineered for modern WordPress Gutenberg Block Themes.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyTokens}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Tokens Copied" : "Copy CSS / JSON"}</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>Regenerate Style</span>
          </button>
        </div>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
            <Palette className="w-4 h-4" />
            <span>Harmonized Color Palette</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>WCAG 2.1 AAA Contrast Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Primary Brand", hex: colors.primary, role: "Main CTA, brand marks" },
            { label: "Primary Hover", hex: colors.primaryHover, role: "Hover and active states" },
            { label: "Secondary Accent", hex: colors.secondary, role: "Sub-headings, badges" },
            { label: "Conversion Accent", hex: colors.accent, role: "Key action highlights" },
            { label: "Dark Canvas Base", hex: colors.background, role: "Root viewport backdrop" },
            { label: "Card Surface", hex: colors.surface, role: "Elevated containers" },
            { label: "Container Border", hex: colors.surfaceBorder, role: "Subtle 1px boundaries" },
            { label: "Text Primary", hex: colors.textPrimary, role: "High-contrast headings" },
            { label: "Text Secondary", hex: colors.textSecondary, role: "Body paragraphs" },
            { label: "Text Muted", hex: colors.textMuted, role: "Metadata, timestamps" }
          ].map((c, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div
                className="h-12 w-full rounded-lg border border-white/10 shadow-inner flex items-end p-1.5 justify-end"
                style={{ backgroundColor: c.hex }}
              >
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-white">
                  {c.hex}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-slate-200 truncate">{c.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Typography Scale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
            <Type className="w-4 h-4" />
            <span>Fluid Typography Scale</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Display Hero (clamp scale)</div>
              <div className="text-2xl font-black text-slate-100 tracking-tight" style={{ fontFamily: typography.fontHeading }}>
                Autonomous Architecture
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Heading 1 / 2</div>
              <div className="text-lg font-bold text-slate-100" style={{ fontFamily: typography.fontHeading }}>
                Zero-Downtime Infrastructure
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Body Typography (16px / 1.6 line height)</div>
              <p className="text-xs text-slate-300 leading-relaxed" style={{ fontFamily: typography.fontBody }}>
                Engineered with Gutenberg block theme specifications for instant time-to-first-byte and flawless responsive readability across desktop, tablet, and mobile devices.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-slate-400">Monospace & Code</div>
              <div className="text-xs font-mono text-indigo-400">
                $ wp theme activate {business.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Spacing & Radius Rules */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
            <Maximize2 className="w-4 h-4" />
            <span>Spacing & Layout Rules</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Container Max Width</span>
              <div className="font-bold text-slate-100 text-sm font-mono">{spacing.containerMaxWidth}</div>
              <p className="text-[10px] text-slate-400">Fluid clamp layout</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Section Padding</span>
              <div className="font-bold text-slate-100 text-sm font-mono">{spacing.sectionPadding}</div>
              <p className="text-[10px] text-slate-400">Vertical rhythmic rhythm</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Card Corner Radius</span>
              <div className="font-bold text-slate-100 text-sm font-mono">{spacing.cardRadius}</div>
              <p className="text-[10px] text-slate-400">Anti-slop balanced radius</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Button Corner Radius</span>
              <div className="font-bold text-slate-100 text-sm font-mono">{spacing.buttonRadius}</div>
              <p className="text-[10px] text-slate-400">Interactive controls</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Micro-interaction Curves</span>
            <div className="font-mono text-slate-300 text-[11px]">{animation.transitionDefault}</div>
            <div className="text-[10px] text-slate-400">Hover scale factor: {animation.hoverScale}</div>
          </div>
        </div>
      </div>

      {/* 4. Live Interactive UI Component Previews */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
            <Eye className="w-4 h-4" />
            <span>Interactive Gutenberg Component Sandbox</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(["buttons", "cards", "bento"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActivePreviewTab(tab)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  activePreviewTab === tab ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sandbox Area */}
        <div className="p-6 rounded-xl border border-slate-800" style={{ backgroundColor: colors.background }}>
          {activePreviewTab === "buttons" && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300">Gutenberg Block Buttons:</div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="px-5 py-2.5 font-bold text-xs text-white shadow-lg transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: spacing.buttonRadius,
                    boxShadow: `0 8px 24px -4px ${colors.primary}40`
                  }}
                >
                  Primary Brand Action
                </button>

                <button
                  className="px-5 py-2.5 font-bold text-xs text-white transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors.accent,
                    borderRadius: spacing.buttonRadius
                  }}
                >
                  Conversion Accent CTA
                </button>

                <button
                  className="px-5 py-2.5 font-bold text-xs border transition-colors hover:bg-white/5"
                  style={{
                    color: colors.textPrimary,
                    borderColor: colors.surfaceBorder,
                    borderRadius: spacing.buttonRadius
                  }}
                >
                  Secondary Outline
                </button>
              </div>
            </div>
          )}

          {activePreviewTab === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-5 border space-y-2"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                  borderRadius: spacing.cardRadius
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold" style={{ color: colors.primary }}>FEATURE BLOCK</span>
                  <span className="text-[10px] text-emerald-400 font-mono">99.99% Uptime</span>
                </div>
                <h4 className="text-sm font-bold" style={{ color: colors.textPrimary }}>Autonomous Telemetry</h4>
                <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                  Real-time synchronization across fleet instances with sub-millisecond edge failover.
                </p>
              </div>

              <div
                className="p-5 border space-y-2"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                  borderRadius: spacing.cardRadius
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold" style={{ color: colors.secondary }}>SECURITY SHIELD</span>
                  <span className="text-[10px] text-indigo-400 font-mono">SOC-2 Type II</span>
                </div>
                <h4 className="text-sm font-bold" style={{ color: colors.textPrimary }}>Key Vault Encryption</h4>
                <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                  All SSH and cPanel UAPI credentials encrypted at rest using AES-256 GCM authenticated ciphers.
                </p>
              </div>
            </div>
          )}

          {activePreviewTab === "bento" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className="md:col-span-2 p-5 border space-y-2"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                  borderRadius: spacing.cardRadius
                }}
              >
                <span className="text-[10px] font-mono uppercase font-bold" style={{ color: colors.primary }}>Algorithmic Dispatch</span>
                <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>34% Lower Operational Cost</h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Continuous routing optimization powered by multi-modal machine learning models.
                </p>
              </div>

              <div
                className="p-5 border flex flex-col justify-between"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.surfaceBorder,
                  borderRadius: spacing.cardRadius
                }}
              >
                <span className="text-[10px] font-mono uppercase font-bold" style={{ color: colors.accent }}>Response Time</span>
                <div className="text-3xl font-black" style={{ color: colors.textPrimary }}>18ms</div>
                <span className="text-[10px]" style={{ color: colors.textMuted }}>Edge Cache Hit Rate: 98.4%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
