# Submit Speed - Shipment Tracking System

A professional-grade full-stack logistics tracking application with real-time admin dashboard, public tracking portal, hierarchical RBAC (Role-Based Access Control), audit logging, and comprehensive system settings control panel.

## 🚀 Key Features

### 👤 Public Tracking
- **Real-time Shipment Tracking**: Track shipments by tracking ID
- **Detailed Timeline**: Complete journey history with timestamps
- **Current Location**: Live location updates with status
- **Email/WhatsApp Subscription**: Get real-time updates via email or WhatsApp
- **Product & Sender Details**: View product name and sender information
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
- **Subscriber Management**: View and manage email/WhatsApp subscribers
- **Quick Shipment List**: Active inventory with current status
- **Activity Feed**: Recent shipment activities

### 👑 Owner Dashboard (NEW!)
**Access Level**: Owner role only

#### Admin Management
- View all admins and users with their roles
- Promote users to admin role
- Revoke admin access by demoting users back to regular user
- Real-time role changes take effect immediately

#### Activity Audit Log
- **Complete Paper Trail**: View every admin action performed on the platform
- **Tracked Actions**:
  - Shipment creation
  - Shipment deletion
  - Status updates
  - Update deletion
  - Admin role changes
- **Log Details**: 
  - Admin name and email
  - Action type
  - Target shipment/resource ID
  - Timestamp
  - Client IP address
- **Advanced Filtering**:
  - Filter by admin name
  - Filter by date range
  - Real-time log search

#### User Management
- View all registered users (customers)
- See user roles, email, phone, and join date
- Understand platform user distribution

### ⚙️ System Settings Control Panel
The comprehensive settings include 6 major sections:

#### 1️⃣ Account Settings
- Profile management (Name, Email, Role: Owner/Admin/User)
- Secure password change functionality
- Display current user information

#### 2️⃣ System Configuration
- Global currency selector (USD, NGN)
- Tracking ID customization (Custom prefix/suffix)

#### 3️⃣ Appearance & Branding
- Logo upload and URL configuration
- Company name customization
- Support contact information display

#### 4️⃣ Notifications Engine
- Email provider configuration
- SMS provider setup (Twilio)
- Notification trigger settings for pickup/transit/delivery

#### 5️⃣ Advanced Settings
- Webhook URL configuration for integrations
- API key generation and management
- Google Maps API key integration
- Detailed logging preferences

#### 6️⃣ Owner Dashboard (Owner Role Only)
- Admin role management interface
- Live activity audit log viewer
- System security and compliance monitoring

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
- Product and sender details
- Edit and delete capabilities

### Subscribers Tab
- View all email/WhatsApp subscribers
- See subscription email addresses
- Monitor customer engagement

### Users Tab (Owner Only)
- View all registered users
- See user roles and details
- Join dates and contact information

### Settings Tab
- Tabbed interface with 6 sections (5 for admin, 1 additional for owner)
- Account, System, Appearance, Notifications, Advanced, and Owner tabs
- Real-time configuration changes
- API key and integration management

## 🔐 Role-Based Access Control (RBAC)

### Role Hierarchy
```
Owner (Highest)
  ├── Full platform access
  ├── Admin management (promote/demote)
  ├── Activity audit log viewing
  ├── User management
  └── All admin capabilities

Admin
  ├── Create/edit/delete shipments
  ├── Manage updates and timelines
  ├── View subscribers
  ├── Access to dashboard and settings
  └── Cannot access owner dashboard or manage other admins

User (Regular Customer)
  ├── Track shipments
  ├── Subscribe to tracking updates
  ├── View shipment details
  └── No admin access
```

### How to Access the Owner Dashboard

#### Prerequisites
You must have the **Owner** role in your system. By default, the first admin user created in the database should be promoted to owner role.

#### Steps to Access Owner Dashboard
1. **Login to Admin Dashboard**
   - Navigate to `http://localhost:5000` (or your deployment URL)
   - Click "Admin Login"
   - Enter owner email and password

2. **Navigate to Settings**
   - In the left sidebar, click "Settings"

