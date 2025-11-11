# Social Authentication Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for the Rwanda-Dubai E-commerce platform.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Google OAuth Setup](#google-oauth-setup)
- [Facebook OAuth Setup](#facebook-oauth-setup)
- [Laravel Socialite Installation](#laravel-socialite-installation)
- [Backend Implementation](#backend-implementation)
- [Frontend Integration](#frontend-integration)
- [Testing](#testing)

---

## Prerequisites

- Active Google Cloud Console account
- Active Facebook Developer account
- Laravel backend running
- React frontend running
- SSL certificate (required for production)

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **New Project**
3. Enter project name: `Rwanda-Dubai-Ecommerce`
4. Click **Create**

### Step 2: Enable Google+ API

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **Create**
4. Fill in the required information:
   - **App name**: Rwanda-Dubai E-commerce
   - **User support email**: your-email@example.com
   - **Developer contact email**: your-email@example.com
5. Click **Save and Continue**
6. **Scopes**: Click **Add or Remove Scopes**
   - Select: `userinfo.email`, `userinfo.profile`, `openid`
7. Click **Save and Continue**
8. **Test users** (Optional for development)
9. Click **Save and Continue**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Application type**: Web application
4. **Name**: Rwanda-Dubai Web Client
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://yourdomain.com
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:8000/api/auth/google/callback
   https://api.yourdomain.com/api/auth/google/callback
   ```
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

---

## Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Consumer** app type
4. Click **Next**
5. Fill in app details:
   - **App Name**: Rwanda-Dubai E-commerce
   - **App Contact Email**: your-email@example.com
6. Click **Create App**

### Step 2: Add Facebook Login

1. In the app dashboard, find **Add Product**
2. Click **Set Up** on **Facebook Login**
3. Select **Web** platform
4. Enter your site URL: `http://localhost:3000`
5. Click **Save** and **Continue**

### Step 3: Configure Facebook Login Settings

1. Go to **Facebook Login** → **Settings**
2. **Valid OAuth Redirect URIs**:
   ```
   http://localhost:8000/api/auth/facebook/callback
   https://api.yourdomain.com/api/auth/facebook/callback
   ```
3. **Deauthorize Callback URL**: (optional)
4. **Login from Devices**: No
5. Click **Save Changes**

### Step 4: Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy **App ID** and **App Secret**
3. Add your domain to **App Domains**:
   ```
   localhost
   yourdomain.com
   ```
4. Fill in **Privacy Policy URL** (required for production)
5. Fill in **Terms of Service URL** (optional)

### Step 5: Make App Public (Production Only)

1. Go to **Settings** → **Basic**
2. At the top, toggle the app from **Development** to **Live**
3. Note: You must complete all required fields and pass App Review

---

## Laravel Socialite Installation

### Step 1: Install Socialite

```bash
cd rwanda-dubai-be
composer require laravel/socialite
```

### Step 2: Update .env File

Add the following to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:8000/api/auth/facebook/callback
```

### Step 3: Update config/services.php

Add to `config/services.php`:

```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],

'facebook' => [
    'client_id' => env('FACEBOOK_CLIENT_ID'),
    'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
    'redirect' => env('FACEBOOK_REDIRECT_URI'),
],
```

---

## Backend Implementation

### Step 1: Create Social Auth Controller

Create `app/Http/Controllers/Api/SocialAuthController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'tenant_id' => 1, // Default tenant
                    'email_verified_at' => now(),
                ]);

                // Assign customer role
                $user->assignRole('customer');
            } else {
                // Update Google ID if not set
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $token);
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL') . '/auth/error?message=' . urlencode($e->getMessage()));
        }
    }

    /**
     * Redirect to Facebook OAuth
     */
    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')
            ->stateless()
            ->redirect();
    }

    /**
     * Handle Facebook OAuth callback
     */
    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();

            $user = User::where('email', $facebookUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $facebookUser->name,
                    'email' => $facebookUser->email,
                    'facebook_id' => $facebookUser->id,
                    'avatar' => $facebookUser->avatar,
                    'tenant_id' => 1, // Default tenant
                    'email_verified_at' => now(),
                ]);

                // Assign customer role
                $user->assignRole('customer');
            } else {
                // Update Facebook ID if not set
                if (!$user->facebook_id) {
                    $user->update(['facebook_id' => $facebookUser->id]);
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $token);
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL') . '/auth/error?message=' . urlencode($e->getMessage()));
        }
    }
}
```

### Step 2: Add Database Columns

Create migration to add social auth columns:

```bash
php artisan make:migration add_social_auth_columns_to_users_table
```

Edit the migration file:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->after('email');
            $table->string('facebook_id')->nullable()->after('google_id');
            $table->string('avatar')->nullable()->after('facebook_id');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'facebook_id', 'avatar']);
        });
    }
};
```

