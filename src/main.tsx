import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import PerformanceOptimizer from './components/PerformanceOptimizer.tsx';

// Polyfill for requestIdleCallback for older browsers
if (!('requestIdleCallback' in window)) {
  window.requestIdleCallback = function(cb) {
    return setTimeout(() => {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };
  
  window.cancelIdleCallback = function(id) {
    clearTimeout(id);
  };
}

// Create root and render app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <PerformanceOptimizer>
    <App />
  </PerformanceOptimizer>
);