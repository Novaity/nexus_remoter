import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("Nexus App starting...");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React Render initiated");
} else {
  console.error("Root element not found in index.html");
}