// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      dbHost: process.env.DB_HOST || 'localhost',
      dbUser: process.env.DB_USER || 'root',
      dbPassword: process.env.DB_PASSWORD || '',
      dbName: process.env.DB_NAME || 'maid_management'
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  }
})