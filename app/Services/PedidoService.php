<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\Producto;
use App\Models\HistorialPedido;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PedidoService
{
    public function crearPedido(array $data, int $userId): Pedido
    {
        try {

            Log::info('=== CREANDO PEDIDO ===');
            Log::info('DATA RECIBIDA', $data);

            return DB::transaction(function () use ($data, $userId) {

                // CREAR PEDIDO
                $pedido = Pedido::create([
                    'cliente_id' => $data['cliente_id'],
                    'estado_id' => $data['estado_id'],
                    'observaciones' => $data['observaciones'] ?? null,
                    'user_id' => $userId,
                ]);

                Log::info('PEDIDO CREADO', [
                    'pedido_id' => $pedido->id
                ]);

                // RECORRER DETALLES
                foreach ($data['detalles'] as $detalle) {

                    Log::info('PROCESANDO DETALLE', $detalle);

                    // BUSCAR PRODUCTO
                    $producto = Producto::where('id', $detalle['producto_id'])
                        ->lockForUpdate()
                        ->first();

                    Log::info('PRODUCTO ENCONTRADO', [
                        'producto' => $producto
                    ]);

                    if (!$producto) {
                        throw ValidationException::withMessages([
                            'producto' => 'Producto no encontrado'
                        ]);
                    }

                    // VALIDAR STOCK
                    Log::info('VALIDANDO STOCK', [
                        'stock_actual' => $producto->stock,
                        'cantidad_solicitada' => $detalle['cantidad']
                    ]);

                    if ($producto->stock < $detalle['cantidad']) {

                        Log::warning('STOCK INSUFICIENTE', [
                            'producto_id' => $producto->id
                        ]);

                        throw ValidationException::withMessages([
                            'stock' => "Stock insuficiente para {$producto->nombre}"
                        ]);
                    }

                    // CREAR DETALLE
                    Log::info('CREANDO DETALLE PEDIDO');

                    $pedido->detalles()->create([
                        'producto_id' => $producto->id,
                        'cantidad' => (int) $detalle['cantidad'],
                        'precio_unitario' => $producto->precio,
                        'subtotal' => $producto->precio * (int) $detalle['cantidad'],
                    ]);

                    Log::info('DETALLE CREADO');

                    // DESCONTAR STOCK
                    Log::info('DESCONTANDO STOCK');

                    $producto->decrement(
                        'stock',
                        (int) $detalle['cantidad']
                    );

                    Log::info('STOCK DESCONTADO');
                }

                // HISTORIAL
                HistorialPedido::create([
                    'pedido_id' => $pedido->id,
                    'estado_id' => $pedido->estado_id,
                    'comentario' => 'Pedido creado',
                    'user_id' => $userId,
                ]);

                Log::info('HISTORIAL CREADO');

                Log::info('=== PEDIDO COMPLETADO ===');

                return $pedido->load([
                    'cliente',
                    'estado',
                    'detalles.producto'
                ]);
            });

        } catch (\Throwable $e) {

            Log::error('=== ERROR CREANDO PEDIDO ===');
            Log::error('MENSAJE: ' . $e->getMessage());
            Log::error('ARCHIVO: ' . $e->getFile());
            Log::error('LINEA: ' . $e->getLine());
            Log::error($e->getTraceAsString());

            throw $e;
        }
    }
}