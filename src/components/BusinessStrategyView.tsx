import React, { useState } from "react";
import {
  Layers,
  Target,
  FileText,
  Search,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { BusinessStrategy, BusinessInput } from "../types";
import { fetchBusinessStrategy } from "../lib/geminiClient";

interface BusinessStrategyViewProps {
  business: BusinessInput;
  strategy: BusinessStrategy | null;
  onUpdateStrategy: (strat: BusinessStrategy) => void;
}

export const BusinessStrategyView: React.FC<BusinessStrategyViewProps> = ({
  business,
  strategy,
  onUpdateStrategy
}) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopyJson = () => {
    if (!strategy) return;
    navigator.clipboard.writeText(JSON.stringify(strategy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetchBusinessStrategy({
        name: business.name,
        type: business.type,
        industry: business.industry,
        location: business.location,
        targetAudience: business.targetAudience,
        goals: business.goals,
        personality: business.personality
      });
      onUpdateStrategy(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!strategy) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <Layers className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-slate-100">No Strategy Generated Yet</h3>
        <p className="text-xs text-slate-400">Run the Digital Factory wizard to automatically construct a production strategy for {business.name}.</p>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
        >
          {isRegenerating ? "Synthesizing..." : "Generate Strategy with Gemini AI"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-100">Business Intelligence & Architecture Strategy</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              AI-Synthesized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive blueprint for {business.name} ({business.industry}).</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied JSON" : "Copy Blueprint"}</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>Regenerate with AI</span>
          </button>
        </div>
      </div>

      {/* 1. Value Proposition & Strategic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Core Value Proposition</span>
          </div>
          <div className="text-base md:text-lg font-bold text-slate-100 leading-snug">
            "{strategy.valueProposition}"
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{strategy.summary}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
            <Target className="w-4 h-4" />
            <span>Conversion Goal & Engine</span>
          </div>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Primary CTA</span>
              <span className="font-bold text-emerald-400 text-sm">{strategy.conversionStrategy.primaryCTA}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Lead Magnet</span>
              <span className="text-slate-200">{strategy.conversionStrategy.leadMagnet}</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Trust Badges</span>
              <div className="flex flex-wrap gap-1">
                {strategy.conversionStrategy.trustSignals.map((ts, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                    ✓ {ts}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Target Audience Persona & Pain Points */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
          <Users className="w-4 h-4" />
          <span>Target Audience Profile: {strategy.targetAudiencePersona.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 space-y-2">
            <span className="text-xs font-bold text-rose-400">Critical Pain Points</span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {strategy.targetAudiencePersona.painPoints.map((pain, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-2">
            <span className="text-xs font-bold text-emerald-400">Key Motivations & Desired Outcomes</span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {strategy.targetAudiencePersona.motivations.map((mot, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{mot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Website Page Architecture & Structure */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
            <FileText className="w-4 h-4" />
            <span>Required Website Architecture ({strategy.pages.length} Pages)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {strategy.pages.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100">{p.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  /{p.slug}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{p.purpose}</p>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Planned Gutenberg Sections:</span>
                <div className="flex flex-wrap gap-1">
                  {p.keySections.map((sec, sIdx) => (
                    <span key={sIdx} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SEO Strategy & Schema Markup */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
          <Search className="w-4 h-4" />
          <span>SEO Foundation & Semantic Structured Data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300">Primary Commercial Keywords</span>
            <div className="flex flex-wrap gap-1.5">
              {strategy.seoStrategy.primaryKeywords.map((k, i) => (
                <span key={i} className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300">Secondary Long-Tail Keywords</span>
            <div className="flex flex-wrap gap-1.5">
              {strategy.seoStrategy.secondaryKeywords.map((k, i) => (
                <span key={i} className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300">Schema.org JSON-LD Entities</span>
            <div className="flex flex-wrap gap-1.5">
              {strategy.seoStrategy.schemaMarkup.map((schema, i) => (
                <span key={i} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono">
                  @{schema}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. 4-Stage Customer Journey */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
          <Compass className="w-4 h-4" />
          <span>Autonomous Customer Journey Blueprint</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {strategy.customerJourney.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">{idx + 1}. {step.stage}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Touchpoint:</span> {step.touchpoint}
              </div>
              <div className="text-[11px] text-slate-300">
                <span className="font-semibold text-emerald-400">User Action:</span> {step.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
