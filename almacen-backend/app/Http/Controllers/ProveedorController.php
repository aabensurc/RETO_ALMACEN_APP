<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule; // Importar la clase Rule
use Illuminate\Support\Facades\DB; // Importar la fachada DB

class ProveedorController extends Controller
{
    /**
     * Muestra una lista de todos los proveedores.
     */
    public function index()
    {
        return response()->json(Proveedor::all());
    }

    /**
     * Almacena un nuevo proveedor.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:proveedores,nombre'], // Nombre único al crear
            'contacto_email' => ['nullable', 'email', 'max:255'],
            'contacto_telefono' => ['nullable', 'string', 'max:20'],
        ], [
            'nombre.required' => 'El nombre del proveedor es obligatorio.',
            'nombre.unique' => 'Ya existe un proveedor con este nombre.',
            'contacto_email.email' => 'El correo electrónico de contacto debe ser una dirección válida.',
        ]);

        $proveedor = Proveedor::create($request->all());

        return response()->json([
            'mensaje' => 'Proveedor creado exitosamente',
            'proveedor' => $proveedor,
        ], 201);
    }

    /**
     * Muestra el proveedor especificado.
     */
    public function show(Proveedor $proveedor)
    {
        return response()->json($proveedor);
    }

    /**
     * Actualiza el proveedor especificado en el almacenamiento.
     */
     public function update(Request $request, string $id)
    {
        // Busca el proveedor por su ID
        $proveedor = Proveedor::findOrFail($id);

        $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
                // Esta es la clave: Ignora el nombre del proveedor actual por su ID
                Rule::unique('proveedores', 'nombre')->ignore($proveedor->id),
            ],
            'contacto_email' => 'nullable|email|max:255',
            'contacto_telefono' => 'nullable|string|max:20',
        ]);

        $proveedor->update($request->all());
        return response()->json($proveedor);
    }

    /**
     * Elimina el proveedor especificado del almacenamiento.
     */
    public function destroy(Proveedor $proveedor)
    {
        // Antes de eliminar, verificar si hay ingresos de productos asociados
        if ($proveedor->ingresosProductos()->exists()) {
            throw ValidationException::withMessages([
                'proveedor' => ['No se puede eliminar el proveedor porque tiene ingresos de productos asociados.'],
            ]);
        }

        $proveedor->delete();

        return response()->json([
            'mensaje' => 'Proveedor eliminado exitosamente',
        ], 200);
    }
}
