<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->header('Origin');
        
        // Define allowed origins
        $allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            'https://api.seba.hanohost.net',
            'https://seba.hanohost.net',
            'https://damus-2bfi.vercel.app',
        ];
        
        // Check if origin is allowed
        $allowedOrigin = in_array($origin, $allowedOrigins) ? $origin : null;
        
        // Check Vercel pattern if not in allowed origins
        if (!$allowedOrigin && $origin && preg_match('/^https:\/\/.*\.vercel\.app$/', $origin)) {
            $allowedOrigin = $origin;
        }
        
        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
            
            if ($allowedOrigin) {
                $response->header('Access-Control-Allow-Origin', $allowedOrigin);
                $response->header('Access-Control-Allow-Credentials', 'true');
            }
            
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN');
            $response->header('Access-Control-Max-Age', '86400');
            
            return $response;
        }

        $response = $next($request);

        // Add CORS headers to the response
        if ($allowedOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }
        
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN');

        return $response;
    }
}
