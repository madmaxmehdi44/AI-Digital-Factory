/**
 * AI Digital Factory - Application Architect
 * Analyzes Business Blueprint specifications and determines the required software system,
 * producing a machine-readable Application Blueprint.
 * Decouples business intent from technical software architecture.
 */

import { BusinessBlueprint } from '../../modules/business-agent';
import { BusinessInput } from '../../types';
import { ApplicationBlueprint, ApplicationType } from './types';

export class ApplicationArchitect {
  /**
   * Synthesizes a formal ApplicationBlueprint from a BusinessBlueprint and BusinessInput.
   */
  public synthesize(
    businessBlueprint: BusinessBlueprint,
    input: BusinessInput,
    preferredHosting: 'docker' | 'local_docker' | 'cpanel' | 'plesk' | 'ssh' | 'cloudrun' = 'docker',
    environment: 'development' | 'staging' | 'production' = 'development'
  ): ApplicationBlueprint {
    const isEcommerce = businessBlueprint.goal === 'ecommerce' || (input.industry && /ecommerce|shop|retail|store/i.test(input.industry));
    const isBooking = businessBlueprint.goal === 'booking' || (input.industry && /dental|clinic|salon|consult|advisory|law|realty/i.test(input.industry));
    const isSaaS = businessBlueprint.goal === 'saas_trial';

    let appType: ApplicationType = 'business_website';
    if (isEcommerce) appType = 'ecommerce_store';
    else if (isBooking) appType = 'business_website';
    else if (isSaaS) appType = 'business_website'; // Marketing & acquisition site for SaaS
    else if (/blog|news|media|magazine|publishing/i.test(input.industry || '')) appType = 'blog_editorial';

    return {
      applicationId: `app_${input.id || Date.now()}`,
      applicationType: appType,
      name: `${input.name} Digital Application`,
      description: `Production software system for ${input.name} (${input.industry}). Engineered for sub-50ms TTFB, 100/100 Core Web Vitals, and autonomous self-healing.`,
      runtime: {
        id: 'runtime-wordpress',
        type: 'wordpress',
        reason: 'Business requires content-driven marketing website, Gutenberg Full Site Editing (FSE) block theme, SEO injection, and zero-downtime CMS operations.',
        version: '6.7.1'
      },
      architecture: {
        frontend: 'wordpress-fse',
        backend: 'wordpress',
        database: 'mariadb',
        caching: 'redis',
        storage: 'local-fs'
      },
      services: [
        {
          name: 'web-server',
          type: 'web',
          runtime: 'wordpress-php-8.3',
          scaling: 'single_instance',
          description: 'Nginx + PHP-FPM 8.3 WordPress Application Server'
        },
        {
          name: 'relational-db',
          type: 'database',
          runtime: 'mariadb-11.4',
          scaling: 'single_instance',
          description: 'MariaDB 11.4 transactional relational database'
        },
        {
          name: 'object-cache',
          type: 'cache',
          runtime: 'redis-7.2',
          scaling: 'single_instance',
          description: 'In-memory Redis object cache for sub-20ms database queries'
        }
      ],
      requirements: {
        cms: true,
        seo: true,
        ecommerce: isEcommerce,
        booking: isBooking,
        themeCompilation: true,
        authentication: true,
        customApi: true,
        backgroundJobs: true,
        realtime: false,
        ssl: true,
        objectCache: true,
        cronScheduling: true
      },
      apiRequirements: {
        restApi: true,
        graphql: false,
        customEndpoints: ['/wp-json/factory/v1/health', '/wp-json/factory/v1/telemetry'],
        publicAccess: true
      },
      deploymentRequirements: {
        targetEnvironment: environment,
        preferredHosting,
        minPhpVersion: '8.2.0',
        memoryMb: 512,
        diskMb: 1024,
        sslRequired: true
      },
      securityRequirements: {
        isolationLevel: 'container',
        waf: true,
        fileEditDisabled: true,
        authPolicy: 'application_passwords_and_cookies',
        disallowUnfilteredHtml: true
      },
      scalingRequirements: {
        trafficTier: 'medium',
        cachingStrategy: 'object_cache',
        targetResponseTimeMs: 40
      },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Synthesizes a custom or future ApplicationBlueprint for explicit runtime testing (e.g. Node.js, Python)
   */
  public synthesizeCustom(spec: Partial<ApplicationBlueprint> & { applicationType: ApplicationType; name: string }): ApplicationBlueprint {
    const isNode = spec.runtime?.type === 'nodejs';
    const isPython = spec.runtime?.type === 'python';

    return {
      applicationId: spec.applicationId || `app_custom_${Date.now()}`,
      applicationType: spec.applicationType,
      name: spec.name,
      description: spec.description || `Custom Application Specification for ${spec.name}`,
      runtime: spec.runtime || {
        id: isNode ? 'runtime-nodejs' : isPython ? 'runtime-python' : 'runtime-wordpress',
        type: isNode ? 'nodejs' : isPython ? 'python' : 'wordpress',
        reason: spec.runtime?.reason || 'Custom software architecture requirement'
      },
      architecture: spec.architecture || {
        frontend: isNode ? 'nextjs' : isPython ? 'fastapi-ui' : 'wordpress-fse',
        backend: isNode ? 'express-node' : isPython ? 'fastapi-python' : 'wordpress',
        database: isNode ? 'postgresql' : isPython ? 'postgresql' : 'mariadb',
        caching: 'redis',
        storage: 's3-compatible'
      },
      services: spec.services || [
        { name: 'app-service', type: 'web', runtime: spec.runtime?.type || 'nodejs', scaling: 'single_instance' }
      ],
      requirements: spec.requirements || {
        cms: !isNode && !isPython,
        seo: true,
        themeCompilation: !isNode && !isPython,
        authentication: true,
        ssl: true
      },
      apiRequirements: spec.apiRequirements || {
        restApi: true,
        graphql: false,
        publicAccess: true
      },
      deploymentRequirements: spec.deploymentRequirements || {
        targetEnvironment: 'development',
        preferredHosting: 'docker',
        memoryMb: 512,
        sslRequired: true
      },
      securityRequirements: spec.securityRequirements || {
        isolationLevel: 'container',
        waf: true,
        fileEditDisabled: true
      },
      scalingRequirements: spec.scalingRequirements || {
        trafficTier: 'medium',
        cachingStrategy: 'page_cache',
        targetResponseTimeMs: 50
      },
      generatedAt: new Date().toISOString()
    };
  }
}

export const applicationArchitect = new ApplicationArchitect();
