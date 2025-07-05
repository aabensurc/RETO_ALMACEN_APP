<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones.
     */
    public function up(): void
    {
        Schema::create('detalles_ingresos_productos', function (Blueprint $table) {
            $table->id(); // Clave primaria autoincremental
            $table->foreignId('id_ingreso')->constrained('ingresos_productos')->onDelete('cascade'); // ID del ingreso
            $table->foreignId('id_producto')->constrained('productos')->onDelete('cascade'); // ID del producto
            $table->integer('cantidad'); // Cantidad del producto en este ingreso
            $table->enum('estado', ['Disponible', 'No disponible', 'Merma'])->default('Disponible'); // Estado del producto
            $table->timestamps(); // Columnas 'created_at' y 'updated_at'

            // Asegura que no se repita el mismo producto en el mismo ingreso
            $table->unique(['id_ingreso', 'id_producto']);
        });
    }

    /**
     * Revierte las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_ingresos_productos');
    }
};
