<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FirstController;
// Admin Blade controllers intentionally not used; React admin is the source of truth.

Route::get('/', function () {
    return view('welcome');
});

Route::get('/first', [FirstController::class, 'index']);

// Forward all /admin* web requests to React Admin SPA
Route::prefix('admin')->group(function () {
    Route::any('{any?}', function () {
        $base = rtrim(config('app.frontend_url', '/'), '/');
        return redirect($base . '/admin');
    })->where('any', '.*');
});
