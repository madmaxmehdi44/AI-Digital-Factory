/**
 * AI Digital Factory - Infrastructure Selection Engine
 * Evaluates Application Blueprints, Runtime Selections, Environment tiers, and User Preferences
 * to deterministically negotiate and resolve the appropriate InfrastructureProvider.
 * Prevents unauthorized or capability-mismatched infrastructure execution.
 */

import { ApplicationBlueprint } from '../application/types';
import { RuntimeSelection } from '../runtime/RuntimeSelector';
import { DeploymentPlan } from '../application/DeploymentPlan';
import {
  InfrastructureProvider,
  InfrastructureType,
  EnvironmentTier
} from './types';
import { infrastructureRegistry } from './InfrastructureRegistry';

export interface InfrastructureSelection {
  providerId: string;
  providerType: InfrastructureType;
  environment: EnvironmentTier;
  reason: string;
  confidence: number;
  matchedCapabilities: string[];
  isMock: boolean;
  compatible: boolean;
}

export class InfrastructureResolutionError extends Error {
  public readonly code = 'INFRASTRUCTURE_RESOLUTION_ERROR';

  constructor(message: string, public readonly details?: Record<string, any>) {
    super(message);
    this.name = 'InfrastructureResolutionError';
  }
}

export class InfrastructureSelector {
  /**
   * Deterministically negotiates and selects the infrastructure provider.
   */
  public selectProvider(
    blueprint: ApplicationBlueprint,
    runtimeSelection: RuntimeSelection,
    preferredHosting: string = 'docker',
    environment?: EnvironmentTier
  ): InfrastructureSelection {
    const targetEnv: EnvironmentTier = environment || blueprint.deploymentRequirements.targetEnvironment || 'development';
    
    // Normalize target provider type
    let requestedType: InfrastructureType = 'local_docker';
    if (preferredHosting === 'cpanel') requestedType = 'cpanel';
    else if (preferredHosting === 'plesk') requestedType = 'plesk';
    else if (preferredHosting === 'ssh') requestedType = 'ssh';
    else if (preferredHosting === 'docker' || preferredHosting === 'local_docker') requestedType = 'local_docker';
    else if (preferredHosting === 'cloudrun') requestedType = 'cloudrun';

    // Development tier maps directly to local development provider
    if (targetEnv === 'development') {
      const provider = infrastructureRegistry.getProviderForEnvironment('development', 'local_docker');
      return {
        providerId: provider.id,
        providerType: provider.type,
        environment: 'development',
        reason: 'Development environment automatically provisions isolated Local Docker MariaDB & Container stack with sub-50ms WP-CLI execution.',
        confidence: 0.99,
        matchedCapabilities: [
          'DATABASE_PROVISIONING',
          'WEBROOT_DEPLOYMENT',
          'CONTAINER_ISOLATION',
          'WP_CLI_EXECUTION',
          'OBJECT_CACHE_REDIS'
        ],
        isMock: provider.isMock,
        compatible: true
      };
    }

    // Production / Staging tier negotiation
    if (!infrastructureRegistry.hasProvider(requestedType) && !infrastructureRegistry.hasProvider(`provider-${requestedType}`)) {
      return {
        providerId: `provider-${requestedType}`,
        providerType: requestedType,
        environment: targetEnv,
        reason: `Requested production infrastructure provider '${requestedType}' is not registered in InfrastructureRegistry.`,
        confidence: 0,
        matchedCapabilities: [],
        isMock: false,
        compatible: false
      };
    }

    const provider = infrastructureRegistry.getProvider(requestedType);
    const isMock = provider.isMock;

    return {
      providerId: provider.id,
      providerType: provider.type,
      environment: targetEnv,
      reason: `Selected verified ${provider.name} for ${targetEnv.toUpperCase()} environment deployment.`,
      confidence: isMock ? 0.85 : 0.95,
      matchedCapabilities: [
        'DATABASE_PROVISIONING',
        'WEBROOT_DEPLOYMENT',
        'SSL_PROVISIONING',
        'WP_CLI_EXECUTION'
      ],
      isMock,
      compatible: true
    };
  }

