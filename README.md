# Trusted Supplier Marketplace Frontend

A modern React-based frontend for the Trusted Supplier Marketplace with group buying functionality, built with Vite, Tailwind CSS, and integrated with our Node.js backend.

## 🚀 Features

### Authentication & User Management
- **Multi-role Authentication**: Vendor, Supplier, and Admin roles
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Role-based Access Control**: Different dashboards and features per role
- **User Registration & Login**: Complete auth flow with error handling

### Vendor Features
- **Product Browser**: Browse and search products from suppliers
- **Group Order Management**: Create and join group buying orders
- **Order Tracking**: View order history and status
- **Profile Management**: Update vendor information and preferences

### Supplier Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage incoming group orders
- **Supplier Profile**: Update business information and settings
- **Inventory Tracking**: Monitor stock levels and sales

### Admin Features
- **Dashboard Analytics**: Comprehensive metrics and statistics
- **User Management**: View and manage all users
- **Supplier Approval**: Approve or reject supplier registrations
- **System Monitoring**: Track marketplace performance

### Shared Features
- **Multi-language Support**: English and Hindi interface
- **Real-time Notifications**: Toast notifications for user actions
- **Responsive Design**: Mobile-first responsive layout
- **Modern UI/UX**: Beautiful, intuitive interface with animations

## 🛠️ Tech Stack

- **React 19**: Latest React with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation utilities

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running (see Backend README)

### Quick Start

1. **Clone and navigate to frontend directory**
   ```bash
   cd Frontend
   ```

2. **Run setup script**
   ```bash
   npm run setup
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your backend URL
   VITE_API_URL=http://localhost:3001/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME="Trusted Supplier Marketplace"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false
```

### Backend Connection

The frontend connects to the backend via REST APIs. Ensure your backend is running and accessible at the URL specified in `VITE_API_URL`.

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Auth/           # Authentication components
│   │   ├── Vendor/         # Vendor-specific components
│   │   ├── Supplier/       # Supplier-specific components
│   │   ├── Admin/          # Admin-specific components
│   │   └── Shared/         # Shared components
│   ├── contexts/
│   │   ├── AuthContext.jsx # Authentication state
│   │   ├── DataContext.jsx # Data management
│   │   └── LanguageContext.jsx # Multi-language support
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── public/                 # Static assets
├── .env.example           # Environment template
├── setup.js               # Setup script
└── package.json           # Dependencies and scripts
```

## 🔌 API Integration

The frontend integrates with the backend through a comprehensive API service layer:

### Authentication APIs
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users/me` - Get current user

### Vendor APIs
- `GET /api/vendors/me` - Get vendor profile
- `POST /api/vendors` - Create vendor profile
- `PUT /api/vendors/me` - Update vendor profile

### Product APIs
- `GET /api/products` - List products
- `POST /api/products` - Add product (supplier)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Group Order APIs
- `GET /api/group-orders` - List group orders
- `POST /api/group-orders` - Create group order
- `PUT /api/group-orders/:id/join` - Join group order
- `PUT /api/group-orders/:id/confirm` - Confirm order

### Admin APIs
- `GET /api/admin/dashboard/metrics` - Dashboard metrics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/approve-supplier/:id` - Approve supplier

## 🎨 UI Components

### Authentication
- **Login Form**: Email/password authentication
- **Demo Credentials**: Quick access for testing
- **Language Toggle**: English/Hindi support

### Vendor Dashboard
- **Product Browser**: Grid layout with filters
- **Group Order Creation**: Form to start new orders
- **Order Management**: List and track orders
- **Profile Settings**: Update vendor information

### Supplier Dashboard
- **Product Management**: CRUD operations for products
- **Order Overview**: View incoming group orders
- **Inventory Management**: Stock tracking
- **Business Profile**: Update supplier details

### Admin Dashboard
- **Metrics Overview**: Key performance indicators
- **User Management**: View and manage users
- **Supplier Approval**: Approve/reject applications
- **System Statistics**: Marketplace analytics

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Setup
npm run setup        # Run setup script
```

### Development Workflow

1. **Start backend server** (see Backend README)
2. **Start frontend development server**
   ```bash
   npm run dev
   ```
3. **Make changes** - Hot reload enabled
4. **Test features** - Use demo credentials
5. **Build for production**
   ```bash
   npm run build
   ```

### Testing with Demo Credentials

The application includes demo credentials for testing:

- **Vendor**: `vendor@test.com` / `password`
- **Supplier**: `supplier@test.com` / `password`
- **Admin**: `admin@test.com` / `password`

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deployment Options

1. **Netlify** (recommended)
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Vercel**
   - Import your repository
   - Framework preset: Vite
   - Build command: `npm run build`

3. **Static Hosting**
   - Upload `dist` folder contents
   - Configure for SPA routing

### Environment Configuration

For production deployment, update environment variables:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Route protection by user role
- **API Security**: Automatic token inclusion in requests
- **Error Handling**: Graceful error management
- **Input Validation**: Form validation and sanitization

## 🌍 Internationalization

The application supports multiple languages:

- **English**: Default language
- **Hindi**: Full translation support
- **Language Toggle**: Switch between languages
- **Context-aware**: Language-specific content

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Responsive tablet layouts
- **Desktop Experience**: Full desktop functionality
- **Touch-friendly**: Optimized for touch interactions

## 🎯 Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Production-ready optimizations
- **Fast Development**: Vite's rapid HMR

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the Backend README for API documentation
2. Review the setup logs for configuration issues
3. Ensure backend server is running
4. Verify environment variables are correct

---

**Ready to build your marketplace! 🚀**