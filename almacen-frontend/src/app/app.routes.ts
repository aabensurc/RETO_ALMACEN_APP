import { Routes } from '@angular/router';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion';
import { RegistroIngresoComponent } from './components/registro-ingreso/registro-ingreso';
import { ReporteIngresosComponent } from './components/reporte-ingresos/reporte-ingresos';
import { AutenticacionGuard } from './guards/autenticacion-guard';
import { DashboardComponent } from './components/dashboard/dashboard';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos'; // Importar nuevo componente
import { GestionProveedoresComponent } from './components/gestion-proveedores/gestion-proveedores'; // Importar nuevo componente

export const routes: Routes = [
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AutenticacionGuard] },
  { path: 'ingreso', component: RegistroIngresoComponent, canActivate: [AutenticacionGuard] },
  { path: 'reporte', component: ReporteIngresosComponent, canActivate: [AutenticacionGuard] },
  { path: 'gestion-productos', component: GestionProductosComponent, canActivate: [AutenticacionGuard] }, // Nueva ruta
  { path: 'gestion-proveedores', component: GestionProveedoresComponent, canActivate: [AutenticacionGuard] }, // Nueva ruta
  { path: '', redirectTo: '/iniciar-sesion', pathMatch: 'full' }, // Redirigir a iniciar-sesion por defecto
  { path: '**', redirectTo: '/iniciar-sesion' } // Redirigir a iniciar-sesion para rutas no encontradas
];
