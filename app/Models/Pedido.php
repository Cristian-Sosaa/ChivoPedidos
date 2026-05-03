<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'cliente_id',
        'user_id',
        'estado_id',
        'total',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
        ];
    }

    // ─── Relaciones ─────────────────────────────────────
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoPedido::class, 'estado_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(PedidoDetalle::class, 'pedido_id');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(Pago::class, 'pedido_id');
    }

    public function historial(): HasMany
    {
        return $this->hasMany(HistorialPedido::class, 'pedido_id');
    }

    // ─── Métodos ────────────────────────────────────────
    public function recalcularTotal(): void
    {
        $this->total = $this->detalles()->sum('subtotal');
        $this->save();
    }

    public function totalPagado(): float
    {
        return (float) $this->pagos()
            ->where('estado', 'confirmado')
            ->sum('monto');
    }

    public function saldoPendiente(): float
    {
        return (float) $this->total - $this->totalPagado();
    }
}