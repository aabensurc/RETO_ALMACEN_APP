import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-proveedores',
  templateUrl: './gestion-proveedores.html',
  styleUrls: ['./gestion-proveedores.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class GestionProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  proveedorSeleccionado: any = null; // Mantener para saber si estamos editando
  formProveedor: any = { nombre: '', contacto_email: '', contacto_telefono: '' }; // Objeto para el formulario
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private servicioProveedor: ProveedorService) { }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.servicioProveedor.obtenerProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
        this.mensajeError = 'Error al cargar la lista de proveedores.';
      }
    });
  }

  seleccionarProveedor(proveedor: any): void {
    this.proveedorSeleccionado = { ...proveedor }; // Copia el proveedor para editar
    this.formProveedor = { ...proveedor }; // Carga los datos en el formulario
    this.mensajeExito = null;
    this.mensajeError = null;
    console.log('Proveedor seleccionado para edición:', this.proveedorSeleccionado);
    console.log('Formulario de proveedor cargado:', this.formProveedor);
  }

  limpiarFormulario(): void {
    this.proveedorSeleccionado = null;
    this.formProveedor = { nombre: '', contacto_email: '', contacto_telefono: '' }; // Reinicia el formulario
    this.mensajeExito = null;
    this.mensajeError = null;
    console.log('Formulario de proveedor limpiado.');
  }

  crearProveedor(): void {
    this.mensajeExito = null;
    this.mensajeError = null;
    console.log('Intentando crear proveedor con datos:', this.formProveedor);
    this.servicioProveedor.crearProveedor(this.formProveedor).subscribe({ // Usa formProveedor
      next: (res) => {
        this.mensajeExito = res.mensaje;
        this.cargarProveedores();
        this.limpiarFormulario();
      },
      error: (error) => {
        this.mensajeError = error.error.message || 'Error al crear el proveedor.';
        if (error.error.errors) {
          for (const campo in error.error.errors) {
            if (Object.prototype.hasOwnProperty.call(error.error.errors, campo)) {
              this.mensajeError += `\n${error.error.errors[campo].join(', ')}`;
            }
          }
        }
        console.error('Error al crear proveedor:', error);
        console.error('Detalles del error:', error.error); // Log completo del error del backend
      }
    });
  }

  actualizarProveedor(): void {
    this.mensajeExito = null;
    this.mensajeError = null;
    if (this.proveedorSeleccionado && this.proveedorSeleccionado.id) {
      console.log('Intentando actualizar proveedor ID:', this.proveedorSeleccionado.id, 'con datos:', this.formProveedor);
      this.servicioProveedor.actualizarProveedor(this.proveedorSeleccionado.id, this.formProveedor).subscribe({ // Usa formProveedor
        next: (res) => {
          this.mensajeExito = res.mensaje;
          this.cargarProveedores();
          this.limpiarFormulario();
        },
        error: (error) => {
          this.mensajeError = error.error.message || 'Error al actualizar el proveedor.';
          if (error.error.errors) {
            for (const campo in error.error.errors) {
              if (Object.prototype.hasOwnProperty.call(error.error.errors, campo)) {
                this.mensajeError += `\n${error.error.errors[campo].join(', ')}`;
              }
            }
          }
          console.error('Error al actualizar proveedor:', error);
          console.error('Detalles del error:', error.error); // Log completo del error del backend
        }
      });
    }
  }

  eliminarProveedor(id: number): void {
    this.mensajeExito = null;
    this.mensajeError = null;
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor? Esta acción no se puede deshacer y puede fallar si hay ingresos asociados.')) {
      this.servicioProveedor.eliminarProveedor(id).subscribe({
        next: (res) => {
          this.mensajeExito = res.mensaje;
          this.cargarProveedores();
          this.limpiarFormulario();
        },
        error: (error) => {
          this.mensajeError = error.error.message || 'Error al eliminar el proveedor.';
          if (error.error.errors) {
            for (const campo in error.error.errors) {
              if (Object.prototype.hasOwnProperty.call(error.error.errors, campo)) {
                this.mensajeError += `\n${error.error.errors[campo].join(', ')}`;
              }
            }
          }
          console.error('Error al eliminar proveedor:', error);
          console.error('Detalles del error:', error.error); // Log completo del error del backend
        }
      });
    }
  }
}