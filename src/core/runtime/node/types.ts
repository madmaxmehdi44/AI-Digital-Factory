/**
 * AI Digital Factory - Node.js Application Runtime Types
 * Defines project schemas, package managers, framework specifications, and build models.
 */

export type NodePackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun';

export type NodeFramework =
  | 'express'
  | 'nextjs'
  | 'fastify'
  | 'nestjs'
  | 'nuxt'
  | 'vite_ssr'
  | 'generic';

export type NodeDatabaseType =
  | 'postgresql'
  | 'mysql'
  | 'mariadb'
  | 'redis'
  | 'sqlite'
  | 'none';

export interface NodeProjectDetection {
  detected: boolean;
  runtimeId: 'runtime-node';
  version: string;
  framework: NodeFramework;
  packageManager: NodePackageManager;
  confidence: number;
  entrypoint?: string;
  buildCommand?: string;
  startCommand?: string;
  hasMigrations?: boolean;
  metadata: Record<string, any>;
}

export interface NodeProjectConfig {
  name: string;
  version: string;
  nodeVersion: string;
  packageManager: NodePackageManager;
  packageManagerVersion?: string;
  framework: NodeFramework;
  entrypoint: string;
  buildCommand?: string;
  startCommand: string;
  devCommand?: string;
  port: number;
  environmentVariables?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  database?: NodeDatabaseType;
  migrationCommand?: string;
  sourceFiles?: Record<string, string>;
}

export interface NodeBuildArtifact {
  id: string;
  runtimeId: 'runtime-node';
  version: string;
  checksum: string;
  framework: NodeFramework;
  nodeVersion: string;
  packageManager: NodePackageManager;
  entryFile: string;
  port: number;
  files: Record<string, string>;
  metadata: {
    framework: NodeFramework;
    nodeVersion: string;
    packageManager: NodePackageManager;
    dependencies: Record<string, string>;
    compiledAt: string;
    fileCount: number;
    database?: NodeDatabaseType;
  };
}

export interface NodeFrameworkAdapter {
  readonly name: string;
  readonly framework: NodeFramework;
  detect(packageJson: Record<string, any>, files?: string[]): { detected: boolean; confidence: number; metadata?: Record<string, any> };
  generateScaffold(blueprint: any, designTokens?: any, config?: Partial<NodeProjectConfig>): Record<string, string>;
  getBuildCommand(): string;
  getStartCommand(entrypoint?: string): string;
  getDefaultPort(): number;
  getHealthEndpoint(): string;
}
