<?php

namespace App\Http\Middleware;

// ─────────────────────────────────────────────
// HelpDesk Pro — Role-Based Access Middleware
// Usage: Route::middleware('role:admin')
// ─────────────────────────────────────────────

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param string ...$roles  Allowed roles (e.g., 'admin', 'agent')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        // Admin always has access
        if ($user->role === 'admin') {
            return $next($request);
        }

        if (! in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Acesso negado. Permissão insuficiente.',
            ], 403);
        }

        return $next($request);
    }
}

// ─────────────────────────────────────────────
// Register in bootstrap/app.php:
//
// ->withMiddleware(function (Middleware $middleware) {
//     $middleware->alias([
//         'role' => \App\Http\Middleware\CheckRole::class,
//     ]);
// })
// ─────────────────────────────────────────────
