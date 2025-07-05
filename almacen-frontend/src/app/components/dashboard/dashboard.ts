import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importar RouterLink para standalone

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true, // Marcar como standalone
  imports: [RouterLink] // Importar RouterLink aquí
})
export class DashboardComponent {
  // Lógica del dashboard aquí
}
