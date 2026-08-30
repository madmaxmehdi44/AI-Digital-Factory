export interface LifecycleMemoryRecord {
  id: string;
  websiteId: string;
  domain: string;
  businessContext: {
    businessName: string;
    industry: string;
    targetAudience: string;
    goals: string[];
    brandVoice: string;
    createdAt: string;
  };
  aiDecisions: Array<{
    timestamp: string;
    agentId: string;
    action: string;
    rationale: string;
    parameters: Record<string, any>;
  }>;
  generatedAssets: {
    designTokens?: any;
    themeBundleVersion?: string;
    sitemap?: string[];
    schemaTypes?: string[];
  };
  deploymentHistory: Array<{
    deploymentId: string;
    timestamp: string;
    target: string;
    version: string;
    status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
    durationMs: number;
  }>;
  errorLog: Array<{
    timestamp: string;
    agentId: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    remediationAction?: string;
    resolved: boolean;
  }>;
  optimizationHistory: Array<{
    timestamp: string;
    metricType: 'CRO' | 'SEO' | 'PERFORMANCE';
    beforeScore: number;
    afterScore: number;
    appliedStrategy: string;
  }>;
}

class AgentMemoryStore {
  private memoryMap: Map<string, LifecycleMemoryRecord> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem("factory_agent_lifecycle_memory");
        if (raw) {
          const parsed = JSON.parse(raw);
          Object.keys(parsed).forEach(k => {
            this.memoryMap.set(k, parsed[k]);
          });
        }
      }
    } catch (e) {
      console.warn("Could not load agent memory from storage", e);
    }
  }

  private persist() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const obj: Record<string, LifecycleMemoryRecord> = {};
        this.memoryMap.forEach((val, key) => {
          obj[key] = val;
        });
        localStorage.setItem("factory_agent_lifecycle_memory", JSON.stringify(obj));
      }
    } catch (e) {
      console.warn("Could not persist agent memory", e);
    }
  }

  public getOrCreate(domain: string, initialContext?: Partial<LifecycleMemoryRecord['businessContext']>): LifecycleMemoryRecord {
    const key = domain.toLowerCase().trim();
    if (!this.memoryMap.has(key)) {
      const record: LifecycleMemoryRecord = {
        id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        websiteId: `site_${Date.now()}`,
        domain: key,
        businessContext: {
          businessName: initialContext?.businessName || key,
          industry: initialContext?.industry || "Professional Services",
          targetAudience: initialContext?.targetAudience || "General Customers",
          goals: initialContext?.goals || ["Lead Generation", "Brand Authority"],
          brandVoice: initialContext?.brandVoice || "Modern, Authoritative, Crisp",
          createdAt: new Date().toISOString(),
        },
        aiDecisions: [],
        generatedAssets: {},
        deploymentHistory: [],
        errorLog: [],
        optimizationHistory: []
      };
      this.memoryMap.set(key, record);
      this.persist();
    }
    return this.memoryMap.get(key)!;
  }

  public recordDecision(domain: string, agentId: string, action: string, rationale: string, parameters: Record<string, any> = {}) {
    const mem = this.getOrCreate(domain);
    mem.aiDecisions.unshift({
      timestamp: new Date().toISOString(),
      agentId,
      action,
      rationale,
      parameters
    });
    if (mem.aiDecisions.length > 50) mem.aiDecisions.pop();
    this.persist();
  }

  public recordDeployment(domain: string, deployment: {
    target: string;
    version: string;
    status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
    durationMs: number;
  }) {
    const mem = this.getOrCreate(domain);
    mem.deploymentHistory.unshift({
      deploymentId: `dep_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...deployment
    });
    this.persist();
  }

  public recordError(domain: string, error: {
    agentId: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    message: string;
    remediationAction?: string;
    resolved: boolean;
  }) {
    const mem = this.getOrCreate(domain);
    mem.errorLog.unshift({
      timestamp: new Date().toISOString(),
      ...error
    });
    this.persist();
  }

  public recordOptimization(domain: string, opt: {
    metricType: 'CRO' | 'SEO' | 'PERFORMANCE';
    beforeScore: number;
    afterScore: number;
    appliedStrategy: string;
  }) {
    const mem = this.getOrCreate(domain);
    mem.optimizationHistory.unshift({
      timestamp: new Date().toISOString(),
      ...opt
    });
    this.persist();
  }

  public updateGeneratedAssets(domain: string, assets: Partial<LifecycleMemoryRecord['generatedAssets']>) {
    const mem = this.getOrCreate(domain);
    mem.generatedAssets = {
      ...mem.generatedAssets,
      ...assets
    };
    this.persist();
  }

  public getMemory(domain: string): LifecycleMemoryRecord | undefined {
    return this.memoryMap.get(domain.toLowerCase().trim());
  }

  public getAll(): LifecycleMemoryRecord[] {
    return Array.from(this.memoryMap.values());
  }
}

export const agentMemory = new AgentMemoryStore();
