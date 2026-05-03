<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoPedido extends Model
{
    protected $table = 'estados_pedido';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // ─── Relaciones ─────────────────────────────────────
    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class, 'estado_id');
    }
}