import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Removed reportWebVitals import as it's not essential for minimal setup

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Removed reportWebVitals call as it's not essential for minimal setup