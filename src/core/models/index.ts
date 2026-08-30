/**
 * AI Digital Factory - Unified Domain Model
 * Single Source of Truth for Enterprise SaaS, Multi-Tenancy, and WordPress Lifecycle
 */

export type TenantId = string;
export type UserId = string;
export type BusinessId = string;
export type WebsiteId = string;
export type WorkflowId = string;
export type TaskId = string;
export type AgentId = string;

export type ProviderMode = 'PRODUCTION' | 'DEVELOPMENT_MOCK' | 'UNAVAILABLE';
export type TelemetryStatus = 'REAL' | 'SIMULATED' | 'UNAVAILABLE' | 'ERROR';
export type EnvironmentType = 'development' | 'staging' | 'production';

export enum RepairPolicyLevel {
  LEVEL_0_READ_ONLY = 0,
  LEVEL_1_SAFE_DIAGNOSTICS = 1,
  LEVEL_2_REVERSIBLE_CHANGE = 2,
  LEVEL_3_HIGH_RISK_APPROVAL = 3
}

export enum SiteLifecycleState {
  PLANNED = 'PLANNED',
  PROVISIONING = 'PROVISIONING',
  GENERATING = 'GENERATING',
  DEPLOYING = 'DEPLOYING',
  ACTIVE = 'ACTIVE',
  DEGRADED = 'DEGRADED',
  INCIDENT = 'INCIDENT',
  RECOVERING = 'RECOVERING'
}

export interface Tenant {
  id: TenantId;
  name: string;
  slug: string;
  plan: 'Starter' | 'Agency' | 'Enterprise';
  maxSites: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: UserId;
  tenantId: TenantId;
  email: string;
  name: string;
  role: 'admin' | 'architect' | 'operator' | 'viewer';
  avatarUrl?: string;
  createdAt: string;
}

export interface Business {
  id: BusinessId;
  tenantId: TenantId;
  userId: UserId;
  name: string;
  type: string;
  industry: string;
  location: string;
  targetAudience: string;
  goals: string;
  personality: string;
  blueprintVersion?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerJourneyStep {
  stage: string;
  touchpoint: string;
  action: string;
}

export interface PageArchitecture {
  name: string;
  slug: string;
  purpose: string;
  keySections: string[];
}

export interface BusinessBlueprint {
  id: string;
  businessId: BusinessId;
  version: number;
  summary: string;
  valueProposition: string;
  targetAudiencePersona: {
    title: string;
    painPoints: string[];
    motivations: string[];
  };
  pages: PageArchitecture[];
  goal: 'lead_generation' | 'ecommerce' | 'booking' | 'saas_trial' | 'community';
  conversionStrategy: {
    primaryCTA: string;
    leadMagnet: string;
    trustSignals: string[];
  };
  seoStrategy: {
    focusType: string;
    primaryKeywords: string[];
    secondaryKeywords: string[];
    contentPillars: string[];
    schemaMarkup: string[];
  };
  customerJourney: CustomerJourneyStep[];
  generatedAt: string;
}

export interface DesignSystem {
  id: string;
  businessId: BusinessId;
  version: number;
  styleName: string;
  themeMode: 'dark' | 'light' | 'dual';
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceBorder: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
    fontMono: string;
    scale: {
      display: string;
      h1: string;
      h2: string;
      h3: string;
      body: string;
      small: string;
    };
  };
  spacing: {
    unit: string;
    sectionPadding: string;
    containerMaxWidth: string;
    cardRadius: string;
    buttonRadius: string;
  };
  components: string[];
  animation: {
    transitionDefault: string;
    hoverScale: string;
    glowAccent: string;
  };
  createdAt: string;
}

export interface Theme {
  id: string;
  businessId: BusinessId;
  themeName: string;
  themeSlug: string;
  activeVersion: string;
  createdAt: string;
}

export interface ThemeVersion {
  id: string;
  themeId: string;
  version: string;
  fileCount: number;
  files: Record<string, string>;
  zipBase64?: string;
  compiledByAgentId: string;
  createdAt: string;
}

export interface ContentPackage {
  id: string;
  businessId: BusinessId;
  pages: {
    title: string;
    slug: string;
    blocksHtml: string;
    seoTitle: string;
    seoDescription: string;
    schemaJsonLd: string;
  }[];
  wxrExportXml?: string;
  generatedAt: string;
}

export interface Website {
  id: WebsiteId;
  tenantId: TenantId;
  businessId: BusinessId;
  name: string;
  domain: string;
  environment: EnvironmentType;
  status: 'provisioning' | 'healthy' | 'warning' | 'critical' | 'maintenance';
  hostingType: 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';
  hostingAccountId?: string;
  wpVersion: string;
  phpVersion: string;
  themeSlug: string;
  activeThemeVersion?: string;
  uptimePercent: number;
  responseTimeMs: number;
  coreVitalsScore: number;
  sslExpiryDays: number;
  pluginsCount: number;
  telemetryMode: TelemetryStatus;
  lastBackupAt: string;
  lastAuditAt: string;
  createdAt: string;
}

