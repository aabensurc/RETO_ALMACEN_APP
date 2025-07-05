<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleIngresoProducto extends Model
{
    use HasFactory;

    protected $table = 'detalles_ingresos_productos';

    protected $fillable = [
        'id_ingreso',
        'id_producto',
        'cantidad',
        'estado',
    ];

    /**
     * Obtiene el ingreso de producto al que pertenece este detalle.
     */
    public function ingresoProducto()
    {
        return $this->belongsTo(IngresoProducto::class, 'id_ingreso');
    }

    /**
     * Obtiene el producto asociado a este detalle de ingreso.
     */
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}