import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/solarsungai-REACT2026Q2/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    pool: 'vmForks',
  },
});
