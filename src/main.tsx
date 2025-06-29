import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import PerformanceOptimizer from './components/PerformanceOptimizer.tsx';

createRoot(document.getElementById("root")!).render(
  <PerformanceOptimizer>
    <App />
  </PerformanceOptimizer>
);