export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: string; // Changed from number to string to prevent val.replace errors
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

  private convertMetadataToStrings(metadata: any): any {
    if (!metadata || typeof metadata !== 'object') {
      return {};
    }

    const converted: any = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (value === null || value === undefined) {
        converted[key] = '';
      } else if (typeof value === 'object' && Array.isArray(value)) {
        // Handle arrays (like items array)
        converted[key] = value.map((item: any) => {
          if (typeof item === 'object' && item !== null) {
            const convertedItem: any = {};
            for (const [itemKey, itemValue] of Object.entries(item)) {
              // Ensure all values are strings and sanitize them
              convertedItem[itemKey] = this.sanitizeString(String(itemValue || ''));
            }
            return convertedItem;
          }
          return this.sanitizeString(String(item || ''));
        });
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        converted[key] = this.convertMetadataToStrings(value);
      } else {
        // Convert primitive values to strings and sanitize them
        converted[key] = this.sanitizeString(String(value || ''));
      }
    }
    return converted;
  }

  private sanitizeString(value: string): string {
    // Remove any characters that might cause issues with val.replace
    return value
      .replace(/[^\w\s@.-]/g, '') // Keep only alphanumeric, spaces, @, ., and -
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
  }

  public createPaymentConfig(
    email: string,
    amount: string | number, // Accept both string and number, convert to string internally
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

    // Ensure all values are properly converted to strings and sanitized
    const config = {
      public_key: this.sanitizeString(String(publicKey)),
      tx_ref: this.sanitizeString(String(txRef || this.generateTxRef())),
      amount: String(Number(amount).toFixed(2)), // Convert to string with 2 decimal places
      currency: String('USD'), // Explicitly convert to string
      payment_options: String('card,mobilemoney,ussd'), // Explicitly convert to string
      redirect_url: this.sanitizeString(String(window.location.origin + '/checkout')),
      customer: {
        email: this.sanitizeString(String(email || '')),
        phone_number: phoneNumber ? this.sanitizeString(String(phoneNumber)) : String(''), // Convert undefined to empty string
        name: this.sanitizeString(String(customerName || '')),
      },
      customizations: {
        title: this.sanitizeString(String('TechBridge - Dubai to Rwanda')),
        description: this.sanitizeString(String('Payment for your order')),
        logo: this.sanitizeString(String(window.location.origin + '/vite.svg')),
      },
      meta: this.convertMetadataToStrings(metadata || {}),
    };

    console.log('Flutterwave config created:', { ...config, public_key: publicKey.substring(0, 15) + '...' });
    
    // Debug: Check all values are strings
    console.log('String validation check:', {
      public_key: typeof config.public_key,
      tx_ref: typeof config.tx_ref,
      amount: typeof config.amount,
      currency: typeof config.currency,
      payment_options: typeof config.payment_options,
      redirect_url: typeof config.redirect_url,
      customer_email: typeof config.customer.email,
      customer_phone: typeof config.customer.phone_number,
      customer_name: typeof config.customer.name,
      customizations_title: typeof config.customizations.title,
      customizations_description: typeof config.customizations.description,
      customizations_logo: typeof config.customizations.logo,
      meta: typeof config.meta
    });
    
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
    if (typeof config.currency !== 'string') {
      throw new Error('Currency must be a string for Flutterwave');
    }
    if (typeof config.payment_options !== 'string') {
      throw new Error('Payment options must be a string for Flutterwave');
    }
    if (typeof config.redirect_url !== 'string') {
      throw new Error('Redirect URL must be a string for Flutterwave');
    }
    if (typeof config.customer.email !== 'string') {
      throw new Error('Customer email must be a string for Flutterwave');
    }
    if (typeof config.customer.name !== 'string') {
      throw new Error('Customer name must be a string for Flutterwave');
    }
    if (config.customer.phone_number && typeof config.customer.phone_number !== 'string') {
      throw new Error('Customer phone number must be a string for Flutterwave');
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

