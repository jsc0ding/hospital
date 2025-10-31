#!/usr/bin/env node

// Script to start both frontend and backend for local development
// Frontend will run on port 3002
// Backend will run on port 5002

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Hospital Management System in development mode...');
console.log('Frontend port: 3002');
console.log('Backend port: 5002');
console.log('');

// Start backend server
const backend = spawn('npm', ['run', 'server'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

// Start frontend client
const frontend = spawn('npm', ['run', 'client'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});