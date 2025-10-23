import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// API endpoint that returns "Hello World"
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Serve static files from the React app build directory in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  // Set build path to client build directory
  const buildPath = path.join(__dirname, '../client/build');
  
  // Serve static files
  app.use(express.static(buildPath));
  
  // For any other route, serve index.html (for client-side routing)
  app.use((req, res) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});