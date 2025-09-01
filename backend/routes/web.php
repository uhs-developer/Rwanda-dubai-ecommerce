<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FirstController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/first', [FirstController::class, 'index']);

// Cart routes (public - works for both authenticated users and guests)
Route::prefix('api/cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/add', [CartController::class, 'add']);
    Route::put('/update/{id}', [CartController::class, 'update']);
    Route::delete('/remove/{id}', [CartController::class, 'remove']);
    Route::delete('/clear', [CartController::class, 'clear']);
    Route::get('/summary', [CartController::class, 'summary']);
});

// Wishlist routes (public - works for both authenticated users and guests)
Route::prefix('api/wishlist')->group(function () {
    Route::get('/', [WishlistController::class, 'index']);
    Route::post('/add', [WishlistController::class, 'add']);
    Route::delete('/remove/{id}', [WishlistController::class, 'remove']);
    Route::delete('/remove-product/{productId}', [WishlistController::class, 'removeByProduct']);
    Route::delete('/clear', [WishlistController::class, 'clear']);
    Route::get('/check/{productId}', [WishlistController::class, 'check']);
    Route::get('/count', [WishlistController::class, 'count']);
});
