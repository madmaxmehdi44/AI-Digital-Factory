import { AgentRegistry, workflowEngine, WorkflowExecution } from './index';
import { BusinessIntelligenceAgent } from '../../agents/business-agent';
import { DesignSystemAgent } from '../../agents/design-agent';
import { WordPressThemeCompilerAgent } from '../../agents/theme-agent';
import { ContentGenerationAgent } from '../../agents/content-agent';
import { DeploymentAgent } from '../../agents/deployment-agent';
import { SeoIntelligenceAgent } from '../../agents/seo-agent';
import { AutonomousOperationsAgent } from '../../agents/operations-agent';

// Register all production AI Agents on module initialization
let initialized = false;

export function initializeFactoryAgents() {
  if (initialized) return;
  AgentRegistry.register(new BusinessIntelligenceAgent());
  AgentRegistry.register(new DesignSystemAgent());
  AgentRegistry.register(new WordPressThemeCompilerAgent());
  AgentRegistry.register(new ContentGenerationAgent());
  AgentRegistry.register(new DeploymentAgent());
  AgentRegistry.register(new SeoIntelligenceAgent());
  AgentRegistry.register(new AutonomousOperationsAgent());
  initialized = true;
}

export async function executeNewWebsiteCreationWorkflow(
  domain: string,
  businessInput: any,
  onProgress?: (exec: WorkflowExecution) => void
): Promise<WorkflowExecution> {
  initializeFactoryAgents();

  const pipeline = [
    "business-agent",
    "design-agent",
    "theme-agent",
    "content-agent",
    "deployment-agent",
    "seo-agent",
    "operations-agent"
  ];

  return await workflowEngine.executePipeline(
    "New Website Creation & Launch Pipeline",
    domain,
    pipeline,
    businessInput,
    onProgress
  );
}

export async function executeAutonomousRepairWorkflow(
  domain: string,
  incidentContext: any,
  onProgress?: (exec: WorkflowExecution) => void
): Promise<WorkflowExecution> {
  initializeFactoryAgents();

  const pipeline = [
    "operations-agent",
    "theme-agent",
    "seo-agent"
  ];

  return await workflowEngine.executePipeline(
    "Autonomous Website Self-Healing & Diagnostic Workflow",
    domain,
    pipeline,
    incidentContext,
    onProgress
  );
}

export * from './index';
