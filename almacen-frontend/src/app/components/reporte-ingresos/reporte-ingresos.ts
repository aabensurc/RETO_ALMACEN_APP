import { Component, OnInit } from '@angular/core';
import { IngresoProductoService } from '../../services/ingreso-producto';
import { ProveedorService } from '../../services/proveedor'; // Para cargar lista de proveedores en filtro
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf, *ngFor
import { NgxPaginationModule } from 'ngx-pagination'; // Importar NgxPaginationModule

@Component({
  selector: 'app-reporte-ingresos',
  templateUrl: './reporte-ingresos.html',
  styleUrls: ['./reporte-ingresos.css'],
  standalone: true, // Marcar como standalone
  imports: [FormsModule, CommonModule, NgxPaginationModule] // Importar aquí los módulos necesarios
})
export class ReporteIngresosComponent implements OnInit {
  filtros = {
    fecha_inicio: '',
    fecha_fin: '',
    proveedor: '', // Ahora puede ser el nombre del proveedor
    numero_guia: '' // Ahora puede ser el número de guía
  };
  datosReporte: any[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalElementos: number = 0;
  estaCargando: boolean = false;
  mensajeError: string | null = null;
  proveedoresParaFiltro: any[] = []; // Para el select de filtro de proveedores
  numerosGuiaDisponibles: string[] = []; // Para el select de filtro de números de guía

  constructor(
    private servicioIngresoProducto: IngresoProductoService,
    private servicioProveedor: ProveedorService
  ) { }

  ngOnInit(): void {
    this.cargarProveedoresParaFiltro();
    this.cargarNumerosGuiaParaFiltro(); // Nueva llamada
    this.obtenerReporte();
  }

  cargarProveedoresParaFiltro(): void {
    this.servicioProveedor.obtenerProveedores().subscribe({
      next: (data) => {
        this.proveedoresParaFiltro = data;
      },
      error: (error) => {
        console.error('Error al cargar proveedores para filtro:', error);
      }
    });
  }

  // Nueva función para cargar números de guía únicos
  cargarNumerosGuiaParaFiltro(): void {
    this.servicioIngresoProducto.obtenerNumerosGuiaUnicos().subscribe({
      next: (data) => {
        this.numerosGuiaDisponibles = data;
      },
      error: (error) => {
        console.error('Error al cargar números de guía para filtro:', error);
      }
    });
  }

  // Obtener los datos del reporte
  obtenerReporte(): void {
    this.estaCargando = true;
    this.mensajeError = null;
    this.servicioIngresoProducto.obtenerReporte(this.filtros, this.paginaActual, this.elementosPorPagina).subscribe({
      next: (respuesta) => {
        this.datosReporte = respuesta.data; // Los datos paginados están en 'data'
        this.totalElementos = respuesta.total; // El total de elementos
        this.estaCargando = false;
      },
      error: (error) => {
        this.mensajeError = error.error.message || 'Error al cargar el reporte.';
        this.estaCargando = false;
        console.error('Error al obtener reporte:', error);
      }
    });
  }

  // Manejar el cambio de página (para ngx-pagination, el evento es el número de página)
  alCambiarPagina(evento: any): void {
    this.paginaActual = evento;
    this.obtenerReporte();
  }

  // Aplicar filtros al reporte
  alAplicarFiltro(): void {
    this.paginaActual = 1; // Reiniciar a la primera página al aplicar filtros
    this.obtenerReporte();
  }

  // Exportar el reporte a Excel
  exportarAExcel(): void {
    this.servicioIngresoProducto.exportarReporte(this.filtros).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_ingresos_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.mensajeError = error.error.message || 'Error al exportar a Excel.';
        console.error('Error al exportar:', error);
      }
    });
  }

  // Método para cambiar el estado de un producto específico
  actualizarEstadoProducto(idDetalleIngreso: number, estadoActual: string): void {
    const nuevoEstado = prompt(`Cambiar estado del producto (actual: ${estadoActual}). Ingrese "Disponible", "No disponible" o "Merma":`);
    if (nuevoEstado && ['Disponible', 'No disponible', 'Merma'].includes(nuevoEstado)) {
      this.servicioIngresoProducto.actualizarEstadoProducto(idDetalleIngreso, nuevoEstado).subscribe({
        next: (respuesta) => {
          console.log('Estado actualizado:', respuesta);
          this.obtenerReporte(); // Recargar el reporte para ver el cambio
        },
        error: (error) => {
          this.mensajeError = error.error.message || 'Error al actualizar el estado.';
          console.error('Error al actualizar estado:', error);
        }
      });
    } else if (nuevoEstado !== null) {
      alert('Estado inválido. Por favor, ingrese "Disponible", "No disponible" o "Merma".');
    }
  }
}