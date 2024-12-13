import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '34.200.90.9', // Bind to all network interfaces
    port: 5173      // Optional: Customize the port if needed
  },
})
