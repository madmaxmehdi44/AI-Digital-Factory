/**
 * AI Digital Factory - Deterministic Local Tools Layer
 * Bridges AI Agents to LocalDevEngine with strict argument validation, permission gates,
 * and command allowlisting.
 */

import { SecurityGatekeeper } from '../security';
import { RepairPolicyLevel } from '../models';
import { localDevEngine, WordPressSiteConfig, NodeSiteConfig } from '../../lib/LocalDevEngine';
import { localDevelopmentProvider } from '../infrastructure';

// Strict WP-CLI command family allowlist
const PERMITTED_WP_CLI_FAMILIES = new Set([
  'core',
  'theme',
  'plugin',
  'post',
  'cache',
  'option',
  'user',
  'config',
  'db',
  'rewrite',
  'cron',
  'media',
  'eval-file'
]);

// Permitted Node package managers and runtime commands
const PERMITTED_NODE_BINARIES = new Set([
  'node',
  'npm',
  'pnpm',
  'yarn',
  'bun',
  'corepack',
  'npx'
]);

export class LocalTools {
  /**
   * wordpress.local.install - Provisions a local WordPress site in Docker
   */
  public static async installSite(
    config: WordPressSiteConfig,
    context?: { tenantId?: string; role?: string }
  ) {
    if (!config.domain || typeof config.domain !== 'string') {
      throw new Error('[ValidationError] Invalid or missing domain for local site installation.');
    }
    // Tool authorization check
    if (!SecurityGatekeeper.validateAllowedTool('wordpress.local.install')) {
      throw new Error('[SecurityGatekeeper] Tool wordpress.local.install is not authorized.');
    }

    return localDevEngine.installSite(config);
  }

  /**
   * wordpress.local.remove - Destructive site deletion (Requires Level 2/3 Policy)
   */
  public static async removeSite(
    siteIdOrDomain: string,
    policyConfig: { currentLevel: RepairPolicyLevel; hasApproval?: boolean }
  ) {
    const policy = SecurityGatekeeper.checkPolicyLevelPermission(
      'wordpress.local.remove',
      RepairPolicyLevel.LEVEL_2_REVERSIBLE_CHANGE,
      policyConfig.currentLevel,
      policyConfig.hasApproval
    );

    if (!policy.permitted) {
      throw new Error(`[SecurityGatekeeper] ${policy.reason}`);
    }

    return localDevEngine.uninstallSite(siteIdOrDomain);
  }

  /**
   * wordpress.local.status - Retrieve container and WordPress status
   */
  public static async getStatus(siteIdOrDomain: string) {
    if (!SecurityGatekeeper.validateAllowedTool('wordpress.local.status')) {
      throw new Error('[SecurityGatekeeper] Tool wordpress.local.status is not authorized.');
    }
    return localDevEngine.getSiteStatus(siteIdOrDomain);
  }

  /**
   * wordpress.local.wpCli - Secure, allowlisted WP-CLI command execution
   */
  public static async runWpCli(
    siteIdOrDomain: string,
    subcommand: string,
    args: string[] = []
  ) {
    if (!SecurityGatekeeper.validateAllowedTool('wordpress.local.wpCli')) {
      throw new Error('[SecurityGatekeeper] Tool wordpress.local.wpCli is not authorized.');
    }

    const trimmed = subcommand.trim();
    const commandParts = (trimmed.startsWith('wp ') ? trimmed.slice(3) : trimmed).split(' ');
    const family = commandParts[0]?.toLowerCase();

    if (!family || !PERMITTED_WP_CLI_FAMILIES.has(family)) {
      throw new Error(`[SecurityException] WP-CLI command family '${family}' is forbidden by security policy.`);
    }

    // Disallow dangerous shell metacharacters in arguments
    const dangerousChars = [';', '&&', '||', '`', '$(', '>', '<', '|'];
    for (const arg of [...commandParts, ...args]) {
      if (dangerousChars.some(char => arg.includes(char))) {
        throw new Error(`[SecurityException] Illegal characters detected in WP-CLI argument: ${arg}`);
      }
    }

    return localDevEngine.runWpCliCommand(siteIdOrDomain, subcommand, args);
  }

  /**
   * wordpress.local.installTheme - Install and activate Gutenberg theme
   */
  public static async installTheme(siteIdOrDomain: string, themeSlug: string, activate = true) {
    if (!themeSlug || !/^[a-z0-9-_]+$/i.test(themeSlug)) {
      throw new Error('[ValidationError] Invalid theme slug format.');
    }
    return localDevEngine.installTheme(siteIdOrDomain, themeSlug, activate);
  }

