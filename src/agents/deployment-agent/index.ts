import { BaseAIAgent, ExecutionContext, AgentResult } from '../core';
import { WordPressProvisioningEngine, ProvisioningJob } from '../../modules/wordpress-engine';
import { CompiledTheme } from '../../modules/theme-compiler';
import { BusinessBlueprint } from '../../modules/business-agent';

export interface DeploymentAgentOutput {
  job: ProvisioningJob;
  liveUrl: string;
  adminUrl: string;
  stagesCompleted: string[];
}

export class DeploymentAgent extends BaseAIAgent<any, { deployment: DeploymentAgentOutput }> {
  public readonly id = "deployment-agent";
  public readonly name = "Autonomous Deployment & Provisioning Agent";
  public readonly category = "DEPLOYMENT" as const;
  public readonly version = "2.0.0";

  private wpEngine = new WordPressProvisioningEngine();

  public async execute(context: ExecutionContext): Promise<AgentResult<{ deployment: DeploymentAgentOutput }>> {
    const startTime = Date.now();
    const logs: string[] = [];
    logs.push(`[${this.name}] Starting deployment pipeline on target: ${context.domain}`);

    try {
      const blueprint: BusinessBlueprint = context.input.blueprint || {
        business: context.input.businessName || context.domain,
        industry: "Technology",
        location: "Global",
        audience: "All",
        goal: "lead_generation",
        summary: "Digital Platform",
        valueProposition: "High Velocity",
        pages: [],
        conversionStrategy: { primaryCTA: "Start", leadMagnet: "", trustSignals: [] },
        seoStrategy: { focusType: "", primaryKeywords: [], secondaryKeywords: [], contentPillars: [], schemaMarkup: [] },
        customerJourney: [],
        generatedAt: new Date().toISOString()
      };

      const compiledTheme: CompiledTheme = context.input.compiledTheme || {
        themeName: `${blueprint.business} Theme`,
        themeSlug: `wp-${blueprint.business.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        version: "1.0.0",
        fileCount: 12,
        files: {},
        createdAt: new Date().toISOString()
      };

      const hostingType = (context.input.hostingType || "docker") as 'cpanel' | 'plesk' | 'ssh' | 'docker' | 'cloudrun';

      // Execute deployment on WordPress Provisioning Engine
      const job = await this.wpEngine.provisionWebsite(
        blueprint,
        compiledTheme,
        context.domain,
        hostingType
      );

      const stagesCompleted = job.steps.filter(s => s.status === 'completed').map(s => s.name);

      logs.push(`[${this.name}] Provisioning status: ${job.status}. Site live at ${job.liveUrl}`);

      return {
        success: job.status === 'LIVE',
        data: {
          deployment: {
            job,
            liveUrl: job.liveUrl || `https://${context.domain}`,
            adminUrl: job.adminCredentials?.loginUrl || `https://${context.domain}/wp-admin`,
            stagesCompleted
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

  public validate(result: AgentResult<{ deployment: DeploymentAgentOutput }>): boolean {
    return Boolean(result.data?.deployment?.job && result.data.deployment.job.status === 'LIVE');
  }

  public async rollback(context: ExecutionContext): Promise<boolean> {
    context.logger.warn(`Deployment rollback initiated for domain ${context.domain}.`);
    return true;
  }
}
