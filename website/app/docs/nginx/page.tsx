import { H1, H2, Body, Code, Note, NextLink, PrevLink } from '../components'

export default function NginxPage() {
  return (
    <div>
      <H1>Nginx & SSL</H1>
      <Body>
        TinyCRM runs on port 3000. Nginx proxies public traffic to it and handles HTTPS via Let's Encrypt.
      </Body>

      <H2>Install Nginx</H2>
      <Code>{`sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx`}</Code>

      <H2>Create site config</H2>
      <Body>Copy the included <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>nginx.conf</code> from the repo and update the domain name.</Body>
      <Code>{`sudo cp /var/www/tinycrm/nginx.conf /etc/nginx/sites-available/tinycrm

# Replace 'yourdomain.com' with your actual domain:
sudo nano /etc/nginx/sites-available/tinycrm

sudo ln -s /etc/nginx/sites-available/tinycrm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx`}</Code>

      <H2>The config file</H2>
      <Body>This is what nginx.conf contains. The key part is the <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>proxy_pass</code> to port 3000.</Body>
      <Code>{`server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`}</Code>

      <H2>SSL certificate</H2>
      <Body>Get a free SSL certificate with Certbot. Point your domain's DNS to the server IP first.</Body>
      <Code>{`sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
sudo systemctl reload nginx`}</Code>
      <Note>Certbot automatically renews certificates. Verify with: <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>certbot renew --dry-run</code></Note>

      <H2>Firewall</H2>
      <Code>{`sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable`}</Code>

      <H2>Verify</H2>
      <Body>After setup, visiting your domain should show TinyCRM over HTTPS. Port 3000 should not be publicly reachable.</Body>

      <div className="mt-10 pt-8 border-t border-hairline flex items-center justify-between">
        <PrevLink href="/docs/installation">Installation</PrevLink>
        <NextLink href="/docs/stripe">Stripe payments</NextLink>
      </div>
    </div>
  )
}
