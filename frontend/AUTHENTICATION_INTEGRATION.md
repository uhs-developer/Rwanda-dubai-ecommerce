# Authentication Integration - Rwanda-Dubai Frontend

This document outlines the authentication system integration between the Rwanda-Dubai frontend and backend.

## 🔧 **Setup Instructions**

### 1. Install Dependencies
```bash
npm install
# Axios is already added to package.json
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Rwanda-Dubai E-commerce Platform
```

### 3. Start the Backend
Make sure the rwanda-dubai-be Laravel backend is running on `http://localhost:8000`

### 4. Start the Frontend
```bash
npm run dev
```

## 🏗️ **Architecture Overview**

### **Core Components:**
1. **AuthService** (`src/services/auth.ts`) - API communication
2. **AuthContext** (`src/contexts/AuthContext.tsx`) - Global state management
3. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`) - Route protection
4. **AuthPage** (`src/components/AuthPage.tsx`) - Login/Register UI

### **API Integration:**
- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Token Management**: Automatic Bearer token handling
- **Error Handling**: Comprehensive error states and validation
- **Auto-redirect**: Invalid tokens redirect to login

## 🔐 **Authentication Flow**

### **1. User Registration**
```typescript
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+250123456789" // optional
}
```

### **2. User Login**
```typescript
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **3. Token Storage**
- **Token**: Stored in `localStorage` as `rwanda-dubai-token`
- **User Data**: Stored in `localStorage` as `rwanda-dubai-user`

### **4. API Requests**
All authenticated requests automatically include:
```
Authorization: Bearer <token>
```

## 🛡️ **Protected Routes**

### **Basic Protection**
```tsx
<ProtectedRoute>
  <AccountDashboard />
</ProtectedRoute>
```

### **Role-Based Protection**
```tsx
<ProtectedRoute requiredRoles={['admin', 'super-admin']}>
  <AdminPanel />
</ProtectedRoute>
```

### **Permission-Based Protection**
```tsx
<ProtectedRoute requiredPermissions={['view-users', 'edit-content']}>
  <UserManagement />
</ProtectedRoute>
```

## 🎛️ **Auth Context Usage**

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    hasRole, 
    hasPermission 
  } = useAuth();

  // Check authentication
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  // Check roles
  if (hasRole('admin')) {
    return <AdminPanel />;
  }

  // Check permissions
  if (hasPermission('view-users')) {
    return <UserList />;
  }

  return <RegularUserView />;
}
```

## 📱 **User Management Features**

### **Profile Updates**
- **Name**: Editable
- **Phone**: Editable  
- **Avatar**: URL-based
- **Email**: Read-only (contact support to change)

### **Password Changes**
- Current password verification
- 8+ character requirement
- Password confirmation matching
- Success/error feedback

### **Security Actions**
- Logout from current device
- Logout from all devices
- View account status and last login

## 🔄 **State Management**

### **Global Auth State**
- **User object**: Full user data with roles/permissions
- **Loading states**: Login/register/refresh operations  
- **Error handling**: Validation errors and API errors

### **Local Storage**
- **Persistent login**: User stays logged in across browser sessions
- **Automatic cleanup**: Invalid tokens are automatically cleared

## 🚨 **Error Handling**

### **API Errors**
- **401 Unauthorized**: Automatic redirect to login
- **422 Validation**: Field-specific error messages
- **500 Server**: Generic error message

### **Client Validation**
- **Email format**: Built-in HTML5 validation
- **Password matching**: Real-time confirmation
- **Required fields**: Form submission prevention

## 🎯 **Backend Integration Points**

### **Available Endpoints:**
- `POST /api/register` - User registration
- `POST /api/login` - User authentication  
- `GET /api/me` - Get current user
- `POST /api/logout` - Logout current session
- `POST /api/logout-all` - Logout all sessions
- `POST /api/change-password` - Change password
- `PUT /api/profile` - Update profile

### **User Roles & Permissions:**
- **Super Admin**: Full system access (17 permissions)
- **Admin**: Most permissions (16 permissions, no system-backup)  
- **Editor**: Content management (6 permissions)
- **User**: Basic access (1 permission: view-content)

### **Test Accounts:**
| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | password123 |
| Admin | admin@test.com | password123 |
| Editor | editor@test.com | password123 |
| User | user@test.com | password123 |

## 🔧 **Development Notes**

### **Local Storage Keys:**
- `rwanda-dubai-token` - Authentication token
- `rwanda-dubai-user` - User data object
- `rwanda-dubai-cart` - Shopping cart data
- `rwanda-dubai-flash-sale-seen` - Flash sale popup state

### **TypeScript Types:**
All authentication types are defined in `src/services/auth.ts`:
- `User` - User object structure
- `Role` - User role structure  
- `Permission` - Permission structure
- `LoginRequest` - Login payload
- `RegisterRequest` - Registration payload

### **Future Enhancements:**
- Social login integration (Google, Facebook)
- Two-factor authentication (2FA)
- Password reset functionality
- Email verification
- Session management dashboard

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **Token Expiry**: Implement refresh token logic if needed
3. **Route Protection**: Check middleware registration in `bootstrap/app.php`
4. **API Base URL**: Verify `VITE_API_BASE_URL` matches backend URL

### **Debug Tools:**
- Browser DevTools → Network tab for API calls
- Browser DevTools → Application → Local Storage for stored data
- Console logs for authentication state changes

---

The authentication system is now fully integrated and ready for use! 🎉
