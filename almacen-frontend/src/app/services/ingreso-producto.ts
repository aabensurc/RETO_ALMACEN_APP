import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoProductoService {
  private urlApiIngresos = '/api/ingresos-productos'; // Usamos el proxy
  private urlApiReportes = '/api/reportes/ingresos-productos'; // Usamos el proxy

  constructor(private http: HttpClient) { }

  // Método privado para obtener los encabezados de autenticación
  private obtenerEncabezadosAutenticacion() {
    const token = localStorage.getItem('tokenAcceso');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  // Crear un nuevo ingreso de producto
  crearIngresoProducto(datos: any): Observable<any> {
    return this.http.post(this.urlApiIngresos, datos, this.obtenerEncabezadosAutenticacion());
  }

  // Obtener un ingreso de producto por su ID
  obtenerIngresoProducto(id: number): Observable<any> {
    return this.http.get(`${this.urlApiIngresos}/${id}`, this.obtenerEncabezadosAutenticacion());
  }

  // Actualizar un ingreso de producto por su ID
  actualizarIngresoProducto(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.urlApiIngresos}/${id}`, datos, this.obtenerEncabezadosAutenticacion());
  }

  // Eliminar un ingreso de producto por su ID
  eliminarIngresoProducto(id: number): Observable<any> {
    return this.http.delete(`${this.urlApiIngresos}/${id}`, this.obtenerEncabezadosAutenticacion());
  }

  // Actualizar el estado de un producto específico dentro de un ingreso
  actualizarEstadoProducto(idDetalleIngreso: number, estado: string): Observable<any> {
    return this.http.put(`/api/detalles-ingresos-productos/${idDetalleIngreso}/estado`, { estado }, this.obtenerEncabezadosAutenticacion());
  }

  // Obtener el reporte de ingresos de productos con filtros y paginación
  obtenerReporte(filtros: any, pagina: number, porPagina: number): Observable<any> {
    let parametros = {
      ...filtros,
      page: pagina.toString(),
      por_pagina: porPagina.toString()
    };
    return this.http.get(this.urlApiReportes, { params: parametros, ...this.obtenerEncabezadosAutenticacion() });
  }

  // Exportar el reporte a Excel
  exportarReporte(filtros: any): Observable<Blob> {
    let parametros = { ...filtros };
    return this.http.get(`${this.urlApiReportes}/exportar`, { params: parametros, responseType: 'blob', ...this.obtenerEncabezadosAutenticacion() });
  }

  // Nuevo: Obtener una lista de números de guía únicos
  obtenerNumerosGuiaUnicos(): Observable<string[]> {
    return this.http.get<string[]>(`/api/numeros-guia-unicos`, this.obtenerEncabezadosAutenticacion());
  }
}