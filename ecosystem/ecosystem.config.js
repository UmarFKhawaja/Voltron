const envs = {
  'monitor-app': require('./envs/monitor-app.json'),
  'server-app': require('./envs/server-app.json')
};

module.exports = {
  apps: [
    {
      name: 'monitor-app',
      script: '../dist/apps/monitor-app/main.js',
      watch: true,
      env: envs['monitor-app']
    },
    {
      name: 'server-app',
      script: '../dist/apps/server-app/main.js',
      watch: true,
      env: envs['server-app']
    }
  ]
};
