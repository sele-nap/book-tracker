import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on) {
      on('task', {
        async seed() {
          const { execSync } = await import('child_process');
          execSync('npm run seed', {
            cwd: '../server',
            env: { ...process.env },
            stdio: 'inherit',
          });
          return null;
        },
      });
    },
  },
});
