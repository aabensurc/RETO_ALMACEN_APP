import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.html',
  styleUrls: ['./gestion-productos.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class GestionProductosComponent implements OnInit {
  productos: any[] = [];
  productoSeleccionado: any = null; // Mantener para saber si estamos editando
  formProducto: any = { nombre: '', sku: '', descripcion: '' }; // Objeto para el formulario
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private servicioProducto: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.servicioProducto.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mensajeError = 'Error al cargar la lista de productos.';
      }
    });
  }

  seleccionarProducto(producto: any): void {
    this.productoSeleccionado = { ...producto }; // Copia el producto para editar
    this.formProducto = { ...producto }; // Carga los datos en el formulario
    this.mensajeExito = null;
    this.mensajeError = null;
    console.log('Producto seleccionado para edición:', this.productoSeleccionado);
    console.log('Formulario de producto cargado:', this.formProducto);
  }

  limpiarFormulario(): void {
    this.productoSeleccionado = null;
    this.formProducto = { nombre: '', sku: '', descripcion: '' }; // Reinicia el formulario
    this.mensajeExito = null;
    this.mensajeError = null;
    console.log('Formulario de producto limpiado.');
  }

  crearProducto(): void {
    this.mensajeExito = null;
    this.mensajeError = null;
    console.log('Intentando crear producto con datos:', this.formProducto);
    this.servicioProducto.crearProducto(this.formProducto).subscribe({ // Usa formProducto
      next: (res) => {
        this.mensajeExito = res.mensaje;
        this.cargarProductos();
        this.limpiarFormulario();
      },
      error: (error) => {
        this.mensajeError = error.error.message || 'Error al crear el producto.';
        if (error.error.errors) {
          for (const campo in error.error.errors) {
            if (Object.prototype.hasOwnProperty.call(error.error.errors, campo)) {
              this.mensajeError += `\n${error.error.errors[campo].join(', ')}`;
            }
          }
        }
        console.error('Error al crear producto:', error);
        console.error('Detalles del error:', error.error); // Log completo del error del backend
      }
    });
  }

  actualizarProducto(): void {
    this.mensajeExito = null;
    this.mensajeError = null;
    if (this.productoSeleccionado && this.productoSeleccionado.id) {
      console.log('Intentando actualizar producto ID:', this.productoSeleccionado.id, 'con datos:', this.formProducto);
      this.servicioProducto.actualizarProducto(this.productoSeleccionado.id, this.formProducto).subscribe({ // Usa formProducto
        next: (res) => {
          this.mensajeExito = res.mensaje;
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => {
          this.mensajeError = error.error.message || 'Error al actualizar el producto.';
          if (error.error.errors) {
            for (const campo in error.error.errors) {
              if (Object.prototype.hasOwnProperty.call(error.error.errors, campo)) {
                this.mensajeError += `\n${error.error.errors[campo].join(', ')}`;
              }
            }
          }
          console.error('Error al actualizar producto:', error);
          console.error('Detalles del error:', error.error); // Log completo del error del backend
        }
      });
    }
  }

  eliminarProducto(id: number): void {
    this.mensajeExito = null;
    this.mensajeError = null;
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      this.servicioProducto.eliminarProducto(id).subscribe({
        next: (res) => {
          this.mensajeExito = res.mensaje;
          this.cargarProductos();
          this.limpiarFormulario();
        },
        error: (error) => {
          this.mensajeError = error.error.message || 'Error al eliminar el producto.';
          if (error.error.errors) {
            for (const campo in error.error.errors) {
              if (Object.prototype.hasOwnProperty.call(error.error.errors, campo)) {
                this.mensajeError += `\n${error.error.errors[campo].join(', ')}`;
              }
            }
          }
          console.error('Error al eliminar producto:', error);
          console.error('Detalles del error:', error.error); // Log completo del error del backend
        }
      });
    }
  }
}