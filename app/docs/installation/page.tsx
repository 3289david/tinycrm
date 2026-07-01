import { H1, H2, Body, Code, Note, NextLink } from '../components'

export default function InstallationPage() {
  return (
    <div>
      <H1>Installation</H1>
      <Body>
        TinyCRM runs on any Linux VPS or dedicated server. You need Node.js, PostgreSQL, and Nginx.
        It works with servers managed by cPanel, DirectAdmin, Plesk, or plain SSH.
      </Body>

      <H2>Requirements</H2>
      <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden mb-8">
        {[
          ['Node.js', '20 or later'],
          ['PostgreSQL', '14 or later'],
          ['Nginx', 'Any recent version'],
          ['PM2', 'npm install -g pm2'],
          ['RAM', '512 MB minimum, 1 GB recommended'],
          ['OS', 'Ubuntu 22.04 / Debian 12 / any Linux'],
        ].map(([req, val]) => (
          <div key={req} className="flex items-center justify-between px-4 py-3 bg-canvas">
            <span className="text-sm text-ink-mute">{req}</span>
            <span className="text-sm text-ink font-normal">{val}</span>
          </div>
        ))}
      </div>

      <H2>1. Clone the repository</H2>
      <Code>{`git clone https://github.com/yourusername/tinycrm.git /var/www/tinycrm
cd /var/www/tinycrm
npm install`}</Code>

      <H2>2. Set up the database</H2>
      <Body>Create a PostgreSQL database and user for TinyCRM.</Body>
      <Code>{`sudo -u postgres psql

CREATE DATABASE tinycrm;
CREATE USER tinycrm WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE tinycrm TO tinycrm;
\\q`}</Code>

      <H2>3. Configure environment</H2>
      <Body>Copy the example file and fill in your values.</Body>
      <Code>{`cp .env.example .env
nano .env`}</Code>

      <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden mb-8">
        {[
          ['DATABASE_URL', 'postgresql://tinycrm:password@localhost:5432/tinycrm'],
          ['NEXTAUTH_SECRET', 'Run: openssl rand -base64 32'],
          ['NEXTAUTH_URL', 'https://yourdomain.com'],
          ['STRIPE_SECRET_KEY', 'sk_live_... from Stripe dashboard'],
          ['STRIPE_WEBHOOK_SECRET', 'whsec_... from Stripe webhook setup'],
          ['NEXT_PUBLIC_APP_URL', 'https://yourdomain.com'],
        ].map(([key, hint]) => (
          <div key={key} className="px-4 py-3 bg-canvas">
            <p className="text-xs font-normal text-ink mb-0.5" style={{ fontFamily: 'ui-monospace, monospace' }}>{key}</p>
            <p className="text-xs text-ink-mute">{hint}</p>
          </div>
        ))}
      </div>

      <H2>4. Run database migrations</H2>
      <Code>{`npx prisma db push`}</Code>
      <Note>Use <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>prisma migrate deploy</code> instead of <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>db push</code> in existing production environments.</Note>

      <H2>5. Build</H2>
      <Code>{`npm run build`}</Code>

      <H2>6. Start with PM2</H2>
      <Code>{`npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup`}</Code>
      <Note>
        <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>pm2 startup</code> generates a command to run — copy and paste it to enable auto-start on boot.
      </Note>

      <H2>7. Create your first account</H2>
      <Body>Visit <strong className="font-normal text-ink">yourdomain.com/register</strong>. The first account you register becomes the system administrator.</Body>

      <div className="mt-10 pt-8 border-t border-hairline flex items-center justify-between">
        <span className="text-ink-mute text-sm">Next</span>
        <NextLink href="/docs/nginx">Nginx & SSL</NextLink>
      </div>
    </div>
  )
}
