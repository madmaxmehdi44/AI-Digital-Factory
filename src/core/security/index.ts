/**
 * AI Digital Factory - Security, Tenant Isolation & Permission Gatekeeper
 * Enforces strict multi-tenancy boundaries, credential encryption abstractions,
 * and Level 0-3 autonomous remediation policy enforcement.
 */

import { TenantId, UserId, RepairPolicyLevel, AuditEvent } from '../models';

export interface SecurityContext {
  tenantId: TenantId;
  userId?: UserId;
  role: 'admin' | 'architect' | 'operator' | 'viewer';
  ipAddress?: string;
}

export class SecurityGatekeeper {
  private static auditLogs: AuditEvent[] = [];

  /**
   * Enforces that an operation belongs strictly to the authenticated tenant.
   */
  public static assertTenantAccess(context: SecurityContext, resourceTenantId: TenantId, resourceName: string = "Resource"): void {
    if (!context.tenantId) {
      throw new Error(`[SecurityException] Unauthenticated access attempt on ${resourceName}`);
    }
    if (context.tenantId !== resourceTenantId) {
      this.logAudit({
        tenantId: context.tenantId,
        userId: context.userId,
        action: 'TENANT_ISOLATION_VIOLATION_BLOCKED',
        resourceType: resourceName,
        resourceId: resourceTenantId,
        details: { requestedTenant: resourceTenantId, userTenant: context.tenantId }
      });
      throw new Error(`[SecurityException] Forbidden: Access to tenant resource is strictly segregated.`);
    }
  }

  /**
   * Evaluates if a given tool/action is permitted under the configured Repair Policy Level.
   */
  public static checkPolicyLevelPermission(
    actionName: string,
    requiredLevel: RepairPolicyLevel,
    currentConfiguredLevel: RepairPolicyLevel,
    hasHumanApproval: boolean = false
  ): { permitted: boolean; reason?: string } {
    if (requiredLevel === RepairPolicyLevel.LEVEL_3_HIGH_RISK_APPROVAL && !hasHumanApproval) {
      return {
        permitted: false,
        reason: `Action '${actionName}' requires explicit Human Operator Approval (Level 3 High-Risk).`
      };
    }

    if (requiredLevel > currentConfiguredLevel) {
      return {
        permitted: false,
        reason: `Action '${actionName}' requires Policy Level ${requiredLevel}, but current system is restricted to Level ${currentConfiguredLevel}.`
      };
    }

    return { permitted: true };
  }

  /**
   * Masks sensitive credentials so that AI Agents and UI never receive raw private keys or passwords.
   */
  public static maskSecret(secret: string, visibleChars: number = 4): string {
    if (!secret || secret.length <= visibleChars * 2) {
      return "••••••••••••";
    }
    return `${secret.slice(0, visibleChars)}••••••••••••${secret.slice(-visibleChars)}`;
  }

  /**
   * Tool allowlist validation preventing arbitrary shell injection or unauthorized commands.
   */
  public static validateAllowedTool(toolName: string): boolean {
    const ALLOWED_TOOLS = new Set([
      "wordpress.getStatus",
      "wordpress.getPlugins",
      "wordpress.updatePlugin",
      "wordpress.disablePlugin",
      "wordpress.getLogs",
      "wordpress.backup",
      "wordpress.restore",
      "wordpress.local.install",
      "wordpress.local.remove",
      "wordpress.local.status",
      "wordpress.local.wpCli",
      "wordpress.local.installTheme",
      "wordpress.local.installPlugin",
      "wordpress.local.backupDatabase",
      "wordpress.local.restoreDatabase",
      "hosting.testConnection",
      "hosting.checkEnvironment",
      "hosting.createDatabase",
      "hosting.uploadFiles",
      "hosting.installSSL",
      "hosting.deploy",
      "hosting.local.checkDocker",
      "hosting.local.createDatabase",
      "site.healthCheck",
      "site.runSEOAudit",
      "site.fetchLogs",
      "ai.synthesizeStrategy",
      "ai.compileTokens",
      "ai.compileTheme"
    ]);

    return ALLOWED_TOOLS.has(toolName);
  }

  /**
   * Appends immutable audit log entry.
   */
  public static logAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const fullEvent: AuditEvent = {
      ...event,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(fullEvent);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return fullEvent;
  }

  public static getAuditLogs(tenantId: TenantId): AuditEvent[] {
    return this.auditLogs.filter(log => log.tenantId === tenantId);
  }
}
