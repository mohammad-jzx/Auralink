import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      // توجيه مسار الفيديو مباشرةً إلى خادم Flask
      '/video_feed': 'http://127.0.0.1:5000'
    }
  }
})


