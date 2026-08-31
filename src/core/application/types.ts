/**
 * AI Digital Factory - Application Blueprint Domain Models
 * Defines the software architecture specification synthesized by the Application Architect.
 * Explicitly separates "What software system to build" (Application Blueprint)
 * from "What business purpose it serves" (Business Blueprint).
 */

export type ApplicationType =
  | 'business_website'
  | 'ecommerce_store'
  | 'blog_editorial'
  | 'saas_platform'
  | 'web_application'
  | 'api_backend'
  | 'data_pipeline'
  | 'portfolio_landing';

export type ServiceType = 'web' | 'api' | 'worker' | 'database' | 'cache' | 'cron';

export interface ApplicationService {
  name: string;
  type: ServiceType;
  runtime: string;
  scaling?: 'single_instance' | 'horizontal' | 'serverless';
  description?: string;
}

export interface ApplicationArchitectureSpec {
  frontend: string; // e.g. 'wordpress-fse', 'nextjs', 'react-spa', 'html-static'
  backend: string;  // e.g. 'wordpress', 'express-node', 'fastapi-python', 'none'
  database: string; // e.g. 'mariadb', 'mysql', 'postgresql', 'sqlite', 'none'
  caching?: string; // e.g. 'redis', 'memcached', 'browser-cache'
  storage?: string; // e.g. 'local-fs', 's3-compatible'
}

export interface ApplicationRequirements {
  cms?: boolean;
  seo?: boolean;
  ecommerce?: boolean;
  booking?: boolean;
  themeCompilation?: boolean;
  authentication?: boolean;
  customApi?: boolean;
  backgroundJobs?: boolean;
  realtime?: boolean;
  ssl?: boolean;
  objectCache?: boolean;
  cronScheduling?: boolean;
}

export interface ApiRequirementsSpec {
  restApi?: boolean;
  graphql?: boolean;
  customEndpoints?: string[];
  publicAccess?: boolean;
}

export interface DeploymentRequirementsSpec {
  targetEnvironment: 'development' | 'staging' | 'production';
  preferredHosting?: 'docker' | 'local_docker' | 'cpanel' | 'plesk' | 'ssh' | 'cloudrun';
  minPhpVersion?: string;
  minNodeVersion?: string;
  minPythonVersion?: string;
  memoryMb?: number;
  diskMb?: number;
  sslRequired?: boolean;
}

export interface SecurityRequirementsSpec {
  isolationLevel: 'container' | 'process' | 'vhost';
  waf?: boolean;
  fileEditDisabled?: boolean;
  authPolicy?: string;
  disallowUnfilteredHtml?: boolean;
}

export interface ScalingRequirementsSpec {
  trafficTier: 'low' | 'medium' | 'high' | 'enterprise';
  cachingStrategy: 'page_cache' | 'object_cache' | 'edge_cdn';
  targetResponseTimeMs?: number;
}

export interface ApplicationBlueprint {
  applicationId: string;
  applicationType: ApplicationType;
  name: string;
  description: string;
  runtime: {
    id: string; // e.g. 'runtime-wordpress'
    type: string; // e.g. 'wordpress'
    reason: string;
    version?: string;
  };
  architecture: ApplicationArchitectureSpec;
  services: ApplicationService[];
  requirements: ApplicationRequirements;
  apiRequirements: ApiRequirementsSpec;
  deploymentRequirements: DeploymentRequirementsSpec;
  securityRequirements: SecurityRequirementsSpec;
  scalingRequirements: ScalingRequirementsSpec;
  generatedAt: string;
}
