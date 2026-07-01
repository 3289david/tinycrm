import { H1, H2, Body, Code, Note, PrevLink } from '../components'

export default function ScalingPage() {
  return (
    <div>
      <H1>Scaling</H1>
      <Body>
        TinyCRM is stateless — all data lives in PostgreSQL.
        You can run multiple Node.js processes on one server (vertical scaling)
        or across multiple servers (horizontal scaling) without any code changes.
      </Body>

      <H2>PM2 cluster mode (single server)</H2>
      <Body>
        PM2 can fork one process per CPU core. Edit <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>ecosystem.config.js</code>:
      </Body>
      <Code>{`module.exports = {
  apps: [{
    name: 'tinycrm',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/tinycrm',
    instances: 'max',      // one per CPU core
    exec_mode: 'cluster',  // share port 3000
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
}`}</Code>
      <Code>{`pm2 reload ecosystem.config.js
pm2 save`}</Code>
      <Note>
        <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>pm2 reload</code> does a zero-downtime restart, replacing workers one at a time.
      </Note>

      <H2>Multiple servers (horizontal)</H2>
      <Body>
        Run TinyCRM on several servers with a shared PostgreSQL instance.
        Use Nginx upstream to distribute traffic.
      </Body>
      <Code>{`upstream tinycrm_cluster {
    server 10.0.0.1:3000;   # server 1
    server 10.0.0.2:3000;   # server 2
    server 10.0.0.3:3000;   # server 3
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    location / {
        proxy_pass http://tinycrm_cluster;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}</Code>

      <H2>Database connection pooling</H2>
      <Body>
        With many instances each holding their own connection pool, you may exhaust PostgreSQL's connection limit.
        Use PgBouncer to pool connections centrally.
      </Body>
      <Code>{`sudo apt install pgbouncer -y`}</Code>
      <Body>
        Then update <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>DATABASE_URL</code> in your .env to point at PgBouncer (port 6432) instead of PostgreSQL directly (port 5432).
      </Body>
      <Code>{`DATABASE_URL="postgresql://tinycrm:password@localhost:6432/tinycrm?pgbouncer=true&connection_limit=1"}`}</Code>

      <H2>PostgreSQL on a separate server</H2>
      <Body>
        For high traffic, move the database to a dedicated server. Update <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>DATABASE_URL</code> on all app servers to point to the DB server's IP.
        Use a private network interface, not the public IP, to avoid data transfer costs and latency.
      </Body>
      <Code>{`DATABASE_URL="postgresql://tinycrm:password@10.0.0.10:5432/tinycrm"`}</Code>

      <H2>Monitoring</H2>
      <Code>{`pm2 monit                  # live CPU/RAM per process
pm2 logs tinycrm           # tail logs
pm2 list                   # process list and status`}</Code>

      <div className="mt-10 pt-8 border-t border-hairline">
        <PrevLink href="/docs/admin">Admin panel</PrevLink>
      </div>
    </div>
  )
}