export interface HostingAccount {
  id: string;
  tenantId: TenantId;
  name: string;
  type: 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';
  host: string;
  providerMode: ProviderMode;
  status: 'connected' | 'testing' | 'error' | 'unreachable';
  lastPingMs: number;
  serverInfo: {
    php: string;
    mysql: string;
    webServer: string;
    memoryLimit: string;
  };
  vaultKeyId: string;
  maskedToken: string;
  createdAt: string;
}

export interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  duration?: string;
  log?: string;
  error?: string;
}

export interface Deployment {
  id: string;
  tenantId: TenantId;
  websiteId: WebsiteId;
  businessId: BusinessId;
  environment: EnvironmentType;
  providerMode: ProviderMode;
  targetEnv: 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';
  domain: string;
  themeVersionId: string;
  status: 'QUEUED' | 'DEPLOYING' | 'LIVE' | 'FAILED' | 'ROLLED_BACK';
  steps: DeploymentStep[];
  liveUrl?: string;
  totalDuration?: string;
  executedByUserId?: UserId;
  createdAt: string;
  completedAt?: string;
}

export interface WorkflowRun {
  id: WorkflowId;
  tenantId: TenantId;
  name: string;
  correlationId: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'RETRYING' | 'WAITING_APPROVAL' | 'ROLLED_BACK' | 'CANCELLED';
  currentStepIndex: number;
  totalSteps: number;
  steps: {
    id: string;
    agentId: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
    durationMs?: number;
    error?: string;
  }[];
  startedAt: string;
  completedAt?: string;
}

export interface Task {
  id: TaskId;
  workflowId?: WorkflowId;
  agentId: AgentId;
  action: string;
  input: any;
  output?: any;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'ROLLED_BACK';
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  completedAt?: string;
}

export interface Incident {
  id: string;
  websiteId: WebsiteId;
  domain: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'HTTP_500' | 'FATAL_PHP' | 'WSOD' | 'SSL_EXPIRY' | 'CACHE_CORRUPTION' | 'RESOURCE_EXHAUSTION';
  rawErrorLog: string;
  rootCause?: string;
  remediationPlan?: any;
  snapshotId?: string;
  status: 'DETECTED' | 'DIAGNOSING' | 'REMEDIATING' | 'RESOLVED' | 'FAILED_ROLLED_BACK';
  detectedAt: string;
  resolvedAt?: string;
}

export interface HealthCheck {
  id: string;
  websiteId: WebsiteId;
  domain: string;
  providerMode: ProviderMode;
  telemetryStatus: TelemetryStatus;
  httpStatus: number;
  ttfbMs: number;
  dnsLookupMs: number;
  sslValid: boolean;
  sslExpiryDays: number;
  redisConnected: boolean;
  phpErrorsCount: number;
  checkedAt: string;
}

export interface SEOAudit {
  id: string;
  websiteId: WebsiteId;
  domain: string;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  passedChecksCount: number;
  warningsCount: number;
  criticalIssuesCount: number;
  mobileUsabilityScore: number;
  structuredDataScore: number;
  checks: {
    id: string;
    category: string;
    title: string;
    severity: 'passed' | 'warning' | 'critical';
    score: number;
    currentValue: string;
    recommendedValue: string;
    description: string;
    canAutoFix: boolean;
    fixedAt?: string;
  }[];
  keywords: {
    keyword: string;
    intent: string;
    currentRank: number;
    searchVolumeMonthly: number;
    difficultyScore: number;
  }[];
  auditedAt: string;
}

export interface OptimizationRun {
  id: string;
  websiteId: WebsiteId;
  overallScore: number;
  potentialUplift: string;
  optimizations: {
    id: string;
    category: 'SPEED_VITALS' | 'CONVERSION_CRO' | 'SEO_SCHEMA' | 'MOBILE_UX';
    title: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    effort: 'AUTO_APPLY' | 'REQUIRES_APPROVAL' | 'MANUAL';
    description: string;
    estimatedGain: string;
    status: 'pending' | 'applied' | 'dismissed';
  }[];
  runAt: string;
}

export interface Backup {
  id: string;
  websiteId: WebsiteId;
  domain: string;
  type: 'pre_update' | 'scheduled' | 'incident_safety' | 'manual';
  sizeMb: number;
  dbIncluded: boolean;
  filesIncluded: boolean;
  status: 'available' | 'restoring' | 'verified';
  commitMessage: string;
  createdAt: string;
}

export interface Snapshot {
  id: string;
  websiteId: WebsiteId;
  domain: string;
  incidentId?: string;
  dbDumpRef: string;
  pluginsFolderRef: string;
  createdAt: string;
}

export interface Credential {
  id: string;
  tenantId: TenantId;
  name: string;
  type: 'cpanel_api' | 'plesk_api' | 'ssh_key' | 'docker_socket' | 'gemini_key' | 'cloudflare_token';
  maskedValue: string;
  encryptedVaultRef: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  tenantId: TenantId;
  userId?: UserId;
  agentId?: AgentId;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}
