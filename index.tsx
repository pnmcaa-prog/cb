import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Add global styles for full height layout
const style = document.createElement('style');
style.textContent = `
  html, body, #root {
    height: 100%;
  }
`;
document.head.appendChild(style);


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
