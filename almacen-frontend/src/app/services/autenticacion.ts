import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators'; // Importar switchMap
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private urlApi = '/api'; // Usamos el proxy configurado
  private estaLogueado = new BehaviorSubject<boolean>(this.tieneToken()); // Estado de autenticación
  private usuarioActual = new BehaviorSubject<any>(null); // Información del usuario logueado

  constructor(private http: HttpClient, private enrutador: Router) {
    // Si ya hay un token al iniciar la app, intentar obtener la información del usuario
    if (this.tieneToken()) {
      this.obtenerUsuarioActual().subscribe();
    }
  }

  // Verifica si hay un token de autenticación en el almacenamiento local
  private tieneToken(): boolean {
    return !!localStorage.getItem('tokenAcceso');
  }

  // Observable para saber si el usuario está logueado
  estaAutenticado(): Observable<boolean> {
    return this.estaLogueado.asObservable();
  }

  // Observable para obtener la información del usuario actual
  obtenerUsuario(): Observable<any> {
    return this.usuarioActual.asObservable();
  }

  // Obtener token CSRF para Laravel Sanctum antes de peticiones POST/PUT/DELETE
  private obtenerCookieCsrf(): Observable<any> {
    return this.http.get('/sanctum/csrf-cookie', { withCredentials: true });
  }

  // Método para iniciar sesión
  iniciarSesion(credenciales: any): Observable<any> {
    return this.obtenerCookieCsrf().pipe(
      tap(() => console.log('Cookie CSRF obtenida para inicio de sesión')),
      catchError(error => {
        console.error('Error al obtener cookie CSRF para inicio de sesión:', error);
        throw error;
      }),
      // Usar switchMap para encadenar la petición de login después de obtener la cookie
      switchMap(() => {
        console.log('Enviando solicitud de inicio de sesión');
        return this.http.post(`${this.urlApi}/iniciar-sesion`, credenciales).pipe(
          tap((respuesta: any) => {
            localStorage.setItem('tokenAcceso', respuesta.token);
            this.estaLogueado.next(true);
            this.usuarioActual.next(respuesta.usuario);
          }),
          catchError(error => {
            console.error('Error durante el inicio de sesión:', error);
            throw error;
          })
        );
      })
    );
  }

  // Método para cerrar sesión
  cerrarSesion(): Observable<any> {
    return this.http.post(`${this.urlApi}/cerrar-sesion`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokenAcceso')}` }
    }).pipe(
      tap(() => {
        localStorage.removeItem('tokenAcceso');
        this.estaLogueado.next(false);
        this.usuarioActual.next(null);
        this.enrutador.navigate(['/iniciar-sesion']); // Redirigir a la página de login
      }),
      catchError(error => {
        console.error('Error durante el cierre de sesión:', error);
        throw error;
      })
    );
  }

  // Método para obtener la información del usuario autenticado desde el backend
  obtenerUsuarioActual(): Observable<any> {
    return this.http.get(`${this.urlApi}/usuario`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tokenAcceso')}` }
    }).pipe(
      tap((usuario: any) => {
        this.usuarioActual.next(usuario);
        this.estaLogueado.next(true);
      }),
      catchError(error => {
        console.error('Error al obtener el usuario actual:', error);
        localStorage.removeItem('tokenAcceso'); // Limpiar token si hay un error
        this.estaLogueado.next(false);
        this.usuarioActual.next(null);
        this.enrutador.navigate(['/iniciar-sesion']); // Redirigir a login
        throw error;
      })
    );
  }
}