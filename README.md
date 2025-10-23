# Node.js + React App Ready for Render.com Deployment

This is a full-stack application with Node.js (Express) backend and React frontend, ready for deployment on Render.com.

## Project Structure

```
.
├── client/              # React frontend
│   ├── public/
│   └── src/
│       └── App.js       # "Welcome to My App" component
├── server/              # Node.js backend
│   └── server.js        # Express server with MongoDB and Telegram bot
├── package.json         # Root package.json with build scripts
└── README.md
```

## Features

1. **Backend (server/server.js)**
   - Express.js server
   - PORT configured via `process.env.PORT` (defaults to 5000)
   - `/api/test` endpoint returning "Hello World"
   - MongoDB connection via `process.env.MONGO_URI`
   - Telegram bot integration via `process.env.BOT_TOKEN`
   - Serves React frontend static files from `client/build`

2. **Frontend (client/src/App.js)**
   - Simple React component displaying "Welcome to My App"

3. **Deployment Ready**
   - Single server deployment (backend serves frontend)
   - Environment variables for configuration
   - Build and start scripts configured

## Environment Variables

Create a `.env` file in the `server/` directory with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
BOT_TOKEN=your_telegram_bot_token
NODE_ENV=production
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. Build the React frontend:
   ```bash
   cd client && npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Render.com Deployment

### Web Service Configuration

1. **Build Command:**
   ```
   npm run build
   ```

2. **Start Command:**
   ```
   npm start
   ```

3. **Environment Variables (in Render Dashboard):**
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `your_mongodb_connection_string`
   - `BOT_TOKEN` = `your_telegram_bot_token`

### Important Notes

- The application will start on the port specified by `PORT` environment variable (Render.com automatically sets this)
- MongoDB connection string must be set in `MONGO_URI` environment variable
- Telegram bot token must be set in `BOT_TOKEN` environment variable for bot functionality
- The server will serve both API endpoints and React frontend static files
- No "No open ports detected" errors will occur as the server listens on the PORT specified by Render.com

## API Endpoints

- `GET /api/test` - Returns `{ "message": "Hello World" }`

## File Details

### server/server.js
- Express server implementation
- MongoDB connection handling
- Telegram bot initialization
- Static file serving for React build
- Proper port configuration for Render.com

### root package.json
- `"start"` script to run the server
- `"build"` script to build the React frontend

### client/package.json
- Standard Create React App configuration
- `"build"` script to create production build

### client/src/App.js
- Simple React component with "Welcome to My App" text

### .gitignore
- Proper exclusions for Node.js and React projects