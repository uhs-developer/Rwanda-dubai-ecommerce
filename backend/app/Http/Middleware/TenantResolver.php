<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantResolver
{
    /**
     * Handle an incoming request.
     *
     * Resolves tenant from:
     * 1. X-Tenant-ID header
     * 2. Host/domain (e.g., tenant1.example.com)
     * 3. Default tenant (localhost, fallback)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = $this->resolveTenant($request);

        if (!$tenant || !$tenant->is_active) {
            return response()->json([
                'error' => 'Tenant not found or inactive',
            ], 404);
        }

        // Set tenant in request for use in controllers/resolvers
        $request->attributes->set('tenant', $tenant);

        // Set tenant globally for query scoping
        app()->instance('tenant', $tenant);

        return $next($request);
    }

    /**
     * Resolve tenant from request
     */
    protected function resolveTenant(Request $request): ?Tenant
    {
        // 1. Check X-Tenant-ID header
        if ($request->hasHeader('X-Tenant-ID')) {
            $tenantId = $request->header('X-Tenant-ID');
            return Tenant::where('id', $tenantId)
                ->orWhere('slug', $tenantId)
                ->first();
        }

        // 2. Check Host header for subdomain or domain
        $host = $request->getHost();
        if ($host) {
            $tenant = Tenant::where('domain', $host)->first();
            if ($tenant) {
                return $tenant;
            }

            // Check subdomain (e.g., tenant1.example.com)
            $parts = explode('.', $host);
            if (count($parts) > 2) {
                $subdomain = $parts[0];
                $tenant = Tenant::where('slug', $subdomain)->first();
                if ($tenant) {
                    return $tenant;
                }
            }
        }

        // 3. Default tenant (for local development)
        return Tenant::where('slug', 'default')->first();
    }
}
