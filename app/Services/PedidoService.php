<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\Producto;
use App\Models\HistorialPedido;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PedidoService
{
    public function crearPedido(array $data, int $userId): Pedido
    {
        return DB::transaction(function () use ($data, $userId) {
            // Crear el pedido
            $pedido = Pedido::create([
                'cliente_id' => $data['cliente_id'],
                'user_id' => $userId,
                'estado_id' => $data['estado_id'],
                'observaciones' => $data['observaciones'] ?? null,
                'total' => 0,
            ]);

            // Procesar cada detalle
            $total = 0;

            foreach ($data['detalles'] as $detalle) {
                $producto = Producto::lockForUpdate()->findOrFail($detalle['producto_id']);

                // Validar stock disponible
                if ($producto->stock < $detalle['cantidad']) {
                    throw ValidationException::withMessages([
                        'detalles' => "Stock insuficiente para \"{$producto->nombre}\". Disponible: {$producto->stock}, solicitado: {$detalle['cantidad']}.",
                    ]);
                }

                $subtotal = $detalle['cantidad'] * $producto->precio;

                // Crear línea de detalle
                $pedido->detalles()->create([
                    'producto_id' => $producto->id,
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $producto->precio,
                    'subtotal' => $subtotal,
                ]);

                // Reducir stock
                $producto->decrement('stock', $detalle['cantidad']);

                $total += $subtotal;
            }

            // Actualizar total del pedido
            $pedido->update(['total' => $total]);

            // Registrar en historial
            HistorialPedido::create([
                'pedido_id' => $pedido->id,
                'user_id' => $userId,
                'estado_anterior_id' => null,
                'estado_nuevo_id' => $data['estado_id'],
                'comentario' => 'Pedido creado',
            ]);

            return $pedido->load(['cliente', 'estado', 'detalles.producto', 'usuario']);
        });
    }

    public function cambiarEstado(Pedido $pedido, int $nuevoEstadoId, int $userId, ?string $comentario = null): Pedido
    {
        return DB::transaction(function () use ($pedido, $nuevoEstadoId, $userId, $comentario) {
            $estadoAnteriorId = $pedido->estado_id;

            // Si se cancela, devolver stock
            if ($this->esCancelacion($nuevoEstadoId) && !$this->esCancelacion($estadoAnteriorId)) {
                foreach ($pedido->detalles as $detalle) {
                    $detalle->producto->increment('stock', $detalle->cantidad);
                }
            }

            // Actualizar estado
            $pedido->update(['estado_id' => $nuevoEstadoId]);

            // Registrar en historial
            HistorialPedido::create([
                'pedido_id' => $pedido->id,
                'user_id' => $userId,
                'estado_anterior_id' => $estadoAnteriorId,
                'estado_nuevo_id' => $nuevoEstadoId,
                'comentario' => $comentario,
            ]);

            return $pedido->load(['cliente', 'estado', 'detalles.producto', 'usuario']);
        });
    }

    private function esCancelacion(int $estadoId): bool
    {
        return \App\Models\EstadoPedido::where('id', $estadoId)
            ->where('nombre', 'cancelado')
            ->exists();
    }

    // Agregar estos métodos al final de la clase PedidoService

    public function agregarDetalle(Pedido $pedido, array $detalle, int $userId): Pedido
    {
        return DB::transaction(function () use ($pedido, $detalle, $userId) {
            $producto = Producto::lockForUpdate()->findOrFail($detalle['producto_id']);

            // Validar que el producto no esté ya en el pedido
            $existe = $pedido->detalles()->where('producto_id', $producto->id)->exists();
            if ($existe) {
                throw ValidationException::withMessages([
                    'producto_id' => "El producto \"{$producto->nombre}\" ya está en el pedido.",
                ]);
            }

            // Validar stock
            if ($producto->stock < $detalle['cantidad']) {
                throw ValidationException::withMessages([
                    'cantidad' => "Stock insuficiente para \"{$producto->nombre}\". Disponible: {$producto->stock}.",
                ]);
            }

            $subtotal = $detalle['cantidad'] * $producto->precio;

            // Crear línea
            $pedido->detalles()->create([
                'producto_id' => $producto->id,
                'cantidad' => $detalle['cantidad'],
                'precio_unitario' => $producto->precio,
                'subtotal' => $subtotal,
            ]);

            // Reducir stock
            $producto->decrement('stock', $detalle['cantidad']);

            // Recalcular total
            $pedido->recalcularTotal();

            return $pedido->load(['cliente', 'estado', 'detalles.producto']);
        });
    }

    public function eliminarDetalle(Pedido $pedido, int $detalleId, int $userId): Pedido
    {
        return DB::transaction(function () use ($pedido, $detalleId) {
            $detalle = $pedido->detalles()->findOrFail($detalleId);

            // Devolver stock
            $detalle->producto->increment('stock', $detalle->cantidad);

            // Eliminar línea
            $detalle->delete();

            // Recalcular total
            $pedido->recalcularTotal();

            return $pedido->load(['cliente', 'estado', 'detalles.producto']);
        });
    }

    public function actualizarCantidad(Pedido $pedido, int $detalleId, int $nuevaCantidad, int $userId): Pedido
    {
        return DB::transaction(function () use ($pedido, $detalleId, $nuevaCantidad) {
            $detalle = $pedido->detalles()->findOrFail($detalleId);
            $producto = Producto::lockForUpdate()->findOrFail($detalle->producto_id);

            $diferencia = $nuevaCantidad - $detalle->cantidad;

            // Si se aumenta la cantidad, validar stock
            if ($diferencia > 0 && $producto->stock < $diferencia) {
                throw ValidationException::withMessages([
                    'cantidad' => "Stock insuficiente. Disponible: {$producto->stock}, necesario: {$diferencia}.",
                ]);
            }

            // Ajustar stock
            if ($diferencia > 0) {
                $producto->decrement('stock', $diferencia);
            } elseif ($diferencia < 0) {
                $producto->increment('stock', abs($diferencia));
            }

            // Actualizar detalle
            $detalle->update([
                'cantidad' => $nuevaCantidad,
                'subtotal' => $nuevaCantidad * $detalle->precio_unitario,
            ]);

            // Recalcular total
            $pedido->recalcularTotal();

            return $pedido->load(['cliente', 'estado', 'detalles.producto']);
        });
    }
}