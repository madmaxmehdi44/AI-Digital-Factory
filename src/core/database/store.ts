import {
  User,
  BusinessProfile,
  Website,
  WordPressThemeRecord,
  DeploymentRecord,
  HostingAccount,
  OperationsLog,
  AITask,
  HealthCheckRecord,
  BackupRecord
} from "./types";

type Listener = () => void;

class FactoryDatabase {
  private users: Map<string, User> = new Map();
  private businessProfiles: Map<string, BusinessProfile> = new Map();
  private websites: Map<string, Website> = new Map();
  private themes: Map<string, WordPressThemeRecord> = new Map();
  private deployments: Map<string, DeploymentRecord> = new Map();
  private hostingAccounts: Map<string, HostingAccount> = new Map();
  private operationsLogs: OperationsLog[] = [];
  private aiTasks: Map<string, AITask> = new Map();
  private healthChecks: HealthCheckRecord[] = [];
  private backups: Map<string, BackupRecord> = new Map();
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
    this.seedDefaultsIfEmpty();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("ai_factory_db_v2");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.users) data.users.forEach((u: User) => this.users.set(u.id, u));
        if (data.businessProfiles) data.businessProfiles.forEach((b: BusinessProfile) => this.businessProfiles.set(b.id, b));
        if (data.websites) data.websites.forEach((w: Website) => this.websites.set(w.id, w));
        if (data.themes) data.themes.forEach((t: WordPressThemeRecord) => this.themes.set(t.id, t));
        if (data.deployments) data.deployments.forEach((d: DeploymentRecord) => this.deployments.set(d.id, d));
        if (data.hostingAccounts) data.hostingAccounts.forEach((h: HostingAccount) => this.hostingAccounts.set(h.id, h));
        if (data.operationsLogs) this.operationsLogs = data.operationsLogs;
        if (data.aiTasks) data.aiTasks.forEach((a: AITask) => this.aiTasks.set(a.id, a));
        if (data.healthChecks) this.healthChecks = data.healthChecks;
        if (data.backups) data.backups.forEach((b: BackupRecord) => this.backups.set(b.id, b));
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }

  public saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      const data = {
        users: Array.from(this.users.values()),
        businessProfiles: Array.from(this.businessProfiles.values()),
        websites: Array.from(this.websites.values()),
        themes: Array.from(this.themes.values()),
        deployments: Array.from(this.deployments.values()),
        hostingAccounts: Array.from(this.hostingAccounts.values()),
        operationsLogs: this.operationsLogs.slice(-200),
        aiTasks: Array.from(this.aiTasks.values()).slice(-100),
        healthChecks: this.healthChecks.slice(-100),
        backups: Array.from(this.backups.values())
      };
      localStorage.setItem("ai_factory_db_v2", JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  private seedDefaultsIfEmpty() {
    if (this.websites.size === 0) {
      const defaultSites: Website[] = [
        {
          id: "site_veloce_1",
          businessId: "biz_veloce",
          name: "Veloce Health Diagnostics",
          domain: "velocehealth.org",
          status: "healthy",
          hostingType: "docker",
          wpVersion: "6.7.1",
          phpVersion: "8.2.18",
          themeSlug: "wp-veloce-health",
          uptimePercent: 99.98,
          responseTimeMs: 24,
          coreVitalsScore: 98,
          sslExpiryDays: 84,
          pluginsCount: 7,
          lastBackupAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          lastAuditAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
        },
        {
          id: "site_apex_2",
          businessId: "biz_apex",
          name: "Apex Autonomous Logistics",
          domain: "apexlogistics.io",
          status: "healthy",
          hostingType: "cpanel",
          wpVersion: "6.7.0",
          phpVersion: "8.2.14",
          themeSlug: "wp-apex-logistics",
          uptimePercent: 99.94,
          responseTimeMs: 38,
          coreVitalsScore: 94,
          sslExpiryDays: 45,
          pluginsCount: 9,
          lastBackupAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          lastAuditAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
        },
        {
          id: "site_luminary_3",
          businessId: "biz_luminary",
          name: "Luminary AI Media Studio",
          domain: "luminarymedia.ai",
          status: "warning",
          hostingType: "plesk",
          wpVersion: "6.6.2",
          phpVersion: "8.1.28",
          themeSlug: "wp-luminary-studio",
          uptimePercent: 98.82,
          responseTimeMs: 82,
          coreVitalsScore: 86,
          sslExpiryDays: 14,
          pluginsCount: 14,
          lastBackupAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          lastAuditAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
        }
      ];
      defaultSites.forEach(s => this.websites.set(s.id, s));
    }

    if (this.hostingAccounts.size === 0) {
      const defaultConnectors: HostingAccount[] = [
        {
          id: "conn-docker-local",
          name: "Local Production Cluster (Docker Swarm)",
          type: "docker",
          host: "unix:///var/run/docker.sock",
          status: "connected",
          lastPingMs: 6,
          serverInfo: {
            php: "8.2.14",
            mysql: "8.0.35-InnoDB",
            webServer: "Nginx 1.25.3 (HTTP/3)",
            memoryLimit: "1024M"
          },
          vaultKeyId: "vault_sec_dk_9918",
          maskedToken: "••••••••••••••••39a1",
          createdAt: new Date().toISOString()
        },
        {
          id: "conn-cpanel-liquid",
          name: "LiquidWeb Enterprise cPanel Node",
          type: "cpanel",
          host: "cpanel.liquidweb-cluster.net",
          status: "connected",
          lastPingMs: 38,
          serverInfo: {
            php: "8.2.18",
            mysql: "10.6.17-MariaDB",
            webServer: "LiteSpeed Enterprise",
            memoryLimit: "512M"
          },
          vaultKeyId: "vault_sec_cp_4402",
          maskedToken: "••••••••••••••••77b2",
          createdAt: new Date().toISOString()
        },
        {
          id: "conn-plesk-hetzner",
          name: "Hetzner Cloud Plesk Obsidian Server",
          type: "plesk",
          host: "plesk.hetzner-eu.cloud",
          status: "connected",
          lastPingMs: 44,
          serverInfo: {
            php: "8.1.28",
            mysql: "MySQL 8.0.33",
            webServer: "Apache 2.4.58 + Nginx Reverse Proxy",
            memoryLimit: "512M"
          },
          vaultKeyId: "vault_sec_pl_1190",
          maskedToken: "••••••••••••••••49f0",
          createdAt: new Date().toISOString()
        }
      ];
      defaultConnectors.forEach(c => this.hostingAccounts.set(c.id, c));
    }

    if (this.operationsLogs.length === 0) {
      this.log("INFO", "HOSTING", "Autonomous Factory Cluster booted successfully. All hosting nodes verified.", "cluster");
      this.log("INFO", "WORDPRESS_CORE", "Gutenberg Full Site Editing v3 schema compiler initialized.", "compiler");
      this.log("INFO", "SECURITY", "Vault key rotation verified with AES-GCM token storage.", "vault");
    }

    this.saveToStorage();
  }

  // --- CRUD Operations ---
  public getWebsites(): Website[] {
    return Array.from(this.websites.values());
  }

  public getWebsite(id: string): Website | undefined {
    return this.websites.get(id);
  }

  public saveWebsite(site: Website) {
    this.websites.set(site.id, site);
    this.saveToStorage();
  }

  public getHostingAccounts(): HostingAccount[] {
    return Array.from(this.hostingAccounts.values());
  }

  public saveHostingAccount(acc: HostingAccount) {
    this.hostingAccounts.set(acc.id, acc);
    this.saveToStorage();
  }

  public getDeployments(): DeploymentRecord[] {
    return Array.from(this.deployments.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public saveDeployment(dep: DeploymentRecord) {
    this.deployments.set(dep.id, dep);
    this.saveToStorage();
  }

  public getThemes(): WordPressThemeRecord[] {
    return Array.from(this.themes.values());
  }

  public saveTheme(theme: WordPressThemeRecord) {
    this.themes.set(theme.id, theme);
    this.saveToStorage();
  }

  public log(level: OperationsLog['level'], category: OperationsLog['category'], message: string, domain: string = "system", details?: any) {
    const entry: OperationsLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      domain,
      level,
      category,
      message,
      details,
      timestamp: new Date().toISOString()
    };
    this.operationsLogs.push(entry);
    if (this.operationsLogs.length > 500) {
      this.operationsLogs.shift();
    }
    this.saveToStorage();
    return entry;
  }

  public getLogs(limit: number = 50): OperationsLog[] {
    return this.operationsLogs.slice(-limit).reverse();
  }

  public getAITasks(): AITask[] {
    return Array.from(this.aiTasks.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public saveAITask(task: AITask) {
    this.aiTasks.set(task.id, task);
    this.saveToStorage();
  }

  public getBackups(domain?: string): BackupRecord[] {
    const list = Array.from(this.backups.values());
    if (domain) {
      return list.filter(b => b.domain === domain).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public saveBackup(backup: BackupRecord) {
    this.backups.set(backup.id, backup);
    this.saveToStorage();
  }
}

export const factoryDB = new FactoryDatabase();
