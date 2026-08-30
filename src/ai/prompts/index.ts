/**
 * AI Digital Factory - AI Prompt Registry
 * Dedicated, version-controlled prompts for all AI Agents
 */

export const BUSINESS_STRATEGY_PROMPT = (input: {
  name?: string;
  type?: string;
  industry?: string;
  location?: string;
  targetAudience?: string;
  goals?: string;
  personality?: string;
}) => `You are a world-class digital business strategist, conversion rate optimizer, and enterprise WordPress architect.
Analyze this business idea and generate an exhaustive, production-grade business and website blueprint.

Business Name: ${input.name || "Nova Enterprises"}
Business Type: ${input.type || "B2B SaaS / Services"}
Industry: ${input.industry || "Technology"}
Location / Market: ${input.location || "Global"}
Target Audience: ${input.targetAudience || "Tech founders, decision makers, and growing teams"}
Primary Business Goals: ${input.goals || "Lead generation, brand authority, high-converting service inquiries"}
Brand Personality: ${input.personality || "Premium, modern, trustworthy, high-performance"}

Respond STRICTLY with a valid JSON object matching this exact JSON schema:
{
  "summary": "2-3 sentence executive summary of the business strategy",
  "valueProposition": "Crisp, powerful core value proposition statement",
  "targetAudiencePersona": {
    "title": "Primary customer profile",
    "painPoints": ["pain 1", "pain 2", "pain 3"],
    "motivations": ["motivation 1", "motivation 2"]
  },
  "pages": [
    {
      "name": "Page Name (e.g. Home, Services, Case Studies, Pricing, About, Contact)",
      "slug": "page-slug",
      "purpose": "Primary conversion objective of this page",
      "keySections": ["Hero section with CTA", "Features grid", "Social proof", "Pricing table", "FAQ"]
    }
  ],
  "goal": "lead_generation",
  "conversionStrategy": {
    "primaryCTA": "Get Started Free / Book Strategic Call",
    "leadMagnet": "Free Blueprint / Live Demo / Audit",
    "trustSignals": ["SOC-2 Compliant", "4.9/5 Rating", "Over 10,000+ Active Users", "100% SLA Guarantee"]
  },
  "seoStrategy": {
    "focusType": "Local & Global B2B SEO",
    "primaryKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
    "secondaryKeywords": ["keyword 5", "keyword 6", "keyword 7"],
    "contentPillars": ["Topic cluster 1", "Topic cluster 2", "Topic cluster 3"],
    "schemaMarkup": ["Organization", "LocalBusiness", "FAQPage", "SoftwareApplication"]
  },
  "customerJourney": [
    { "stage": "Awareness", "touchpoint": "Organic Search & High-Value Content", "action": "Discovers brand via solution-focused keyword" },
    { "stage": "Consideration", "touchpoint": "Interactive Showcase & Case Studies", "action": "Compares features and evaluates ROI" },
    { "stage": "Decision", "touchpoint": "Transparent Pricing & Social Proof", "action": "Submits lead inquiry or starts onboarding" },
    { "stage": "Retention", "touchpoint": "Automated Onboarding & 24/7 Support", "action": "Continuous adoption and expansion" }
  ]
}`;

