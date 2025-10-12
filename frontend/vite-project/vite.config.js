import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop();
          if (/(png|jpg|jpeg|gif|svg|webp|ico)/i.test(ext || '')) return 'assets/images/[name]-[hash][extname]';
          if (/(css)/i.test(ext || '')) return 'assets/styles/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
