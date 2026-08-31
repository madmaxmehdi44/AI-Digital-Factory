/**
 * AI Digital Factory - Infrastructure Provider Interface
 * Defines the unified contract for all infrastructure backends (Local Docker, cPanel, Plesk, SSH, Cloud Run)
 */

import { ProviderMode, TelemetryStatus } from '../models';

export type InfrastructureType = 'docker' | 'local_docker' | 'cpanel' | 'plesk' | 'ssh' | 'cloudrun';
export type EnvironmentTier = 'development' | 'staging' | 'production';

export interface ProviderConnectionResult {
  success: boolean;
  latencyMs: number;
  message: string;
  providerMode: ProviderMode | 'LOCAL';
  telemetryStatus: TelemetryStatus | 'REAL_LOCAL';
  isMock: boolean;
  serverInfo?: {
    phpVersion: string;
    mysqlVersion: string;
    webServer: string;
    memoryLimit: string;
    extensions: string[];
    redisAvailable: boolean;
    sslReady: boolean;
  };
}

export interface ProviderEnvironmentCheck {
  passed: boolean;
  providerMode: ProviderMode | 'LOCAL';
  isMock: boolean;
  checks: Array<{
    name: string;
    status: 'pass' | 'warn' | 'fail';
    detail: string;
  }>;
}

export interface ProviderDatabaseResult {
  success: boolean;
  databaseName: string;
  databaseUser: string;
  host: string;
  port: number;
  message: string;
  providerMode: ProviderMode | 'LOCAL';
  isMock: boolean;
  error?: string;
}

export interface ProviderUploadResult {
  success: boolean;
  uploadedFilesCount: number;
  targetDirectory: string;
  message: string;
  providerMode: ProviderMode | 'LOCAL';
  isMock: boolean;
}

export interface ProviderDeploymentConfig {
  domain: string;
  businessName: string;
  themeSlug: string;
  databaseName?: string;
  adminEmail: string;
  adminUser: string;
  adminPassword?: string;
  wpVersion?: string;
  phpVersion?: string;
  themeFiles?: Record<string, string>;
  plugins?: string[];
  environment?: EnvironmentTier;
}

export interface ProviderDeploymentResult {
  success: boolean;
  deploymentId: string;
  liveUrl: string;
  adminUrl: string;
  status: 'LIVE' | 'FAILED';
  durationSeconds: number;
  providerMode: ProviderMode | 'LOCAL';
  telemetryStatus: TelemetryStatus | 'REAL_LOCAL';
  isMock: boolean;
  pipelineLogs: string[];
  error?: string;
}

export interface ProviderSSLResult {
  success: boolean;
  domain: string;
  issuer: string;
  expiresInDays: number;
  message: string;
  providerMode: ProviderMode | 'LOCAL';
  isMock: boolean;
}

export interface ProviderSnapshotResult {
  success: boolean;
  snapshotId: string;
  domain: string;
  timestamp: string;
  databaseDumpRef: string;
  filesRef: string;
  sizeMb: number;
}

export interface ProviderCommandResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  success: boolean;
}

/**
 * Unified Infrastructure Provider Interface
 */
export interface InfrastructureProvider {
  readonly id: string;
  readonly name: string;
  readonly type: InfrastructureType;
  readonly environment: EnvironmentTier;
  readonly providerMode: ProviderMode | 'LOCAL';
  readonly isMock: boolean;

  /** Establish or test connection to the host/daemon */
  connect(): Promise<ProviderConnectionResult>;

  /** Test connectivity ping */
  testConnection(): Promise<boolean>;

  /** Run environment capability diagnostics */
  checkEnvironment(): Promise<ProviderEnvironmentCheck>;

  /** Check resource limits and allocated disk/memory */
  checkResources(): Promise<{ memoryMb: number; diskMb: number; cpuUsagePercent?: number }>;

  /** Create an isolated database on host */
  createDatabase(dbName: string, user?: string, password?: string): Promise<ProviderDatabaseResult>;

  /** Drop a database */
  dropDatabase(dbName: string): Promise<ProviderDatabaseResult>;

  /** Upload files or extract archive to target webroot */
  uploadFiles(targetPath: string, files: Record<string, string | Uint8Array>): Promise<ProviderUploadResult>;

  /** Configure custom host routing or local test domains */
  configureDomain(domain: string): Promise<boolean>;

  /** Install or provision SSL / TLS certificates */
  installSSL(domain: string): Promise<ProviderSSLResult>;

  /** Execute full deployment */
  deploy(config: ProviderDeploymentConfig): Promise<ProviderDeploymentResult>;

  /** Destroy/uninstall provisioned site */
  destroy(siteIdOrDomain: string): Promise<boolean>;

  /** Create atomic snapshot of database and files */
  snapshot(siteIdOrDomain: string, reason?: string): Promise<ProviderSnapshotResult>;

  /** Restore a snapshot */
  restoreSnapshot(siteIdOrDomain: string, snapshotId: string): Promise<boolean>;

  /** Execute a managed WP-CLI command */
  executeWpCli?(siteIdOrDomain: string, command: string, args?: string[]): Promise<ProviderCommandResult>;
}
