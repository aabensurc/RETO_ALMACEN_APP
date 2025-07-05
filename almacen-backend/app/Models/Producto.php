<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'sku',
        'descripcion',
    ];

    /**
     * Obtiene los detalles de ingresos de productos asociados a este producto.
     */
    public function detallesIngresos()
    {
        return $this->hasMany(DetalleIngresoProducto::class, 'id_producto');
    }
}