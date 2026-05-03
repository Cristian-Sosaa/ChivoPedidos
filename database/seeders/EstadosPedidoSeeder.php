<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EstadoPedido;

class EstadosPedidoSeeder extends Seeder
{
    public function run(): void
    {
        $estados = [
            ['nombre' => 'pendiente',  'descripcion' => 'El pedido ha sido creado y está pendiente de procesamiento'],
            ['nombre' => 'en_proceso', 'descripcion' => 'El pedido está siendo preparado'],
            ['nombre' => 'enviado',    'descripcion' => 'El pedido ha sido enviado al cliente'],
            ['nombre' => 'entregado',  'descripcion' => 'El pedido fue entregado exitosamente'],
            ['nombre' => 'cancelado',  'descripcion' => 'El pedido fue cancelado'],
        ];

        foreach ($estados as $estado) {
            EstadoPedido::firstOrCreate(
                ['nombre' => $estado['nombre']],
                ['descripcion' => $estado['descripcion']]
            );
        }
    }
}