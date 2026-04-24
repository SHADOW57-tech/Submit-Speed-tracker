# Shipment Tracking System

A full-stack logistics tracking application with admin dashboard and public tracking.

## Features

- **Public Tracking**: Track shipments by ID
- **Admin Dashboard**: Manage shipments, view analytics
- **User Authentication**: Separate login for users and admins
- **Real-time Updates**: Event timeline for shipments
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT tokens
- **UI**: Lucide icons, Framer Motion animations

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Configure MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create `.env` in server directory:

```
MONGO_URI=mongodb://localhost:27017/shipment-tracker
JWT_SECRET=your-secret-key
PORT=5000
```

## API Endpoints

### Public
- `GET /api/shipments/:id` - Track shipment

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Admin (Protected)
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create shipment
- `POST /api/events/:shipmentId` - Add event

## Deployment

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
npm run build
# Serve dist/ folder
```

## Usage

1. Register/Login as user or admin
2. Admins can create shipments via dashboard
3. Users can track shipments by ID
4. Admins can update shipment status/events

## License

MIT