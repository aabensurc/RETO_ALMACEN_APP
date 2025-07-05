<?php

use App\Http\Controllers\AutenticacionController;
use App\Http\Controllers\IngresoProductoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

// Rutas de autenticación
Route::post('/iniciar-sesion', [AutenticacionController::class, 'iniciarSesion']);

// Rutas protegidas por autenticación (requieren un token de Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cerrar-sesion', [AutenticacionController::class, 'cerrarSesion']);
    Route::get('/usuario', [AutenticacionController::class, 'obtenerUsuario']);

    // Rutas para ingresos de productos (IngresoProductoController)
    Route::apiResource('ingresos-productos', IngresoProductoController::class);
    // Ruta personalizada para actualizar el estado de un detalle de producto específico
    Route::put('detalles-ingresos-productos/{detalleIngresoProducto}/estado', [IngresoProductoController::class, 'actualizarEstadoProducto']);

    // Rutas para gestionar proveedores (CRUD completo)
    Route::apiResource('proveedores', ProveedorController::class);

    // Rutas para gestionar productos (CRUD completo)
    Route::apiResource('productos', ProductoController::class);

    // Rutas para reportes (ReporteController)
    Route::get('/reportes/ingresos-productos', [ReporteController::class, 'generarReporte']);
    Route::get('/reportes/ingresos-productos/exportar', [ReporteController::class, 'exportarReporte']);

    // Ruta para obtener números de guía únicos
    Route::get('/numeros-guia-unicos', [IngresoProductoController::class, 'obtenerNumerosGuiaUnicos']);
});