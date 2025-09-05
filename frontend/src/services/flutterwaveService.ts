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
  private publicKey: string;

  private constructor() {
    this.publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '';
    if (!this.publicKey) {
      console.error('Flutterwave public key not found in environment variables. Please set VITE_FLUTTERWAVE_PUBLIC_KEY in your .env file');
    }
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
    if (!this.publicKey) {
      throw new Error('Flutterwave public key is not configured. Please set VITE_FLUTTERWAVE_PUBLIC_KEY in your .env file');
    }

    // Validate public key format
    if (!this.publicKey.startsWith('FLWPUBK_')) {
      throw new Error(`Invalid Flutterwave public key format. Expected to start with 'FLWPUBK_', got: ${this.publicKey.substring(0, 10)}...`);
    }

    console.log('Creating Flutterwave config with public key:', this.publicKey.substring(0, 15) + '...');

    const config = {
      public_key: this.publicKey,
      tx_ref: txRef || this.generateTxRef(),
      amount: amount,
      currency: 'USD', // You can change this to RWF for Rwanda
      payment_options: 'card,mobilemoney,ussd',
      redirect_url: window.location.origin + '/checkout',
      customer: {
        email,
        phone_number: phoneNumber,
        name: customerName,
      },
      customizations: {
        title: 'TechBridge - Dubai to Rwanda',
        description: 'Payment for your order',
        logo: window.location.origin + '/vite.svg',
      },
      meta: metadata || {},
    };

    console.log('Flutterwave config created:', { ...config, public_key: config.public_key.substring(0, 15) + '...' });
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

