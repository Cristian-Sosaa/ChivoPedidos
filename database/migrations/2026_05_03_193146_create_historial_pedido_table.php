<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_pedido', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')
                  ->constrained('pedidos')
                  ->restrictOnDelete();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->restrictOnDelete();
            $table->foreignId('estado_anterior_id')
                  ->nullable()
                  ->constrained('estados_pedido')
                  ->restrictOnDelete();
            $table->foreignId('estado_nuevo_id')
                  ->constrained('estados_pedido')
                  ->restrictOnDelete();
            $table->string('comentario', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_pedido');
    }
};