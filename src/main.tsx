
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Run after initial render
  setTimeout(() => {
    initPerformanceMonitoring();
  }, 0);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
