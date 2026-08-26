import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'

const site = process.env.SITE_URL ?? (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4321')

if (!site) {
  throw new Error('SITE_URL is required for production builds (for example: https://blog.example.com).')
}

export default defineConfig({
  site,
  integrations: [vue(), sitemap()],
  vite: {
    ssr: { noExternal: true },
  },
})
