import React, { useState } from "react";
import {
  Code2,
  FolderTree,
  FileCode,
  Download,
  Eye,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Sparkles,
  Layers
} from "lucide-react";
import { WordPressTheme, DesignSystem, BusinessStrategy, BusinessInput } from "../types";
import { fetchCompiledWordPressTheme } from "../lib/geminiClient";
import { downloadThemeAsZip } from "../lib/themeCompiler";

interface ThemeCompilerViewProps {
  business: BusinessInput;
  theme: WordPressTheme | null;
  designSystem: DesignSystem | null;
  strategy: BusinessStrategy | null;
  onUpdateTheme: (theme: WordPressTheme) => void;
}

export const ThemeCompilerView: React.FC<ThemeCompilerViewProps> = ({
  business,
  theme,
  designSystem,
  strategy,
  onUpdateTheme
}) => {
  const [selectedFile, setSelectedFile] = useState<string>("theme.json");
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const handleCompileTheme = async () => {
    setIsCompiling(true);
    try {
      const res = await fetchCompiledWordPressTheme({
        businessName: business.name,
        designSystem: designSystem || undefined,
        strategy: strategy || undefined
      });
      onUpdateTheme(res);
      if (res.files[selectedFile] === undefined) {
        setSelectedFile(Object.keys(res.files)[0] || "theme.json");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleCopyCode = () => {
    if (!theme || !theme.files[selectedFile]) return;
    navigator.clipboard.writeText(theme.files[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!theme) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <Code2 className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-slate-100">Theme Not Compiled</h3>
        <p className="text-xs text-slate-400">Compile a production Gutenberg Block Theme for {business.name}.</p>
        <button
          onClick={handleCompileTheme}
          disabled={isCompiling}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
        >
          {isCompiling ? "Compiling..." : "Compile Theme"}
        </button>
      </div>
    );
  }

  const filesList = Object.keys(theme.files);
  const activeContent = theme.files[selectedFile] || "";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-100">WordPress Gutenberg Theme Compiler</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              Full Site Editing (FSE)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Theme Slug: <span className="font-mono text-indigo-400 font-semibold">{theme.themeSlug}</span> ({theme.fileCount} source files generated)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === "code" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === "preview" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Visual Canvas</span>
            </button>
          </div>

          <button
            onClick={handleCompileTheme}
            disabled={isCompiling}
            title="Re-compile theme files"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isCompiling ? "animate-spin text-indigo-400" : ""}`} />
          </button>

          <button
            onClick={() => downloadThemeAsZip(theme)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Theme (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SOURCE CODE EXPLORER */}
      {viewMode === "code" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[650px]">
          {/* File Tree Explorer (3 cols) */}
          <div className="md:col-span-4 lg:col-span-3 rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4 text-indigo-400" />
                  <span>/{theme.themeSlug}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">{filesList.length} files</span>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[500px] pr-1">
                {filesList.map(filePath => {
                  const isSelected = selectedFile === filePath;
                  const isJson = filePath.endsWith(".json");
                  const isPhp = filePath.endsWith(".php");
                  const isCss = filePath.endsWith(".css");
                  const isHtml = filePath.endsWith(".html");

                  return (
                    <button
                      key={filePath}
                      onClick={() => setSelectedFile(filePath)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isJson
                              ? "text-amber-400"
                              : isPhp
                              ? "text-purple-400"
                              : isCss
                              ? "text-blue-400"
                              : isHtml
                              ? "text-emerald-400"
                              : "text-slate-400"
                          }`}
                        />
                        <span className="truncate">{filePath}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono">
              ✓ Ready for WordPress 6.7+ Full Site Editing upload
            </div>
          </div>

          {/* Code Editor Inspector (9 cols) */}
          <div className="md:col-span-8 lg:col-span-9 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
            {/* Editor Top Bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="text-slate-400 font-normal">Editing:</span>
                <span className="font-bold text-indigo-300">{selectedFile}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Code Body with Line Numbers */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 bg-slate-950 leading-relaxed select-text">
              <pre className="whitespace-pre">{activeContent}</pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: LIVE VISUAL CANVAS SIMULATOR */}
      {viewMode === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit mx-auto text-xs">
            <button
              onClick={() => setViewportSize("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewportSize === "desktop" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop (1280px)</span>
            </button>
            <button
              onClick={() => setViewportSize("tablet")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewportSize === "tablet" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (768px)</span>
            </button>
            <button
              onClick={() => setViewportSize("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewportSize === "mobile" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (390px)</span>
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-center overflow-x-auto min-h-[600px]">
            <div
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
              style={{
                width: viewportSize === "desktop" ? "100%" : viewportSize === "tablet" ? "768px" : "390px",
                maxWidth: "100%"
              }}
            >
              {/* Fake Browser Chrome */}
              <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="font-mono text-[11px] px-3 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  https://{business.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.dev
                </div>
                <span className="text-[10px] font-mono text-emerald-400">GUTENBERG FSE</span>
              </div>

              {/* Rendered Visual Simulation of Front Page Block Theme */}
              <div
                className="p-6 md:p-8 space-y-12"
                style={{
                  backgroundColor: designSystem?.colors?.background || "#090d16",
                  color: designSystem?.colors?.textPrimary || "#f8fafc"
                }}
              >
                {/* Header Block Part */}
                <header className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                      style={{ backgroundColor: designSystem?.colors?.primary || "#10b981", color: "#fff" }}
                    >
                      {business.name.charAt(0)}
                    </div>
                    <span className="font-extrabold text-base tracking-tight">{business.name}</span>
                  </div>

                  <nav className="hidden md:flex items-center gap-5 text-xs text-slate-300 font-medium">
                    <span className="hover:text-emerald-400 cursor-pointer">Solutions</span>
                    <span className="hover:text-emerald-400 cursor-pointer">Case Studies</span>
                    <span className="hover:text-emerald-400 cursor-pointer">Pricing</span>
                    <span className="hover:text-emerald-400 cursor-pointer">About</span>
                  </nav>

                  <button
                    className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-md"
                    style={{ backgroundColor: designSystem?.colors?.primary || "#10b981" }}
                  >
                    {strategy?.conversionStrategy?.primaryCTA || "Get Started"}
                  </button>
                </header>

                {/* Hero Block Pattern */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border" style={{ borderColor: `${designSystem?.colors?.primary}40`, color: designSystem?.colors?.primary }}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{business.industry}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                      {business.name}
                    </h1>

                    <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                      {strategy?.valueProposition || "Autonomous high-performance digital business architecture engineered for 10x scalability and zero operational overhead."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        className="px-5 py-2.5 text-xs font-bold text-white rounded-lg shadow-lg"
                        style={{ backgroundColor: designSystem?.colors?.primary || "#10b981" }}
                      >
                        {strategy?.conversionStrategy?.primaryCTA || "Deploy Autonomous System"}
                      </button>

                      <button className="px-5 py-2.5 text-xs font-bold border border-slate-700 rounded-lg hover:bg-slate-800">
                        Explore Case Studies
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div
                      className="p-6 rounded-2xl border space-y-4 shadow-2xl"
                      style={{
                        backgroundColor: designSystem?.colors?.surface || "#111827",
                        borderColor: designSystem?.colors?.surfaceBorder || "#1f2937"
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-emerald-400">● LIVE WP TELEMETRY</span>
                        <span className="text-[10px] font-mono text-slate-400">WP-CLI v2.9</span>
                      </div>
                      <div className="text-3xl font-black text-slate-100">99.98%</div>
                      <p className="text-xs text-slate-400">Fleet Uptime & Zero-Lag Edge Routing</p>
                      <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-indigo-300 border border-slate-800">
                        $ wp core status<br />
                        Response: 18ms TTFB | Cache: Redis
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer Block Part */}
                <footer className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>© 2026 {business.name}. Autonomous WordPress Operating System.</div>
                  <div className="text-emerald-400 font-mono text-[11px]">● 100/100 Core Web Vitals Guaranteed</div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
