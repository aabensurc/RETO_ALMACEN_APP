import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private urlApiProveedores = '/api/proveedores'; // Usamos el proxy

  constructor(private http: HttpClient) { }

  private obtenerEncabezadosAutenticacion() {
    const token = localStorage.getItem('tokenAcceso');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  // Obtener todos los proveedores
  obtenerProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.urlApiProveedores, this.obtenerEncabezadosAutenticacion());
  }

  // Obtener un proveedor por su ID
  obtenerProveedor(id: number): Observable<any> {
    return this.http.get(`${this.urlApiProveedores}/${id}`, this.obtenerEncabezadosAutenticacion());
  }

  // Crear un nuevo proveedor
  crearProveedor(datos: any): Observable<any> {
    return this.http.post(this.urlApiProveedores, datos, this.obtenerEncabezadosAutenticacion());
  }

  // Actualizar un proveedor existente
  actualizarProveedor(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.urlApiProveedores}/${id}`, datos, this.obtenerEncabezadosAutenticacion());
  }

  // Eliminar un proveedor
  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.urlApiProveedores}/${id}`, this.obtenerEncabezadosAutenticacion());
  }
}