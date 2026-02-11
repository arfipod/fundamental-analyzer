import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { buildDependencies } from './compositionRoot';
import '../ui/styles/global.css';

buildDependencies();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
