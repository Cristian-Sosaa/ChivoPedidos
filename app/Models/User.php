<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ─── Relaciones ─────────────────────────────────────
    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class, 'user_id');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(Pago::class, 'user_id');
    }

    public function historialPedidos(): HasMany
    {
        return $this->hasMany(HistorialPedido::class, 'user_id');
    }
}