3. **Click "Owner" Tab**
   - The "Owner" tab will only appear if your role is set to "owner"
   - If you don't see it, your account is not set as owner

4. **View Owner Dashboard Features**
   - **Admin Management Section**: Shows list of all admins with role toggle buttons
   - **Activity Logs Section**: Shows filtered activity log with search options

#### Setting Owner Role (First Time Setup)

If you need to set up an owner role:

1. **Register an admin account**
   ```bash
   Navigate to Admin Register page
   Create an account with email and password
   ```

2. **Promote to Owner via Database** (Temporary method)
   ```bash
   # Connect to MongoDB
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "owner" } }
   )
   ```

3. **Login and verify**
   - Login with your owner credentials
   - You should now see the "Owner" tab in Settings

## 📦 Database Schema

### User (RBAC)
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  role: String (enum: ['owner', 'admin', 'user']),
  timestamps: true
}
```

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
  productName: String,
  senderName: String,
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

### Subscription (NEW!)
```javascript
{
  email: String,
  shipmentId: ObjectId (ref: Shipment),
  createdAt: Date,
  unique index on email + shipmentId
}
```

### ActivityLog (NEW!)
```javascript
{
  performerId: ObjectId (ref: User),
  actionType: String (CREATE_SHIPMENT, DELETE_SHIPMENT, UPDATE_STATUS, DELETE_UPDATE, TOGGLE_ADMIN_STATUS),
  targetId: String,
  details: String,
  ipAddress: String,
  timestamps: true
}
```

## 🛣️ API Endpoints

### Public
- `GET /api/shipments/:id` - Get shipment details
- `GET /api/shipments/:id/updates` - Get timeline
- `POST /api/shipments/:id/subscribe` - Subscribe to shipment updates

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Admin (Protected - admin or owner)
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/:id/updates` - Add update
- `DELETE /api/shipments/:id/updates/:updateId` - Delete update
- `GET /api/shipments/stats/analytics` - Get analytics
- `GET /api/shipments/admin/subscriptions` - List subscriptions
- `POST /api/shipments/dispatch` - Dispatch emails/WhatsApp
- `GET /api/users/admin/all` - List all users

### Owner Only (Protected - owner role)
## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React
- **Backend**: Node.js, Express 5, MongoDB, Mongoose, Nodemailer, Twilio
- **Auth**: JWT + bcryptjs
- **Architecture**: Full-stack ESM modules
- **Notifications**: Email (Nodemailer) + WhatsApp (Twilio)

## 🏗️ Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Twilio account (for WhatsApp notifications)
- Email service provider (Nodemailer configured)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
```

Configure `.env`:
```env
MONGO_URI=mongodb://localhost:27017/shipment-tracker
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

