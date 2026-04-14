import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import path from "path"

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      VueI18nPlugin({
        include: path.resolve(__dirname, "./src/locales/**")
      })
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },

    server: {
      port: 8080
    }
  }
})