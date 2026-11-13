// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

/**
 * Sitio estático: la landing (src/pages/index.astro) y la página de hoteles
 * (src/pages/hoteles.astro). Tailwind v4 entra como plugin de Vite y solo compila
 * src/styles/index.css (ver la nota del `--theme()` en ese fichero).
 * Source maps en el build: web personal, sin problema en exponer el código (Lighthouse los pide).
 * El CSS va en línea en el <head>: la landing lleva una sola hoja (~7 KB comprimida) y /hoteles/
 * añade la suya (src/styles/hotels.css) solo en esa página; así se ahorra la petición que
 * bloqueaba el render y las @font-face se descubren con el HTML.
 */
export default defineConfig({
  // URL pública (Render): la usan las URL absolutas de canonical y Open Graph en Base.astro
  site: 'https://viaje-japon-2027.onrender.com',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
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
