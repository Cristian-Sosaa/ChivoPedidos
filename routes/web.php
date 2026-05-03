<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\HistorialPedidoController;
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
    // ─── Clientes ───────────────────────────────────────
    Route::middleware('permission:clientes.ver')->group(function () {
        Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
    });

    Route::middleware('permission:clientes.crear')->group(function () {
        Route::get('/clientes/crear', [ClienteController::class, 'create'])->name('clientes.create');
        Route::post('/clientes', [ClienteController::class, 'store'])->name('clientes.store');
    });

    Route::middleware('permission:clientes.editar')->group(function () {
        Route::get('/clientes/{cliente}/editar', [ClienteController::class, 'edit'])->name('clientes.edit');
        Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])->name('clientes.update');
        Route::patch('/clientes/{cliente}/toggle', [ClienteController::class, 'toggleActive'])->name('clientes.toggle');
    });
    // ─── Pedidos ────────────────────────────────────────
    Route::middleware('permission:pedidos.ver')->group(function () {
        Route::get('/pedidos', [PedidoController::class, 'index'])->name('pedidos.index');
        Route::get('/pedidos/{pedido}', [PedidoController::class, 'show'])->name('pedidos.show');
    });

    Route::middleware('permission:pedidos.crear')->group(function () {
        Route::get('/pedidos-crear', [PedidoController::class, 'create'])->name('pedidos.create');
        Route::post('/pedidos', [PedidoController::class, 'store'])->name('pedidos.store');
    });

    Route::middleware('permission:pedidos.editar')->group(function () {
        Route::patch('/pedidos/{pedido}/estado', [PedidoController::class, 'cambiarEstado'])->name('pedidos.cambiarEstado');
    });

    Route::middleware('permission:pedidos.editar')->group(function () {
        Route::patch('/pedidos/{pedido}/estado', [PedidoController::class, 'cambiarEstado'])->name('pedidos.cambiarEstado');
        Route::post('/pedidos/{pedido}/detalle', [PedidoController::class, 'agregarDetalle'])->name('pedidos.agregarDetalle');
        Route::patch('/pedidos/{pedido}/detalle/{detalle}/cantidad', [PedidoController::class, 'actualizarCantidad'])->name('pedidos.actualizarCantidad');
        Route::delete('/pedidos/{pedido}/detalle/{detalle}', [PedidoController::class, 'eliminarDetalle'])->name('pedidos.eliminarDetalle');
    });
    // ─── Pagos ──────────────────────────────────────────
    Route::middleware('permission:pagos.ver')->group(function () {
        Route::get('/pagos', [PagoController::class, 'index'])->name('pagos.index');
    });

    Route::middleware('permission:pagos.crear')->group(function () {
        Route::get('/pagos/crear', [PagoController::class, 'create'])->name('pagos.create');
        Route::post('/pagos', [PagoController::class, 'store'])->name('pagos.store');
        Route::patch('/pagos/{pago}/anular', [PagoController::class, 'anular'])->name('pagos.anular');
    });
    // ─── Historial de pedidos ───────────────────────────
    Route::middleware('permission:pedidos.ver')->group(function () {
        Route::get('/historial', [HistorialPedidoController::class, 'index'])->name('historial.index');
    });
});