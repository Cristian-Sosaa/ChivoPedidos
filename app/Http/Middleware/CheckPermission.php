<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! $request->user() || ! $request->user()->can($permission)) {
            if ($request->header('X-Inertia')) {
                return back()->with('error', 'No tenés permiso para realizar esta acción.');
            }

            abort(403, 'No tenés permiso para realizar esta acción.');
        }

        return $next($request);
    }
}