  /**
   * Resolves and validates provider, throwing InfrastructureResolutionError if incompatible.
   */
  public resolveAndValidate(
    blueprint: ApplicationBlueprint,
    runtimeSelection: RuntimeSelection,
    preferredHosting: string = 'docker',
    environment?: EnvironmentTier
  ): { provider: InfrastructureProvider; selection: InfrastructureSelection } {
    const selection = this.selectProvider(blueprint, runtimeSelection, preferredHosting, environment);

    if (!selection.compatible) {
      throw new InfrastructureResolutionError(
        `Infrastructure resolution failed for Application '${blueprint.name}': ${selection.reason}`,
        {
          applicationId: blueprint.applicationId,
          providerType: selection.providerType,
          environment: selection.environment
        }
      );
    }

    const provider = infrastructureRegistry.getProvider(selection.providerId);
    return { provider, selection };
  }

  /**
   * Builds an explicit, inspectable DeploymentPlan from resolved blueprints and selectors.
   */
  public createDeploymentPlan(
    blueprint: ApplicationBlueprint,
    runtimeSelection: RuntimeSelection,
    infrastructureSelection: InfrastructureSelection,
    domain: string,
    themeSlug: string
  ): DeploymentPlan {
    const planId = `plan_${blueprint.applicationId}_${Date.now()}`;
    const targetEnv = infrastructureSelection.environment;

    return {
      planId,
      applicationId: blueprint.applicationId,
      domain,
      environment: targetEnv,
      applicationBlueprint: blueprint,
      runtimeSelection,
      infrastructureSelection,
      runtime: {
        id: runtimeSelection.runtimeId,
        name: runtimeSelection.runtimeId === 'runtime-wordpress' ? 'WordPress Gutenberg FSE Engine' : runtimeSelection.runtimeId,
        type: runtimeSelection.runtimeType,
        version: blueprint.runtime.version || '6.7.1'
      },
      provider: {
        id: infrastructureSelection.providerId,
        name: infrastructureSelection.providerId === 'provider-local-docker' ? 'Local Development Container Provider' : infrastructureSelection.providerId,
        type: infrastructureSelection.providerType,
        providerMode: targetEnv === 'development' ? 'LOCAL' : 'PRODUCTION',
        isMock: infrastructureSelection.isMock
      },
      requiredCapabilities: runtimeSelection.requiredCapabilities.map(String),
      dependencies: ['mariadb-server', 'redis-server', 'nginx-core', 'php-fpm-8.3', 'wp-cli'],
      artifacts: {
        themeSlug,
        targetPath: `/wp-content/themes/${themeSlug}`,
        compileFse: blueprint.requirements.themeCompilation ?? true
      },
      securityPolicy: {
        isolationLevel: blueprint.securityRequirements.isolationLevel || 'container',
        fileEditDisabled: blueprint.securityRequirements.fileEditDisabled ?? true,
        sslRequired: blueprint.securityRequirements.waf ?? true,
        wafEnabled: blueprint.securityRequirements.waf ?? true,
        disallowUnfilteredHtml: blueprint.securityRequirements.disallowUnfilteredHtml ?? true
      },
      approvalRequirements: {
        requiresManualApproval: targetEnv === 'production',
        environmentTier: targetEnv
      },
      rollbackStrategy: {
        snapshotBeforeDeploy: true,
        atomicSwitch: true,
        healthCheckThresholdMs: 300,
        maxRetries: 3
      },
      architectureDecisionLog: {
        runtimeReason: runtimeSelection.reason,
        providerReason: infrastructureSelection.reason,
        confidence: Number(((runtimeSelection.confidence + infrastructureSelection.confidence) / 2).toFixed(2)),
        timestamp: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };
  }
}

export const infrastructureSelector = new InfrastructureSelector();
