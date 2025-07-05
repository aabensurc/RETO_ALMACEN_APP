<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule; // Importar la clase Rule

class ProductoController extends Controller
{
    /**
     * Muestra una lista de todos los productos.
     */
    public function index()
    {
        return response()->json(Producto::all());
    }

    /**
     * Almacena un nuevo producto.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => ['required', 'string', 'max:255'], // Nombre no único al crear
            'sku' => ['nullable', 'string', 'max:255', 'unique:productos,sku'], // SKU único al crear
            'descripcion' => ['nullable', 'string'],
        ], [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'sku.unique' => 'Ya existe un producto con este SKU.',
        ]);

        $producto = Producto::create($request->all());

        return response()->json([
            'mensaje' => 'Producto creado exitosamente',
            'producto' => $producto,
        ], 201);
    }

    /**
     * Muestra el producto especificado.
     */
    public function show(Producto $producto)
    {
        return response()->json($producto);
    }

    /**
     * Actualiza el producto especificado en el almacenamiento.
     */
    public function update(Request $request, Producto $producto)
    {
        $request->validate([
            'nombre' => ['required', 'string', 'max:255', Rule::unique('productos')->ignore($producto->id)], // Nombre único al actualizar, ignorando el propio ID
            'sku' => ['nullable', 'string', 'max:255', Rule::unique('productos')->ignore($producto->id)], // SKU único al actualizar, ignorando el propio ID
            'descripcion' => ['nullable', 'string'],
        ], [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'nombre.unique' => 'Ya existe otro producto con este nombre.', // Mensaje más específico
            'sku.unique' => 'Ya existe otro producto con este SKU.', // Mensaje más específico
        ]);

        $producto->update($request->all());

        return response()->json([
            'mensaje' => 'Producto actualizado exitosamente',
            'producto' => $producto,
        ]);
    }

    /**
     * Elimina el producto especificado del almacenamiento.
     */
    public function destroy(Producto $producto)
    {
        // Antes de eliminar, verificar si hay detalles de ingresos asociados
        if ($producto->detallesIngresos()->exists()) {
            throw ValidationException::withMessages([
                'producto' => ['No se puede eliminar el producto porque tiene ingresos asociados.'],
            ]);
        }

        $producto->delete();

        return response()->json([
            'mensaje' => 'Producto eliminado exitosamente',
        ], 200); // <--- ESTA ES LA SOLUCIÓN
    }
}