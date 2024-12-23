import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './app';

// Create a root element and render the application
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
