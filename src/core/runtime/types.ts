/**
 * AI Digital Factory - Application Runtime Abstraction
 * Defines the generic, extensible contract for all application runtimes (WordPress, Node.js, Static, Python, etc.)
 */

export type RuntimeCapability =
  | 'WP_CLI'
  | 'REST_API'
  | 'THEME_COMPILATION'
  | 'PLUGIN_MANAGEMENT'
  | 'DATABASE_MIGRATION'
  | 'OBJECT_CACHE'
  | 'CRON_SCHEDULING'
  | 'SSL_MANAGEMENT'
  | 'HOT_RELOAD'
  | 'SERVERLESS_SSR'
  | 'STATIC_EXPORT';

export interface RuntimeDetection {
  detected: boolean;
  runtimeId: string;
  version?: string;
  framework?: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface EnvironmentValidation {
  valid: boolean;
  runtimeVersion: string;
  checks: Array<{
    name: string;
    passed: boolean;
    severity: 'critical' | 'warning' | 'info';
    message: string;
  }>;
  missingDependencies: string[];
  recommendations: string[];
}

export interface RuntimeConfig {
  siteId: string;
  domain: string;
  environment: 'development' | 'staging' | 'production';
  providerMode: 'LOCAL' | 'PRODUCTION' | 'DEVELOPMENT_MOCK';
  port?: number;
  adminUser?: string;
  adminPassword?: string;
  adminEmail?: string;
  themeSlug?: string;
  themeFiles?: Record<string, string>;
  plugins?: string[];
  databaseConfig?: {
    name: string;
    user: string;
    password?: string;
    host?: string;
    port?: number;
    prefix?: string;
  };
  options?: Record<string, any>;
}

export interface RuntimeOperationResult {
  success: boolean;
  operation: string;
  runtimeId: string;
  siteId: string;
  durationMs: number;
  logs: string[];
  data?: any;
  error?: string;
}

export interface BuildInput {
  siteId: string;
  themeSlug: string;
  designTokens?: any;
  templates?: Record<string, string>;
  assets?: Record<string, string | Uint8Array>;
  options?: Record<string, any>;
}

export interface BuildResult {
  success: boolean;
  artifactPath?: string;
  artifactSizeMb?: number;
  fileCount: number;
  compiledFiles: Record<string, string>;
  buildLogs: string[];
  durationMs: number;
  error?: string;
}

export interface Artifact {
  id: string;
  runtimeId: string;
  themeSlug: string;
  version: string;
  files: Record<string, string>;
  archiveBase64?: string;
  metadata?: Record<string, any>;
}

export interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  siteId: string;
  liveUrl: string;
  adminUrl: string;
  status: 'LIVE' | 'FAILED' | 'PROVISIONING';
  durationSeconds: number;
  telemetryStatus: 'REAL' | 'REAL_LOCAL' | 'SIMULATED';
  logs: string[];
  error?: string;
}

export interface HealthResult {
  healthy: boolean;
  httpStatus: number;
  responseTimeMs: number;
  phpVersion: string;
  runtimeVersion: string;
  dbConnected: boolean;
  themeActive: string;
  errorsCount: number;
  warningsCount: number;
  recentLogs: string[];
  lastChecked: string;
}

export interface LogResult {
  siteId: string;
  logs: Array<{
    timestamp: string;
    level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    source: 'PHP' | 'WP_CLI' | 'APACHE' | 'DATABASE' | 'RUNTIME';
    message: string;
  }>;
  totalLines: number;
}

/**
 * Generic Application Runtime Interface
 */
export interface ApplicationRuntime {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly capabilities: RuntimeCapability[];

  /** Detect if target project matches this runtime */
  detect(targetPathOrUrl: string): Promise<RuntimeDetection>;

  /** Validate runtime dependencies, memory, and database connectivity */
  validateEnvironment(target?: string): Promise<EnvironmentValidation>;

  /** Install and initialize runtime core */
  install(config: RuntimeConfig): Promise<RuntimeOperationResult>;

  /** Configure runtime properties (options, salts, caching, settings) */
  configure(config: RuntimeConfig): Promise<RuntimeOperationResult>;

  /** Compile/build theme or application bundle */
  build(input: BuildInput): Promise<BuildResult>;

  /** Deploy compiled artifact to infrastructure */
  deploy(artifact: Artifact, config: RuntimeConfig): Promise<DeploymentResult>;

  /** Run deep runtime health check */
  healthCheck(siteIdOrDomain: string): Promise<HealthResult>;

  /** Retrieve recent runtime logs */
  getLogs(siteIdOrDomain: string, lines?: number): Promise<LogResult>;

  /** Roll back to a previous snapshot or version */
  rollback(siteIdOrDomain: string, versionOrSnapshotId: string): Promise<RuntimeOperationResult>;
}
