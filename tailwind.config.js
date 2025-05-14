import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    preprocessorOptions: {
      css: {
        variables: {
          texto: 'var(--color-texto)',
          fondo: 'var(--color-fondo)',
          primario: 'var(--color-primario)',
          secundario: 'var(--color-secundario)',
          acento: 'var(--color-acento)',
        },
      },
    },
  },
  // Tailwind config stays in tailwind.config.js, use the CSS variables in classes
})
