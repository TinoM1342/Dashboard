import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env vars based on mode (dev/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      allowedHosts: ['frontend'],  // Add this line to allow 'frontend' host
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://backend:8000',  // Update default to 'backend' for Docker
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    css: {
      postcss: './postcss.config.cjs',  // Explicitly point to it
    },
  };
});