  /**
   * wordpress.local.installPlugin - Install and activate plugin
   */
  public static async installPlugin(siteIdOrDomain: string, pluginSlug: string, activate = true) {
    if (!pluginSlug || !/^[a-z0-9-_]+$/i.test(pluginSlug)) {
      throw new Error('[ValidationError] Invalid plugin slug format.');
    }
    return localDevEngine.installPlugin(siteIdOrDomain, pluginSlug, activate);
  }

  /**
   * wordpress.local.backupDatabase - Export database dump
   */
  public static async backupDatabase(dbName: string) {
    return localDevEngine.exportDatabase(dbName);
  }

  /**
   * wordpress.local.restoreDatabase - Import database dump
   */
  public static async restoreDatabase(dbName: string, dumpPath: string) {
    return localDevEngine.importDatabase(dbName, dumpPath);
  }

  /**
   * hosting.local.checkDocker - Check Docker runtime status
   */
  public static async checkDocker() {
    return localDevEngine.checkDockerStatus();
  }

  /**
   * hosting.local.createDatabase - Create isolated database
   */
  public static async createDatabase(dbName: string, user = 'wp_user', password = 'wp_password') {
    return localDevelopmentProvider.createDatabase(dbName, user, password);
  }

  // ==========================================
  // NODE.JS LOCAL TOOLS
  // ==========================================

  /**
   * node.local.install - Provisions a local Node.js application container
   */
  public static async installNodeSite(
    config: NodeSiteConfig,
    context?: { tenantId?: string; role?: string }
  ) {
    if (!config.domain || typeof config.domain !== 'string') {
      throw new Error('[ValidationError] Invalid or missing domain for Node site installation.');
    }
    if (!SecurityGatekeeper.validateAllowedTool('node.local.install')) {
      throw new Error('[SecurityGatekeeper] Tool node.local.install is not authorized.');
    }

    return localDevEngine.installNodeSite(config);
  }

  /**
   * node.local.status - Retrieve Node container and service status
   */
  public static async getNodeStatus(siteIdOrDomain: string) {
    if (!SecurityGatekeeper.validateAllowedTool('node.local.status')) {
      throw new Error('[SecurityGatekeeper] Tool node.local.status is not authorized.');
    }
    return localDevEngine.getNodeSiteStatus(siteIdOrDomain);
  }

  /**
   * node.local.command - Secure, allowlisted Node binary and package manager execution
   */
  public static async runNodeCommand(
    siteIdOrDomain: string,
    binary: string,
    args: string[] = []
  ) {
    if (!SecurityGatekeeper.validateAllowedTool('node.local.command')) {
      throw new Error('[SecurityGatekeeper] Tool node.local.command is not authorized.');
    }

    const trimmedBinary = binary.trim().toLowerCase();
    if (!PERMITTED_NODE_BINARIES.has(trimmedBinary)) {
      throw new Error(`[SecurityException] Node binary '${trimmedBinary}' is forbidden by security policy.`);
    }

    // Disallow dangerous shell metacharacters and directory traversal
    const dangerousChars = [';', '&&', '||', '`', '$(', '>', '<', '|', '..', '/etc/', '/root'];
    for (const arg of args) {
      if (dangerousChars.some(char => arg.includes(char))) {
        throw new Error(`[SecurityException] Illegal characters detected in command argument: ${arg}`);
      }
    }

    return localDevEngine.runNodeCommand(siteIdOrDomain, trimmedBinary, args);
  }

  /**
   * node.local.restart - Restart a Node.js container
   */
  public static async restartNodeSite(siteIdOrDomain: string) {
    if (!SecurityGatekeeper.validateAllowedTool('node.local.restart')) {
      throw new Error('[SecurityGatekeeper] Tool node.local.restart is not authorized.');
    }
    return localDevEngine.restartNodeSite(siteIdOrDomain);
  }

  /**
   * node.local.rollback - Rollback a Node site to a snapshot
   */
  public static async rollbackNodeSite(siteIdOrDomain: string, snapshotId: string) {
    if (!SecurityGatekeeper.validateAllowedTool('node.local.rollback')) {
      throw new Error('[SecurityGatekeeper] Tool node.local.rollback is not authorized.');
    }
    return localDevEngine.restoreNodeSnapshot(siteIdOrDomain, snapshotId);
  }

  /**
   * node.local.remove - Remove a Node container (Requires Policy check)
   */
  public static async removeNodeSite(
    siteIdOrDomain: string,
    policyConfig: { currentLevel: RepairPolicyLevel; hasApproval?: boolean }
  ) {
    const policy = SecurityGatekeeper.checkPolicyLevelPermission(
      'node.local.remove',
      RepairPolicyLevel.LEVEL_2_REVERSIBLE_CHANGE,
      policyConfig.currentLevel,
      policyConfig.hasApproval
    );

    if (!policy.permitted) {
      throw new Error(`[SecurityGatekeeper] ${policy.reason}`);
    }

    return localDevEngine.uninstallNodeSite(siteIdOrDomain);
  }
}
