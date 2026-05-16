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
            $pedido = Pedido::create([
                'cliente_id' => $data['cliente_id'],
                'user_id' => $userId,
                'estado_id' => $data['estado_id'],
                'observaciones' => $data['observaciones'] ?? null,
                'total' => 0,
            ]);

            $total = 0;

            foreach ($data['detalles'] as $detalle) {
                $producto = Producto::findOrFail($detalle['producto_id']);

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

                $producto->decrement('stock', $detalle['cantidad']);

                $total += $subtotal;
            }

            $pedido->update(['total' => $total]);

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

            if ($this->esCancelacion($nuevoEstadoId) && !$this->esCancelacion($estadoAnteriorId)) {
                foreach ($pedido->detalles as $detalle) {
                    $detalle->producto->increment('stock', $detalle->cantidad);
                }
            }

            $pedido->update(['estado_id' => $nuevoEstadoId]);

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

    public function agregarDetalle(Pedido $pedido, array $detalle, int $userId): Pedido
    {
        return DB::transaction(function () use ($pedido, $detalle, $userId) {
            $producto = Producto::findOrFail($detalle['producto_id']);

            $existe = $pedido->detalles()->where('producto_id', $producto->id)->exists();
            if ($existe) {
                throw ValidationException::withMessages([
                    'producto_id' => "El producto \"{$producto->nombre}\" ya está en el pedido.",
                ]);
            }

            if ($producto->stock < $detalle['cantidad']) {
                throw ValidationException::withMessages([
                    'cantidad' => "Stock insuficiente para \"{$producto->nombre}\". Disponible: {$producto->stock}.",
                ]);
            }

            $subtotal = $detalle['cantidad'] * $producto->precio;

            $pedido->detalles()->create([
                'producto_id' => $producto->id,
                'cantidad' => $detalle['cantidad'],
                'precio_unitario' => $producto->precio,
                'subtotal' => $subtotal,
            ]);

            $producto->decrement('stock', $detalle['cantidad']);

            $pedido->recalcularTotal();

            return $pedido->load(['cliente', 'estado', 'detalles.producto']);
        });
    }

    public function eliminarDetalle(Pedido $pedido, int $detalleId, int $userId): Pedido
    {
        return DB::transaction(function () use ($pedido, $detalleId) {
            $detalle = $pedido->detalles()->findOrFail($detalleId);

            $detalle->producto->increment('stock', $detalle->cantidad);

            $detalle->delete();

            $pedido->recalcularTotal();

            return $pedido->load(['cliente', 'estado', 'detalles.producto']);
        });
    }

    public function actualizarCantidad(Pedido $pedido, int $detalleId, int $nuevaCantidad, int $userId): Pedido
    {
        return DB::transaction(function () use ($pedido, $detalleId, $nuevaCantidad) {
            $detalle = $pedido->detalles()->findOrFail($detalleId);
            $producto = Producto::findOrFail($detalle->producto_id);

            $diferencia = $nuevaCantidad - $detalle->cantidad;

            if ($diferencia > 0 && $producto->stock < $diferencia) {
                throw ValidationException::withMessages([
                    'cantidad' => "Stock insuficiente. Disponible: {$producto->stock}, necesario: {$diferencia}.",
                ]);
            }

            if ($diferencia > 0) {
                $producto->decrement('stock', $diferencia);
            } elseif ($diferencia < 0) {
                $producto->increment('stock', abs($diferencia));
            }

            $detalle->update([
                'cantidad' => $nuevaCantidad,
                'subtotal' => $nuevaCantidad * $detalle->precio_unitario,
            ]);

            $pedido->recalcularTotal();

            return $pedido->load(['cliente', 'estado', 'detalles.producto']);
        });
    }
}