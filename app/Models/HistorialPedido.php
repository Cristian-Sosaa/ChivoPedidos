<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistorialPedido extends Model
{
    protected $table = 'historial_pedido';

    public $timestamps = false;

    protected $fillable = [
        'pedido_id',
        'user_id',
        'estado_anterior_id',
        'estado_nuevo_id',
        'comentario',
    ];

    // ─── Relaciones ─────────────────────────────────────
    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function estadoAnterior(): BelongsTo
    {
        return $this->belongsTo(EstadoPedido::class, 'estado_anterior_id');
    }

    public function estadoNuevo(): BelongsTo
    {
        return $this->belongsTo(EstadoPedido::class, 'estado_nuevo_id');
    }
}