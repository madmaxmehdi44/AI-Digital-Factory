/**
 * AI Digital Factory - Runtime Selection Engine
 * Evaluates Application Blueprints and deterministically negotiates and selects
 * the appropriate ApplicationRuntime from the authoritative RuntimeRegistry.
 * Enforces strict capability validation with ZERO silent fallbacks.
 */

import { ApplicationBlueprint } from '../application/types';
import { RuntimeCapability, ApplicationRuntime } from './types';
import { runtimeRegistry } from './RuntimeRegistry';

export interface RuntimeSelection {
  runtimeId: string;
  runtimeType: string;
  reason: string;
  confidence: number;
  requiredCapabilities: RuntimeCapability[];
  matchedCapabilities: RuntimeCapability[];
  missingCapabilities: string[];
  compatible: boolean;
}

export class RuntimeResolutionError extends Error {
  public readonly code = 'RUNTIME_RESOLUTION_ERROR';

  constructor(message: string, public readonly details?: Record<string, any>) {
    super(message);
    this.name = 'RuntimeResolutionError';
  }
}

export class RuntimeSelector {
  /**
   * Deterministically evaluates required capabilities against registered runtimes.
   */
  public selectRuntime(blueprint: ApplicationBlueprint): RuntimeSelection {
    const requiredCapabilities = this.determineRequiredCapabilities(blueprint);
    const targetRuntimeId = blueprint.runtime?.id || 'runtime-wordpress';
    const targetRuntimeType = blueprint.runtime?.type || 'wordpress';

    // 1. Authoritative check in RuntimeRegistry
    if (!runtimeRegistry.hasRuntime(targetRuntimeId) && !runtimeRegistry.hasRuntime(targetRuntimeType)) {
      return {
        runtimeId: targetRuntimeId,
        runtimeType: targetRuntimeType,
        reason: `Requested runtime '${targetRuntimeId}' is not registered in RuntimeRegistry.`,
        confidence: 0,
        requiredCapabilities,
        matchedCapabilities: [],
        missingCapabilities: requiredCapabilities.map(String),
        compatible: false
      };
    }

    // 2. Fetch runtime instance
    const runtime = runtimeRegistry.getRuntime(targetRuntimeId);

    // 3. Negotiate capabilities
    const runtimeCaps = new Set<RuntimeCapability>(runtime.capabilities);
    const matchedCapabilities: RuntimeCapability[] = [];
    const missingCapabilities: string[] = [];

    for (const reqCap of requiredCapabilities) {
      if (runtimeCaps.has(reqCap)) {
        matchedCapabilities.push(reqCap);
      } else {
        missingCapabilities.push(reqCap);
      }
    }

    const isCompatible = missingCapabilities.length === 0;
    const confidence = isCompatible
      ? (blueprint.applicationType === 'business_website' || blueprint.applicationType === 'ecommerce_store' || blueprint.applicationType === 'blog_editorial' ? 0.98 : 0.85)
      : 0;

    return {
      runtimeId: runtime.id,
      runtimeType: runtime.type,
      reason: isCompatible
        ? `${runtime.name} fulfills all ${requiredCapabilities.length} required capabilities (${matchedCapabilities.join(', ')}). ${blueprint.runtime.reason}`
        : `Runtime '${runtime.name}' lacks required capabilities: ${missingCapabilities.join(', ')}`,
      confidence,
      requiredCapabilities,
      matchedCapabilities,
      missingCapabilities,
      compatible: isCompatible
    };
  }

  /**
   * Resolves and validates the runtime, throwing RuntimeResolutionError if incompatible or missing.
   */
  public resolveAndValidate(blueprint: ApplicationBlueprint): { runtime: ApplicationRuntime; selection: RuntimeSelection } {
    const selection = this.selectRuntime(blueprint);

    if (!selection.compatible) {
      throw new RuntimeResolutionError(
        `Failed to resolve compatible runtime for Application '${blueprint.name}': ${selection.reason}`,
        {
          applicationId: blueprint.applicationId,
          runtimeId: selection.runtimeId,
          missingCapabilities: selection.missingCapabilities
        }
      );
    }

    const runtime = runtimeRegistry.getRuntime(selection.runtimeId);
    return { runtime, selection };
  }

  /**
   * Maps blueprint requirements to formal RuntimeCapability flags.
   */
  private determineRequiredCapabilities(blueprint: ApplicationBlueprint): RuntimeCapability[] {
    const caps: RuntimeCapability[] = [];

    if (blueprint.requirements.cms || blueprint.requirements.themeCompilation) {
      caps.push('WP_CLI');
      caps.push('THEME_COMPILATION');
    }

    if (blueprint.requirements.customApi || blueprint.apiRequirements?.restApi) {
      caps.push('REST_API');
    }

    if (blueprint.architecture.database && blueprint.architecture.database !== 'none') {
      caps.push('DATABASE_MIGRATION');
    }

    if (blueprint.requirements.objectCache || blueprint.architecture.caching === 'redis') {
      caps.push('OBJECT_CACHE');
    }

    if (blueprint.requirements.ssl || blueprint.deploymentRequirements.sslRequired) {
      caps.push('SSL_MANAGEMENT');
    }

    if (blueprint.requirements.cronScheduling) {
      caps.push('CRON_SCHEDULING');
    }

    // De-duplicate
    return Array.from(new Set(caps));
  }
}

export const runtimeSelector = new RuntimeSelector();
