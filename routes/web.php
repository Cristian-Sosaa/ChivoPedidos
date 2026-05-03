<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use Inertia\Inertia;

// ─── Rutas públicas (invitados) ─────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// ─── Rutas protegidas (autenticados) ────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/', function () {
        return redirect('/dashboard');
    });

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // ─── Categorías ─────────────────────────────────────
    Route::middleware('permission:categorias.ver')->group(function () {
        Route::get('/categorias', [CategoriaController::class, 'index'])->name('categorias.index');
    });

    Route::middleware('permission:categorias.crear')->group(function () {
        Route::get('/categorias/crear', [CategoriaController::class, 'create'])->name('categorias.create');
        Route::post('/categorias', [CategoriaController::class, 'store'])->name('categorias.store');
    });

    Route::middleware('permission:categorias.editar')->group(function () {
        Route::get('/categorias/{categoria}/editar', [CategoriaController::class, 'edit'])->name('categorias.edit');
        Route::put('/categorias/{categoria}', [CategoriaController::class, 'update'])->name('categorias.update');
        Route::patch('/categorias/{categoria}/toggle', [CategoriaController::class, 'toggleActive'])->name('categorias.toggle');
    });
    // ─── Productos ──────────────────────────────────────
    Route::middleware('permission:productos.ver')->group(function () {
        Route::get('/productos', [ProductoController::class, 'index'])->name('productos.index');
    });

    Route::middleware('permission:productos.crear')->group(function () {
        Route::get('/productos/crear', [ProductoController::class, 'create'])->name('productos.create');
        Route::post('/productos', [ProductoController::class, 'store'])->name('productos.store');
    });

    Route::middleware('permission:productos.editar')->group(function () {
        Route::get('/productos/{producto}/editar', [ProductoController::class, 'edit'])->name('productos.edit');
        Route::put('/productos/{producto}', [ProductoController::class, 'update'])->name('productos.update');
        Route::patch('/productos/{producto}/toggle', [ProductoController::class, 'toggleActive'])->name('productos.toggle');
    });
});