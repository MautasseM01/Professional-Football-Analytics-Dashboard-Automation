
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      // Reduce file watcher load
      usePolling: false,
      interval: 1000,
      binaryInterval: 1000,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/.nuxt/**',
        '**/.vuepress/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/.cache/**',
        '**/.temp/**',
        '**/.tmp/**',
        '**/*.log',
        '**/.DS_Store',
        '**/Thumbs.db'
      ]
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize build and dev performance
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Reduce the number of chunks and optimize bundling
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
}));
