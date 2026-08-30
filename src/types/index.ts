export type PlanTier = 'Starter' | 'Agency' | 'Enterprise';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: PlanTier;
  role?: "admin" | "member" | "viewer";
  totalSitesQuota?: number;
}

export interface BusinessInput {
  id: string;
  name: string;
  type: string;
  industry: string;
  location: string;
  targetAudience: string;
  goals: string;
  personality: string;
  stylePreference?: string;
  createdAt: string;
}

export interface PageArchitecture {
  name: string;
  slug: string;
  purpose: string;
  keySections: string[];
}

export interface CustomerJourneyStep {
  stage: string;
  touchpoint: string;
  action: string;
}

export interface BusinessStrategy {
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
}

export interface DesignSystemColors {
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
}

export interface DesignSystemTypography {
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
}

export interface DesignSystem {
  styleName: string;
  themeMode: 'dark' | 'light' | 'dual';
  colors: DesignSystemColors;
  typography: DesignSystemTypography;
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
}

export interface WordPressTheme {
  themeName: string;
  themeSlug: string;
  version: string;
  fileCount: number;
  files: Record<string, string>;
  createdAt: string;
}

export type HostingType = 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';

export interface HostingConnector {
  id: string;
  name: string;
  type: HostingType;
  host: string;
  status: 'connected' | 'testing' | 'error';
  lastPingMs: number;
  serverInfo: {
    php: string;
    mysql: string;
    webServer: string;
    memoryLimit: string;
  };
  vaultKeyId: string;
  maskedToken: string;
}

export interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  duration?: string;
  log?: string;
}

export interface DeploymentRecord {
  id: string;
  businessId: string;
  businessName: string;
  targetEnv: HostingType;
  domain: string;
  databaseName: string;
  themeSlug: string;
  status: 'QUEUED' | 'DEPLOYING' | 'LIVE' | 'FAILED' | 'ROLLED_BACK';
  totalDuration?: string;
  liveUrl?: string;
  steps: DeploymentStep[];
  createdAt: string;
}

export interface FleetSite {
  id: string;
  name: string;
  domain: string;
  status: 'healthy' | 'warning' | 'critical';
  wpVersion: string;
  phpVersion: string;
  uptimePercent: number;
  responseTimeMs: number;
  pluginsCount: number;
  updatesAvailable: number;
  lastBackup: string;
  sslExpiryDays: number;
  coreVitalsScore: number;
  hostingType: HostingType;
  autoUpdateEnabled: boolean;
}

export interface IncidentRecord {
  id: string;
  siteDomain: string;
  timestamp: string;
  problemTitle: string;
  rootCauseAnalysis: string;
  affectedComponent: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'INVESTIGATING' | 'SNAPSHOT_TAKEN' | 'REMEDIATING' | 'RESOLVED' | 'ROLLED_BACK';
  safetyTransaction: {
    snapshotId: string;
    backupScope: string;
  };
  autonomousRemediationSteps: {
    step: number;
    action: string;
    detail: string;
    completed?: boolean;
  }[];
  preventionRecommendation: string;
  rollbackScript: string;
}

export interface BackupSnapshot {
  id: string;
  siteDomain: string;
  timestamp: string;
  sizeMb: number;
  type: 'pre_update' | 'scheduled' | 'incident_safety' | 'manual';
  dbIncluded: boolean;
  filesIncluded: boolean;
  status: 'available' | 'restoring' | 'verified';
  commitMessage: string;
}

export interface OptimizationItem {
  id: string;
  category: 'SPEED_VITALS' | 'CONVERSION_CRO' | 'SEO_SCHEMA' | 'SECURITY';
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'AUTO_APPLY' | 'REQUIRES_RESTART';
  description: string;
  estimatedGain: string;
  applied?: boolean;
}

export type ActiveTab =
  | 'factory_wizard'
  | 'business_ai'
  | 'design_system'
  | 'theme_compiler'
  | 'deployment'
  | 'operations_fleet'
  | 'troubleshooting'
  | 'backup_vault'
  | 'optimization'
  | 'voice_studio'
  | 'developer_tools';

export type ApiHealthStatus = 'operational' | 'degraded' | 'down' | 'maintenance';

export interface ExternalApiHealth {
  id: string;
  name: string;
  shortName: string;
  category: 'CMS Core' | 'Hosting' | 'AI Engine' | 'Security' | 'CDN' | 'Database';
  endpoint: string;
  status: ApiHealthStatus;
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
  description: string;
  region?: string;
  version?: string;
}

export interface SystemHealthReport {
  overallStatus: 'all_systems_operational' | 'degraded_performance' | 'partial_outage' | 'maintenance';
  overallStatusLabel: string;
  lastUpdated: string;
  totalServices: number;
  operationalCount: number;
  averageLatencyMs: number;
  services: ExternalApiHealth[];
}

export type SeoCheckSeverity = 'critical' | 'warning' | 'passed' | 'info';

export interface SeoCheckItem {
  id: string;
  category: 'Technical' | 'On-Page' | 'Schema & Rich Snippets' | 'Speed & Vitals' | 'Indexability';
  title: string;
  severity: SeoCheckSeverity;
  score: number; // 0 - 100
  currentValue: string;
  recommendedValue: string;
  description: string;
  canAutoFix: boolean;
  fixed?: boolean;
}

export interface SeoKeywordMetric {
  keyword: string;
  intent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational';
  currentRank: number | string;
  searchVolumeMonthly: number;
  difficultyScore: number; // 0-100
  relevanceScore: number; // 0-100
  estimatedCtr: string;
}

export interface SeoSchemaItem {
  type: string;
  status: 'valid' | 'warning' | 'missing';
  description: string;
  codeSnippet: string;
}

export interface SeoAuditResult {
  siteDomain: string;
  siteTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  auditTimestamp: string;
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  passedChecksCount: number;
  warningsCount: number;
  criticalIssuesCount: number;
  googleIndexStatus: 'Indexed & Valid' | 'Crawl Anomaly' | 'Discovered - Not Indexed';
  mobileUsabilityScore: number;
  structuredDataScore: number;
  organicKeywordCount: number;
  estimatedOrganicTraffic: string;
  checks: SeoCheckItem[];
  keywords: SeoKeywordMetric[];
  schemas: SeoSchemaItem[];
  serpPreview: {
    title: string;
    url: string;
    description: string;
    richSnippetRating?: string;
    richSnippetReviews?: number;
    sitelinks?: string[];
  };
  aiOverviewReady: boolean;
  aiSearchCitationSignals: string[];
}

