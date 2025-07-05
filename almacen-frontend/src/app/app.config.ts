import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importar provideHttpClient y withFetch
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { NgxPaginationModule } from 'ngx-pagination'; // Importar NgxPaginationModule

import { routes } from './app.routes'; // Importar tus rutas

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Provee el enrutador con tus rutas
    provideHttpClient(withFetch()), // Provee HttpClient con soporte para fetch (necesario para el proxy)
    importProvidersFrom(FormsModule, NgxPaginationModule) // Importa módulos tradicionales
  ]
};