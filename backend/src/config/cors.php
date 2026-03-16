<?php

// ─────────────────────────────────────────────
// HelpDesk Pro — CORS Configuration
// config/cors.php
// ─────────────────────────────────────────────

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Allows the Next.js frontend (localhost:3000) to make requests to the
    | Laravel API (localhost:8000) during development.
    |
    | In production, set FRONTEND_URL in .env to your actual domain.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
