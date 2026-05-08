<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;

Route::post('/login', [ApiController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [ApiController::class, 'logout']);
    Route::get('/me', [ApiController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [ApiController::class, 'dashboard']);

    // Categorías
    Route::get('/categorias', [ApiController::class, 'categoriasIndex'])->middleware('permission:categorias.ver');
    Route::get('/categorias/all', [ApiController::class, 'categoriasAll'])->middleware('permission:categorias.ver');
    Route::post('/categorias', [ApiController::class, 'categoriasStore'])->middleware('permission:categorias.crear');
    Route::get('/categorias/{categoria}', [ApiController::class, 'categoriasShow'])->middleware('permission:categorias.ver');
    Route::put('/categorias/{categoria}', [ApiController::class, 'categoriasUpdate'])->middleware('permission:categorias.editar');
    Route::patch('/categorias/{categoria}/toggle', [ApiController::class, 'categoriasToggle'])->middleware('permission:categorias.editar');

    // Productos
    Route::get('/productos', [ApiController::class, 'productosIndex'])->middleware('permission:productos.ver');
    Route::post('/productos', [ApiController::class, 'productosStore'])->middleware('permission:productos.crear');
    Route::get('/productos/{producto}', [ApiController::class, 'productosShow'])->middleware('permission:productos.ver');
    Route::put('/productos/{producto}', [ApiController::class, 'productosUpdate'])->middleware('permission:productos.editar');
    Route::patch('/productos/{producto}/toggle', [ApiController::class, 'productosToggle'])->middleware('permission:productos.editar');

    // Clientes
    Route::get('/clientes', [ApiController::class, 'clientesIndex'])->middleware('permission:clientes.ver');
    Route::get('/clientes/all', [ApiController::class, 'clientesAll'])->middleware('permission:clientes.ver');
    Route::post('/clientes', [ApiController::class, 'clientesStore'])->middleware('permission:clientes.crear');
    Route::get('/clientes/{cliente}', [ApiController::class, 'clientesShow'])->middleware('permission:clientes.ver');
    Route::put('/clientes/{cliente}', [ApiController::class, 'clientesUpdate'])->middleware('permission:clientes.editar');
    Route::patch('/clientes/{cliente}/toggle', [ApiController::class, 'clientesToggle'])->middleware('permission:clientes.editar');

    // Pedidos
    Route::get('/pedidos/estados', [ApiController::class, 'pedidosEstados'])->middleware('permission:pedidos.ver');
    Route::get('/pedidos', [ApiController::class, 'pedidosIndex'])->middleware('permission:pedidos.ver');
    Route::post('/pedidos', [ApiController::class, 'pedidosStore'])->middleware('permission:pedidos.crear');
    Route::get('/pedidos/{pedido}', [ApiController::class, 'pedidosShow'])->middleware('permission:pedidos.ver');
    Route::patch('/pedidos/{pedido}/estado', [ApiController::class, 'pedidosCambiarEstado'])->middleware('permission:pedidos.editar');
    Route::post('/pedidos/{pedido}/detalle', [ApiController::class, 'pedidosAgregarDetalle'])->middleware('permission:pedidos.editar');
    Route::patch('/pedidos/{pedido}/detalle/{detalle}/cantidad', [ApiController::class, 'pedidosActualizarCantidad'])->middleware('permission:pedidos.editar');
    Route::delete('/pedidos/{pedido}/detalle/{detalle}', [ApiController::class, 'pedidosEliminarDetalle'])->middleware('permission:pedidos.editar');

    // Pagos
    Route::get('/pagos', [ApiController::class, 'pagosIndex'])->middleware('permission:pagos.ver');
    Route::get('/pagos/pedidos-con-saldo', [ApiController::class, 'pagosConSaldo'])->middleware('permission:pagos.crear');
    Route::post('/pagos', [ApiController::class, 'pagosStore'])->middleware('permission:pagos.crear');
    Route::patch('/pagos/{pago}/anular', [ApiController::class, 'pagosAnular'])->middleware('permission:pagos.crear');

    // Historial
    Route::get('/historial', [ApiController::class, 'historialIndex'])->middleware('permission:pedidos.ver');

    // Inventario
    Route::get('/inventario', [ApiController::class, 'inventarioIndex'])->middleware('permission:productos.ver');
    Route::patch('/inventario/{producto}/ajustar', [ApiController::class, 'inventarioAjustar'])->middleware('permission:productos.editar');

    // Usuarios
    Route::get('/usuarios', [ApiController::class, 'usuariosIndex'])->middleware('permission:usuarios.ver');
});