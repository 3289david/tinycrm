module.exports = {
  apps: [
    {
      name: 'tinycrm',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/tinycrm',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/tinycrm-error.log',
      out_file: '/var/log/pm2/tinycrm-out.log',
    },
  ],
}