Run the migration:

```bash
php artisan migrate
```

### Step 3: Update User Model

Add to `app/Models/User.php` fillable array:

```php
protected $fillable = [
    'name',
    'email',
    'password',
    'tenant_id',
    'google_id',
    'facebook_id',
    'avatar',
];
```

### Step 4: Add API Routes

Add to `routes/api.php`:

```php
use App\Http\Controllers\Api\SocialAuthController;

// Social Authentication Routes
Route::prefix('auth')->group(function () {
    // Google OAuth
    Route::get('google', [SocialAuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

    // Facebook OAuth
    Route::get('facebook', [SocialAuthController::class, 'redirectToFacebook']);
    Route::get('facebook/callback', [SocialAuthController::class, 'handleFacebookCallback']);
});
```

---

## Frontend Integration

### Step 1: Add Environment Variables

Add to `rwanda-dubai-project-fe/.env`:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
```

### Step 2: Install React Google Login

```bash
cd rwanda-dubai-project-fe
npm install @react-oauth/google
npm install react-facebook-login
```

### Step 3: Update App.tsx

Wrap your app with Google OAuth Provider in `src/App.tsx`:

```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      {/* Your app components */}
    </GoogleOAuthProvider>
  );
}
```

### Step 4: Create Social Login Buttons

Create `src/components/SocialLogin.tsx`:

```tsx
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

interface SocialLoginProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError }) => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  const handleFacebookResponse = (response: any) => {
    if (response.accessToken) {
      // Backend will handle the Facebook token
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/facebook`;
    }
  };

  return (
    <div className="social-login">
      <button
        onClick={handleGoogleLogin}
        className="btn btn-outline-danger w-100 mb-2"
      >
        <i className="bi bi-google me-2"></i>
        Continue with Google
      </button>

      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID || ''}
        callback={handleFacebookResponse}
        render={(renderProps: any) => (
          <button
            onClick={renderProps.onClick}
            className="btn btn-outline-primary w-100"
          >
            <i className="bi bi-facebook me-2"></i>
            Continue with Facebook
          </button>
        )}
      />
    </div>
  );
};
```

### Step 5: Handle OAuth Callback

Create `src/pages/AuthCallback.tsx`:

```tsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('message');

    if (token) {
      // Save token to localStorage
      localStorage.setItem('auth_token', token);

      // Redirect to dashboard or home
      navigate('/dashboard');
    } else if (error) {
      console.error('Auth error:', error);
      navigate('/login?error=' + error);
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
```

### Step 6: Add Route

Add to your router:

```tsx
<Route path="/auth/callback" element={<AuthCallback />} />
<Route path="/auth/error" element={<AuthError />} />
```

---

## Testing

### Development Testing

1. **Test Google Login**:
   - Click "Continue with Google" button
   - Select your Google account
   - Grant permissions
   - You should be redirected to your app with a token

2. **Test Facebook Login**:
   - Click "Continue with Facebook" button
   - Log in with your Facebook account
   - Grant permissions
   - You should be redirected to your app with a token

### Production Checklist

- [ ] SSL certificate installed (HTTPS)
- [ ] Update all redirect URIs to production URLs
- [ ] Update Google OAuth consent screen with production info
- [ ] Make Facebook app live
- [ ] Test with multiple accounts
- [ ] Monitor error logs
- [ ] Set up proper error handling and user messaging

---

## Troubleshooting

### Common Issues

1. **redirect_uri_mismatch**:
   - Ensure redirect URI in Google/Facebook matches exactly
   - Include http:// or https://
   - No trailing slashes

2. **CORS errors**:
   - Add frontend URL to `config/cors.php` allowed origins
   - Ensure API routes are in `api` middleware group

3. **Invalid token**:
   - Check Laravel Sanctum configuration
   - Ensure stateless mode is enabled

4. **Email already exists**:
   - Handle duplicate email scenario
   - Allow linking social accounts to existing accounts

---

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** on auth endpoints
4. **Validate email domains** if needed
5. **Store minimal user data** from providers
6. **Implement logout** functionality properly
7. **Use HTTPS** in production
8. **Keep packages updated** regularly

---

## Support

For issues or questions:
- Laravel Socialite Docs: https://laravel.com/docs/socialite
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
- Facebook Login Docs: https://developers.facebook.com/docs/facebook-login

---

**Last Updated**: 2025-11-11
