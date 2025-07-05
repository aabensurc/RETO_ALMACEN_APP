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
        Schema::create('ingresos_productos', function (Blueprint $table) {
            $table->id(); // Clave primaria autoincremental
            $table->foreignId('id_usuario')->constrained('users')->onDelete('cascade'); // ID del usuario que registra
            $table->foreignId('id_proveedor')->constrained('proveedores')->onDelete('cascade'); // ID del proveedor
            $table->string('numero_guia')->unique(); // Número de guía, debe ser único
            $table->timestamps(); // Columnas 'created_at' y 'updated_at'
        });
    }

    /**
     * Revierte las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingresos_productos');
    }
};