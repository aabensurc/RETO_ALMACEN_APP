<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores';

    protected $fillable = [
        'nombre',
        'contacto_email',
        'contacto_telefono',
    ];

    /**
     * Obtiene los ingresos de productos asociados a este proveedor.
     */
    public function ingresosProductos()
    {
        return $this->hasMany(IngresoProducto::class, 'id_proveedor');
    }
}
