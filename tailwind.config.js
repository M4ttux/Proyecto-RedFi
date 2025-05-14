import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    preprocessorOptions: {
      css: {
        variables: {
          texto: "rgb(var(--color-texto) / <alpha-value>)",
          fondo: "rgb(var(--color-fondo) / <alpha-value>)",
          primario: "rgb(var(--color-primario) / <alpha-value>)",
          secundario: "rgb(var(--color-secundario) / <alpha-value>)",
          acento: "rgb(var(--color-acento) / <alpha-value>)",
        },
      },
    },
  },
  // Tailwind config stays in tailwind.config.js, use the CSS variables in classes
})
