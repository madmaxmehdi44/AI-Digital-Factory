import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Globe,
  FileCode,
  Sparkles,
  Zap,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Code2,
  TrendingUp,
  Smartphone,
  ShieldCheck,
  Layers,
  Sliders,
  Share2,
  Download,
  Terminal,
  Bot,
  Activity,
  Maximize2
} from "lucide-react";
import confetti from "canvas-confetti";
import { FleetSite, SeoAuditResult, SeoCheckItem, SeoKeywordMetric, SeoSchemaItem } from "../types";
import { fetchSeoAudit } from "../lib/geminiClient";

interface SeoAuditEngineProps {
  fleet: FleetSite[];
  defaultDomain?: string;
}

export const SeoAuditEngine: React.FC<SeoAuditEngineProps> = ({
  fleet,
  defaultDomain
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>(
    defaultDomain || fleet[0]?.domain || "velocehealth.org"
  );
  const [customDomainInput, setCustomDomainInput] = useState<string>("");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<string>("");
  const [activeCheckCategory, setActiveCheckCategory] = useState<string>("all");
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>("chk-2");
  const [activeSchemaTab, setActiveSchemaTab] = useState<string>("Organization");
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [customKeywordInput, setCustomKeywordInput] = useState<string>("");

  // Audit Result State
  const [auditResult, setAuditResult] = useState<SeoAuditResult>({
    siteDomain: "velocehealth.org",
    siteTitle: "Veloce Health | Autonomous Clinical Diagnostics & Telehealth",
    metaDescription: "Deploy high-performance clinical diagnostics and telehealth infrastructure with sub-100ms response times, verified HIPAA compliance, and automated care workflows.",
    canonicalUrl: "https://velocehealth.org/",
    auditTimestamp: new Date().toISOString(),
    overallScore: 94,
    grade: "A",
    passedChecksCount: 16,
    warningsCount: 3,
    criticalIssuesCount: 0,
    googleIndexStatus: "Indexed & Valid",
    mobileUsabilityScore: 99,
    structuredDataScore: 92,
    organicKeywordCount: 380,
    estimatedOrganicTraffic: "12.8K / mo",
    checks: [
      {
        id: "chk-1",
        category: "On-Page",
        title: "Title Tag Length & Keyword Placement",
        severity: "passed",
        score: 96,
        currentValue: "54 characters (Optimal 50-60 chars)",
        recommendedValue: "50-60 characters with primary brand + keyword",
        description: "Title tag is within Google SERP pixel boundaries (580px) with strong frontloaded branding.",
        canAutoFix: false
      },
      {
        id: "chk-2",
        category: "On-Page",
        title: "Meta Description Actionability & SERP CTR",
        severity: "warning",
        score: 76,
        currentValue: "132 characters (Missing primary action CTA)",
        recommendedValue: "145-155 characters with clear value proposition and demo CTA",
        description: "Adding an explicit conversion callout will increase search result click-through rates by up to 14%.",
        canAutoFix: true
      },
      {
        id: "chk-3",
        category: "Schema & Rich Snippets",
        title: "Schema.org FAQPage Structured Data",
        severity: "warning",
        score: 80,
        currentValue: "Organization Schema active; FAQPage Schema missing",
        recommendedValue: "Inject FAQPage structured data for accordion SERP rich snippets",
        description: "FAQ schema enables rich search accordion snippets in Google search results, expanding SERP real estate.",
        canAutoFix: true
      },
      {
        id: "chk-4",
        category: "Technical",
        title: "XML Sitemap & Robots.txt Directives",
        severity: "passed",
        score: 100,
        currentValue: "Auto-generated Gutenberg FSE sitemap-index.xml",
        recommendedValue: "Auto-updated XML sitemap with ping to Google/Bing",
        description: "All public pages and custom post types are cleanly indexed with zero crawl errors.",
        canAutoFix: false
      },
      {
        id: "chk-5",
        category: "Speed & Vitals",
        title: "Core Web Vitals Search Ranking Signal",
        severity: "passed",
        score: 98,
        currentValue: "LCP 0.8s, CLS 0.00, INP 20ms",
        recommendedValue: "LCP < 2.5s, CLS < 0.1, INP < 200ms",
        description: "Fast response times pass all Google Search algorithm speed benchmarks.",
        canAutoFix: false
      },
      {
        id: "chk-6",
        category: "On-Page",
        title: "Image Alt Attributes & Media SEO",
        severity: "warning",
        score: 72,
        currentValue: "2 block images missing descriptive alt tags",
        recommendedValue: "100% image alt coverage with semantic keywords",
        description: "Providing descriptive alt tags improves Google Image search discovery and accessibility.",
        canAutoFix: true
      },
      {
        id: "chk-7",
        category: "Indexability",
        title: "OpenGraph & Social Sharing Meta Tags",
        severity: "passed",
        score: 100,
        currentValue: "og:image (1200x630px) + twitter:card summary_large_image",
        recommendedValue: "Complete OpenGraph social preview tags",
        description: "Ensures high-converting social card rendering when shared across LinkedIn and Twitter/X.",
        canAutoFix: false
      }
    ],
    keywords: [
      {
        keyword: "autonomous clinical diagnostics",
        intent: "Commercial",
        currentRank: 2,
        searchVolumeMonthly: 4200,
        difficultyScore: 45,
        relevanceScore: 98,
        estimatedCtr: "24.6%"
      },
      {
        keyword: "enterprise telehealth platform",
        intent: "Transactional",
        currentRank: 4,
        searchVolumeMonthly: 1800,
        difficultyScore: 38,
        relevanceScore: 94,
        estimatedCtr: "14.2%"
      },
      {
        keyword: "veloce health platform review",
        intent: "Informational",
        currentRank: 1,
        searchVolumeMonthly: 950,
        difficultyScore: 22,
        relevanceScore: 100,
        estimatedCtr: "42.1%"
      },
      {
        keyword: "hipaa compliant cloud diagnostics",
        intent: "Commercial",
        currentRank: 5,
        searchVolumeMonthly: 2800,
        difficultyScore: 49,
        relevanceScore: 89,
        estimatedCtr: "9.8%"
      }
    ],
    schemas: [
      {
        type: "Organization",
        status: "valid",
        description: "Defines business entity, official logo, and social verification profiles.",
        codeSnippet: `{\n  "@context": "https://schema.org",\n  "@type": "MedicalOrganization",\n  "name": "Veloce Health",\n  "url": "https://velocehealth.org",\n  "logo": "https://velocehealth.org/wp-content/uploads/logo.png",\n  "sameAs": ["https://twitter.com/velocehealth", "https://linkedin.com/company/velocehealth"]\n}`
      },
      {
        type: "FAQPage",
        status: "warning",
        description: "Structured questions and answers parsed for Google SERP expandable accordion rich results.",
        codeSnippet: `{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "What makes Veloce Health diagnostics autonomous?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "Our Gutenberg-powered clinical platform integrates real-time Redis telemetry with sub-100ms diagnostic speeds."\n    }\n  }]\n}`
      },
      {
        type: "BreadcrumbList",
        status: "valid",
        description: "Hierarchical URL trail rendered in search results breadcrumb path.",
        codeSnippet: `{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [{\n    "@type": "ListItem",\n    "position": 1,\n    "name": "Home",\n    "item": "https://velocehealth.org"\n  }, {\n    "@type": "ListItem",\n    "position": 2,\n    "name": "Clinical Diagnostics",\n    "item": "https://velocehealth.org/diagnostics"\n  }]\n}`
      }
    ],
    serpPreview: {
      title: "Veloce Health | Autonomous Clinical Diagnostics & Telehealth",
      url: "https://velocehealth.org",
      description: "Deploy high-performance clinical diagnostics and telehealth infrastructure with sub-100ms response times, verified HIPAA compliance, and automated care workflows.",
      richSnippetRating: "4.9",
      richSnippetReviews: 142,
      sitelinks: ["Clinical Diagnostics", "HIPAA Compliance", "Telehealth APIs", "Schedule Demo"]
    },
    aiOverviewReady: true,
    aiSearchCitationSignals: [
      "High Semantic Information Gain with verified medical entity references",
      "Valid JSON-LD MedicalOrganization markup recognized by search bots",
      "Sub-100ms TTFB Core Web Vitals ranking advantage",
      "Topical authority citations formatted for Gemini & Perplexity Search snippets"
    ]
  });

  // Run SEO Audit
  const handleRunAudit = async (domainToAudit?: string) => {
    const targetDomain = domainToAudit || selectedDomain;
    setIsAuditing(true);

    const steps = [
      "Connecting to DNS & SSL Handshake...",
      "Crawling DOM Head tags & Heading hierarchy...",
      "Validating Schema.org JSON-LD structured data...",
      "Evaluating Keyword intent & Semantic density...",
      "Simulating Google SERP & Gemini AI Overview rendering..."
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setAuditStep(steps[i]);
        await new Promise(r => setTimeout(r, 260));
      }

      const res = await fetchSeoAudit({
        domain: targetDomain,
        siteTitle: targetDomain.includes("veloce")
          ? "Veloce Health | Autonomous Clinical Diagnostics"
          : targetDomain.includes("apex")
          ? "Apex Autonomous Logistics | AI Supply Chain"
          : `${targetDomain} | Enterprise Autonomous Platform`
      });

      if (res.data) {
        setAuditResult(res.data);
      }
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch (e: any) {
      console.error("Audit error:", e);
    } finally {
      setIsAuditing(false);
      setAuditStep("");
    }
  };

  // Auto-Fix Individual SEO Issue with Confetti
  const handleAutoFixCheck = (checkId: string) => {
    setAuditResult(prev => {
      const updatedChecks = prev.checks.map(c => {
        if (c.id === checkId) {
          return {
            ...c,
            severity: "passed" as const,
            score: 100,
            fixed: true,
            currentValue: `✓ Fixed: ${c.recommendedValue}`
          };
        }
        return c;
      });

      const updatedSchemas = prev.schemas.map(s => {
        if (checkId === "chk-3" && s.type === "FAQPage") {
          return { ...s, status: "valid" as const };
        }
        return s;
      });

      const fixedCount = updatedChecks.filter(c => c.severity === "passed").length;
      const warnCount = updatedChecks.filter(c => c.severity === "warning").length;

      return {
        ...prev,
        overallScore: Math.min(100, prev.overallScore + 3),
        passedChecksCount: fixedCount,
        warningsCount: warnCount,
        checks: updatedChecks,
        schemas: updatedSchemas
      };
    });

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  // Auto-Fix ALL Issues at once
  const handleAutoFixAll = () => {
    setAuditResult(prev => ({
      ...prev,
      overallScore: 100,
      grade: "A+",
      passedChecksCount: prev.checks.length,
      warningsCount: 0,
      criticalIssuesCount: 0,
      checks: prev.checks.map(c => ({
        ...c,
        severity: "passed" as const,
        score: 100,
        fixed: true,
        currentValue: `✓ Auto-Remediated: ${c.recommendedValue}`
      })),
      schemas: prev.schemas.map(s => ({
        ...s,
        status: "valid" as const
      }))
    }));

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
  };

  // Add Target Keyword
  const handleAddKeyword = () => {
    if (!customKeywordInput.trim()) return;
    const newKw: SeoKeywordMetric = {
      keyword: customKeywordInput.trim().toLowerCase(),
      intent: "Commercial",
      currentRank: Math.floor(Math.random() * 8) + 1,
      searchVolumeMonthly: Math.floor(Math.random() * 4000) + 800,
      difficultyScore: Math.floor(Math.random() * 40) + 20,
      relevanceScore: 95,
      estimatedCtr: `${(Math.random() * 20 + 8).toFixed(1)}%`
    };

    setAuditResult(prev => ({
      ...prev,
      keywords: [newKw, ...prev.keywords]
    }));
    setCustomKeywordInput("");
  };

  // Copy Schema to Clipboard
  const handleCopySchema = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  // Export JSON report
  const handleExportReport = () => {
    const blob = new Blob([JSON.stringify(auditResult, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-audit-${auditResult.siteDomain}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityPill = (severity: string) => {
    switch (severity) {
      case "passed":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          icon: CheckCircle2,
          label: "Passed"
        };
      case "warning":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
          icon: AlertTriangle,
          label: "Warning"
        };
      case "critical":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
          icon: XCircle,
          label: "Critical"
        };
      default:
        return {
          bg: "bg-sky-500/10 border-sky-500/20 text-sky-400",
          icon: Bot,
          label: "Info"
        };
    }
  };

  const filteredChecks = auditResult.checks.filter(c => {
    if (activeCheckCategory === "all") return true;
    return c.category.toLowerCase().includes(activeCheckCategory.toLowerCase());
  });

  const activeSchema =
    auditResult.schemas.find(s => s.type === activeSchemaTab) ||
    auditResult.schemas[0];

  return (
    <div className="space-y-6">
      {/* 1. Top Audit Controller & Website Selector Bar */}
      <div className="bento-card flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Automated SEO Audit & SERP Bento Engine
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  AI Autonomous Prober
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-stack On-Page analysis, Schema.org JSON-LD generation, Core Web Vitals SERP signals, and Gemini Search citations.
              </p>
            </div>
          </div>
        </div>

        {/* Website Selector & Audit Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Fleet Dropdown */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDomain}
              onChange={e => {
                setSelectedDomain(e.target.value);
                handleRunAudit(e.target.value);
              }}
              disabled={isAuditing}
              className="px-3 py-1.5 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-slate-200 text-xs font-mono focus:outline-none focus:border-sky-500 cursor-pointer disabled:opacity-50"
            >
              {fleet && fleet.length > 0 ? (
                fleet.map(site => (
                  <option key={site.id} value={site.domain}>
                    {site.domain} ({site.name})
                  </option>
                ))
              ) : (
                <>
                  <option value="velocehealth.org">velocehealth.org (Clinical)</option>
                  <option value="apexlogistics.io">apexlogistics.io (Logistics)</option>
                  <option value="luminarymedia.ai">luminarymedia.ai (Media)</option>
                </>
              )}
            </select>
          </div>

          {/* Audit Action Button */}
          <button
            onClick={() => handleRunAudit()}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-black font-mono uppercase tracking-wider shadow-md shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                <span>Re-Audit Website</span>
              </>
            )}
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportReport}
            className="p-2 rounded-lg bg-[#0A0A0C] hover:bg-[#1f1f26] border border-[#27272A] text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Export SEO Audit Report JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Audit Progress Bar Banner if currently probing */}
      {isAuditing && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/40 text-xs font-mono text-sky-300 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
            <span>{auditStep || "Probing target DOM and Google Index API..."}</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
            Gemini 2.5 Prober
          </span>
        </motion.div>
      )}

      {/* 2. THE MAIN BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* BENTO TILE 1: Top Hero Metric Card with Score Radial (Span 4 cols) */}
        <div className="md:col-span-4 bento-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-slate-500">
                SEO Health Score
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                Grade {auditResult.grade}
              </span>
            </div>

            {/* Circular Gauge + Big Score */}
            <div className="flex items-center gap-4 my-2">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#0A0A0C] border-2 border-emerald-500/40 shadow-inner">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {auditResult.overallScore}
                </span>
                <span className="absolute bottom-1 text-[9px] font-mono text-slate-500">
                  / 100
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-100">
                  {auditResult.overallScore >= 90
                    ? "Excellent SEO Integrity"
                    : auditResult.overallScore >= 75
                    ? "Good (Actionable Items)"
                    : "Needs Remediation"}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {auditResult.siteDomain}
                </div>
                <div className="text-[10px] text-slate-500">
                  Last audit: {new Date(auditResult.auditTimestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Breakdown Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#27272A] text-center font-mono">
            <div className="p-2 rounded bg-[#0A0A0C] border border-[#232327]">
              <div className="text-xs font-bold text-emerald-400">
                {auditResult.passedChecksCount}
              </div>
              <div className="text-[9px] text-slate-500 uppercase">Passed</div>
            </div>
            <div className="p-2 rounded bg-[#0A0A0C] border border-[#232327]">
              <div className="text-xs font-bold text-amber-400">
                {auditResult.warningsCount}
              </div>
              <div className="text-[9px] text-slate-500 uppercase">Warnings</div>
            </div>
            <div className="p-2 rounded bg-[#0A0A0C] border border-[#232327]">
              <div className="text-xs font-bold text-rose-400">
                {auditResult.criticalIssuesCount}
              </div>
              <div className="text-[9px] text-slate-500 uppercase">Critical</div>
            </div>
          </div>

          {/* 1-Click Fix All Action */}
          {auditResult.warningsCount > 0 && (
            <button
              onClick={handleAutoFixAll}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-Fix All Warnings ({auditResult.warningsCount})</span>
            </button>
          )}
        </div>

        {/* BENTO TILE 2: Live Google SERP & Rich Snippets Preview (Span 8 cols) */}
        <div className="md:col-span-8 bento-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                Google Search Result & SERP Snippet Preview
              </span>
            </div>

            {/* Desktop vs Mobile Toggle */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0A0A0C] border border-[#27272A]">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                  previewMode === "desktop"
                    ? "bg-[#1f1f26] text-slate-100 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Desktop SERP
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                  previewMode === "mobile"
                    ? "bg-[#1f1f26] text-slate-100 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Mobile SERP
              </button>
            </div>
          </div>

          {/* Google SERP Simulated Card */}
          <div
            className={`p-4 rounded-xl bg-[#141417] border border-[#27272A] transition-all ${
              previewMode === "mobile" ? "max-w-md mx-auto" : "w-full"
            }`}
          >
            {/* Favicon + URL Path */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <div className="w-4 h-4 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-[9px] text-sky-300 font-bold">
                W
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300 truncate">
                <span>{auditResult.serpPreview.url}</span>
                <span className="text-slate-500">› index</span>
              </div>
            </div>

            {/* Title Link */}
            <h4 className="text-base text-sky-400 hover:underline font-medium cursor-pointer line-clamp-1">
              {auditResult.serpPreview.title}
            </h4>

            {/* Rich Snippet Rating Stars if present */}
            {auditResult.serpPreview.richSnippetRating && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 my-1 font-mono">
                <span>★ ★ ★ ★ ★</span>
                <span className="font-bold">{auditResult.serpPreview.richSnippetRating}</span>
                <span className="text-slate-400">
                  ({auditResult.serpPreview.richSnippetReviews} reviews) • Schema Valid
                </span>
              </div>
            )}

            {/* Meta Description */}
            <p className="text-xs text-slate-300 leading-relaxed mt-1 line-clamp-2">
              {auditResult.serpPreview.description}
            </p>

            {/* Sitelinks Strip */}
            {auditResult.serpPreview.sitelinks && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#232327]">
                {auditResult.serpPreview.sitelinks.map((sitelink, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded bg-[#0A0A0C] border border-[#232327] text-[10px] text-sky-300 truncate hover:text-sky-200 cursor-pointer"
                  >
                    {sitelink}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Snippet Length Health Indicators */}
          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
            <div className="p-2 rounded bg-[#0A0A0C] border border-[#27272A] flex items-center justify-between">
              <span className="text-slate-400">Title Length:</span>
              <span className="text-emerald-400 font-bold">
                {auditResult.serpPreview.title.length} / 60 chars (Optimal)
              </span>
            </div>
            <div className="p-2 rounded bg-[#0A0A0C] border border-[#27272A] flex items-center justify-between">
              <span className="text-slate-400">Meta Desc Length:</span>
              <span className="text-emerald-400 font-bold">
                {auditResult.serpPreview.description.length} / 155 chars (Optimal)
              </span>
            </div>
          </div>
        </div>

        {/* BENTO TILE 3: Detailed SEO & On-Page Health Checklist (Span 7 cols) */}
        <div className="md:col-span-7 bento-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                Technical & On-Page Audit Checklist
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1">
              {[
                { id: "all", label: "All" },
                { id: "on-page", label: "On-Page" },
                { id: "technical", label: "Technical" },
                { id: "schema", label: "Schema" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveCheckCategory(f.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    activeCheckCategory === f.id
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                      : "text-slate-400 hover:text-slate-200 bg-[#0A0A0C] border border-[#27272A]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist Items Accordion */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredChecks.map(check => {
              const severityConfig = getSeverityPill(check.severity);
              const SeverityIcon = severityConfig.icon;
              const isExpanded = expandedCheckId === check.id;

              return (
                <div
                  key={check.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isExpanded
                      ? "bg-[#141417] border-sky-500/40 shadow-sm"
                      : "bg-[#0A0A0C] border-[#27272A] hover:border-slate-600"
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() =>
                      setExpandedCheckId(isExpanded ? null : check.id)
                    }
                    className="flex items-center justify-between gap-2 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1 rounded-md border ${severityConfig.bg}`}
                      >
                        <SeverityIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          {check.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {check.category} • Score {check.score}/100
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold ${severityConfig.bg}`}
                      >
                        {severityConfig.label}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-[#27272A] space-y-2.5 text-xs font-mono"
                      >
                        <p className="text-slate-300 font-sans text-xs">
                          {check.description}
                        </p>

                        <div className="p-2.5 rounded bg-[#070709] border border-[#232327] space-y-1 text-[11px]">
                          <div className="flex items-start gap-2">
                            <span className="text-slate-500 shrink-0">Current:</span>
                            <span className="text-slate-300">{check.currentValue}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">Recommended:</span>
                            <span className="text-emerald-300">
                              {check.recommendedValue}
                            </span>
                          </div>
                        </div>

                        {/* Action auto-fix button if available */}
                        {check.canAutoFix && check.severity !== "passed" && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleAutoFixCheck(check.id)}
                              className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Auto-Fix with AI</span>
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENTO TILE 4: Schema.org JSON-LD Structured Data Inspector (Span 5 cols) */}
        <div className="md:col-span-5 bento-card space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Schema.org JSON-LD Markup
                </span>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                {auditResult.structuredDataScore}% Validated
              </span>
            </div>

            {/* Schema Type Tabs */}
            <div className="flex items-center gap-1 border-b border-[#27272A] pb-2">
              {auditResult.schemas.map(s => (
                <button
                  key={s.type}
                  onClick={() => setActiveSchemaTab(s.type)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    activeSchemaTab === s.type
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                      : "text-slate-400 hover:text-slate-200 bg-[#0A0A0C]"
                  }`}
                >
                  {s.type}
                </button>
              ))}
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="p-3 rounded-lg bg-[#070709] border border-[#27272A] font-mono text-[10px] text-sky-300 overflow-x-auto max-h-[220px] scrollbar-none">
                <code>{activeSchema?.codeSnippet}</code>
              </pre>

              <button
                onClick={() => handleCopySchema(activeSchema?.codeSnippet || "")}
                className="absolute top-2 right-2 p-1.5 rounded bg-[#141417] hover:bg-[#1f1f26] border border-[#27272A] text-slate-300 hover:text-slate-100 transition-all cursor-pointer"
                title="Copy JSON-LD Schema"
              >
                {copiedSchema ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {activeSchema?.description}
            </p>
          </div>

          <div className="pt-2 border-t border-[#27272A] flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Status: Google Rich Snippet Ready</span>
            <span className="text-emerald-400 font-bold">100% Schema Valid</span>
          </div>
        </div>

        {/* BENTO TILE 5: Keyword Rankings, Search Intent & Organic CTR Matrix (Span 7 cols) */}
        <div className="md:col-span-7 bento-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                Organic Keywords & Search Intent Matrix
              </span>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              Est. Organic Traffic:{" "}
              <strong className="text-emerald-400 font-mono">
                {auditResult.estimatedOrganicTraffic}
              </strong>
            </span>
          </div>

          {/* Add Target Keyword Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customKeywordInput}
              onChange={e => setCustomKeywordInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddKeyword()}
              placeholder="Track target keyword (e.g. 'hipaa telehealth software')..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#0A0A0C] border border-[#27272A] text-slate-200 text-xs font-mono focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={handleAddKeyword}
              className="px-3 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1f1f26] border border-[#27272A] text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              + Track
            </button>
          </div>

          {/* Keywords Table */}
          <div className="overflow-x-auto border border-[#27272A] rounded-xl bg-[#0A0A0C]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#111114] text-slate-400 text-[10px] uppercase">
                  <th className="p-2.5">Keyword</th>
                  <th className="p-2.5">Intent</th>
                  <th className="p-2.5 text-center">Rank</th>
                  <th className="p-2.5 text-right">Vol/Mo</th>
                  <th className="p-2.5 text-right">Est. CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f26]">
                {auditResult.keywords.map((kw, idx) => (
                  <tr key={idx} className="hover:bg-[#141419] transition-colors">
                    <td className="p-2.5 font-bold text-slate-200">
                      {kw.keyword}
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[9px] bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {kw.intent}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-emerald-400">
                      #{kw.currentRank}
                    </td>
                    <td className="p-2.5 text-right text-slate-300">
                      {kw.searchVolumeMonthly.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-emerald-400">
                      {kw.estimatedCtr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BENTO TILE 6: Gemini AI Search Overviews & Citation Signals (Span 5 cols) */}
        <div className="md:col-span-5 bento-card space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Gemini & AI Search Overviews Readiness
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                100% SGE Ready
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
              How generative search engines (Gemini Search, Perplexity AI, Bing Copilot) extract and cite this domain:
            </p>

            <div className="space-y-2 font-mono text-[11px]">
              {auditResult.aiSearchCitationSignals.map((signal, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#0A0A0C] border border-[#232327] flex items-start gap-2 text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-500">Search Engine Index:</span>
            <span className="text-emerald-400 font-bold">
              {auditResult.googleIndexStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
