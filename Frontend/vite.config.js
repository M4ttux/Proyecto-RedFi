import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // esto habilita acceso desde otros dispositivos
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: { 
    alias: { '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs', }, 
  }, 
})