/**
 * AI Digital Factory - Infrastructure Provider Registry
 * Manages infrastructure providers for local docker, cpanel, plesk, ssh, and cloud environments.
 */

import { InfrastructureProvider, InfrastructureType, EnvironmentTier } from './types';
import { localDevelopmentProvider } from './local/LocalDevelopmentProvider';
import { InfrastructureResolutionError } from './InfrastructureSelector';

export { InfrastructureResolutionError };

export class InfrastructureRegistry {
  private static instance: InfrastructureRegistry;
  private providers: Map<string, InfrastructureProvider> = new Map();

  private constructor() {
    // Register default local provider
    this.registerProvider(localDevelopmentProvider);
  }

  public static getInstance(): InfrastructureRegistry {
    if (!InfrastructureRegistry.instance) {
      InfrastructureRegistry.instance = new InfrastructureRegistry();
    }
    return InfrastructureRegistry.instance;
  }

  public registerProvider(provider: InfrastructureProvider): void {
    this.providers.set(provider.id, provider);
    this.providers.set(provider.type, provider);
  }

  public unregisterProvider(idOrType: string): boolean {
    const provider = this.providers.get(idOrType);
    if (!provider) return false;
    this.providers.delete(provider.id);
    this.providers.delete(provider.type);
    return true;
  }

  public hasProvider(idOrType: string): boolean {
    return this.providers.has(idOrType);
  }

  public getProvider(idOrType: string): InfrastructureProvider {
    const provider = this.providers.get(idOrType);
    if (!provider) {
      // If it's local docker alias, return localDevelopmentProvider
      if (idOrType === 'local_docker' || idOrType === 'docker' || idOrType === 'provider-local-docker') {
        return localDevelopmentProvider;
      }
      throw new InfrastructureResolutionError(`Infrastructure provider '${idOrType}' is not registered in InfrastructureRegistry.`);
    }
    return provider;
  }

  public getProviderForEnvironment(environment: EnvironmentTier, type: InfrastructureType = 'local_docker'): InfrastructureProvider {
    if (environment === 'development') {
      return localDevelopmentProvider;
    }
    return this.getProvider(type);
  }

  public listProviders(): InfrastructureProvider[] {
    const unique = new Map<string, InfrastructureProvider>();
    this.providers.forEach(p => unique.set(p.id, p));
    return Array.from(unique.values());
  }

  public reset(): void {
    this.providers.clear();
    this.registerProvider(localDevelopmentProvider);
  }
}

export const infrastructureRegistry = InfrastructureRegistry.getInstance();

