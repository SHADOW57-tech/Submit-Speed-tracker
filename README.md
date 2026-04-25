# Submit Speed - Shipment Tracking System

A professional-grade full-stack logistics tracking application with real-time admin dashboard, public tracking portal, and comprehensive system settings control panel.

## 🚀 Key Features

### 👤 Public Tracking
- **Real-time Shipment Tracking**: Track shipments by tracking ID
- **Detailed Timeline**: Complete journey history with timestamps
- **Current Location**: Live location updates with status
- **Responsive Design**: Mobile-first responsive interface
- **High-end UI**: Professional red/white/dark theme

### 🛠️ Admin Dashboard
- **Shipment Management**: Create, view, edit, and delete shipments
- **Real-time Analytics**: Dashboard showing key metrics
  - Total shipments count
  - In-transit count
  - Delivered count
  - Attention needed alerts
- **Timeline Management**: Add status updates, view history, delete corrections
- **Quick Shipment List**: Active inventory with current status
- **Activity Feed**: Recent shipment activities

### ⚙️ System Settings Control Panel
The comprehensive settings include 5 major sections:

#### 1️⃣ Account Settings
- Profile management (Name, Email, Role: Super Admin/Admin/Dispatcher)
- Secure password change functionality
- Two-Factor Authentication (2FA) setup
- Active device/session monitoring

#### 2️⃣ System Configuration
- Global currency selector (USD, EUR, GBP, NGN)
- Measurement units (Metric/Imperial toggle)
- Tracking ID customization (Custom prefix/suffix)
- Service types management (add custom shipping methods)

#### 3️⃣ Appearance & Branding
- Logo upload and URL configuration
- Brand color picker (live preview)
- Company name customization
- Support contact information display

#### 4️⃣ Notifications Engine
- Email provider configuration (Resend, SendGrid, Mailgun)
- Email API key management
- SMS provider setup (Twilio)
- Notification trigger settings

#### 5️⃣ Advanced Settings
- Webhook URL configuration for integrations
- API key generation and management
- Google Maps API key integration
- Database logging preferences

## 📊 Admin Pages

### Dashboard Tab
- Quick metrics overview (4 stat cards)
- Shipment inventory table
- Recent activity feed
- Create shipment button

### Shipments Tab
- Full shipment management
- Click to add/view updates
- Timeline and status updates
- Edit and delete capabilities

### Settings Tab
- Tabbed interface with 5 sections
- Account, System, Appearance, Notifications, Advanced
- Real-time configuration changes
- API key and integration management

## 📦 Database Schema

### Shipment
```javascript
{
  trackingNumber: String (unique),
  status: String (enum),
  origin: String,
  destination: String,
  currentLocation: String,
  recipientName: String,
  recipientEmail: String,
  weight: String,
  serviceType: String,
  estimatedDelivery: String,
  timestamps: true
}
```

### ShipmentUpdate
```javascript
{
  shipmentId: ObjectId (ref: Shipment),
  status: String,
  location: String,
  description: String,
  timestamp: Date,
  timestamps: true
}
```

## 🛣️ API Endpoints

### Public
- `GET /api/shipments/:id` - Get shipment details
- `GET /api/shipments/:id/updates` - Get timeline

### Admin (Protected)
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/:id/updates` - Add update
- `DELETE /api/updates/:updateId` - Delete update
- `GET /api/shipments/stats/analytics` - Get analytics

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React
- **Backend**: Node.js, Express 5, MongoDB, Mongoose
- **Auth**: JWT + bcryptjs
- **Architecture**: Full-stack ESM modules

## 🏗️ Setup
}
```

## API Endpoints

### Public Endpoints
- `GET /api/shipments/:id` - Get shipment details
- `GET /api/shipments/:id/updates` - Get shipment timeline

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create new shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/:id/updates` - Add status update
- `DELETE /api/updates/:updateId` - Delete update
- `GET /api/shipments/stats/analytics` - Get analytics

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

### Build for Production
```bash
cd client
npm run build
```

## Environment Variables

Create `.env` in server directory:

```
MONGO_URI=mongodb://localhost:27017/shipment-tracker
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## Usage

### Admin Workflow
1. Login to admin dashboard
2. Create new shipment with recipient details
3. Add status updates as package moves:
   - "In Transit" - Package picked up
   - "Arrived at Hub" - Reached sorting facility
   - "Out for Delivery" - Final delivery
   - "Delivered" - Completed
4. View complete shipment timeline
5. Delete incorrect updates if needed

### Public Tracking
1. Enter tracking number on homepage
2. View shipment details and complete journey timeline
3. See current status and location
4. Track progress from origin to destination

## Security Features

- JWT-based authentication for admin operations
- Protected routes with middleware
- Password hashing with bcrypt
- CORS enabled for frontend communication

## Future Enhancements

- Email/SMS notifications for status updates
- PDF manifest generation with QR codes
- Real-time push notifications
- Map integration for location tracking
- Multi-tenant support for multiple logistics companies

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