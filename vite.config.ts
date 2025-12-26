import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isGitHubPages = process.env.GITHUB_PAGES === 'true';
    
    return {
      base: isGitHubPages ? '/ai-studio-edit-image-pro/' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        externalizeDeps({
          deps: true,
          devDeps: false
        }),
        react({
          jsxRuntime: 'classic'
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          external: ['react', 'react-dom', '@google/genai'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            }
          }
        }
      }
    };
});
