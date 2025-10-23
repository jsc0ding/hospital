# My Project - Node.js + React with MongoDB and Telegram Bot

## Project Structure

```
my-project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   └── App.js          # React component with "Welcome to My App"
│   └── package.json        # Client dependencies and scripts
├── server/                 # Node.js + Express backend
│   └── server.js           # Main server file with MongoDB and Telegram bot
├── package.json            # Root package.json with build scripts
└── .gitignore              # Git ignore file
```

## Features

1. **Backend (server/server.js)**
   - Express.js server
   - MongoDB connection via `process.env.MONGO_URI`
   - Telegram bot via `process.env.BOT_TOKEN`
   - API endpoint `/api/test`
   - Serves React frontend from `../client/build`
   - Server port: `process.env.PORT || 5000`

2. **Frontend (client/src/App.js)**
   - Simple React component displaying "Welcome to My App"

3. **Scripts (package.json)**
   - `"start": "node server/server.js"`
   - `"client:build": "cd client && npm install && npm run build"`
   - `"build:all": "npm install && npm run client:build"`

## Environment Variables

Create a `.env` file in the root directory with:

```env
MONGO_URI=your_mongodb_connection_string
BOT_TOKEN=your_telegram_bot_token
PORT=5000
NODE_ENV=production
```

## Installation and Setup

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install client dependencies and build:
   ```bash
   npm run build:all
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start` - Start the Node.js server
- `npm run client:build` - Build the React frontend
- `npm run build:all` - Install dependencies and build everything

## Deployment

This project is ready for deployment to any Node.js hosting platform. Make sure to set the required environment variables.