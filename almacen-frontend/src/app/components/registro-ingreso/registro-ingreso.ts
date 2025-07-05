import { Component, OnInit } from '@angular/core';
import { IngresoProductoService } from '../../services/ingreso-producto';
import { ProveedorService } from '../../services/proveedor';
import { ProductoService } from '../../services/producto';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngFor, *ngIf

@Component({
  selector: 'app-registro-ingreso',
  templateUrl: './registro-ingreso.html',
  styleUrls: ['./registro-ingreso.css'],
  standalone: true, // Marcar como standalone
  imports: [FormsModule, CommonModule] // Importar aquí los módulos necesarios
})
export class RegistroIngresoComponent implements OnInit {
  ingreso = {
    id_proveedor: null, // Ahora es un ID
    numero_guia: '',
    productos: [{ id_producto: null, cantidad: 1, estado: 'Disponible' }]
  };
  proveedoresDisponibles: any[] = [];
  productosDisponibles: any[] = [];
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private servicioIngresoProducto: IngresoProductoService,
    private servicioProveedor: ProveedorService,
    private servicioProducto: ProductoService,
    private enrutador: Router
  ) { }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductos();
  }

  cargarProveedores(): void {
    this.servicioProveedor.obtenerProveedores().subscribe({
      next: (data) => {
        this.proveedoresDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar proveedores:', error);
        this.mensajeError = 'Error al cargar la lista de proveedores.';
      }
    });
  }

  cargarProductos(): void {
    this.servicioProducto.obtenerProductos().subscribe({
      next: (data) => {
        this.productosDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mensajeError = 'Error al cargar la lista de productos.';
      }
    });
  }

  agregarCampoProducto(): void {
    this.ingreso.productos.push({ id_producto: null, cantidad: 1, estado: 'Disponible' });
  }

  eliminarCampoProducto(index: number): void {
    this.ingreso.productos.splice(index, 1);
  }

  alEnviar(): void {
    this.mensajeExito = null;
    this.mensajeError = null;

    // Validaciones en el frontend: asegurar que se seleccionen IDs
    if (!this.ingreso.id_proveedor) {
      this.mensajeError = 'Debe seleccionar un proveedor.';
      return;
    }

    for (const prod of this.ingreso.productos) {
      if (!prod.id_producto) {
        this.mensajeError = 'Debe seleccionar un producto para todos los productos.';
        return;
      }
    }

    // Preparar los datos para enviar al backend (solo IDs)
    const datosAEnviar = {
      id_proveedor: this.ingreso.id_proveedor,
      numero_guia: this.ingreso.numero_guia,
      productos: this.ingreso.productos.map(p => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        estado: p.estado
      }))
    };

    this.servicioIngresoProducto.crearIngresoProducto(datosAEnviar).subscribe({
      next: (res) => {
        this.mensajeExito = res.mensaje;
        // Resetear el formulario
        this.ingreso = {
          id_proveedor: null,
          numero_guia: '',
          productos: [{ id_producto: null, cantidad: 1, estado: 'Disponible' }]
        };
      },
      error: (error) => {
        this.mensajeError = error.error.message || 'Error al registrar el ingreso.';
        if (error.error.errors) {
          for (const campo in error.error.errors) {
            if (Object.prototype.hasOwnProperty.call(error.error.errors, campo)) {
              this.mensajeError += `\n${error.error.errors[campo].join(', ')}`;
            }
          }
        }
        console.error('Error al crear ingreso:', error);
      }
    });
  }
}