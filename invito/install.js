// Run this script to install all dependencies
const { execSync } = require('child_process');
const path = require('path');

const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

console.log('📦 Installing server dependencies...');
try {
  execSync('npm install', { cwd: serverDir, stdio: 'inherit' });
  console.log('✅ Server dependencies installed!');
} catch (e) {
  console.error('❌ Server install failed:', e.message);
}
