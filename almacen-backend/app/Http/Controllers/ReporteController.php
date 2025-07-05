<?php

namespace App\Http\Controllers;

use App\Models\IngresoProducto;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReporteController extends Controller
{
    /**
     * Genera un reporte paginado de ingresos de productos con filtros.
     */
    public function generarReporte(Request $request)
    {
        $consulta = IngresoProducto::query()
            ->with(['proveedor', 'detalles.producto']) // Cargar las relaciones necesarias
            ->join('detalles_ingresos_productos', 'ingresos_productos.id', '=', 'detalles_ingresos_productos.id_ingreso')
            ->join('productos', 'detalles_ingresos_productos.id_producto', '=', 'productos.id')
            ->join('proveedores', 'ingresos_productos.id_proveedor', '=', 'proveedores.id')
            ->select(
                'ingresos_productos.*', // Seleccionar todas las columnas de la tabla principal
                'proveedores.nombre as nombre_proveedor',
                'productos.nombre as nombre_producto',
                'detalles_ingresos_productos.cantidad',
                'detalles_ingresos_productos.estado',
                'detalles_ingresos_productos.id as id_detalle_ingreso' // ID del detalle para actualizar estado
            );

        // Filtro por rango de fecha: Aplicar solo si ambas fechas están presentes
        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $consulta->whereBetween('ingresos_productos.created_at', [$request->fecha_inicio . ' 00:00:00', $request->fecha_fin . ' 23:59:59']);
        }

        // Filtro por proveedor (usando el nombre del proveedor): Aplicar solo si el campo está presente
        if ($request->filled('proveedor')) {
            $consulta->where('proveedores.nombre', 'ILIKE', '%' . $request->proveedor . '%');
        }

        // Filtro por número de guía: Aplicar solo si el campo está presente
        if ($request->filled('numero_guia')) {
            $consulta->where('ingresos_productos.numero_guia', 'ILIKE', '%' . $request->numero_guia . '%');
        }

        // Paginación
        $porPagina = $request->input('por_pagina', 10);
        $reportePaginado = $consulta->paginate($porPagina);

        // Formatear la respuesta para el frontend si es necesario,
        // aunque el join ya nos da una estructura plana útil.
        return response()->json($reportePaginado);
    }

    /**
     * Exporta el reporte a Excel.
     */
    public function exportarReporte(Request $request)
    {
        $consulta = IngresoProducto::query()
            ->join('detalles_ingresos_productos', 'ingresos_productos.id', '=', 'detalles_ingresos_productos.id_ingreso')
            ->join('productos', 'detalles_ingresos_productos.id_producto', '=', 'productos.id')
            ->join('proveedores', 'ingresos_productos.id_proveedor', '=', 'proveedores.id')
            ->select(
                'ingresos_productos.id',
                'ingresos_productos.created_at',
                'ingresos_productos.numero_guia',
                'proveedores.nombre as nombre_proveedor',
                'productos.nombre as nombre_producto',
                'detalles_ingresos_productos.cantidad',
                'detalles_ingresos_productos.estado'
            );

        // Aplicar los mismos filtros que en generarReporte
        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $consulta->whereBetween('ingresos_productos.created_at', [$request->fecha_inicio . ' 00:00:00', $request->fecha_fin . ' 23:59:59']);
        }
        if ($request->filled('proveedor')) {
            $consulta->where('proveedores.nombre', 'ILIKE', '%' . $request->proveedor . '%');
        }
        if ($request->filled('numero_guia')) {
            $consulta->where('ingresos_productos.numero_guia', 'ILIKE', '%' . $request->numero_guia . '%');
        }

        $datosExportar = $consulta->get();

        // Crear una nueva hoja de cálculo
        $hojaCalculo = new Spreadsheet();
        $hoja = $hojaCalculo->getActiveSheet();

        // Encabezados de la tabla
        $hoja->setCellValue('A1', 'ID Ingreso');
        $hoja->setCellValue('B1', 'Fecha Registro');
        $hoja->setCellValue('C1', 'Proveedor');
        $hoja->setCellValue('D1', 'Número de Guía');
        $hoja->setCellValue('E1', 'Producto');
        $hoja->setCellValue('F1', 'Cantidad');
        $hoja->setCellValue('G1', 'Estado');

        $fila = 2;
        foreach ($datosExportar as $registro) {
            $hoja->setCellValue('A' . $fila, $registro->id);
            $hoja->setCellValue('B' . $fila, $registro->created_at->format('Y-m-d H:i:s'));
            $hoja->setCellValue('C' . $fila, $registro->nombre_proveedor);
            $hoja->setCellValue('D' . $fila, $registro->numero_guia);
            $hoja->setCellValue('E' . $fila, $registro->nombre_producto);
            $hoja->setCellValue('F' . $fila, $registro->cantidad);
            $hoja->setCellValue('G' . $fila, $registro->estado);
            $fila++;
        }

        // Configurar el escritor y la respuesta
        $escritor = new Xlsx($hojaCalculo);
        $nombreArchivo = 'reporte_ingresos_productos_' . date('Ymd_His') . '.xlsx';

        $respuesta = new StreamedResponse(function () use ($escritor) {
            $escritor->save('php://output');
        });

        $respuesta->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $respuesta->headers->set('Content-Disposition', 'attachment;filename="' . $nombreArchivo . '"');
        $respuesta->headers->set('Cache-Control', 'max-age=0');

        return $respuesta;
    }
}
