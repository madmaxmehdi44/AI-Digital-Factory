import { BaseAIAgent, ExecutionContext, AgentResult } from '../core';
import { BusinessIntelligenceAgent as BIEngine } from '../../modules/business-agent';
import type { BusinessBlueprint } from '../../modules/business-agent';

export type { BusinessBlueprint };

export class BusinessIntelligenceAgent extends BaseAIAgent<any, { blueprint: BusinessBlueprint }> {
  public readonly id = "business-agent";
  public readonly name = "Business Intelligence & Strategy Agent";
  public readonly category = "BUSINESS" as const;
  public readonly version = "2.0.0";

  private biEngine = new BIEngine();

  public async execute(context: ExecutionContext): Promise<AgentResult<{ blueprint: BusinessBlueprint }>> {
    const startTime = Date.now();
    const logs: string[] = [];
    logs.push(`[${this.name}] Synthesizing business blueprint for domain: ${context.domain}`);

    try {
      const inputData = context.input || {};
      const blueprint = await this.biEngine.analyze({
        id: `biz_${Date.now()}`,
        name: inputData.name || inputData.businessName || context.domain,
        type: inputData.type || inputData.businessType || "B2B Enterprise",
        industry: inputData.industry || "Digital Technology & Services",
        location: inputData.location || "Global",
        targetAudience: inputData.targetAudience || "Corporate decision makers and buyers",
        goals: inputData.goals || "Lead Generation & High-Ticket Inbound Conversion",
        personality: inputData.personality || inputData.brandPersonality || "Authoritative, Premium, Modern",
        createdAt: new Date().toISOString()
      });

      logs.push(`[${this.name}] Blueprint synthesized: ${blueprint.pages.length} core conversion pages generated.`);

      return {
        success: true,
        data: { blueprint },
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

  public validate(result: AgentResult<{ blueprint: BusinessBlueprint }>): boolean {
    if (!result.data?.blueprint) return false;
    const bp = result.data.blueprint;
    return Boolean(bp.business && bp.pages && bp.pages.length > 0);
  }
}
