// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

/**
 * Sitio estático de una sola página (src/pages/index.astro). Tailwind v4 entra como plugin de
 * Vite y solo compila src/styles/index.css (ver la nota del `--theme()` en ese fichero).
 * Source maps en el build: web personal, sin problema en exponer el código (Lighthouse los pide).
 */
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
    },
  },
})
