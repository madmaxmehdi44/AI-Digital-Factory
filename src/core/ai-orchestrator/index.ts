import { AIAgent, ExecutionContext, AgentResult } from '../../agents/core';
import { agentMemory } from '../memory';

export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING' | 'ROLLED_BACK';

export interface WorkflowTask {
  id: string;
  agentId: string;
  name: string;
  status: TaskStatus;
  retryCount: number;
  maxRetries: number;
  error?: string;
  result?: any;
  startedAt?: number;
  finishedAt?: number;
  durationMs?: number;
}

export interface WorkflowExecution {
  id: string;
  name: string;
  domain: string;
  status: TaskStatus;
  tasks: WorkflowTask[];
  currentTaskIndex: number;
  startedAt: number;
  finishedAt?: number;
  logs: string[];
}

export class AgentRegistry {
  private static agents: Map<string, AIAgent> = new Map();

  public static register(agent: AIAgent) {
    this.agents.set(agent.id, agent);
  }

  public static get(agentId: string): AIAgent | undefined {
    return this.agents.get(agentId);
  }

  public static getAll(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  public static getByCategory(category: AIAgent['category']): AIAgent[] {
    return Array.from(this.agents.values()).filter(a => a.category === category);
  }
}

export class TaskQueue {
  private queue: WorkflowTask[] = [];

  public enqueue(task: WorkflowTask) {
    this.queue.push(task);
  }

  public dequeue(): WorkflowTask | undefined {
    return this.queue.shift();
  }

  public peek(): WorkflowTask | undefined {
    return this.queue[0];
  }

  public clear() {
    this.queue = [];
  }

  public get length(): number {
    return this.queue.length;
  }
}

export class WorkflowEngine {
  private executions: Map<string, WorkflowExecution> = new Map();

  public async executePipeline(
    pipelineName: string,
    domain: string,
    agentIds: string[],
    initialInput: any,
    onProgress?: (execution: WorkflowExecution) => void
  ): Promise<WorkflowExecution> {
    const executionId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    const tasks: WorkflowTask[] = agentIds.map(agentId => {
      const agent = AgentRegistry.get(agentId);
      return {
        id: `task_${agentId}_${Date.now()}`,
        agentId,
        name: agent ? agent.name : agentId,
        status: 'PENDING',
        retryCount: 0,
        maxRetries: 2
      };
    });

    const execution: WorkflowExecution = {
      id: executionId,
      name: pipelineName,
      domain,
      status: 'RUNNING',
      tasks,
      currentTaskIndex: 0,
      startedAt: Date.now(),
      logs: [`[ORCHESTRATOR] Initialized workflow '${pipelineName}' for domain '${domain}' with ${tasks.length} agents.`]
    };

    this.executions.set(executionId, execution);
    if (onProgress) onProgress(execution);

    let cumulativeContext: Record<string, any> = { ...initialInput };

    for (let i = 0; i < tasks.length; i++) {
      execution.currentTaskIndex = i;
      const currentTask = tasks[i];
      const agent = AgentRegistry.get(currentTask.agentId);

      if (!agent) {
        currentTask.status = 'FAILED';
        currentTask.error = `Agent '${currentTask.agentId}' is not registered in AgentRegistry.`;
        execution.status = 'FAILED';
        execution.logs.push(`[ORCHESTRATOR ERROR] Missing agent '${currentTask.agentId}'.`);
        if (onProgress) onProgress(execution);
        break;
      }

      currentTask.status = 'RUNNING';
      currentTask.startedAt = Date.now();
      execution.logs.push(`[${agent.name}] Executing stage ${i + 1}/${tasks.length}...`);
      if (onProgress) onProgress(execution);

      const ctx: ExecutionContext = {
        jobId: executionId,
        workflowId: pipelineName,
        businessId: `biz_${domain.replace(/[^a-zA-Z0-9]/g, '_')}`,
        domain,
        input: cumulativeContext,
        memory: agentMemory.getOrCreate(domain).businessContext,
        metadata: {
          startTime: Date.now(),
          retryCount: currentTask.retryCount
        },
        logger: {
          info: (msg, d) => execution.logs.push(`[${agent.name} INFO] ${msg} ${d ? JSON.stringify(d) : ''}`),
          warn: (msg, d) => execution.logs.push(`[${agent.name} WARN] ${msg} ${d ? JSON.stringify(d) : ''}`),
          error: (msg, d) => execution.logs.push(`[${agent.name} ERROR] ${msg} ${d ? JSON.stringify(d) : ''}`)
        }
      };

      let success = false;
      while (currentTask.retryCount <= currentTask.maxRetries && !success) {
        try {
          const result: AgentResult = await agent.execute(ctx);
          const isValid = agent.validate(result);

          if (result.success && isValid) {
            success = true;
            currentTask.status = 'COMPLETED';
            currentTask.finishedAt = Date.now();
            currentTask.durationMs = currentTask.finishedAt - (currentTask.startedAt || currentTask.finishedAt);
            currentTask.result = result.data;
            
            // Merge output into context for downstream agents
            cumulativeContext = { ...cumulativeContext, ...result.data };
            
            agentMemory.recordDecision(
              domain,
              agent.id,
              `Completed ${agent.name}`,
              `Successfully generated output for ${domain}`,
              { executionMs: currentTask.durationMs }
            );

            execution.logs.push(`[${agent.name}] Completed successfully in ${currentTask.durationMs}ms.`);
          } else {
            throw new Error(result.error || "Agent validation failed");
          }
        } catch (err: any) {
          currentTask.retryCount++;
          if (currentTask.retryCount <= currentTask.maxRetries) {
            currentTask.status = 'RETRYING';
            execution.logs.push(`[${agent.name}] Execution error: ${err.message}. Retrying (${currentTask.retryCount}/${currentTask.maxRetries})...`);
            if (onProgress) onProgress(execution);
            await new Promise(r => setTimeout(r, 600));
          } else {
            currentTask.status = 'FAILED';
            currentTask.error = err.message;
            currentTask.finishedAt = Date.now();
            currentTask.durationMs = currentTask.finishedAt - (currentTask.startedAt || currentTask.finishedAt);
            execution.status = 'FAILED';
            execution.logs.push(`[${agent.name} FATAL] Workflow aborted after ${currentTask.maxRetries} retries: ${err.message}`);
            
            agentMemory.recordError(domain, {
              agentId: agent.id,
              severity: 'HIGH',
              message: err.message,
              resolved: false
            });

            // Perform rollback on previous completed agents if needed
            if (agent.rollback) {
              try {
                await agent.rollback(ctx);
                execution.logs.push(`[${agent.name}] Rollback triggered successfully.`);
              } catch (rollErr: any) {
                execution.logs.push(`[${agent.name} ROLLBACK ERROR] ${rollErr.message}`);
              }
            }
          }
        }
      }

      if (onProgress) onProgress(execution);
      if (execution.status === 'FAILED') break;
    }

    if (execution.status !== 'FAILED') {
      execution.status = 'COMPLETED';
      execution.finishedAt = Date.now();
      execution.logs.push(`[ORCHESTRATOR] Pipeline '${pipelineName}' finished successfully in ${execution.finishedAt - execution.startedAt}ms.`);
      if (onProgress) onProgress(execution);
    }

    return execution;
  }

  public getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }
}

export const workflowEngine = new WorkflowEngine();
