# Authentication System Testing Guide

## Overview
Your Laravel project now has a complete authentication system with:
- **4 User Roles**: Super Admin, Admin, Editor, User
- **17 Permissions**: Covering user management, content management, and system operations
- **JWT API Authentication** using Laravel Sanctum
- **Role & Permission-based Middleware**

## Test Users Created
The seeder has created these test users for you:

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| Super Admin | superadmin@test.com | password123 | Full system access |
| Admin | admin@test.com | password123 | Most permissions (no system backup) |
| Editor | editor@test.com | password123 | Content management only |
| User | user@test.com | password123 | Basic view permissions |

## API Endpoints

### Public Endpoints
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Protected Endpoints (require Bearer token)
- `GET /api/me` - Get current user info
- `POST /api/logout` - Logout current session
- `POST /api/logout-all` - Logout all sessions
- `POST /api/change-password` - Change password
- `PUT /api/profile` - Update profile

### Role-Based Endpoints
- `GET /api/super-admin/dashboard` - Super Admin only
- `GET /api/super-admin/system-backup` - Super Admin only
- `GET /api/admin/dashboard` - Admin & Super Admin
- `GET /api/admin/users` - Admin & Super Admin
- `GET /api/editor/dashboard` - Editor only
- `GET /api/editor/content` - Editor only

### Permission-Based Endpoints
- `GET /api/users` - Requires 'view-users' permission
- `POST /api/content` - Requires 'create-content' or 'edit-content' permission

### General Endpoints
- `GET /api/user/dashboard` - Any authenticated user

### Test Endpoints
- `GET /api/test/super-admin` - Test Super Admin access
- `GET /api/test/admin` - Test Admin access
- `GET /api/test/editor` - Test Editor access
- `GET /api/test/user` - Test basic user access

## Testing Instructions

### 1. Using cURL Commands

#### Login as Super Admin
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@test.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@test.com",
      "roles": [
        {
          "id": 1,
          "name": "Super Admin",
          "slug": "super-admin",
          "permissions": [...all permissions...]
        }
      ]
    },
    "token": "1|abc123def456...",
    "token_type": "Bearer"
  }
}
```

#### Test Super Admin Access
```bash
curl -X GET http://localhost:8000/api/super-admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test Admin Login and Access
```bash
# Login as Admin
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'

# Test admin access (should work)
curl -X GET http://localhost:8000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Test super admin access (should fail with 403)
curl -X GET http://localhost:8000/api/super-admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 2. Using Postman

#### Step 1: Create Postman Collection
1. Create a new collection called "Laravel Auth Testing"
2. Add environment variables:
   - `base_url`: `http://localhost:8000/api`
   - `token`: (will be set automatically)

#### Step 2: Create Login Requests
Create separate requests for each user type:

**Super Admin Login:**
- Method: POST
- URL: `{{base_url}}/login`
- Body (JSON):
```json
{
  "email": "superadmin@test.com",
  "password": "password123"
}
```
- Test Script:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("token", response.data.token);
        console.log("Super Admin Token:", response.data.token);
    }
}
```

**Admin Login:**
```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Editor Login:**
```json
{
  "email": "editor@test.com",
  "password": "password123"
}
```

**User Login:**
```json
{
  "email": "user@test.com",
  "password": "password123"
}
```

#### Step 3: Create Protected Route Tests
For each protected route, create a request with:
- Method: GET
- URL: `{{base_url}}/endpoint`
- Authorization: Bearer Token `{{token}}`

### 3. Expected Test Results Matrix

| User Type | Super Admin Routes | Admin Routes | Editor Routes | User Routes | General Routes |
|-----------|------------------|--------------|---------------|-------------|----------------|
| Super Admin | ✅ 200 Success | ✅ 200 Success | ❌ 403 Forbidden | ❌ 403 Forbidden | ✅ 200 Success |
| Admin | ❌ 403 Forbidden | ✅ 200 Success | ❌ 403 Forbidden | ❌ 403 Forbidden | ✅ 200 Success |
| Editor | ❌ 403 Forbidden | ❌ 403 Forbidden | ✅ 200 Success | ❌ 403 Forbidden | ✅ 200 Success |
| User | ❌ 403 Forbidden | ❌ 403 Forbidden | ❌ 403 Forbidden | ❌ 403 Forbidden | ✅ 200 Success |

### 4. Permission Testing

#### Super Admin Permissions Test
```bash
# Login as Super Admin and test system backup permission
curl -X GET http://localhost:8000/api/super-admin/system-backup \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN"
```
**Expected:** ✅ 200 Success

#### Admin Permissions Test  
```bash
# Login as Admin and test system backup (should fail)
curl -X GET http://localhost:8000/api/super-admin/system-backup \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:** ❌ 403 Forbidden

#### Editor Content Management Test
```bash
# Login as Editor and test content access
curl -X GET http://localhost:8000/api/editor/content \
  -H "Authorization: Bearer EDITOR_TOKEN"
```
**Expected:** ✅ 200 Success

### 5. Laravel Tinker Testing

You can also test the role system using Laravel Tinker:

```bash
php artisan tinker
```

```php
// Test user roles and permissions
$superAdmin = User::where('email', 'superadmin@test.com')->first();
$superAdmin->hasRole('super-admin'); // true
$superAdmin->hasPermission('system-backup'); // true
$superAdmin->isSuperAdmin(); // true

$admin = User::where('email', 'admin@test.com')->first();
$admin->hasRole('admin'); // true
$admin->hasPermission('system-backup'); // false
$admin->isAdmin(); // true

$editor = User::where('email', 'editor@test.com')->first();
$editor->hasRole('editor'); // true
$editor->hasPermission('create-content'); // true
$editor->hasPermission('delete-users'); // false

$user = User::where('email', 'user@test.com')->first();
$user->hasRole('user'); // true
$user->hasPermission('view-content'); // true
$user->hasPermission('create-content'); // false
```

### 6. Error Response Examples

**401 Unauthorized (No token):**
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

**403 Forbidden (Insufficient permissions):**
```json
{
  "success": false,
  "message": "Insufficient permissions. Required roles: super-admin"
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

## Quick Start Testing Commands

Start your Laravel server:
```bash
php artisan serve
```

Test all user types quickly:
```bash
# 1. Login as Super Admin
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d '{"email":"superadmin@test.com","password":"password123"}'

# 2. Login as Admin  
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d '{"email":"admin@test.com","password":"password123"}'

# 3. Login as Editor
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d '{"email":"editor@test.com","password":"password123"}'

# 4. Login as User
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d '{"email":"user@test.com","password":"password123"}'
```

Copy the token from each response and use it to test the respective endpoints!

## Troubleshooting

1. **Token not working**: Make sure you're using `Bearer TOKEN` format in Authorization header
2. **403 Forbidden**: Check if user has the required role/permission
3. **500 Error**: Check Laravel logs with `php artisan tail`
4. **Database issues**: Run `php artisan migrate:fresh --seed` to reset

Your authentication system is now fully functional and ready for testing! 🚀


