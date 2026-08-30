/**
 * AI Digital Factory - Infrastructure Provider Registry
 * Manages infrastructure providers for local docker, cpanel, plesk, ssh, and cloud environments.
 */

import { InfrastructureProvider, InfrastructureType, EnvironmentTier } from './types';
import { localDevelopmentProvider } from './local/LocalDevelopmentProvider';

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

  public getProvider(idOrType: string): InfrastructureProvider {
    const provider = this.providers.get(idOrType);
    if (!provider) {
      // Default to local development provider if not found
      return localDevelopmentProvider;
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
}

export const infrastructureRegistry = InfrastructureRegistry.getInstance();
