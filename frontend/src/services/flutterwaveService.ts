export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  redirect_url?: string;
  customer: {
    email: string;
    phone_number?: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
  meta?: {
    [key: string]: any;
  };
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    card: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      token: string;
      expiry: string;
    };
    created_at: string;
    status: string;
    account_id: number;
    customer: {
      id: number;
      phone_number: string;
      name: string;
      email: string;
      created_at: string;
    };
  };
}

export interface FlutterwaveError {
  message: string;
  code?: string;
}

export class FlutterwaveService {
  private static instance: FlutterwaveService;

  private constructor() {
    // Don't initialize publicKey here - it will be loaded when needed
  }

  private getPublicKey(): string {
    const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '';
    if (!publicKey) {
      console.error('Flutterwave public key not found in environment variables. Please set VITE_FLUTTERWAVE_PUBLIC_KEY in your .env file');
    }
    return publicKey;
  }

  public static getInstance(): FlutterwaveService {
    if (!FlutterwaveService.instance) {
      FlutterwaveService.instance = new FlutterwaveService();
    }
    return FlutterwaveService.instance;
  }

  public generateTxRef(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public createPaymentConfig(
    email: string,
    amount: number,
    customerName: string,
    phoneNumber?: string,
    txRef?: string,
    metadata?: any
  ): FlutterwaveConfig {
    const publicKey = this.getPublicKey();
    
    if (!publicKey) {
      throw new Error('Flutterwave public key is not configured. Please set VITE_FLUTTERWAVE_PUBLIC_KEY in your .env file');
    }

    // Validate public key format
    if (!publicKey.startsWith('FLWPUBK_')) {
      throw new Error(`Invalid Flutterwave public key format. Expected to start with 'FLWPUBK_', got: ${publicKey.substring(0, 10)}...`);
    }

    console.log('Creating Flutterwave config with public key:', publicKey.substring(0, 15) + '...');
    console.log('Input validation:', {
      email: typeof email, emailValue: email,
      amount: typeof amount, amountValue: amount,
      customerName: typeof customerName, customerNameValue: customerName,
      phoneNumber: typeof phoneNumber, phoneNumberValue: phoneNumber
    });

    const config = {
      public_key: String(publicKey),
      tx_ref: String(txRef || this.generateTxRef()),
      amount: String(Number(amount).toFixed(2)), // Convert to string with 2 decimal places
      currency: 'USD', // You can change this to RWF for Rwanda
      payment_options: 'card,mobilemoney,ussd',
      redirect_url: String(window.location.origin + '/checkout'),
      customer: {
        email: String(email || ''),
        phone_number: phoneNumber ? String(phoneNumber) : undefined,
        name: String(customerName || ''),
      },
      customizations: {
        title: 'TechBridge - Dubai to Rwanda',
        description: 'Payment for your order',
        logo: String(window.location.origin + '/vite.svg'),
      },
      meta: metadata || {},
    };

    console.log('Flutterwave config created:', { ...config, public_key: publicKey.substring(0, 15) + '...' });
    
    // Validate required fields for Flutterwave
    if (!config.customer.email) {
      throw new Error('Customer email is required for Flutterwave payment');
    }
    if (!config.customer.name) {
      throw new Error('Customer name is required for Flutterwave payment');
    }
    if (Number(config.amount) <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }
    if (!config.tx_ref) {
      throw new Error('Transaction reference is required');
    }
    
    // Validate that all values are strings
    if (typeof config.amount !== 'string') {
      throw new Error('Amount must be a string for Flutterwave');
    }
    if (typeof config.tx_ref !== 'string') {
      throw new Error('Transaction reference must be a string for Flutterwave');
    }
    
    console.log('Flutterwave validation passed:', {
      hasEmail: !!config.customer.email,
      hasName: !!config.customer.name,
      amount: config.amount,
      amountType: typeof config.amount,
      currency: config.currency,
      tx_ref: config.tx_ref,
      tx_refType: typeof config.tx_ref,
      public_keyType: typeof config.public_key
    });
    
    return config;
  }

  public async verifyPayment(txRef: string): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tx_ref: txRef })
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      const result = await response.json();
      return result.status === 'success';
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  public async processPayment(
    config: FlutterwaveConfig,
    onSuccess: (response: FlutterwaveResponse) => void,
    onError: (error: FlutterwaveError) => void
  ): Promise<void> {
    try {
      // This will be handled by the Flutterwave component
      console.log('Flutterwave payment config created:', config);
    } catch (error) {
      onError({
        message: 'Failed to initialize payment',
        code: 'INIT_ERROR'
      });
    }
  }
}

export const flutterwaveService = FlutterwaveService.getInstance();

