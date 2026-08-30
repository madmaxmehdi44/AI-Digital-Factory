export interface ExecutionContext<TInput = any, TOutput = any> {
  jobId: string;
  workflowId: string;
  businessId: string;
  tenantId?: string;
  environment?: 'development' | 'staging' | 'production';
  domain: string;
  input: TInput;
  output?: TOutput;
  memory: Record<string, any>;
  metadata: {
    startTime: number;
    timeoutMs?: number;
    retryCount?: number;
    callerRole?: string;
  };
  logger: {
    info: (msg: string, details?: any) => void;
    warn: (msg: string, details?: any) => void;
    error: (msg: string, details?: any) => void;
  };
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  executionMs: number;
  logs: string[];
  metrics?: {
    tokensUsed?: number;
    apiLatencyMs?: number;
    resourceUsage?: string;
  };
}

export interface AIAgent<TInput = any, TOutput = any> {
  readonly id: string;
  readonly name: string;
  readonly category: 'BUSINESS' | 'DESIGN' | 'THEME' | 'CONTENT' | 'DEPLOYMENT' | 'OPERATIONS' | 'SEO';
  readonly version: string;

  execute(context: ExecutionContext<TInput, TOutput>): Promise<AgentResult<TOutput>>;
  validate(result: AgentResult<TOutput>): boolean;
  rollback?(context: ExecutionContext<TInput, TOutput>): Promise<boolean>;
}

export abstract class BaseAIAgent<TInput = any, TOutput = any> implements AIAgent<TInput, TOutput> {
  public abstract readonly id: string;
  public abstract readonly name: string;
  public abstract readonly category: AIAgent['category'];
  public readonly version: string = "1.0.0";

  public abstract execute(context: ExecutionContext<TInput, TOutput>): Promise<AgentResult<TOutput>>;
  public abstract validate(result: AgentResult<TOutput>): boolean;

  public async rollback(context: ExecutionContext<TInput, TOutput>): Promise<boolean> {
    context.logger.warn(`Default rollback called on agent ${this.id}`);
    return true;
  }
}
