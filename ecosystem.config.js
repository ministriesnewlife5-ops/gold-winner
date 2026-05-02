module.exports = {
  apps: [
    {
      name: "crowd9-goldwinner-production",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/srv/apps/crowd9-goldwinner/production/app",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      error_file: "/srv/apps/crowd9-goldwinner/production/logs/err.log",
      out_file:   "/srv/apps/crowd9-goldwinner/production/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
