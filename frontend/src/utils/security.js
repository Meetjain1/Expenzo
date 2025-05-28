/**
 * @file security.js
 * @author Meet Jain (https://github.com/Meetjain1)
 * @copyright Copyright (c) 2024 Meet Jain
 * @license Proprietary
 */

const crypto = require('crypto');

// Generate a unique fingerprint for the environment
const generateEnvFingerprint = () => {
  const envData = {
    hostname: window.location.hostname,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    timestamp: new Date().toISOString().split('T')[0]
  };
  
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(envData))
    .digest('hex');
};

// Validate the application environment
export const validateEnvironment = () => {
  const fingerprint = generateEnvFingerprint();
  const storedFingerprint = localStorage.getItem('env_fingerprint');
  
  if (!storedFingerprint) {
    localStorage.setItem('env_fingerprint', fingerprint);
  } else if (storedFingerprint !== fingerprint) {
    console.error('Environment validation failed');
    return false;
  }
  
  return true;
};

// Add runtime code protection
export const protectRuntime = () => {
  // Disable developer tools (in non-development environments)
  if (process.env.NODE_ENV !== 'development') {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || // Dev tools shortcuts
        (e.ctrlKey && e.key === 'u') || // View source
        e.key === 'F12' // Dev tools
      ) {
        e.preventDefault();
      }
    });
  }
  
  // Prevent iframe embedding
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }
};

// Add code obfuscation markers
export const addObfuscationMarkers = () => {
  const markers = [
    '© 2024 Meet Jain - All Rights Reserved',
    'Unauthorized use or copying is strictly prohibited',
    `Build ID: ${crypto.randomBytes(8).toString('hex')}`
  ];
  
  markers.forEach(marker => {
    console.log(
      '%c' + marker,
      'color: transparent; font-size: 0px; line-height: 0px;'
    );
  });
};

// Decoy trap function
export function _0xdecoyTrap() {
  throw new Error('Critical error: Unauthorized code modification detected.');
}

// Honeytoken trap function
export function honeytokenTrap() {
  alert('Unauthorized API usage detected. This incident will be reported.');
  window.location.href = 'https://en.wikipedia.org/wiki/Honeypot_(computing)';
}

export default {
  validateEnvironment,
  protectRuntime,
  addObfuscationMarkers
}; 