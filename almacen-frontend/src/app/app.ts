import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Importar RouterOutlet, RouterLink
import { CommonModule } from '@angular/common'; // Importar CommonModule desde @angular/common
import { AutenticacionService } from './services/autenticacion';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true, // Marcar como standalone
  imports: [RouterOutlet, RouterLink, CommonModule] // Importar aquí los módulos necesarios
})
export class AppComponent {
  titulo = 'almacen-app';
  estaLogueado$: Observable<boolean>;

  constructor(private servicioAutenticacion: AutenticacionService) {
    this.estaLogueado$ = this.servicioAutenticacion.estaAutenticado();
  }

  alCerrarSesion(): void {
    this.servicioAutenticacion.cerrarSesion().subscribe();
  }
}