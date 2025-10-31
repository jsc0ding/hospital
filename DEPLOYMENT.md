# Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (render.com)
- MongoDB Atlas database

## Deployment Steps

### 1. Environment Variables
Set these environment variables in Render dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-change-in-production
BOT_TOKEN=your-telegram-bot-token
CHAT_ID=your-telegram-chat-id
ADMIN_CODE=your-admin-code
FRONTEND_URL=https://your-app-name.onrender.com
```

### 2. Render Configuration
- Service Type: Web Service
- Build Command: `npm run build`
- Start Command: `npm start`
- Node Version: 18+

### 3. Database Setup
Make sure your MongoDB Atlas:
- Allows connections from anywhere (0.0.0.0/0)
- Has the correct database name in connection string
- User has read/write permissions

### 4. Post-Deployment
After successful deployment:
1. Visit your app URL to verify it's working
2. Test API endpoints at `/health` and `/cors-test`
3. Create admin user using `/api/admin/create-admin` endpoint

## Troubleshooting
- Check Render logs for any errors
- Verify all environment variables are set
- Ensure MongoDB connection is working
- Check CORS settings if frontend can't connect to backend