Start server:
```bash
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
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

## Usage

### For Customers (Public)
1. Go to homepage
2. Enter tracking number in search box
3. View shipment details and timeline
4. Click "Subscribe" to get email/WhatsApp updates
5. Subscribe with your email to receive tracking notifications

### For Admins
1. **Login**: Click "Admin Login" on homepage
2. **Create Shipment**: 
   - Go to "Shipments" tab
   - Click "Add Shipment" button
   - Fill in tracking number, recipient, origin, destination
   - Add product name and sender name
3. **Add Updates**: 
   - Click on shipment in the list
   - Add status (Picked Up, In Transit, Processing, Out for Delivery, Delivered)
   - Add location and description
4. **Delete Updates**: 
   - View timeline for shipment
   - Click delete icon on update you want to remove
5. **View Subscribers**: 
   - Go to "Subscribers" tab
   - See all customers subscribed to tracking updates
6. **Settings**: 
   - Configure account, system, appearance, and notifications

### For Owner
1. **Login as Owner**: Use owner email/password
2. **Access Owner Dashboard**:
   - Click "Settings" in sidebar
   - Click "Owner" tab (only visible if you are owner)
3. **Manage Admins**:
   - See list of all admins
   - Click "Grant Admin" or "Revoke Admin" button to change roles
   - Changes take effect immediately
4. **View Activity Logs**:
   - See complete audit trail of all admin actions
   - Filter by admin name
   - Filter by date range
   - View action type, target, timestamp, and IP address
5. **View Users**:
   - Go to "Users" tab to see all registered customers
   - View user roles, emails, phone numbers, and join dates

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **RBAC**: Role-based access control (Owner/Admin/User)
- **Audit Logging**: Complete paper trail of all admin actions
- **Protected Routes**: Middleware-based route protection
- **IP Tracking**: Admin actions logged with client IP
- **CORS**: Configured for secure frontend-backend communication

## 📱 Notification Features

### Email Notifications
- Powered by Nodemailer
- Automatic tracking updates to subscribers
- Triggered on shipment creation and status changes

### WhatsApp Notifications
- Powered by Twilio API
- Real-time WhatsApp messages to customers
- Status updates sent automatically

### Subscription Management
- Customers can subscribe by email or phone
- Multiple subscriptions per shipment
- Unique constraint on email + shipment ID

## 🚀 Deployment Guide

### Backend Deployment (Heroku/Railway)
1. Create account on Heroku or Railway
2. Set environment variables
3. Deploy from git repository
4. Ensure MongoDB is accessible from deployment platform

### Frontend Deployment (Vercel/Netlify)
1. Build frontend: `npm run build`
2. Deploy `dist/` folder
3. Configure environment to point to backend URL
4. Set up custom domain if needed

## Future Enhancements

- Two-factor authentication (2FA)
- Real-time push notifications
- Map integration for location tracking
- PDF manifest generation with QR codes
- Multi-tenant support for multiple logistics companies
- Advanced analytics and reporting
- Integration with carrier APIs
- Mobile app for admins and customers
- SMS OTP verification
- Payment integration for premium features

## 📝 API Request Examples

### Track a Shipment (Public)
```bash
curl -X GET http://localhost:5000/api/shipments/TRK-ABC123
```

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Create Shipment (Admin)
```bash
curl -X POST http://localhost:5000/api/shipments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trackingNumber":"TRK-XYZ789",
    "recipientName":"John Doe",
    "origin":"Lagos",
    "destination":"Abuja",
    "status":"Picked Up",
    "weight":"5kg",
    "serviceType":"Express",
    "productName":"Electronics Package",
    "senderName":"Amazon Logistics"
  }'
```

### Add Update to Shipment
```bash
curl -X POST http://localhost:5000/api/shipments/TRK-XYZ789/updates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status":"In Transit",
    "location":"Ibadan Distribution Center",
    "description":"Package picked up and en route"
  }'
```

### Subscribe to Tracking
```bash
curl -X POST http://localhost:5000/api/shipments/TRK-XYZ789/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com"}'
```

### Get Activity Logs (Owner Only)
```bash
curl -X GET 'http://localhost:5000/api/admin/logs?adminName=John&startDate=2026-01-01&endDate=2026-12-31' \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"
```

## 📊 Database Setup

### Initial Owner Setup
1. Register an admin account through the admin registration page
2. Connect to MongoDB and run:
   ```javascript
   db.users.updateOne(
     { email: "your-admin-email@example.com" },
     { $set: { role: "owner" } }
   )
   ```
3. Login and access the Owner dashboard

### Create Test Shipments
Use the API endpoint above or admin dashboard to create shipments for testing.

## 🐛 Troubleshooting

### "Owner tab not visible in Settings"
- Ensure your user role is set to "owner" in the database
- Refresh the page after role change
- Check browser console for any errors

### 404 Error on Delete Update
- Ensure tracking number is being passed (not MongoDB ID)
- Verify update ID is valid
- Check server logs for details

### Subscribers not receiving emails
- Check Nodemailer configuration in `.env`
- Verify email credentials are correct
- Check email spam folder
- Review server logs for errors

### WhatsApp notifications not working
- Verify Twilio credentials in `.env`
- Ensure phone numbers are in correct format (+country code)
- Check Twilio account balance
- Review server logs for API errors

## 📞 Support

For issues or questions:
1. Check server console logs
2. Review browser developer console
3. Verify MongoDB connection
4. Check API endpoint URLs match your deployment
5. Ensure all environment variables are set correctly

## License

MIT