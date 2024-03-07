module.exports = {
  apps: [
    {
      name: 'Mappilogue',
      cwd: 'mappilogue-temp',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      wait_ready: true,
      kill_timeout: 5000,
      autorestart: true,
      watch: true,
      args: ['--color'],
    },
  ],
};
