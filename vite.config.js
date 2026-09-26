import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        fridge: page('./remont-holodilnikov-tashkent/index.html'),
        washer: page('./remont-stiralnyh-mashin-tashkent/index.html'),
        appliances: page('./remont-bytovoy-tehniki-tashkent/index.html')
      }
    }
  }
})
