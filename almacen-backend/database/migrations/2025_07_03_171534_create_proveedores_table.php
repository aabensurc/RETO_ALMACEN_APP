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
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id(); // Clave primaria autoincremental
            $table->string('nombre')->unique(); // Nombre del proveedor, debe ser único
            $table->string('contacto_email')->nullable();
            $table->string('contacto_telefono')->nullable();
            $table->timestamps(); // Columnas 'created_at' y 'updated_at'
        });
    }

    /**
     * Revierte las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};