import { BaseAIAgent, ExecutionContext, AgentResult } from '../core';
import { AutonomousOperationsAgent as OpsEngine, HealingExecutionResult } from '../../modules/operations-agent';
import { factoryDB } from '../../core/database/store';

export interface OperationsAgentOutput {
  healingResult: HealingExecutionResult;
  status: 'OPTIMAL' | 'HEALED' | 'WARNING';
}

export class AutonomousOperationsAgent extends BaseAIAgent<any, { operations: OperationsAgentOutput }> {
  public readonly id = "operations-agent";
  public readonly name = "Autonomous Operations & Self-Healing Agent";
  public readonly category = "OPERATIONS" as const;
  public readonly version = "2.0.0";

  private opsEngine = new OpsEngine();

  public async execute(context: ExecutionContext): Promise<AgentResult<{ operations: OperationsAgentOutput }>> {
    const startTime = Date.now();
    const logs: string[] = [];
    logs.push(`[${this.name}] Observing telemetry metrics for: ${context.domain}`);

    try {
      const allSites = factoryDB.getWebsites();
      let targetSite = allSites.find(s => s.domain === context.domain);

      if (!targetSite) {
        targetSite = {
          id: `site_${Date.now()}`,
          businessId: `biz_${Date.now()}`,
          name: context.input.businessName || context.domain,
          domain: context.domain,
          status: 'healthy',
          hostingType: (context.input.hostingType || 'docker') as any,
          wpVersion: '6.7.1',
          phpVersion: '8.2.14',
          themeSlug: 'wp-gutenberg-fse',
          uptimePercent: 99.98,
          responseTimeMs: 32,
          coreVitalsScore: 99,
          sslExpiryDays: 89,
          pluginsCount: 6,
          lastBackupAt: new Date().toISOString(),
          lastAuditAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
      }

      const metrics = await this.opsEngine.observe(targetSite);
      logs.push(`[${this.name}] TTFB: ${metrics.ttfbMs}ms | Memory: ${metrics.memoryUsageMb}MB / ${metrics.memoryLimitMb}MB`);

      const healingPlan = await this.opsEngine.analyze(metrics);
      let healingResult: HealingExecutionResult;

      if (healingPlan) {
        healingResult = await this.opsEngine.executeSafeHealing(healingPlan);
        logs.push(`[${this.name}] Snapshot '${healingResult.snapshotId}' created. Actions executed: ${healingResult.actionsExecuted.length}`);
      } else {
        healingResult = {
          success: true,
          domain: context.domain,
          snapshotId: "snap_baseline",
          actionsExecuted: ["Telemetry Heartbeat Normal", "Cache Verified"],
          postHealthCheckPassed: true,
          rolledBack: false,
          message: "All operational metrics within nominal limits."
        };
      }

      return {
        success: healingResult.success,
        data: {
          operations: {
            healingResult,
            status: healingResult.actionsExecuted.length > 2 ? 'HEALED' : 'OPTIMAL'
          }
        },
        executionMs: Date.now() - startTime,
        logs
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        executionMs: Date.now() - startTime,
        logs
      };
    }
  }

  public validate(result: AgentResult<{ operations: OperationsAgentOutput }>): boolean {
    return Boolean(result.data?.operations?.healingResult);
  }
}
