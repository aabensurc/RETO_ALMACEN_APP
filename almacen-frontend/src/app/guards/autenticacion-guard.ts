import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router'; // Usar CanActivateFn
import { AutenticacionService } from '../services/autenticacion';
import { inject } from '@angular/core'; // Importar inject
import { map, take } from 'rxjs/operators';

export const AutenticacionGuard: CanActivateFn = (route, state) => {
  const servicioAutenticacion = inject(AutenticacionService);
  const enrutador = inject(Router);

  return servicioAutenticacion.estaAutenticado().pipe(
    take(1), // Tomar solo el primer valor y luego completar
    map(logueado => {
      if (logueado) {
        return true; // Permitir acceso si está logueado
      } else {
        // Redirigir a la página de inicio de sesión si no está logueado
        return enrutador.createUrlTree(['/iniciar-sesion']);
      }
    })
  );
};
