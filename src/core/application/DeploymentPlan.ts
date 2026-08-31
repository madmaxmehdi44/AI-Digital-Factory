/**
 * AI Digital Factory - Deployment Plan Domain Model
 * Machine-readable, inspectable contract synthesized after Runtime and Infrastructure resolution.
 * Consumed by the Deployment Agent and Orchestrator to execute verified, hardened deployments.
 */

import { ApplicationBlueprint } from './types';
import { RuntimeSelection } from '../runtime/RuntimeSelector';
import { InfrastructureSelection } from '../infrastructure/InfrastructureSelector';
import { EnvironmentTier, InfrastructureType } from '../infrastructure/types';

export interface DeploymentPlan {
  planId: string;
  applicationId: string;
  domain: string;
  environment: EnvironmentTier;
  applicationBlueprint: ApplicationBlueprint;
  runtimeSelection: RuntimeSelection;
  infrastructureSelection: InfrastructureSelection;
  runtime: {
    id: string;
    name: string;
    type: string;
    version?: string;
  };
  provider: {
    id: string;
    name: string;
    type: InfrastructureType;
    providerMode: string;
    isMock: boolean;
  };
  requiredCapabilities: string[];
  dependencies: string[];
  artifacts: {
    themeSlug: string;
    targetPath: string;
    compileFse: boolean;
  };
  securityPolicy: {
    isolationLevel: 'container' | 'process' | 'vhost';
    fileEditDisabled: boolean;
    sslRequired: boolean;
    wafEnabled: boolean;
    disallowUnfilteredHtml: boolean;
  };
  approvalRequirements: {
    requiresManualApproval: boolean;
    approvedBy?: string;
    environmentTier: EnvironmentTier;
  };
  rollbackStrategy: {
    snapshotBeforeDeploy: boolean;
    atomicSwitch: boolean;
    healthCheckThresholdMs: number;
    maxRetries: number;
  };
  architectureDecisionLog: {
    runtimeReason: string;
    providerReason: string;
    confidence: number;
    timestamp: string;
  };
  createdAt: string;
}
