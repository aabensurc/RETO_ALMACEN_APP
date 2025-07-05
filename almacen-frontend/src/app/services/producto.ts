import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private urlApiProductos = '/api/productos'; // Usamos el proxy

  constructor(private http: HttpClient) { }

  private obtenerEncabezadosAutenticacion() {
    const token = localStorage.getItem('tokenAcceso');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  // Obtener todos los productos
  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.urlApiProductos, this.obtenerEncabezadosAutenticacion());
  }

  // Obtener un producto por su ID
  obtenerProducto(id: number): Observable<any> {
    return this.http.get(`${this.urlApiProductos}/${id}`, this.obtenerEncabezadosAutenticacion());
  }

  // Crear un nuevo producto
  crearProducto(datos: any): Observable<any> {
    return this.http.post(this.urlApiProductos, datos, this.obtenerEncabezadosAutenticacion());
  }

  // Actualizar un producto existente
  actualizarProducto(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.urlApiProductos}/${id}`, datos, this.obtenerEncabezadosAutenticacion());
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.urlApiProductos}/${id}`, this.obtenerEncabezadosAutenticacion());
  }
}