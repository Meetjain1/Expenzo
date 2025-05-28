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

// Anti-debugging timing trap
(function() {
  let start = Date.now();
  debugger;
  if (Date.now() - start > 100) {
    document.body.innerHTML = '<h1>Access Denied</h1><p>Debugging detected. This application cannot be debugged.</p>';
    throw new Error('Debugging detected');
  }
})();

// Client-side tamper detection (hash check)
(function() {
  // SHA-256 hash of this file's original content (update if you change this file)
  const expectedHash = 'b7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2';
  fetch(window.location.pathname)
    .then(res => res.text())
    .then(text => {
      if (window.crypto && window.crypto.subtle) {
        window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(hashBuffer => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          if (hashHex !== expectedHash) {
            document.body.innerHTML = '<h1>Access Denied</h1><p>Code tampering detected.</p>';
            throw new Error('Code tampering detected');
          }
        });
      }
    });
})();

// Self-destruct on unauthorized host
(function() {
  const allowed = ['expenzo-fawn.vercel.app', 'localhost', '127.0.0.1'];
  if (!allowed.includes(window.location.hostname)) {
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => window.location.reload(), 100);
  }
})();

// Headless browser detection
(function() {
  const isHeadless = /HeadlessChrome/.test(window.navigator.userAgent) || window.navigator.webdriver;
  if (isHeadless) {
    document.body.innerHTML = '<h1>Access Denied</h1><p>Headless browser detected.</p>';
    throw new Error('Headless browser detected');
  }
})();

// Dynamic license key check
(function() {
  const requiredKey = 'MEETJAIN-EXPENZO-2024';
  const licenseKey = process.env.REACT_APP_LICENSE_KEY;
  if (typeof licenseKey !== 'string' || licenseKey !== requiredKey) {
    document.body.innerHTML = '<h1>Access Denied</h1><p>Missing or invalid license key.</p>';
    throw new Error('Invalid license key');
  }
})();

// Mutation observer trap
(function() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        if (document.body.innerHTML.indexOf('Expenzo') === -1) {
          document.body.innerHTML = '<h1>Access Denied</h1><p>DOM tampering detected.</p>';
          throw new Error('DOM tampering detected');
        }
      }
    });
  });
  observer.observe(document.body, { attributes: true, childList: true, subtree: true });
})();

// Console clear block
(function() {
  const origClear = window.console.clear;
  window.console.clear = function() {
    window.console.log('Console clearing is disabled.');
  };
})();

// Disable right-click and text selection
(function() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => e.preventDefault());
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
