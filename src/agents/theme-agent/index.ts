import { BaseAIAgent, ExecutionContext, AgentResult } from '../core';
import { WordPressThemeCompiler } from '../../modules/theme-compiler';
import type { CompiledTheme } from '../../modules/theme-compiler';
import type { BusinessBlueprint } from '../../modules/business-agent';
import type { DesignTokens } from '../../modules/design-engine';

export type { CompiledTheme };

export class WordPressThemeCompilerAgent extends BaseAIAgent<any, { compiledTheme: CompiledTheme }> {
  public readonly id = "theme-agent";
  public readonly name = "WordPress FSE Theme Compiler Agent";
  public readonly category = "THEME" as const;
  public readonly version = "2.0.0";

  private compiler = new WordPressThemeCompiler();

  public async execute(context: ExecutionContext): Promise<AgentResult<{ compiledTheme: CompiledTheme }>> {
    const startTime = Date.now();
    const logs: string[] = [];
    logs.push(`[${this.name}] Compiling Gutenberg FSE block theme for: ${context.domain}`);

    try {
      const blueprint: BusinessBlueprint = context.input.blueprint;
      const designTokens: DesignTokens = context.input.designTokens;

      if (!blueprint || !designTokens) {
        throw new Error("Business Blueprint and Design Tokens are required to compile WordPress theme.");
      }

      const compiledTheme = await this.compiler.compile(blueprint, designTokens);

      logs.push(`[${this.name}] Compiled ${compiledTheme.fileCount} source files for theme '${compiledTheme.themeSlug}'.`);

      return {
        success: true,
        data: { compiledTheme },
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

  public validate(result: AgentResult<{ compiledTheme: CompiledTheme }>): boolean {
    return Boolean(result.data?.compiledTheme?.files && result.data.compiledTheme.files["theme.json"]);
  }
}
