<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Producto;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $alertasStock = null;

        if ($request->user()) {
            $sinStock = Producto::where('activo', true)
                ->where('stock', 0)
                ->count();

            $stockBajo = Producto::where('activo', true)
                ->where('stock', '>', 0)
                ->where('stock', '<=', 10)
                ->count();

            if ($sinStock > 0 || $stockBajo > 0) {
                $alertasStock = [
                    'sin_stock' => $sinStock,
                    'stock_bajo' => $stockBajo,
                ];
            }
        }

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            'alertasStock' => $alertasStock,
        ];
    }
}