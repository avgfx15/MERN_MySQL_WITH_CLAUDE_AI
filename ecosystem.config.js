module.exports = {
  apps: [
    {
      name: 'mern-backend',
      cwd: '/var/www/mern-mysql-app/backend',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/pm2/mern-backend-error.log',
      out_file: '/var/log/pm2/mern-backend-out.log',
      log_file: '/var/log/pm2/mern-backend-combined.log',
      time: true,
      merge_logs: true,
    },
  ],
};
