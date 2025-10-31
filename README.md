# Hospital Management System

A full-stack hospital management application with React frontend and Node.js/Express backend, featuring doctor listings, appointment scheduling, and admin panel functionality.

## Project Structure

```
.
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── komponentlar/   # Components (UI, Admin, Layout, Context, Utility)
│       ├── sahifalar/      # Pages (Admin, Home, Doctors, etc.)
│       ├── uslublar/       # Stylesheets
│       ├── konstantalar/   # Constants and utilities
│       └── yordamchi_funksiyalar/ # Helper functions (API, validation)
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication and authorization middleware
│   ├── config/             # Database configuration
│   ├── scripts/            # Utility scripts
│   └── utils/              # Utility functions
├── package.json            # Root package.json with build scripts
└── README.md
```

## Key Features

### Frontend (React)
- Doctor listing with filtering capabilities
- Doctor detail pages with comprehensive information
- Appointment queue system
- Admin dashboard for managing doctors, appointments, and complaints
- Responsive design for all device sizes
- Modern UI with multiple theme options

### Backend (Node.js/Express)
- RESTful API for doctor, appointment, and complaint management
- MongoDB integration for data persistence
- Admin authentication and authorization
- Telegram bot integration for notifications
- Data seeding scripts for initial setup

## Environment Variables

### Server Environment (.env in server/)
```env
PORT=5012
MONGO_URI=your_mongodb_connection_string
BOT_TOKEN=your_telegram_bot_token
JWT_SECRET=your_jwt_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
```

### Client Environment (.env in client/)
```env
REACT_APP_API_URL=http://localhost:5012
```

## Installation and Setup

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install client dependencies:
   ```bash
   cd client && npm install
   ```

3. Install server dependencies:
   ```bash
   cd ../server && npm install
   ```

4. Return to root directory:
   ```bash
   cd ..
   ```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   npm run start:backend
   ```

2. In a separate terminal, start the frontend:
   ```bash
   npm run start:frontend
   ```

### Production Mode

1. Build the React frontend:
   ```bash
   npm run build
   ```

2. Start the server (serves both API and frontend):
   ```bash
   npm start
   ```

## Available Scripts

- `npm start` - Run production build
- `npm run start:frontend` - Start React development server
- `npm run start:backend` - Start Node.js server
- `npm run build` - Build React frontend for production
- `npm run dev` - Run both frontend and backend in development mode

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/logout` - Admin logout
- `GET /api/auth/status` - Check authentication status

### Doctors
- `GET /api/queue/doctors` - Get all doctors
- `POST /api/queue/doctors` - Create new doctor (admin only)
- `PUT /api/queue/doctors/:id` - Update doctor (admin only)
- `DELETE /api/queue/doctors/:id` - Delete doctor (admin only)

### Appointments
- `GET /api/queue/appointments` - Get all appointments
- `POST /api/queue/appointments` - Create new appointment
- `PUT /api/queue/appointments/:id` - Update appointment status
- `DELETE /api/queue/appointments/:id` - Delete appointment

### Complaints
- `GET /api/queue/complaints` - Get all complaints
- `POST /api/queue/complaints` - Create new complaint

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/doctors` - Get all doctors (admin only)
- `POST /api/admin/doctors` - Create doctor (admin only)
- `PUT /api/admin/doctors/:id` - Update doctor (admin only)
- `DELETE /api/admin/doctors/:id` - Delete doctor (admin only)

## Admin Panel Access

To access the admin panel:
1. Navigate to `/admin/login`
2. Use the credentials set in your environment variables:
   - Username: `ADMIN_USERNAME`
   - Password: `ADMIN_PASSWORD`

## Database Seeding

Initialize the database with sample data:
```bash
cd server
node scripts/createAdmin.js
node scripts/seedAllDoctors.js
```

## Deployment

The application is configured for deployment on platforms like Render.com or Heroku:

1. Set the required environment variables
2. Build the React frontend: `npm run build`
3. Start the server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.