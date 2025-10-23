// Simple test script to verify ES modules work
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('ES modules are working correctly!');
console.log('Current directory:', __dirname);

// Test express import
const app = express();
console.log('Express imported successfully!');

// Test path resolution
const testPath = path.join(__dirname, '../client/build');
console.log('Path resolution working:', testPath);

console.log('All tests passed! Server is ready for ES modules.');