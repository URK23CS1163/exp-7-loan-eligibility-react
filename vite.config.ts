import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use env to support both GitHub Pages and Render
  // On Render set VITE_BASE_PATH=/
  // In GitHub Actions set VITE_BASE_PATH=/exp-7-loan-eligibility-react/
  base: process.env.VITE_BASE_PATH ?? '/',
})
