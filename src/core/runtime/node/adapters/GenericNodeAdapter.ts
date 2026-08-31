/**
 * AI Digital Factory - Generic Node.js Framework Adapter
 * Provides fallback scaffolding, detection, and lifecycle commands for raw/standard Node.js projects.
 */

import { NodeFrameworkAdapter, NodeFramework, NodeProjectConfig } from '../types';

export class GenericNodeAdapter implements NodeFrameworkAdapter {
  public readonly name = 'Generic Node.js Adapter';
  public readonly framework: NodeFramework = 'generic';

  public detect(packageJson: Record<string, any>, files: string[] = []): { detected: boolean; confidence: number; metadata?: Record<string, any> } {
    const isNode = Boolean(packageJson.name || packageJson.main || packageJson.scripts || files.includes('package.json'));
    return {
      detected: isNode,
      confidence: isNode ? 0.7 : 0.0,
      metadata: {
        entrypoint: packageJson.main || 'index.js',
        scripts: Object.keys(packageJson.scripts || {})
      }
    };
  }

  public generateScaffold(blueprint: any, designTokens?: any, config?: Partial<NodeProjectConfig>): Record<string, string> {
    const appName = (blueprint?.business || blueprint?.name || 'node-app').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const port = config?.port || 3000;

    const packageJson = {
      name: appName,
      version: '1.0.0',
      description: blueprint?.summary || 'Autonomous Node.js Application',
      main: 'src/index.js',
      type: 'module',
      scripts: {
        start: 'node src/index.js',
        dev: 'node --watch src/index.js',
        build: 'echo "Generic build complete"',
        test: 'node --test'
      },
      engines: {
        node: '>=20.0.0'
      },
      dependencies: {
        ...config?.dependencies
      }
    };

    const serverJs = `import http from 'node:http';

const PORT = process.env.PORT || ${port};

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      runtime: 'Node.js ' + process.version
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Welcome to ${blueprint?.business || blueprint?.name || 'Autonomous Node.js App'}',
    status: 'online',
    environment: process.env.NODE_ENV || 'development'
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(\`[GenericNode] Server listening on http://0.0.0.0:\${PORT}\`);
});
`;

    return {
      'package.json': JSON.stringify(packageJson, null, 2),
      'src/index.js': serverJs,
      '.env.example': `PORT=${port}\nNODE_ENV=development\n`,
      'README.md': `# ${appName}\n\nAutonomous Node.js service synthesized by AI Digital Factory.\n`
    };
  }

  public getBuildCommand(): string {
    return 'npm run build';
  }

  public getStartCommand(entrypoint = 'src/index.js'): string {
    return `node ${entrypoint}`;
  }

  public getDefaultPort(): number {
    return 3000;
  }

  public getHealthEndpoint(): string {
    return '/health';
  }
}

export const genericNodeAdapter = new GenericNodeAdapter();
