import { BaseAIAgent, ExecutionContext, AgentResult } from '../core';
import { SeoEngine } from '../../modules/seo-engine';
import { SeoAuditResult } from '../../types';

export interface SeoAgentOutput {
  auditResult: SeoAuditResult;
  optimizedScore: number;
}

export class SeoIntelligenceAgent extends BaseAIAgent<any, { seo: SeoAgentOutput }> {
  public readonly id = "seo-agent";
  public readonly name = "Semantic SEO & Schema Intelligence Agent";
  public readonly category = "SEO" as const;
  public readonly version = "2.0.0";

  private seoEngine = new SeoEngine();

  public async execute(context: ExecutionContext): Promise<AgentResult<{ seo: SeoAgentOutput }>> {
    const startTime = Date.now();
    const logs: string[] = [];
    logs.push(`[${this.name}] Executing semantic SEO crawl and Core Web Vitals audit for: ${context.domain}`);

    try {
      const auditResult = await this.seoEngine.auditWebsite(
        context.domain,
        context.input.businessName || context.domain,
        context.input.industry || "Digital Technology"
      );

      logs.push(`[${this.name}] Crawl completed: Score ${auditResult.overallScore}/100. ${auditResult.checks.length} compliance checks verified.`);

      return {
        success: true,
        data: {
          seo: {
            auditResult,
            optimizedScore: auditResult.overallScore
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

  public validate(result: AgentResult<{ seo: SeoAgentOutput }>): boolean {
    return Boolean(result.data?.seo?.auditResult && result.data.seo.auditResult.overallScore > 0);
  }
}
