const os = require('os');
const allowedUsers = ['meetjain', 'Meet Jain'];
if (!allowedUsers.includes(os.userInfo().username) && !process.env.SKIP_PREINSTALL) {
  console.error('Unauthorized install attempt detected.');
  process.exit(1);
} 