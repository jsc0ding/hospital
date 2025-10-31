#!/usr/bin/env node

// Build script for production deployment
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting production build process...');

try {
  // Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, '../client'), stdio: 'inherit' });
  
  // Build React frontend directly with react-scripts to avoid recursive calls
  console.log('🏗️ Building React frontend...');
  execSync('npx react-scripts build', { cwd: path.join(__dirname, '../client'), stdio: 'inherit' });
  
  console.log('✅ Build process completed successfully!');
} catch (error) {
  console.error('❌ Build process failed:', error.message);
  process.exit(1);
}