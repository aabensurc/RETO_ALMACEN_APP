# RETO_ALMACEN_APP
Desarrollo de una aplicación de gestión de almacén, utilizando Laravel 10 para el backend, Angular 20 para el frontend y PostgreSQL como base de datos. 

Cómo ejecutar el sistema:
📦 Backend (Laravel)
1. Clonar el repositorio y acceder a la carpeta `almacen-backend`
2. Ejecutar:

    composer install
    cp .env.example .env

3. Editar el archivo `.env` con las siguientes credenciales de conexión a PostgreSQL:

    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=almacen_db
    DB_USERNAME=postgres
    DB_PASSWORD=12345

4. Ejecutar las migraciones:

    php artisan migrate

5. Iniciar el servidor:

    php artisan serve

🌐 Frontend (Angular)
1. Acceder a la carpeta `almacen-frontend`
2. Ejecutar:

    npm install
    npm start

El frontend está configurado para conectarse al backend local vía proxy (`proxy.conf.json`).

🔐 Credenciales de acceso al sistema:

    Usuario: admin@example.com
    Contraseña: password


