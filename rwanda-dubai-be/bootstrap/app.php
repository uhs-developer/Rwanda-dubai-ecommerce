<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Enable CORS globally (for both web and API, including GraphQL)
        $middleware->prepend(\App\Http\Middleware\Cors::class);
        
        // Register tenant resolver globally for both web and API routes
        $middleware->appendToGroup('web', \App\Http\Middleware\TenantResolver::class);
        $middleware->appendToGroup('api', \App\Http\Middleware\TenantResolver::class);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'permission' => \App\Http\Middleware\PermissionMiddleware::class,
            'super-admin' => \App\Http\Middleware\SuperAdminMiddleware::class,
            'tenant' => \App\Http\Middleware\TenantResolver::class,
        ]);

        // Rate limiting for API routes
        $middleware->throttleApi('60,1'); // 60 requests per minute per IP

        // Security headers
        $middleware->appendToGroup('api', \App\Http\Middleware\SecurityHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
