<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\Producto;
use App\Models\HistorialPedido;
use App\Models\EstadoPedido;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PedidoService
{
    public function crearPedido(array $data, int $userId): Pedido
    {
        try {

            return DB::transaction(function () use ($data, $userId) {

                Log::info('=== CREANDO PEDIDO ===');
                Log::info('DATA RECIBIDA', $data);

                if (!isset($data['detalles']) || empty($data['detalles'])) {
                    throw ValidationException::withMessages([
                        'detalles' => 'Debe agregar al menos un producto.',
                    ]);
                }

                $pedido = Pedido::create([
                    'cliente_id' => $data['cliente_id'],
                    'user_id' => $userId,
                    'estado_id' => $data['estado_id'],
                    'observaciones' => $data['observaciones'] ?? null,
                    'total' => 0,
                ]);

                Log::info('PEDIDO CREADO', [
                    'pedido_id' => $pedido->id,
                ]);

                $total = 0;

                foreach ($data['detalles'] as $detalle) {

                    Log::info('PROCESANDO DETALLE', $detalle);

                    if (
                        !isset($detalle['producto_id']) ||
                        !isset($detalle['cantidad'])
                    ) {
                        throw ValidationException::withMessages([
                            'detalle' => 'Detalle inválido.',
                        ]);
                    }

                    if ($detalle['cantidad'] <= 0) {
                        throw ValidationException::withMessages([
                            'cantidad' => 'La cantidad debe ser mayor a 0.',
                        ]);
                    }

                    $producto = Producto::findOrFail($detalle['producto_id']);

                    Log::info('PRODUCTO ENCONTRADO', [
                        'id' => $producto->id,
                        'nombre' => $producto->nombre,
                        'stock' => $producto->stock,
                        'precio' => $producto->precio,
                    ]);

                    if ($producto->stock < $detalle['cantidad']) {
                        throw ValidationException::withMessages([
                            'detalles' => "Stock insuficiente para \"{$producto->nombre}\". Disponible: {$producto->stock}, solicitado: {$detalle['cantidad']}.",
                        ]);
                    }

                    $subtotal = $detalle['cantidad'] * $producto->precio;

                    $pedido->detalles()->create([
                        'producto_id' => $producto->id,
                        'cantidad' => $detalle['cantidad'],
                        'precio_unitario' => $producto->precio,
                        'subtotal' => $subtotal,
                    ]);

                    Log::info('DETALLE CREADO', [
                        'producto_id' => $producto->id,
                        'cantidad' => $detalle['cantidad'],
                        'subtotal' => $subtotal,
                    ]);

                    $producto->decrement('stock', $detalle['cantidad']);

                    Log::info('STOCK ACTUALIZADO', [
                        'producto_id' => $producto->id,
                        'nuevo_stock' => $producto->fresh()->stock,
                    ]);

                    $total += $subtotal;
                }

                $pedido->update([
                    'total' => $total,
                ]);

                Log::info('TOTAL ACTUALIZADO', [
                    'total' => $total,
                ]);

                HistorialPedido::create([
                    'pedido_id' => $pedido->id,
                    'user_id' => $userId,
                    'estado_anterior_id' => null,
                    'estado_nuevo_id' => $data['estado_id'],
                    'comentario' => 'Pedido creado',
                ]);

                Log::info('HISTORIAL CREADO');

                return $pedido->load([
                    'cliente',
                    'estado',
                    'detalles.producto',
                    'usuario'
                ]);
            });

        } catch (\Throwable $e) {

            Log::error('=== ERROR CREANDO PEDIDO ===');

            Log::error($e->getMessage());

            Log::error($e->getTraceAsString());

            throw $e;
        }
    }

    public function cambiarEstado(
        Pedido $pedido,
        int $nuevoEstadoId,
        int $userId,
        ?string $comentario = null
    ): Pedido {

        try {

            return DB::transaction(function () use (
                $pedido,
                $nuevoEstadoId,
                $userId,
                $comentario
            ) {

                $estadoAnteriorId = $pedido->estado_id;

                if (
                    $this->esCancelacion($nuevoEstadoId) &&
                    !$this->esCancelacion($estadoAnteriorId)
                ) {

                    foreach ($pedido->detalles as $detalle) {

                        $detalle->producto->increment(
                            'stock',
                            $detalle->cantidad
                        );
                    }
                }

                $pedido->update([
                    'estado_id' => $nuevoEstadoId
                ]);

                HistorialPedido::create([
                    'pedido_id' => $pedido->id,
                    'user_id' => $userId,
                    'estado_anterior_id' => $estadoAnteriorId,
                    'estado_nuevo_id' => $nuevoEstadoId,
                    'comentario' => $comentario,
                ]);

                return $pedido->load([
                    'cliente',
                    'estado',
                    'detalles.producto',
                    'usuario'
                ]);
            });

        } catch (\Throwable $e) {

            Log::error('ERROR CAMBIANDO ESTADO');

            Log::error($e->getMessage());

            throw $e;
        }
    }

    private function esCancelacion(int $estadoId): bool
    {
        return EstadoPedido::where('id', $estadoId)
            ->where('nombre', 'cancelado')
            ->exists();
    }

    public function agregarDetalle(
        Pedido $pedido,
        array $detalle,
        int $userId
    ): Pedido {

        try {

            return DB::transaction(function () use (
                $pedido,
                $detalle,
                $userId
            ) {

                $producto = Producto::findOrFail(
                    $detalle['producto_id']
                );

                $existe = $pedido->detalles()
                    ->where('producto_id', $producto->id)
                    ->exists();

                if ($existe) {
                    throw ValidationException::withMessages([
                        'producto_id' => "El producto \"{$producto->nombre}\" ya está en el pedido.",
                    ]);
                }

                if ($detalle['cantidad'] <= 0) {
                    throw ValidationException::withMessages([
                        'cantidad' => 'Cantidad inválida.',
                    ]);
                }

                if ($producto->stock < $detalle['cantidad']) {
                    throw ValidationException::withMessages([
                        'cantidad' => "Stock insuficiente para \"{$producto->nombre}\".",
                    ]);
                }

                $subtotal = $detalle['cantidad'] * $producto->precio;

                $pedido->detalles()->create([
                    'producto_id' => $producto->id,
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $producto->precio,
                    'subtotal' => $subtotal,
                ]);

                $producto->decrement(
                    'stock',
                    $detalle['cantidad']
                );

                $pedido->recalcularTotal();

                return $pedido->load([
                    'cliente',
                    'estado',
                    'detalles.producto'
                ]);
            });

        } catch (\Throwable $e) {

            Log::error('ERROR AGREGANDO DETALLE');

            Log::error($e->getMessage());

            throw $e;
        }
    }

    public function eliminarDetalle(
        Pedido $pedido,
        int $detalleId,
        int $userId
    ): Pedido {

        try {

            return DB::transaction(function () use (
                $pedido,
                $detalleId
            ) {

                $detalle = $pedido->detalles()
                    ->findOrFail($detalleId);

                $detalle->producto->increment(
                    'stock',
                    $detalle->cantidad
                );

                $detalle->delete();

                $pedido->recalcularTotal();

                return $pedido->load([
                    'cliente',
                    'estado',
                    'detalles.producto'
                ]);
            });

        } catch (\Throwable $e) {

            Log::error('ERROR ELIMINANDO DETALLE');

            Log::error($e->getMessage());

            throw $e;
        }
    }

    public function actualizarCantidad(
        Pedido $pedido,
        int $detalleId,
        int $nuevaCantidad,
        int $userId
    ): Pedido {

        try {

            return DB::transaction(function () use (
                $pedido,
                $detalleId,
                $nuevaCantidad
            ) {

                if ($nuevaCantidad <= 0) {
                    throw ValidationException::withMessages([
                        'cantidad' => 'Cantidad inválida.',
                    ]);
                }

                $detalle = $pedido->detalles()
                    ->findOrFail($detalleId);

                $producto = Producto::findOrFail(
                    $detalle->producto_id
                );

                $diferencia = $nuevaCantidad - $detalle->cantidad;

                if (
                    $diferencia > 0 &&
                    $producto->stock < $diferencia
                ) {

                    throw ValidationException::withMessages([
                        'cantidad' => "Stock insuficiente. Disponible: {$producto->stock}, necesario: {$diferencia}.",
                    ]);
                }

                if ($diferencia > 0) {

                    $producto->decrement(
                        'stock',
                        $diferencia
                    );

                } elseif ($diferencia < 0) {

                    $producto->increment(
                        'stock',
                        abs($diferencia)
                    );
                }

                $detalle->update([
                    'cantidad' => $nuevaCantidad,
                    'subtotal' => $nuevaCantidad * $detalle->precio_unitario,
                ]);

                $pedido->recalcularTotal();

                return $pedido->load([
                    'cliente',
                    'estado',
                    'detalles.producto'
                ]);
            });

        } catch (\Throwable $e) {

            Log::error('ERROR ACTUALIZANDO CANTIDAD');

            Log::error($e->getMessage());

            throw $e;
        }
    }
}