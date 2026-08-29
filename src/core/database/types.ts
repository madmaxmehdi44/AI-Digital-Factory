export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'architect' | 'operator' | 'viewer';
  plan: 'Starter' | 'Agency' | 'Enterprise';
  createdAt: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  name: string;
  type: string;
  industry: string;
  location: string;
  targetAudience: string;
  goals: string;
  brandStyle: string;
  blueprint?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Website {
  id: string;
  businessId: string;
  name: string;
  domain: string;
  status: 'provisioning' | 'healthy' | 'warning' | 'critical' | 'maintenance';
  hostingType: 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';
  wpVersion: string;
  phpVersion: string;
  themeSlug: string;
  uptimePercent: number;
  responseTimeMs: number;
  coreVitalsScore: number;
  sslExpiryDays: number;
  pluginsCount: number;
  lastBackupAt: string;
  lastAuditAt: string;
  createdAt: string;
}

export interface WordPressThemeRecord {
  id: string;
  websiteId?: string;
  businessId: string;
  themeName: string;
  themeSlug: string;
  version: string;
  fileCount: number;
  files: Record<string, string>;
  zipBase64?: string;
  createdAt: string;
}

export interface DeploymentRecord {
  id: string;
  jobId?: string;
  websiteId?: string;
  businessId: string;
  businessName: string;
  targetEnv: 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';
  domain: string;
  databaseName: string;
  themeSlug: string;
  status: 'QUEUED' | 'DEPLOYING' | 'LIVE' | 'FAILED' | 'ROLLED_BACK';
  totalDuration?: string;
  liveUrl?: string;
  steps: {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    duration?: string;
    log?: string;
  }[];
  createdAt: string;
}

export interface HostingAccount {
  id: string;
  name: string;
  type: 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';
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
  createdAt: string;
}

export interface OperationsLog {
  id: string;
  websiteId?: string;
  domain: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'RECOVERY';
  category: 'HOSTING' | 'WORDPRESS_CORE' | 'PLUGIN' | 'SECURITY' | 'SEO' | 'PERFORMANCE';
  message: string;
  details?: any;
  timestamp: string;
}

export interface AITask {
  id: string;
  jobId?: string;
  type: 'BUSINESS_ANALYSIS' | 'DESIGN_GENERATION' | 'THEME_COMPILATION' | 'WP_DEPLOYMENT' | 'SEO_AUDIT' | 'SELF_HEALING' | 'OPTIMIZATION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  input: any;
  output?: any;
  error?: string;
  executionMs: number;
  createdAt: string;
  completedAt?: string;
}

export interface HealthCheckRecord {
  id: string;
  websiteId: string;
  domain: string;
  httpStatus: number;
  ttfbMs: number;
  dnsLookupMs: number;
  sslValid: boolean;
  redisConnected: boolean;
  phpErrorsCount: number;
  checkedAt: string;
}

export interface BackupRecord {
  id: string;
  websiteId: string;
  domain: string;
  sizeMb: number;
  type: 'pre_update' | 'scheduled' | 'incident_safety' | 'manual';
  dbIncluded: boolean;
  filesIncluded: boolean;
  status: 'available' | 'restoring' | 'verified';
  commitMessage: string;
  createdAt: string;
}
