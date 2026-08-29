import { BusinessStrategy, DesignSystem, WordPressTheme, IncidentRecord, OptimizationItem, SeoAuditResult } from "../types";

export async function fetchBusinessStrategy(input: {
  name: string;
  type: string;
  industry: string;
  location: string;
  targetAudience: string;
  goals: string;
  personality: string;
}): Promise<{ data: BusinessStrategy; engine: string }> {
  const response = await fetch("/api/ai/business-strategy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Failed to generate strategy: ${response.statusText}`);
  }
  const result = await response.json();
  return { data: result.data, engine: result.engine || "gemini-3.7-flash" };
}

export async function fetchDesignSystem(input: {
  businessName: string;
  industry: string;
  personality: string;
  stylePreference?: string;
}): Promise<{ data: DesignSystem; engine: string }> {
  const response = await fetch("/api/ai/design-system", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Failed to generate design system: ${response.statusText}`);
  }
  const result = await response.json();
  return { data: result.data, engine: result.engine || "gemini-3.7-flash" };
}

export async function fetchCompiledWordPressTheme(input: {
  businessName: string;
  designSystem?: DesignSystem;
  strategy?: BusinessStrategy;
}): Promise<WordPressTheme> {
  const response = await fetch("/api/ai/theme-compile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Failed to compile theme: ${response.statusText}`);
  }
  const result = await response.json();
  return {
    themeName: result.themeName,
    themeSlug: result.themeSlug,
    version: "1.0.0",
    fileCount: result.fileCount,
    files: result.files,
    createdAt: new Date().toISOString()
  };
}

export async function transcribeAudio(audioBase64: string, mimeType: string = "audio/webm"): Promise<string> {
  const response = await fetch("/api/ai/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64, mimeType })
  });
  if (!response.ok) {
    throw new Error(`Audio transcription failed: ${response.statusText}`);
  }
  const result = await response.json();
  return result.transcript || "";
}

export async function transcribeAudioPrompt(audioBase64: string, mimeType: string = "audio/webm"): Promise<{ transcript: string }> {
  const text = await transcribeAudio(audioBase64, mimeType);
  return { transcript: text };
}

export async function fetchTroubleshootingAnalysis(input: {
  errorLog: string;
  problemType: string;
  siteDomain?: string;
}): Promise<{ data: any; engine: string }> {
  const response = await fetch("/api/ai/troubleshoot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Troubleshooting failed: ${response.statusText}`);
  }
  const result = await response.json();
  return { data: result.data, engine: result.engine || "gemini-3.7-flash" };
}

export async function fetchOptimizations(input: {
  siteMetrics?: any;
  domain?: string;
}): Promise<{ data: { overallScore: number; potentialUplift: string; optimizations: OptimizationItem[] }; engine: string }> {
  const response = await fetch("/api/ai/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Optimization failed: ${response.statusText}`);
  }
  const result = await response.json();
  return { data: result.data, engine: result.engine || "gemini-3.7-flash" };
}

export async function fetchOptimizationPlan(input: {
  siteDomain: string;
  currentTTFB: number;
  currentScore: number;
}): Promise<{ data: any }> {
  const res = await fetchOptimizations({ domain: input.siteDomain, siteMetrics: input });
  return {
    data: {
      estimatedSpeedGain: res.data.potentialUplift || "3.2x faster TTFB",
      optimizations: res.data.optimizations
    }
  };
}

export async function fetchCopilotResponse(query: string, context?: any): Promise<{ answer: string; suggestedActions?: string[] }> {
  const response = await fetch("/api/ai/quick-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, context })
  });
  if (!response.ok) {
    throw new Error(`Copilot query failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function fetchLowLatencyCopilot(input: {
  prompt: string;
  context?: string;
}): Promise<{ response: string }> {
  const res = await fetchCopilotResponse(input.prompt, input.context);
  return { response: res.answer };
}

export async function executeDeploymentPipeline(input: {
  targetEnv: string;
  domain: string;
  databaseName: string;
  themeSlug: string;
}): Promise<any> {
  const response = await fetch("/api/deploy/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Deployment failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function fetchSeoAudit(input: {
  domain: string;
  siteTitle?: string;
  industry?: string;
}): Promise<{ data: SeoAuditResult; engine: string }> {
  const response = await fetch("/api/ai/seo-audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`SEO Audit failed: ${response.statusText}`);
  }
  const result = await response.json();
  return { data: result.data, engine: result.engine || "gemini-3.7-flash" };
}

export async function executeOrchestratorPipeline(input: {
  businessInput: any;
  domain: string;
  hostingType: string;
}): Promise<any> {
  const response = await fetch("/api/orchestrator/pipeline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Pipeline failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function testConnectorConnection(connectorType: string, host?: string): Promise<any> {
  const response = await fetch("/api/connectors/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ connectorType, host })
  });
  if (!response.ok) {
    throw new Error(`Connector test failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function executeAutonomousRemediation(input: {
  domain: string;
  problemTitle?: string;
  affectedComponent?: string;
}): Promise<any> {
  const response = await fetch("/api/operations/remediate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error(`Remediation failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function applySeoAutoFix(domain: string, checkId: string): Promise<any> {
  const response = await fetch("/api/seo/autofix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, checkId })
  });
  if (!response.ok) {
    throw new Error(`SEO auto-fix failed: ${response.statusText}`);
  }
  return await response.json();
}

