/**
 * AI Digital Factory - Application Runtime Registry
 * Manages runtime discovery, provides factory lookup for application runtimes
 * (WordPress, Node.js, Python, Static), and exposes the generic ApplicationRuntime contract.
 */

import {
  ApplicationRuntime,
  RuntimeCapability,
  RuntimeDetection,
  EnvironmentValidation,
  RuntimeConfig,
  RuntimeOperationResult,
  BuildInput,
  BuildResult,
  Artifact,
  DeploymentResult,
  HealthResult,
  LogResult
} from './types';
import { wordPressRuntime, WordPressRuntime } from './wordpress';
import { nodeRuntime, NodeRuntime } from './node';
import { RuntimeResolutionError } from './RuntimeSelector';

// Export the generic ApplicationRuntime interface and all contract types
export type {
  ApplicationRuntime,
  RuntimeCapability,
  RuntimeDetection,
  EnvironmentValidation,
  RuntimeConfig,
  RuntimeOperationResult,
  BuildInput,
  BuildResult,
  Artifact,
  DeploymentResult,
  HealthResult,
  LogResult
};

export { RuntimeResolutionError };

export class RuntimeRegistry {
  private static instance: RuntimeRegistry;
  private runtimes: Map<string, ApplicationRuntime> = new Map();

  private constructor() {
    this.initDefaults();
  }

  private initDefaults(): void {
    // Register first-class production runtimes
    this.registerRuntime(wordPressRuntime);
    this.registerRuntime(nodeRuntime);
  }

  public static getInstance(): RuntimeRegistry {
    if (!RuntimeRegistry.instance) {
      RuntimeRegistry.instance = new RuntimeRegistry();
    }
    return RuntimeRegistry.instance;
  }

  /**
   * Register an ApplicationRuntime implementation (e.g. WordPressRuntime, NodeRuntime, PythonRuntime, StaticRuntime)
   */
  public registerRuntime(runtime: ApplicationRuntime): void {
    this.runtimes.set(runtime.id, runtime);
    this.runtimes.set(runtime.type, runtime);
  }

  /**
   * Unregister an ApplicationRuntime by ID or type
   */
  public unregisterRuntime(idOrType: string): boolean {
    const runtime = this.runtimes.get(idOrType);
    if (!runtime) return false;
    this.runtimes.delete(runtime.id);
    this.runtimes.delete(runtime.type);
    return true;
  }

  /**
   * Check if a runtime is registered
   */
  public hasRuntime(idOrType: string): boolean {
    return this.runtimes.has(idOrType);
  }

  /**
   * Get an ApplicationRuntime by ID or type.
   * Throws RuntimeResolutionError if the runtime is not registered (no silent fallback).
   */
  public getRuntime(idOrType = 'runtime-wordpress'): ApplicationRuntime {
    const runtime = this.runtimes.get(idOrType);
    if (!runtime) {
      throw new RuntimeResolutionError(`Runtime '${idOrType}' is not registered in RuntimeRegistry.`);
    }
    return runtime;
  }

  /**
   * Discovers and returns the appropriate runtime by inspecting a target directory path, domain, or URL.
   * Enables orchestrator to seamlessly detect Node.js, Python, Static, or WordPress.
   * Throws RuntimeResolutionError if no registered runtime detects the target.
   */
  public async detectRuntime(targetPathOrUrl: string): Promise<ApplicationRuntime> {
    for (const runtime of this.listRuntimes()) {
      try {
        const detection: RuntimeDetection = await runtime.detect(targetPathOrUrl);
        if (detection.detected) {
          return runtime;
        }
      } catch (err) {
        console.warn(`[RuntimeRegistry] Detection error in ${runtime.id}:`, err);
      }
    }
    
    // Check if default wordPressRuntime is registered before returning
    if (this.hasRuntime('runtime-wordpress') || this.hasRuntime('wordpress')) {
      return this.getRuntime('runtime-wordpress');
    }

    throw new RuntimeResolutionError(`No compatible runtime detected for target: '${targetPathOrUrl}'`);
  }

  /**
   * Returns list of all uniquely registered ApplicationRuntimes
   */
  public listRuntimes(): ApplicationRuntime[] {
    const unique = new Map<string, ApplicationRuntime>();
    this.runtimes.forEach(r => unique.set(r.id, r));
    return Array.from(unique.values());
  }

  /**
   * Returns supported capabilities for a given runtime ID or type
   */
  public listCapabilities(idOrType = 'runtime-wordpress'): RuntimeCapability[] {
    const runtime = this.getRuntime(idOrType);
    return runtime ? [...runtime.capabilities] : [];
  }

  /**
   * Resets registry to default configuration (WordPress runtime)
   */
  public reset(): void {
    this.runtimes.clear();
    this.initDefaults();
  }
}

export const runtimeRegistry = RuntimeRegistry.getInstance();

