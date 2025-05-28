/**
 * @file index.js
 * @author Meet Jain (https://github.com/Meetjain1)
 * @copyright Copyright (c) 2024 Meet Jain
 * @license Proprietary
 * 
 * This file is part of Expenzo.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 * All rights reserved.
 */

// Security check to prevent unauthorized usage
(function() {
  const validDomains = [
    'expenzo-fawn.vercel.app',
    'localhost',
    '127.0.0.1'
  ];
  
  const isValidDomain = validDomains.some(domain => 
    window.location.hostname === domain || 
    window.location.hostname.endsWith(`.${domain}`)
  );

  if (!isValidDomain) {
    document.body.innerHTML = '<h1>Access Denied</h1><p>This application can only run on authorized domains.</p>';
    throw new Error('Unauthorized domain');
  }
})();

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
);

if (process.env.NODE_ENV === 'development') {
  fetch('/.git/config')
    .then(res => res.text())
    .then(text => {
      if (!text.includes('github.com/Meetjain1/Expenzo.git')) {
        document.body.innerHTML = '<h1>Access Denied</h1><p>This project can only be run from the authorized repository.</p>';
        throw new Error('Unauthorized repository');
      }
    })
    .catch(() => {});
}

if (window.location.hostname === 'localhost') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
}
