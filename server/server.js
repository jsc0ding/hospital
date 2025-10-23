import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Telegram bot if token is provided
let bot;
if (process.env.BOT_TOKEN) {
  try {
    bot = new Telegraf(process.env.BOT_TOKEN);
    // Basic bot command
    bot.start((ctx) => ctx.reply('Welcome to our app bot!'));
    bot.help((ctx) => ctx.reply('Send me a sticker'));
    bot.on('sticker', (ctx) => ctx.reply('👍'));
    
    // Launch bot
    bot.launch();
    console.log('Telegram bot started successfully');
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
  }
}

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

// Graceful shutdown
process.once('SIGINT', () => {
  if (bot) {
    bot.stop('SIGINT');
  }
  process.exit(0);
});
process.once('SIGTERM', () => {
  if (bot) {
    bot.stop('SIGTERM');
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});