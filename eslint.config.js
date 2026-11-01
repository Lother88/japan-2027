import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    '.astro',
    // Árbol React pendiente de portar a Astro (se borra al terminar la migración)
    'vite.config.ts',
    'src/**/*.tsx',
    'src/features/landing/hero-art/useLazyArt.ts',
    'src/features/landing/useScrollJourney.ts',
    'src/features/landing/useThemeMode.ts',
  ]),
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
