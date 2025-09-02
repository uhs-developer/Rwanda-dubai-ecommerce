<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private $flutterwaveSecretKey;
    private $flutterwaveBaseUrl = 'https://api.flutterwave.com/v3';

    public function __construct()
    {
        $this->flutterwaveSecretKey = config('services.flutterwave.secret_key');
    }

    /**
     * Verify payment with Flutterwave
     */
    public function verifyPayment(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'tx_ref' => 'required|string'
            ]);

            $txRef = $request->input('tx_ref');

            // Call Flutterwave API to verify payment
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->flutterwaveSecretKey,
                'Content-Type' => 'application/json'
            ])->get($this->flutterwaveBaseUrl . '/transactions/' . $txRef . '/verify');

            if (!$response->successful()) {
                Log::error('Flutterwave verification failed', [
                    'tx_ref' => $txRef,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment verification failed'
                ], 400);
            }

            $data = $response->json();

            if ($data['status'] === 'success' && $data['data']['status'] === 'successful') {
                // Payment is successful
                Log::info('Payment verified successfully', [
                    'tx_ref' => $txRef,
                    'amount' => $data['data']['amount'],
                    'customer_email' => $data['data']['customer']['email']
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Payment verified successfully',
                    'data' => [
                        'tx_ref' => $data['data']['tx_ref'],
                        'flw_ref' => $data['data']['flw_ref'],
                        'amount' => $data['data']['amount'],
                        'currency' => $data['data']['currency'],
                        'customer_email' => $data['data']['customer']['email'],
                        'created_at' => $data['data']['created_at'],
                        'meta' => $data['data']['meta'] ?? null
                    ]
                ]);
            } else {
                Log::warning('Payment verification failed - payment not successful', [
                    'tx_ref' => $txRef,
                    'payment_status' => $data['data']['status'] ?? 'unknown'
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment was not successful'
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Payment verification error', [
                'tx_ref' => $request->input('tx_ref'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while verifying payment'
            ], 500);
        }
    }

    /**
     * Initialize payment with Paystack
     */
    public function initializePayment(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'amount' => 'required|numeric|min:1',
                'reference' => 'required|string',
                'metadata' => 'sometimes|array'
            ]);

            $payload = [
                'email' => $request->input('email'),
                'amount' => $request->input('amount') * 100, // Convert to kobo
                'reference' => $request->input('reference'),
                'currency' => 'USD', // You can make this configurable
                'callback_url' => config('app.url') . '/payment/callback',
                'metadata' => $request->input('metadata', [])
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->paystackSecretKey,
                'Content-Type' => 'application/json'
            ])->post($this->paystackBaseUrl . '/transaction/initialize', $payload);

            if (!$response->successful()) {
                Log::error('Paystack initialization failed', [
                    'payload' => $payload,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment initialization failed'
                ], 400);
            }

            $data = $response->json();

            return response()->json([
                'status' => 'success',
                'message' => 'Payment initialized successfully',
                'data' => [
                    'authorization_url' => $data['data']['authorization_url'],
                    'access_code' => $data['data']['access_code'],
                    'reference' => $data['data']['reference']
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Payment initialization error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while initializing payment'
            ], 500);
        }
    }

    /**
     * Handle Flutterwave webhook
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        try {
            $payload = $request->all();
            $signature = $request->header('verif-hash');

            // Verify webhook signature
            if (!$this->verifyWebhookSignature($request->getContent(), $signature)) {
                Log::warning('Invalid webhook signature', [
                    'signature' => $signature
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid signature'
                ], 400);
            }

            $event = $payload['event'];

            if ($event === 'charge.completed') {
                $data = $payload['data'];
                
                Log::info('Payment webhook received', [
                    'tx_ref' => $data['tx_ref'],
                    'flw_ref' => $data['flw_ref'],
                    'amount' => $data['amount'],
                    'customer_email' => $data['customer']['email']
                ]);

                // Here you can update your database, send emails, etc.
                // For now, we'll just log the successful payment

                return response()->json([
                    'status' => 'success',
                    'message' => 'Webhook processed successfully'
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Webhook received but not processed'
            ]);

        } catch (\Exception $e) {
            Log::error('Webhook processing error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while processing webhook'
            ], 500);
        }
    }

    /**
     * Verify webhook signature
     */
    private function verifyWebhookSignature(string $payload, string $signature): bool
    {
        $expectedSignature = hash_hmac('sha256', $payload, config('services.flutterwave.secret_key'));
        return hash_equals($expectedSignature, $signature);
    }
}
