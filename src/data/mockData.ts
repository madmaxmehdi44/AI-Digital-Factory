import {
  BusinessInput,
  BusinessStrategy,
  DesignSystem,
  WordPressTheme,
  HostingConnector,
  FleetSite,
  IncidentRecord,
  BackupSnapshot,
  OptimizationItem
} from "../types";

export const initialBusiness: BusinessInput = {
  id: "biz_apex_logistics_2026",
  name: "Apex Autonomous Logistics",
  type: "B2B Intelligent Fleet & Freight Operations",
  industry: "Supply Chain & Artificial Intelligence",
  location: "North America & Europe",
  targetAudience: "Enterprise VP of Operations, Supply Chain Directors, and Fleet Managers",
  goals: "Inbound enterprise pipeline, high-ticket RFP requests, demo bookings, and client portal access",
  personality: "Ultra-precise, high-performance, enterprise-grade, futuristic, and relentlessly reliable",
  stylePreference: "Cyber Obsidian & Emerald Accent",
  createdAt: new Date().toISOString()
};

export const sampleBusinessesList: BusinessInput[] = [
  initialBusiness,
  {
    id: "biz_luminary_ai",
    name: "Luminary AI Studio",
    type: "AI Creative Agency & Generative Video",
    industry: "Creative Tech & Media",
    location: "Global",
    targetAudience: "Brand Directors, CMOs, and Production Houses",
    goals: "Tiered retainer client acquisition, portfolio showcase, and automated project intake",
    personality: "Avant-garde, ultra-minimalist, sleek, and high-contrast",
    stylePreference: "Luxe Obsidian & Violet Neon",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "biz_kuro_coffee",
    name: "Kuro Roasters & Specialty Goods",
    type: "E-commerce & Subscription Coffee Club",
    industry: "Artisan Food & Beverage",
    location: "Tokyo, London, San Francisco",
    targetAudience: "Coffee connoisseurs, boutique cafes, and daily subscription consumers",
    goals: "Direct-to-consumer recurring subscriptions and wholesale distribution contracts",
    personality: "Warm Japanese minimalism, meticulous craftsmanship, earthy and organic",
    stylePreference: "Warm Charcoal & Amber Gold",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

export const initialStrategy: BusinessStrategy = {
  summary: "Apex Autonomous Logistics combines predictive route orchestration with automated load dispatching for Fortune 500 fleets. The digital platform is architected to position Apex as the premier high-margin AI logistics infrastructure provider.",
  valueProposition: "Transforming Fragmented Fleets into Zero-Downtime Autonomous Freight Networks with 34% Lower Operational Cost.",
  targetAudiencePersona: {
    title: "Chief Supply Chain Officers & Fleet Directors",
    painPoints: [
      "Unpredictable freight delays costing millions in carrier SLA penalties",
      "Manual load brokering creating 48-hour bottlenecks",
      "Disconnected legacy telematics software lacking real-time AI dispatch"
    ],
    motivations: [
      "Sub-second dispatch automation and predictive maintenance",
      "Guaranteed 99.98% on-time delivery across North American corridors",
      "Real-time executive cockpit with instant ROI visibility"
    ]
  },
  pages: [
    {
      name: "Home",
      slug: "home",
      purpose: "Capture enterprise high-intent interest with live fleet telemetry visualizer and instant ROI calculator.",
      keySections: ["Hero with Live Fleet Cockpit", "Enterprise Value Metrics", "Feature Bento Grid", "Interactive Dispatch Demo", "Security & SOC-2", "Conversion Lead Gate"]
    },
    {
      name: "Autonomous Network",
      slug: "network",
      purpose: "Deep technical dive into the algorithmic dispatch engine and hardware-agnostic API.",
      keySections: ["Corridor Map", "Predictive Routing Algorithm", "Telematics Integrations", "Developer API Docs"]
    },
    {
      name: "Enterprise Case Studies",
      slug: "case-studies",
      purpose: "Provide verified proof of 34% cost reductions and 4.2x faster load turnarounds.",
      keySections: ["Fortune 50 Case Study", "Quantified ROI Grid", "Video Testimonials", "Downloadable Whitepaper"]
    },
    {
      name: "Pricing & Fleet Tiers",
      slug: "pricing",
      purpose: "Transparent fleet-size tiered investments with instant quote generator.",
      keySections: ["Fleet Scale Slider (10 to 5,000+ trucks)", "Tier Specs (Pro / Enterprise / Sovereign)", "Enterprise SLA FAQ"]
    },
    {
      name: "Schedule Operational Briefing",
      slug: "demo",
      purpose: "High-converting qualification funnel routing directly to executive sales engineers.",
      keySections: ["Two-Step Qualification Form", "Direct Calendar Booking", "NDA & Security Briefing"]
    }
  ],
  goal: "lead_generation",
  conversionStrategy: {
    primaryCTA: "Schedule Autonomous Fleet Briefing",
    leadMagnet: "2026 Autonomous Freight Benchmark & ROI Audit",
    trustSignals: [
      "SOC-2 Type II Certified",
      "Over $1.2B in Freight Dispatched",
      "99.99% Fleet Uptime SLA",
      "ISO 27001 & DOT Compliant"
    ]
  },
  seoStrategy: {
    focusType: "High-Intent Commercial B2B SEO",
    primaryKeywords: [
      "autonomous fleet management software",
      "ai freight dispatch engine",
      "predictive logistics platform",
      "enterprise telematics automation"
    ],
    secondaryKeywords: [
      "route optimization api",
      "fleet maintenance machine learning",
      "load dispatch automation",
      "real time supply chain analytics"
    ],
    contentPillars: [
      "Autonomous Dispatch Algorithms",
      "Supply Chain Resiliency & Vitals",
      "Fleet Decarbonization & Fuel Efficiency"
    ],
    schemaMarkup: [
      "Organization",
      "SoftwareApplication",
      "FAQPage",
      "AggregateRating",
      "Service"
    ]
  },
  customerJourney: [
    {
      stage: "Awareness",
      touchpoint: "Technical Whitepaper on Autonomous Route Optimization",
      action: "Discovers Apex through search queries on fleet efficiency algorithms."
    },
    {
      stage: "Consideration",
      touchpoint: "Interactive Dispatch Simulation & Corridor Map",
      action: "Inputs fleet size (250 trucks) to calculate $1.4M estimated annual savings."
    },
    {
      stage: "Decision",
      touchpoint: "Tailored Executive Architecture Briefing & Security Deck",
      action: "Requests customized RFP and begins 30-day pilot deployment."
    },
    {
      stage: "Retention",
      touchpoint: "24/7 Operations Engine & Autonomous Site Monitoring",
      action: "Expands coverage across all national distribution hubs with continuous uptime."
    }
  ]
};

export const initialDesignSystem: DesignSystem = {
  styleName: "Obsidian & Quantum Emerald",
  themeMode: "dark",
  colors: {
    primary: "#10b981",
    primaryHover: "#059669",
    secondary: "#06b6d4",
    accent: "#6366f1",
    background: "#090d16",
    surface: "#111827",
    surfaceBorder: "#1f2937",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textMuted: "#64748b"
  },
  typography: {
    fontHeading: "Plus Jakarta Sans, sans-serif",
    fontBody: "Plus Jakarta Sans, sans-serif",
    fontMono: "JetBrains Mono, monospace",
    scale: {
      display: "clamp(2.5rem, 5vw + 1rem, 4.25rem)",
      h1: "clamp(2rem, 3.5vw + 0.8rem, 3rem)",
      h2: "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)",
      h3: "1.5rem",
      body: "1rem",
      small: "0.875rem"
    }
  },
  spacing: {
    unit: "4px",
    sectionPadding: "clamp(4rem, 8vw, 7.5rem)",
    containerMaxWidth: "1280px",
    cardRadius: "12px",
    buttonRadius: "8px"
  },
  components: [
    "Full-Site Editing (FSE) Sticky Header with Fleet Status Pill",
    "Hero Section with Split Bento Cockpit and Metrics Counter",
    "Interactive Feature Bento Grid with Glass Glow Hover",
    "Logistics Route Topology Visualization Card",
    "High-Density Tiered Pricing Comparison Table",
    "Customer Case Study Spotlight with Video Modal",
    "FAQ Accordion with Dynamic Smooth Chevron",
    "Conversion Footer with Global Infrastructure Heartbeat"
  ],
  animation: {
    transitionDefault: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    hoverScale: "1.02",
    glowAccent: "0 0 28px rgba(16, 185, 129, 0.25)"
  }
};

export const initialHostingConnectors: HostingConnector[] = [
  {
    id: "conn_docker_prod",
    name: "Edge Docker Swarm Cluster (US-East)",
    type: "docker",
    host: "swarm-node-01.aidigitalfactory.infra",
    status: "connected",
    lastPingMs: 14,
    serverInfo: {
      php: "8.3.2 (OPcache + JIT)",
      mysql: "MySQL 8.0.36 InnoDB",
      webServer: "Nginx 1.25.4 + HTTP/3",
      memoryLimit: "1024M"
    },
    vaultKeyId: "vk_aes256_9948",
    maskedToken: "dckr_pat_••••••••••••••••3f8a"
  },
  {
    id: "conn_cpanel_primary",
    name: "cPanel Enterprise WHM Node",
    type: "cpanel",
    host: "whm.fleetcloudhost.com",
    status: "connected",
    lastPingMs: 38,
    serverInfo: {
      php: "8.2.14",
      mysql: "MariaDB 10.11",
      webServer: "LiteSpeed Enterprise",
      memoryLimit: "512M"
    },
    vaultKeyId: "vk_aes256_1029",
    maskedToken: "cp_uapi_••••••••••••••••77a1"
  },
  {
    id: "conn_ssh_vps",
    name: "Dedicated Bare-Metal Ubuntu (Frankfurt)",
    type: "ssh",
    host: "65.109.12.84",
    status: "connected",
    lastPingMs: 82,
    serverInfo: {
      php: "8.3.1",
      mysql: "Percona Server 8.0",
      webServer: "OpenResty + Redis",
      memoryLimit: "2048M"
    },
    vaultKeyId: "vk_ed25519_5521",
    maskedToken: "ssh_key_••••••••••••••••90bc"
  },
  {
    id: "conn_plesk_cloud",
    name: "Plesk Obsidian REST Engine",
    type: "plesk",
    host: "plesk.eurogrid.cloud",
    status: "connected",
    lastPingMs: 44,
    serverInfo: {
      php: "8.2.16",
      mysql: "MySQL 8.0.35",
      webServer: "Apache 2.4 + Nginx Reverse Proxy",
      memoryLimit: "512M"
    },
    vaultKeyId: "vk_aes256_8812",
    maskedToken: "plsk_api_••••••••••••••••4d22"
  }
];

export const mockFleetSites: FleetSite[] = [
  {
    id: "site-001",
    name: "Apex Logistics HQ",
    domain: "apexlogistics.ai",
    status: "healthy",
    wpVersion: "6.7.1",
    phpVersion: "8.3.2",
    uptimePercent: 99.99,
    responseTimeMs: 112,
    pluginsCount: 14,
    updatesAvailable: 0,
    lastBackup: "12 mins ago",
    sslExpiryDays: 84,
    coreVitalsScore: 99,
    hostingType: "docker",
    autoUpdateEnabled: true
  },
  {
    id: "site-002",
    name: "Luminary AI Studio",
    domain: "luminarystudio.io",
    status: "healthy",
    wpVersion: "6.7.1",
    phpVersion: "8.3.2",
    uptimePercent: 99.98,
    responseTimeMs: 145,
    pluginsCount: 18,
    updatesAvailable: 0,
    lastBackup: "1 hour ago",
    sslExpiryDays: 72,
    coreVitalsScore: 97,
    hostingType: "docker",
    autoUpdateEnabled: true
  },
  {
    id: "site-003",
    name: "Kuro Specialty Roasters",
    domain: "kuroroasters.co.uk",
    status: "warning",
    wpVersion: "6.6.2",
    phpVersion: "8.2.14",
    uptimePercent: 99.82,
    responseTimeMs: 340,
    pluginsCount: 26,
    updatesAvailable: 3,
    lastBackup: "4 hours ago",
    sslExpiryDays: 14,
    coreVitalsScore: 84,
    hostingType: "cpanel",
    autoUpdateEnabled: false
  },
  {
    id: "site-004",
    name: "Veloce Health Systems",
    domain: "velocehealth.org",
    status: "critical",
    wpVersion: "6.5.4",
    phpVersion: "8.1.20",
    uptimePercent: 98.40,
    responseTimeMs: 820,
    pluginsCount: 31,
    updatesAvailable: 7,
    lastBackup: "14 hours ago",
    sslExpiryDays: 3,
    coreVitalsScore: 68,
    hostingType: "ssh",
    autoUpdateEnabled: false
  },
  {
    id: "site-005",
    name: "AeroDynamics Cargo",
    domain: "aerocargo-dispatch.com",
    status: "healthy",
    wpVersion: "6.7.1",
    phpVersion: "8.3.2",
    uptimePercent: 100.0,
    responseTimeMs: 98,
    pluginsCount: 12,
    updatesAvailable: 0,
    lastBackup: "30 mins ago",
    sslExpiryDays: 88,
    coreVitalsScore: 100,
    hostingType: "docker",
    autoUpdateEnabled: true
  },
  {
    id: "site-006",
    name: "Synthetix Finance",
    domain: "synthetix-capital.com",
    status: "healthy",
    wpVersion: "6.7.1",
    phpVersion: "8.3.1",
    uptimePercent: 99.99,
    responseTimeMs: 124,
    pluginsCount: 16,
    updatesAvailable: 0,
    lastBackup: "2 hours ago",
    sslExpiryDays: 61,
    coreVitalsScore: 98,
    hostingType: "plesk",
    autoUpdateEnabled: true
  },
  {
    id: "site-007",
    name: "Prism Creative Agency",
    domain: "prismdesign.ch",
    status: "warning",
    wpVersion: "6.7.0",
    phpVersion: "8.2.16",
    uptimePercent: 99.74,
    responseTimeMs: 290,
    pluginsCount: 22,
    updatesAvailable: 2,
    lastBackup: "6 hours ago",
    sslExpiryDays: 22,
    coreVitalsScore: 86,
    hostingType: "cpanel",
    autoUpdateEnabled: true
  },
  {
    id: "site-008",
    name: "Nordic Smart Grid",
    domain: "nordic-grid.no",
    status: "healthy",
    wpVersion: "6.7.1",
    phpVersion: "8.3.2",
    uptimePercent: 99.99,
    responseTimeMs: 105,
    pluginsCount: 11,
    updatesAvailable: 0,
    lastBackup: "45 mins ago",
    sslExpiryDays: 79,
    coreVitalsScore: 99,
    hostingType: "docker",
    autoUpdateEnabled: true
  }
];

export const sampleIncidentLogs: IncidentRecord[] = [
  {
    id: "inc_9921",
    siteDomain: "velocehealth.org",
    timestamp: "18 minutes ago",
    problemTitle: "HTTP 500 Fatal Error - Call to undefined function wp_cache_get_multi()",
    rootCauseAnalysis: "The plugin 'seo-booster-pro v3.1.2' attempted to invoke a deprecated Redis object cache function after an unverified auto-update, causing a fatal PHP 8.1 crash during WordPress bootstrap.",
    affectedComponent: "Plugin: seo-booster-pro",
    severity: "CRITICAL",
    status: "RESOLVED",
    safetyTransaction: {
      snapshotId: "snap_auto_safety_9921",
      backupScope: "Automated snapshot of MySQL database + wp-content directory before applying remediation."
    },
    autonomousRemediationSteps: [
      { step: 1, action: "CREATE_SNAPSHOT", detail: "Emergency transaction snapshot snap_auto_safety_9921 committed to encrypted S3 vault", completed: true },
      { step: 2, action: "ISOLATE_PLUGIN", detail: "Safely deactivated 'seo-booster-pro' via WP-CLI safe hook mode", completed: true },
      { step: 3, action: "FLUSH_CACHE", detail: "Purged Redis object cache and Cloudflare Edge Cache", completed: true },
      { step: 4, action: "HEALTH_VERIFY", detail: "Synthetic health probe returned HTTP 200 OK (TTFB 118ms)", completed: true }
    ],
    preventionRecommendation: "Pin plugin dependencies to tested semver ranges and require staging sandbox verification before applying updates.",
    rollbackScript: "wp rollback plugin seo-booster-pro --version=3.0.4"
  },
  {
    id: "inc_9918",
    siteDomain: "kuroroasters.co.uk",
    timestamp: "2 hours ago",
    problemTitle: "Database Deadlock - WooCommerce Cart Session Lock Contention",
    rootCauseAnalysis: "High concurrent traffic spike on black coffee flash sale caused InnoDB row lock timeout on wp_woocommerce_sessions table due to missing index.",
    affectedComponent: "Database: MySQL Table wp_woocommerce_sessions",
    severity: "HIGH",
    status: "RESOLVED",
    safetyTransaction: {
      snapshotId: "snap_db_9918",
      backupScope: "Transaction log point-in-time snapshot of WooCommerce tables."
    },
    autonomousRemediationSteps: [
      { step: 1, action: "KILL_DEADLOCKS", detail: "Terminated stuck MySQL threads with state 'Locked'", completed: true },
      { step: 2, action: "OPTIMIZE_INDEX", detail: "Added composite index (session_expiry, session_key) to wp_woocommerce_sessions", completed: true },
      { step: 3, action: "ENABLE_REDIS_SESSIONS", detail: "Offloaded session persistence to Redis in-memory store", completed: true }
    ],
    preventionRecommendation: "Maintain sessions exclusively in Redis rather than relational MySQL database.",
    rollbackScript: "ALTER TABLE wp_woocommerce_sessions DROP INDEX session_expiry_key"
  }
];

export const sampleSnapshots: BackupSnapshot[] = [
  {
    id: "snap_20260828_1600",
    siteDomain: "apexlogistics.ai",
    timestamp: "Today at 16:00:00",
    sizeMb: 242.8,
    type: "scheduled",
    dbIncluded: true,
    filesIncluded: true,
    status: "verified",
    commitMessage: "Automated hourly incremental transaction snapshot (Full DB + Uploads)"
  },
  {
    id: "snap_20260828_1530",
    siteDomain: "apexlogistics.ai",
    timestamp: "Today at 15:30:12",
    sizeMb: 241.2,
    type: "pre_update",
    dbIncluded: true,
    filesIncluded: true,
    status: "verified",
    commitMessage: "Pre-theme compilation snapshot before Gutenberg FSE update"
  },
  {
    id: "snap_20260828_1200",
    siteDomain: "luminarystudio.io",
    timestamp: "Today at 12:00:00",
    sizeMb: 388.5,
    type: "scheduled",
    dbIncluded: true,
    filesIncluded: true,
    status: "verified",
    commitMessage: "Automated mid-day fleet backup with cloud redundancy"
  },
  {
    id: "snap_emergency_9921",
    siteDomain: "velocehealth.org",
    timestamp: "Today at 11:42:00",
    sizeMb: 198.4,
    type: "incident_safety",
    dbIncluded: true,
    filesIncluded: true,
    status: "verified",
    commitMessage: "Emergency snapshot before deactivating conflicting SEO plugin"
  }
];

export const sampleOptimizationsList: OptimizationItem[] = [
  {
    id: "opt-1",
    category: "SPEED_VITALS",
    title: "Convert Theme Images to Responsive AVIF / WebP Format",
    impact: "HIGH",
    effort: "AUTO_APPLY",
    description: "Automatically compress, generate responsive srcset dimensions, and serve next-gen AVIF images with async decoding and fetchpriority='high' on above-the-fold hero banners.",
    estimatedGain: "-1.2s LCP reduction (Score 84 -> 99)",
    applied: false
  },
  {
    id: "opt-2",
    category: "CONVERSION_CRO",
    title: "Dynamic Two-Step Multi-Device Interactive Qualification Gate",
    impact: "HIGH",
    effort: "AUTO_APPLY",
    description: "Replace static 6-field inquiry form with progressive disclosure micro-steps. Reduces initial cognitive friction and increases completion rate.",
    estimatedGain: "+23.4% demo conversions",
    applied: false
  },
  {
    id: "opt-3",
    category: "SEO_SCHEMA",
    title: "Inject Autonomous JSON-LD FAQ & AggregateRating Structured Data",
    impact: "HIGH",
    effort: "AUTO_APPLY",
    description: "Generate deep semantic schema markup recognized by Google Search and AI Search Engines (Gemini/Perplexity) for rich snippet SERP dominance.",
    estimatedGain: "+18% organic SERP click-through rate",
    applied: true
  },
  {
    id: "opt-4",
    category: "SECURITY",
    title: "Hardened XML-RPC & REST API Rate Limiter Rules",
    impact: "MEDIUM",
    effort: "AUTO_APPLY",
    description: "Block unauthenticated XML-RPC requests and throttle WordPress REST API endpoints to neutralize brute-force bot assaults.",
    estimatedGain: "Zero automated bot login attempts",
    applied: true
  }
];

// Aliases for unified importing
export const mockBusinesses = sampleBusinessesList;
export const mockStrategy = initialStrategy;
export const mockDesignSystem = initialDesignSystem;
export const mockHostingConnectors = initialHostingConnectors;
export const mockIncidents = sampleIncidentLogs;