export const DESIGN_SYSTEM_PROMPT = (input: {
  businessName: string;
  industry: string;
  personality: string;
  stylePreference?: string;
}) => `You are a principal design systems architect specializing in modern WordPress Gutenberg Block Themes, modern CSS variables, and fluid typography.
Create a complete design system token specification for:
Business Name: ${input.businessName}
Industry: ${input.industry}
Personality: ${input.personality}
Style Preference: ${input.stylePreference || "Modern Luxury & High-Tech Minimalist"}

Respond STRICTLY with a valid JSON object matching this schema:
{
  "styleName": "e.g. Cyber Obsidian / Luxe Minimal / Nordic Clean / Vibrant Studio",
  "themeMode": "dark",
  "colors": {
    "primary": "#6366f1",
    "primaryHover": "#4f46e5",
    "secondary": "#06b6d4",
    "accent": "#10b981",
    "background": "#090d16",
    "surface": "#111827",
    "surfaceBorder": "#1f2937",
    "textPrimary": "#f8fafc",
    "textSecondary": "#94a3b8",
    "textMuted": "#64748b"
  },
  "typography": {
    "fontHeading": "Plus Jakarta Sans, sans-serif",
    "fontBody": "Plus Jakarta Sans, sans-serif",
    "fontMono": "JetBrains Mono, monospace",
    "scale": {
      "display": "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
      "h1": "clamp(2rem, 3.5vw + 0.8rem, 3.25rem)",
      "h2": "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)",
      "h3": "1.5rem",
      "body": "1rem",
      "small": "0.875rem"
    }
  },
  "spacing": {
    "unit": "4px",
    "sectionPadding": "clamp(4rem, 8vw, 8rem)",
    "containerMaxWidth": "1280px",
    "cardRadius": "12px",
    "buttonRadius": "8px"
  },
  "components": [
    "Modern FSE Sticky Navigation Header",
    "Dynamic Hero with Split Grid and KPI Metrics",
    "Interactive Feature Bento Grid with Hover Depth",
    "Social Proof & Partner Logo Marquee",
    "Transparent Pricing Comparison Cards",
    "Customer Testimonial Grid with Star Ratings",
    "FAQ Accordion with Animated Expansion",
    "Conversion Footer with Newsletter and Status Indicator"
  ],
  "animation": {
    "transitionDefault": "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    "hoverScale": "1.02",
    "glowAccent": "0 0 24px rgba(99, 102, 241, 0.25)"
  }
}`;

export const TROUBLESHOOTING_PROMPT = (input: {
  siteDomain?: string;
  problemType?: string;
  errorLog?: string;
}) => `You are a Principal WordPress DevOps Architect and Linux Systems Engineer.
Analyze the following error incident on site "${input.siteDomain || "client-app.com"}" and provide an immediate autonomous diagnosis and self-healing action plan.

Problem Category: ${input.problemType || "HTTP 500 / Fatal Error"}
Error Logs:
${input.errorLog || "PHP Fatal error: Uncaught Error: Call to undefined function wp_cache_get_multi()"}

Respond STRICTLY in JSON format:
{
  "problemTitle": "Concise issue summary",
  "rootCauseAnalysis": "Detailed technical explanation of what caused the crash and why",
  "affectedComponent": "Plugin: offending-plugin v1.0",
  "severity": "CRITICAL",
  "safetyTransaction": {
    "snapshotId": "snap_emergency_auto",
    "backupScope": "Full Database + wp-content/plugins snapshot taken prior to remediation"
  },
  "autonomousRemediationSteps": [
    { "step": 1, "action": "CREATE_SNAPSHOT", "detail": "Automated snapshot captured" },
    { "step": 2, "action": "DISABLE_OFFENDING_MODULE", "detail": "wp plugin deactivate offending-plugin --skip-plugins" },
    { "step": 3, "action": "PURGE_OBJECT_CACHE", "detail": "wp cache flush && redis-cli FLUSHDB async" },
    { "step": 4, "action": "HEALTH_CHECK_PING", "detail": "HTTP GET -> 200 OK" }
  ],
  "preventionRecommendation": "Advice to avoid recurrence.",
  "rollbackScript": "wp plugin activate offending-plugin-previous --force"
}`;

export const SEO_AUDIT_PROMPT = (input: {
  siteDomain: string;
  siteTitle: string;
  industry: string;
}) => `You are a Principal Technical SEO Auditor, Google Search Console Architect, and Schema.org Specialist.
Perform a thorough, automated Technical & On-Page SEO audit for the website:
Domain: "${input.siteDomain}"
Site Title: "${input.siteTitle}"
Industry: "${input.industry}"

Return a comprehensive JSON payload with overallScore, grade, checks array, keywords array, schemas array, and serpPreview.`;

export const OPTIMIZATION_PROMPT = (input: {
  domain: string;
  siteMetrics: any;
}) => `You are a Principal Conversion Rate Optimizer and Core Web Vitals Performance Architect.
Analyze the performance & analytics of "${input.domain || "main-platform.com"}":
Metrics: ${JSON.stringify(input.siteMetrics || {})}

Output a prioritized list of autonomous optimizations in valid JSON format with overallScore, potentialUplift, and optimizations array.`;
