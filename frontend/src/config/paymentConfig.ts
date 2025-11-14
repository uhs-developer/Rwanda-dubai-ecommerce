export type PaymentEnv = 'sandbox' | 'live';

const env = (import.meta as any).env || {};

export const PAYMENT_ENV: PaymentEnv =
  (env.VITE_PAYMENT_ENV as PaymentEnv) || 'sandbox';

export const isSandboxPayment = PAYMENT_ENV === 'sandbox';


