# Flutterwave Payment Integration Testing Guide

## Setup Instructions

### 1. Environment Configuration

The `.env.local` file in the frontend directory should contain:

```env
# Flutterwave Configuration (Test Keys)
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef
VITE_FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef

# Backend API
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Backend Environment Configuration

Add the following to your backend `.env` file:

```env
# Flutterwave Configuration (Test Keys)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef
```

## Test Cards

Use these test card numbers for testing payments:

### Successful Payments
- **Card Number**: 4187427415564246
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 828)
- **PIN**: 3310

### Failed Payments
- **Card Number**: 4000000000000002
- **Expiry Date**: Any future date
- **CVV**: Any 3 digits
- **PIN**: 3310

### Insufficient Funds
- **Card Number**: 4000000000009995
- **Expiry Date**: Any future date
- **CVV**: Any 3 digits
- **PIN**: 3310

## Mobile Money Test Numbers

### MTN Mobile Money
- **Phone Number**: 054709929220
- **OTP**: 12345

### Vodafone Cash
- **Phone Number**: 0200000000
- **OTP**: 12345

## Testing Steps

### 1. Frontend Testing
1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the checkout page
3. Fill in shipping information
4. Select "Flutterwave (Card, Mobile Money, USSD)" as payment method
5. Click "Pay with Flutterwave" button
6. Use one of the test cards above

### 2. Backend Testing
1. Start the Laravel backend:
   ```bash
   cd backend
   php artisan serve
   ```

2. The payment verification endpoint is available at:
   ```
   POST http://localhost:8000/api/payment/verify
   ```

3. Test the webhook endpoint:
   ```
   POST http://localhost:8000/api/payment/webhook
   ```

## Payment Flow

1. **Frontend**: User selects Flutterwave payment method
2. **Frontend**: FlutterwavePayment component initializes payment
3. **Flutterwave**: User is redirected to Flutterwave payment page
4. **Flutterwave**: User enters card details and completes payment
5. **Flutterwave**: Redirects back to frontend with payment result
6. **Frontend**: Calls backend verification endpoint
7. **Backend**: Verifies payment with Flutterwave API
8. **Backend**: Returns verification result
9. **Frontend**: Processes order based on verification result

## Supported Payment Methods

Flutterwave supports multiple payment methods:
- **Card Payments**: Visa, Mastercard, American Express
- **Mobile Money**: MTN, Vodafone, AirtelTigo
- **USSD**: Bank transfers via USSD codes
- **Bank Transfer**: Direct bank transfers

## Error Handling

The integration includes comprehensive error handling for:
- Payment initialization failures
- Payment processing errors
- Verification failures
- Network errors
- Invalid card details

## Security Features

- SSL encryption for all payment data
- PCI DSS compliance through Flutterwave
- Webhook signature verification
- Secure API key management
- Test mode enabled for development

## Production Setup

For production deployment:

1. Replace test keys with live Flutterwave keys
2. Update webhook URLs in Flutterwave dashboard
3. Enable SSL certificates
4. Configure proper error logging
5. Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **Payment not initializing**: Check API keys and network connectivity
2. **Verification failing**: Ensure backend is running and accessible
3. **Webhook not working**: Verify webhook URL and signature validation
4. **CORS errors**: Check API base URL configuration

### Debug Mode

Enable debug logging by setting:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

Check Laravel logs in `storage/logs/laravel.log` for detailed error information.

## Flutterwave Dashboard

Access your Flutterwave dashboard at: https://dashboard.flutterwave.com/

### Test Mode Features:
- All transactions are simulated
- No real money is charged
- Test cards work without real funds
- Webhooks are sent for testing
