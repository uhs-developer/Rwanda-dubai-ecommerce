# 🧪 Test Accounts for Rwanda-Dubai E-commerce

All test accounts use the password: **`password123`** (unless otherwise specified)

---

## 👑 Super Admin Accounts

### Super Admin (Full Access)
- **Email:** `superadmin@test.com`
- **Password:** `password123`
- **Role:** Super Admin
- **Permissions:** Full system access

### Rwanda Dubai Admin
- **Email:** `admin@rwandadubai.com`
- **Password:** `password123`
- **Role:** Super Admin
- **Name:** Rwanda Dubai E-commerce Admin
- **Phone:** +250788123456

---

## 👨‍💼 Admin Accounts

### Admin User
- **Email:** `admin@test.com`
- **Password:** `password123`
- **Role:** Admin
- **Name:** Admin User

### Sarah Johnson
- **Email:** `sarah.johnson@rwandadubai.com`
- **Password:** `admin123`
- **Role:** Admin
- **Phone:** +250788789012

### Michael Omondi
- **Email:** `michael.omondi@rwandadubai.com`
- **Password:** `admin123`
- **Role:** Admin
- **Phone:** +250788890123

---

## ✏️ Editor Account

### Editor User
- **Email:** `editor@test.com`
- **Password:** `password123`
- **Role:** Editor
- **Permissions:** Content management (view, create, edit, delete, publish content)

---

## 🏪 Merchant Accounts (Dubai)

All merchants use password: **`merchant123`**

### Ahmed Al-Rashid Electronics
- **Email:** `ahmed.electronics@dubaishop.com`
- **Password:** `merchant123`
- **Role:** Merchant
- **Phone:** +971501234567

### Fatima Auto Parts
- **Email:** `fatima.autoparts@dubaishop.com`
- **Password:** `merchant123`
- **Role:** Merchant
- **Phone:** +971502345678

### Omar Home Appliances
- **Email:** `omar.appliances@dubaishop.com`
- **Password:** `merchant123`
- **Role:** Merchant
- **Phone:** +971503456789

### Layla Fashion & Textiles
- **Email:** `layla.fashion@dubaishop.com`
- **Password:** `merchant123`
- **Role:** Merchant
- **Phone:** +971504567890

---

## 👤 Customer Accounts (Rwanda)

All customers use password: **`customer123`**

### Jean Baptiste Nkurunziza
- **Email:** `jean.baptiste@email.com`
- **Password:** `customer123`
- **Role:** Customer
- **Phone:** +250788234567

### Marie Claire Uwimana
- **Email:** `marie.claire@email.com`
- **Password:** `customer123`
- **Role:** Customer
- **Phone:** +250788345678

### Peter Mugisha
- **Email:** `peter.mugisha@email.com`
- **Password:** `customer123`
- **Role:** Customer
- **Phone:** +250788456789

### Grace Mukamana
- **Email:** `grace.mukamana@email.com`
- **Password:** `customer123`
- **Role:** Customer
- **Phone:** +250788567890

### David Ndayishimiye
- **Email:** `david.ndayishimiye@email.com`
- **Password:** `customer123`
- **Role:** Customer
- **Phone:** +250788678901

---

## 👥 Regular User Account

### Regular User
- **Email:** `user@test.com`
- **Password:** `password123`
- **Role:** User
- **Permissions:** Basic view access

---

## 🧪 Quick Test Account Summary

### For Quick Testing:
- **Super Admin:** `superadmin@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`
- **Merchant:** `ahmed.electronics@dubaishop.com` / `merchant123`
- **Customer:** `jean.baptiste@email.com` / `customer123`

---

## 📝 API Testing

### Login Endpoint
```bash
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "superadmin@test.com",
  "password": "password123"
}
```

### Example cURL Command
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@test.com",
    "password": "password123"
  }'
```

---

## 🔐 Password Summary

| Role | Password |
|------|----------|
| Super Admin | `password123` |
| Admin | `password123` or `admin123` |
| Editor | `password123` |
| Merchant | `merchant123` |
| Customer | `customer123` |
| User | `password123` |

---

## ✅ All Accounts Status

All accounts are:
- ✅ Email verified
- ✅ Status: Active
- ✅ Roles assigned
- ✅ Ready for testing

---

**Total Accounts Created:** 16 users
- 2 Super Admins
- 3 Admins
- 1 Editor
- 4 Merchants
- 5 Customers
- 1 Regular User
