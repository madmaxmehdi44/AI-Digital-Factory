/**
 * AI Digital Factory - Application Runtime Registry
 * Manages runtime discovery and provides factory lookup for runtimes (WordPress, Node, Python, Static)
 */

import { ApplicationRuntime } from './types';
import { wordPressRuntime } from './wordpress';

export class RuntimeRegistry {
  private static instance: RuntimeRegistry;
  private runtimes: Map<string, ApplicationRuntime> = new Map();

  private constructor() {
    // Register default WordPress Runtime
    this.registerRuntime(wordPressRuntime);
  }

  public static getInstance(): RuntimeRegistry {
    if (!RuntimeRegistry.instance) {
      RuntimeRegistry.instance = new RuntimeRegistry();
    }
    return RuntimeRegistry.instance;
  }

  public registerRuntime(runtime: ApplicationRuntime): void {
    this.runtimes.set(runtime.id, runtime);
    this.runtimes.set(runtime.type, runtime);
  }

  public getRuntime(idOrType = 'wordpress'): ApplicationRuntime {
    const runtime = this.runtimes.get(idOrType);
    if (!runtime) {
      return wordPressRuntime;
    }
    return runtime;
  }

  public async detectRuntime(targetPathOrUrl: string): Promise<ApplicationRuntime> {
    for (const runtime of this.runtimes.values()) {
      const detection = await runtime.detect(targetPathOrUrl);
      if (detection.detected) {
        return runtime;
      }
    }
    return wordPressRuntime;
  }

  public listRuntimes(): ApplicationRuntime[] {
    const unique = new Map<string, ApplicationRuntime>();
    this.runtimes.forEach(r => unique.set(r.id, r));
    return Array.from(unique.values());
  }
}

export const runtimeRegistry = RuntimeRegistry.getInstance();
