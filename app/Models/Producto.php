<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'categoria_id',
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'stock' => 'integer',
            'activo' => 'boolean',
        ];
    }

    // ─── Relaciones ─────────────────────────────────────
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(PedidoDetalle::class, 'producto_id');
    }

    // ─── Scopes ─────────────────────────────────────────
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeConStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeBajoStock($query, int $minimo = 10)
    {
        return $query->where('stock', '<=', $minimo)->where('activo', true);
    }
}