import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { flutterwaveService, FlutterwaveConfig, FlutterwaveResponse, FlutterwaveError } from '../services/flutterwaveService';

interface FlutterwavePaymentProps {
  email: string;
  amount: number;
  customerName: string;
  phoneNumber?: string;
  metadata?: any;
  onSuccess: (response: FlutterwaveResponse) => void;
  onError: (error: FlutterwaveError) => void;
  onClose?: () => void;
  disabled?: boolean;
}

export function FlutterwavePayment({
  email,
  amount,
  customerName,
  phoneNumber,
  metadata,
  onSuccess,
  onError,
  onClose,
  disabled = false
}: FlutterwavePaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  // Create a default config to avoid conditional hook usage
  const defaultConfig: FlutterwaveConfig = {
    public_key: 'FLWPUBK_TEST-default',
    tx_ref: 'default-tx-ref',
    amount: amount,
    currency: 'USD',
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

  let config: FlutterwaveConfig = defaultConfig;
  let handleFlutterPayment: any = null;
  
  try {
    config = flutterwaveService.createPaymentConfig(
      email,
      amount,
      customerName,
      phoneNumber,
      undefined,
      metadata
    );
  } catch (error) {
    console.error('Flutterwave configuration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load payment modal. Check your internet connection and retry later.';
    // Don't set error during render - it will be handled when button is clicked
    config = defaultConfig;
  }

  // Always call useFlutterwave hook to avoid conditional hook usage
  handleFlutterPayment = useFlutterwave(config);

  // No useEffect needed - errors will be handled when user clicks the button

  const handlePayment = async () => {
    if (disabled || isProcessing) return;

    // Check for configuration errors when button is clicked
    try {
      const validConfig = flutterwaveService.createPaymentConfig(
        email,
        amount,
        customerName,
        phoneNumber,
        undefined,
        metadata
      );
    } catch (error) {
      console.error('Flutterwave configuration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load payment modal. Check your internet connection and retry later.';
      setPaymentStatus('error');
      onError({
        message: errorMessage,
        code: 'CONFIG_ERROR'
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      handleFlutterPayment({
        callback: async (response: FlutterwaveResponse) => {
          console.log('Payment response:', response);
          
          if (response.status === 'successful') {
            setPaymentStatus('success');
            
            // Verify payment on backend
            const isVerified = await flutterwaveService.verifyPayment(response.data?.tx_ref || '');
            
            if (isVerified) {
              onSuccess(response);
            } else {
              setPaymentStatus('error');
              onError({
                message: 'Payment verification failed',
                code: 'VERIFICATION_FAILED'
              });
            }
          } else {
            setPaymentStatus('error');
            onError({
              message: response.message || 'Payment failed',
              code: 'PAYMENT_FAILED'
            });
          }
        },
        onClose: () => {
          console.log('Payment closed');
          setPaymentStatus('idle');
          setIsProcessing(false);
          onClose?.();
        }
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setPaymentStatus('error');
      setIsProcessing(false);
      onError({
        message: 'Payment initialization failed',
        code: 'INIT_ERROR'
      });
    }
  };

  const getButtonContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Payment Successful
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Payment Failed
          </>
        );
      default:
        return (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay with Flutterwave - ${amount.toFixed(2)}
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (paymentStatus) {
      case 'success':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Pay securely with Flutterwave
          </p>
          <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
        </div>

        <Button
          onClick={handlePayment}
          disabled={disabled || isProcessing || paymentStatus === 'success'}
          variant={getButtonVariant()}
          size="lg"
          className="w-full"
        >
          {getButtonContent()}
        </Button>

        {paymentStatus === 'error' && (
          <Button
            onClick={() => {
              setPaymentStatus('idle');
              setIsProcessing(false);
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Try Again
          </Button>
        )}

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>• 256-bit SSL encryption</p>
          <p>• PCI DSS compliant</p>
          <p>• Test mode enabled</p>
          <p>• Supports Card, Mobile Money, USSD</p>
        </div>
      </CardContent>
    </Card>
  );
}

