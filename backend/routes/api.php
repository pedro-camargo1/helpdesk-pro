<?php

// ─────────────────────────────────────────────
// HelpDesk Pro — API Routes (Laravel)
// RESTful API with Sanctum authentication
// ─────────────────────────────────────────────

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;

// ── Public routes ─────────────────────────────
// These routes are accessible without authentication

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->name('auth.login');

    Route::post('/register', [AuthController::class, 'register'])
        ->name('auth.register');

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
        ->name('auth.forgot-password');
});

// ── Protected routes ──────────────────────────
// Require valid Sanctum token

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me'])
            ->name('auth.me');

        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');

        Route::put('/me', [AuthController::class, 'updateProfile'])
            ->name('auth.update-profile');
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats'])
            ->name('dashboard.stats');

        Route::get('/charts', [DashboardController::class, 'charts'])
            ->name('dashboard.charts');
    });

    // Tickets
    Route::apiResource('tickets', TicketController::class);

    // Nested: Ticket comments
    Route::prefix('tickets/{ticket}')->group(function () {
        Route::get('/comments', [CommentController::class, 'index'])
            ->name('tickets.comments.index');

        Route::post('/comments', [CommentController::class, 'store'])
            ->name('tickets.comments.store');

        Route::put('/comments/{comment}', [CommentController::class, 'update'])
            ->name('tickets.comments.update');

        Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])
            ->name('tickets.comments.destroy');
    });

    // Users — admin only for full management
    Route::get('/users', [UserController::class, 'index'])
        ->name('users.index');

    Route::get('/users/{user}', [UserController::class, 'show'])
        ->name('users.show');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->name('users.update');

    Route::post('/users/{user}/avatar', [UserController::class, 'updateAvatar'])
        ->name('users.avatar');

    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/users', [UserController::class, 'store'])
            ->name('users.store');

        Route::delete('/users/{user}', [UserController::class, 'destroy'])
            ->name('users.destroy');
    });

    // Categories
    Route::apiResource('categories', CategoryController::class)
        ->only(['index', 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});
