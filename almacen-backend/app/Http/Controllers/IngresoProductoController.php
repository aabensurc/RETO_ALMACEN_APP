<?php

namespace App\Http\Controllers;

use App\Models\IngresoProducto;
use App\Models\DetalleIngresoProducto;
use App\Models\Proveedor;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB; // Para transacciones

class IngresoProductoController extends Controller
{
    /**
     * Muestra una lista de los recursos (no paginada, para propósitos de API simple).
     */
    public function index()
    {
        return IngresoProducto::with(['proveedor', 'detalles.producto'])->get();
    }

    /**
     * Almacena un nuevo ingreso de producto en el almacenamiento.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_proveedor' => ['required', 'exists:proveedores,id'], // El proveedor debe existir y ser seleccionado por ID
            'numero_guia' => ['required', 'string', 'unique:ingresos_productos,numero_guia'],
            'productos' => ['required', 'array', 'min:1'],
            'productos.*.id_producto' => ['required', 'exists:productos,id'], // El producto debe existir y ser seleccionado por ID
            'productos.*.cantidad' => ['required', 'integer', 'min:1'],
            'productos.*.estado' => ['required', 'string', 'in:Disponible,No disponible,Merma'],
        ], [
            'id_proveedor.required' => 'Debe seleccionar un proveedor.',
            'id_proveedor.exists' => 'El ID de proveedor seleccionado no es válido.',
            'numero_guia.required' => 'El campo número de guía es obligatorio.',
            'numero_guia.unique' => 'Este número de guía ya ha sido registrado.',
            'productos.required' => 'Debe ingresar al menos un producto.',
            'productos.array' => 'Los productos deben ser un array.',
            'productos.min' => 'Debe ingresar al menos un producto.',
            'productos.*.id_producto.required' => 'Debe seleccionar un producto.',
            'productos.*.id_producto.exists' => 'El ID de producto seleccionado no es válido.',
            'productos.*.cantidad.required' => 'La cantidad del producto es obligatoria.',
            'productos.*.cantidad.integer' => 'La cantidad debe ser un número entero.',
            'productos.*.cantidad.min' => 'La cantidad debe ser al menos 1.',
            'productos.*.estado.required' => 'El estado del producto es obligatorio.',
            'productos.*.estado.in' => 'El estado del producto debe ser Disponible, No disponible o Merma.',
        ]);

        DB::beginTransaction(); // Iniciar transacción de base de datos

        try {
            $ingreso = IngresoProducto::create([
                'id_usuario' => $request->user()->id,
                'id_proveedor' => $request->id_proveedor,
                'numero_guia' => $request->numero_guia,
            ]);

            foreach ($request->productos as $datosProducto) {
                DetalleIngresoProducto::create([
                    'id_ingreso' => $ingreso->id,
                    'id_producto' => $datosProducto['id_producto'],
                    'cantidad' => $datosProducto['cantidad'],
                    'estado' => $datosProducto['estado'],
                ]);
            }

            DB::commit(); // Confirmar la transacción

            return response()->json([
                'mensaje' => 'Ingreso de producto registrado exitosamente',
                'ingreso' => $ingreso->load(['proveedor', 'detalles.producto']), // Cargar relaciones para la respuesta
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Revertir la transacción en caso de error
            throw $e; // Relanzar la excepción para que sea manejada por Laravel
        }
    }

    /**
     * Muestra el recurso especificado.
     */
    public function show(IngresoProducto $ingresoProducto)
    {
        return $ingresoProducto->load(['proveedor', 'detalles.producto']);
    }

    /**
     * Actualiza el recurso especificado en el almacenamiento.
     * Nota: La actualización de un ingreso completo con sus detalles es compleja.
     * Para simplificar, este método solo actualiza los campos del ingreso principal.
     * Para actualizar detalles de productos, se usa un método específico.
     */
    public function update(Request $request, IngresoProducto $ingresoProducto)
    {
        $request->validate([
            'id_proveedor' => ['sometimes', 'required', 'exists:proveedores,id'],
            'numero_guia' => ['sometimes', 'required', 'string', 'unique:ingresos_productos,numero_guia,' . $ingresoProducto->id],
        ], [
            'id_proveedor.exists' => 'El ID de proveedor seleccionado no es válido.',
            'numero_guia.required' => 'El campo número de guía es obligatorio.',
            'numero_guia.unique' => 'Este número de guía ya ha sido registrado.',
        ]);

        DB::beginTransaction();
        try {
            if ($request->has('id_proveedor')) {
                $ingresoProducto->id_proveedor = $request->id_proveedor;
            }
            if ($request->has('numero_guia')) {
                $ingresoProducto->numero_guia = $request->numero_guia;
            }
            $ingresoProducto->save();

            DB::commit();
            return response()->json([
                'mensaje' => 'Ingreso de producto actualizado exitosamente',
                'ingreso' => $ingresoProducto->load(['proveedor', 'detalles.producto']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Elimina el recurso especificado del almacenamiento.
     */
    public function destroy(IngresoProducto $ingresoProducto)
    {
        $ingresoProducto->delete(); // Esto eliminará también los detalles_ingresos_productos debido a onDelete('cascade')

        return response()->json([
            'mensaje' => 'Ingreso de producto eliminado exitosamente',
        ], 204);
    }

    /**
     * Actualiza el estado de un producto específico dentro de un ingreso.
     * Ahora se dirige a un DetalleIngresoProducto específico.
     */
    public function actualizarEstadoProducto(Request $request, DetalleIngresoProducto $detalleIngresoProducto)
    {
        $request->validate([
            'estado' => ['required', 'string', 'in:Disponible,No disponible,Merma'],
        ], [
            'estado.required' => 'El campo estado es obligatorio.',
            'estado.in' => 'El estado del producto debe ser Disponible, No disponible o Merma.',
        ]);

        $detalleIngresoProducto->estado = $request->estado;
        $detalleIngresoProducto->save();

        return response()->json([
            'mensaje' => 'Estado del producto actualizado exitosamente',
            'detalle_ingreso' => $detalleIngresoProducto->load('producto'),
        ]);
    }

    /**
     * Obtiene una lista de números de guía únicos.
     */
    public function obtenerNumerosGuiaUnicos()
    {
        $numerosGuia = IngresoProducto::distinct('numero_guia')->pluck('numero_guia');
        return response()->json($numerosGuia);
    }
}