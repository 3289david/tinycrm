# TinyCRM

Self-hosted client management with built-in invoicing. Built for freelancers, agencies, and small teams. Runs on any VPS or dedicated server.

## Stack

- **Next.js 14** — App Router, Server Actions
- **PostgreSQL** + **Prisma** — local database, no cloud
- **NextAuth.js** — email/password auth, no OAuth required
- **Stripe** — client invoice payments (your clients pay you)
- **Tailwind CSS** — Stripe-inspired design system

## Features

- Client records with status, notes, tags, timeline
- Invoicing — create an invoice, share a link, client pays by card
- Admin panel — manage all users, promote/demote admins, view revenue
- Export clients to CSV
- Multi-instance support (Nginx + PM2 cluster)

## Quick start

```bash
# 1. Clone
git clone https://github.com/yourusername/tinycrm.git /var/www/tinycrm
cd /var/www/tinycrm

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit .env with your DATABASE_URL, NEXTAUTH_SECRET, and Stripe keys

# 4. Database
sudo -u postgres psql -c "CREATE DATABASE tinycrm;"
sudo -u postgres psql -c "CREATE USER tinycrm WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tinycrm TO tinycrm;"
npx prisma db push

# 5. Build and run
npm run build
pm2 start ecosystem.config.js
```

See `/docs` in the running app for the full setup guide including Nginx, SSL, and Stripe webhook configuration.

## Admin

The first registered account is automatically the system administrator. Admin panel is at `/admin`.

## Stripe webhook

Point `https://yourdomain.com/api/webhooks` to the `checkout.session.completed` event in Stripe Dashboard → Developers → Webhooks.

## License

MIT
