// Test script for Paystack payment integration
// This file can be imported and used for testing

import { paymentService } from './services/paymentService';

export const testPaymentService = () => {
  console.log('Testing Payment Service...');
  
  // Test reference generation
  const reference = paymentService.generateReference();
  console.log('Generated reference:', reference);
  
  // Test payment config creation
  const config = paymentService.createPaymentConfig(
    'test@example.com',
    100, // $100
    reference,
    { test: true }
  );
  
  console.log('Payment config:', config);
  
  // Test payment processing (mock)
  paymentService.processPayment(
    config,
    (response) => {
      console.log('Payment success:', response);
    },
    (error) => {
      console.log('Payment error:', error);
    }
  );
  
  return {
    reference,
    config,
    status: 'Payment service initialized successfully'
  };
};

// Test data for checkout
export const testCheckoutData = {
  shipping: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+250 123 456 789',
    address: '123 Main Street',
    city: 'Kigali',
    district: 'Kigali',
    postalCode: '12345'
  },
  payment: {
    method: 'paystack',
    reference: paymentService.generateReference()
  },
  totals: {
    subtotal: 500,
    shipping: 50,
    tax: 27.5,
    total: 577.5
  }
};

// Test cards for Paystack
export const testCards = {
  successful: {
    number: '4084084084084081',
    expiry: '12/25',
    cvv: '123',
    pin: '1234'
  },
  failed: {
    number: '4084084084084085',
    expiry: '12/25',
    cvv: '123',
    pin: '1234'
  },
  insufficientFunds: {
    number: '4084084084084082',
    expiry: '12/25',
    cvv: '123',
    pin: '1234'
  }
};

console.log('Payment test utilities loaded');
console.log('Available functions: testPaymentService(), testCheckoutData, testCards');
