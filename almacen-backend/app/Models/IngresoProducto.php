<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IngresoProducto extends Model
{
    use HasFactory;

    protected $table = 'ingresos_productos';

    protected $fillable = [
        'id_usuario',
        'id_proveedor',
        'numero_guia',
    ];

    /**
     * Obtiene el usuario que realizó este ingreso de producto.
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    /**
     * Obtiene el proveedor de este ingreso de producto.
     */
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }

    /**
     * Obtiene los detalles de los productos asociados a este ingreso.
     */
    public function detalles()
    {
        return $this->hasMany(DetalleIngresoProducto::class, 'id_ingreso');
    }
}