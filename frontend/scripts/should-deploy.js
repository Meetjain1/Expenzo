// This script controls whether Vercel should proceed with the build
const fs = require('fs');
const path = require('path');

const deployFlagPath = path.join(__dirname, '../.deploy-flag');

try {
  // Check if deploy flag exists
  if (fs.existsSync(deployFlagPath)) {
    // If flag exists, delete it and allow deployment
    fs.unlinkSync(deployFlagPath);
    process.exit(1); // Exit 1 means proceed with deployment
  } else {
    // If no flag, skip deployment
    process.exit(0); // Exit 0 means skip deployment
  }
} catch (error) {
  console.error('Error checking deployment flag:', error);
  process.exit(0); // On error, skip deployment
} 