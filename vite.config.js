import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces to make it accessible externally
    port: 5173,      // Use port 5173 for the dev server
    strictPort: true // Ensure Vite uses the specified port without fallback
  },
  base: '/', // Optional: Can be updated to match your deployment path
});
