import { Component } from '@angular/core';
import { AutenticacionService } from '../../services/autenticacion';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.html',
  styleUrls: ['./iniciar-sesion.css'],
  standalone: true, // Marcar como standalone
  imports: [FormsModule, CommonModule] // Importar aquí los módulos necesarios
})
export class IniciarSesionComponent {
  credenciales = {
    email: '',
    password: ''
  };
  mensajeError: string | null = null;

  constructor(private servicioAutenticacion: AutenticacionService, private enrutador: Router) { }

  alIniciarSesion(): void {
    this.mensajeError = null; // Limpiar mensajes de error anteriores
    this.servicioAutenticacion.iniciarSesion(this.credenciales).subscribe({
      next: () => {
        this.enrutador.navigate(['/dashboard']); // Redirigir a la página principal después del login exitoso
      },
      error: (error) => {
        this.mensajeError = error.error.message || 'Error al iniciar sesión. Verifique sus credenciales.';
        console.error('Error de inicio de sesión:', error);
      }
    });
  }
}