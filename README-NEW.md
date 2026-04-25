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
  - Phone number
  - Email address
  - Live chat link

#### 4️⃣ Notifications Engine
- Email provider configuration (Resend, SendGrid, Mailgun)
- Email API key management
- SMS provider setup (Twilio)
- Notification trigger settings:
  - Send on pickup
  - Send on transit
  - Send on delivery
- Email template editing support

#### 5️⃣ Advanced Settings
- Webhook URL configuration for integrations
- API key generation and management
- Google Maps API key integration
- Database logging preferences
- Third-party integrations

## 📦 Database Schema

### Shipment Collection
```javascript
{
  trackingNumber: String (unique),
  status: String (enum: 'Pending', 'In Transit', 'Arrived at Hub', 'Out for Delivery', 'Delivered', 'On Hold', 'Delayed'),
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

### ShipmentUpdate Collection
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

## 🛣️ API Routes

### Public Routes
- `GET /api/shipments/:id` - Get shipment details
- `GET /api/shipments/:id/updates` - Get shipment timeline/history

### Authentication Routes
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration

### Admin Routes (JWT Protected)
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create new shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/:id/updates` - Add shipment status update
- `DELETE /api/updates/:updateId` - Delete update (correction)
- `GET /api/shipments/stats/analytics` - Get dashboard analytics

## 💻 Tech Stack

- **Frontend**: 
  - React 19 + TypeScript
  - Vite (fast build tool)
  - Tailwind CSS 4.x
  - Lucide React (icons)
  - Framer Motion (animations)
  - Axios (API client)
  - Zustand (state management)

- **Backend**:
  - Node.js + Express 5
  - MongoDB + Mongoose
  - JWT (authentication)
  - bcryptjs (password hashing)
  - CORS enabled

- **Architecture**: Full-stack JavaScript/TypeScript with ESM modules

## 🏗️ Project Structure

```
shipment-tracking-system/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── TrackingResults.tsx (redesigned)
│   │   │   ├── AdminDashboard.tsx (with tabs)
│   │   │   ├── AdminSettings.tsx (NEW)
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminRegister.tsx
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── ShipmentForm.tsx
│   │   │   │   ├── UpdateManager.tsx
│   │   │   │   ├── ShipmentTable.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── shipmentService.ts
│   │   │   └── authService.ts
│   │   └── types/
│   │       └── shipment.ts
│   └── package.json
│
├── server/
│   ├── models/
│   │   ├── Shipment.js
│   │   ├── ShipmentUpdate.js (NEW)
│   │   ├── User.js
│   ├── controllers/
│   │   ├── shipmentController.js
│   │   ├── updateController.js (NEW)
│   │   ├── eventController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── shipmentRoutes.js
│   │   ├── updateRoutes.js (NEW)
│   │   ├── eventRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
# JWT_SECRET=your-super-secret-jwt-key-here
# PORT=5000

npm run dev
```

The server starts on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

The client starts on `http://localhost:5173`

## 📖 Usage Guide

### For Admin Users

1. **Register/Login**
   - Go to `/login` to create admin account or login
   - JWT token stored in localStorage

2. **Dashboard Tab**
   - View key metrics and shipment overview
   - Quick access to shipment list
   - Recent activity feed
   - Create shipment button

3. **Shipments Tab**
   - View all shipments in detailed table
   - Click shipment to add/view updates
   - Manage shipment timeline
   - Delete incorrect updates

4. **Settings Tab**
   - Configure system parameters
   - Customize branding
   - Setup notifications
   - Manage API integrations

### For Public Users

1. **Track Shipment**
   - Navigate to homepage
   - Enter tracking number (e.g., UA784563921ZA)
   - View complete shipment details
   - See full journey timeline

2. **Timeline View**
   - Status updates in chronological order
   - Location information
   - Timestamps for each update
   - Detailed descriptions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Protected Routes**: Middleware-protected admin endpoints
- **CORS Configuration**: Safe cross-origin requests
- **Error Handling**: Centralized error management
- **Input Validation**: Backend validation for all inputs

## 🌳 Environment Variables

Create `.env` file in server directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Server Port
PORT=5000

# Optional: Email Provider Keys
RESEND_API_KEY=re_xxx
SENDGRID_API_KEY=SG.xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=your_token

# Optional: Maps
GOOGLE_MAPS_API_KEY=AIza...
```

## 📊 API Examples

### Track Shipment (Public)
```bash
curl http://localhost:5000/api/shipments/UA784563921ZA/updates
```

### Create Shipment (Admin)
```bash
curl -X POST http://localhost:5000/api/shipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "origin": "Lagos, Nigeria",
    "destination": "London, UK",
    "recipientName": "John Doe",
    "weight": "2.5",
    "serviceType": "Express"
  }
```

### Add Update (Admin)
```bash
curl -X POST http://localhost:5000/api/shipments/SHIPMENT_ID/updates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d {
    "status": "In Transit",
    "location": "Istanbul, Turkey",
    "description": "Arrived at international hub"
  }
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Color Scheme

- **Primary**: Red (#dc2626)
- **Background**: Dark (#000000, #0f0f0f)
- **Surfaces**: Zinc (#1f2937, #27272a)
- **Text**: White (#ffffff, #e4e4e7)
- **Borders**: Zinc (#52525b, #71717a)

## 🔄 Data Flow

```
Public User
  ↓
[Track Page] → [API: GET /shipments/:id] → [Timeline]
                        ↓
                    MongoDB (Shipment)

Admin User
  ↓
[Admin Dashboard] → [Admin Auth] → [Protected Routes]
  ├─ Dashboard: [API: GET /analytics]
  ├─ Shipments: [Create/Read/Delete]
  ├─ Updates: [Create/View/Delete]
  └─ Settings: [Configure System]
```

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
```bash
npm run dev  # For production
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Environment Setup
Set all `.env` variables in platform's environment configuration.

## 🔮 Future Enhancements

- [ ] Email/SMS notifications (Resend, Twilio integration)
- [ ] PDF manifest generation with QR codes
- [ ] Real-time push notifications
- [ ] Interactive map integration (Google Maps)
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Batch shipment import/export
- [ ] Customer portal
- [ ] Mobile app (React Native)
- [ ] AI-powered delivery estimates

## 📄 License

MIT License - Feel free to use this project for commercial or personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

---

**Made with ❤️ by Submit Speed Team**

For support or inquiries, contact: support@submitspeed.com