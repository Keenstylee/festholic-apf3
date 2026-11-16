# Festholic · Avance de Proyecto Final 3

En este avance continúo mi proyecto del APF2 e integro Angular con SASS, mi API Spring Boot con JWT y la persistencia JPA/MySQL.

Autor: Keenscy Kennedy Sanchez Quispe · UTP · sección 29026.

## Arquitectura

Angular → API REST Spring Boot → JPA/Hibernate → MySQL.

El catálogo, el CRUD y las compras utilizan mi backend y mi base de datos. Utilicé una API externa únicamente para obtener los datos de tres eventos de ejemplo; no forma parte de la ejecución de la aplicación.

## Requisitos

- Java 17 o 21 y Maven 3.9+.
- Node.js 22.12+ o 24 y npm.
- MySQL 8. Puertos: MySQL 3306, backend 8080 y Angular 4200.

## 1. Base de datos

Con MySQL local, ejecutar `04_Base_de_Datos/01_crear_bd.sql`. Si ya existe la base `festholic` del APF2, se puede reutilizar.

También incluyo `compose.yaml` como alternativa: copiar `.env.example` a `.env`, configurar las claves y ejecutar `docker compose up -d`. El `.env` de Compose no configura automáticamente la terminal de Maven.

## 2. Backend en PowerShell

En una terminal, dentro de `02_Backend_SpringBoot`:

```powershell
$env:DB_USER="root"
$env:DB_PASS="TU_CONTRASEÑA_DE_MYSQL"
$env:JWT_SECRET="un_secreto_local_privado_de_al_menos_32_bytes"
mvn test
mvn spring-boot:run
```

Reemplazar el usuario y la contraseña por los de la instancia local. Hibernate crea o actualiza las tablas, incluida la columna opcional `imagen_url`. Los registros del APF2 se conservan.

## 3. Datos iniciales de ejemplo

Después de iniciar una vez el backend actualizado, abrir y ejecutar en MySQL Workbench:

`04_Base_de_Datos/04_datos_iniciales.sql`

El script incorpora JUNGLE, SIMPLE PLAN y SLIPKNOT con sus nombres, lugares, fechas y afiches de referencia. La capacidad de 100 entradas se configura exclusivamente para la demostración académica; no representa un aforo oficial. El script no elimina datos y evita repetir un mismo evento con la misma fecha.

Los datos se guardan en MySQL y se consultan mediante `GET /api/eventos`. No es necesario conectarse a la API externa para abrir la web. Los afiches se obtienen desde los enlaces guardados en cada evento y conservan sus colores originales.

## 4. Angular

En una segunda terminal, dentro de `03_Frontend_Angular`:

```powershell
npm ci
npm start
```

Abrir http://localhost:4200 y dejar las dos terminales abiertas. El proxy envía `/api` a localhost:8080; Angular no accede directamente a MySQL.

Para compilar:

```powershell
npm run build
```

La salida queda en `dist/festholic/browser`. Un servidor para esa compilación debe reenviar `/api` al backend y las rutas de Angular a `index.html`. La publicación no es un requisito principal del APF3.

## 5. Demostración funcional

1. Crear una cuenta desde `/registro`; recibe el rol CLIENTE.
2. Para habilitar al responsable, ejecutar `04_Base_de_Datos/03_habilitar_admin.sql` sustituyendo el correo y volver a iniciar sesión.
3. Como ADMIN, crear, consultar, editar y eliminar un evento sin ventas desde Angular.
4. Como CLIENTE, abrir un evento, seleccionar la cantidad, confirmar la compra y consultar Mis entradas.
5. Comprobar la validación de formularios, los errores de permisos y el conflicto al borrar un evento con compras.
6. Reiniciar el backend y consultar nuevamente los datos para comprobar su persistencia.

La compra registra una entrada académica; no realiza un cobro en línea.

## Rutas

| Ruta | Vista | Acceso |
|---|---|---|
| /eventos | Catálogo y filtros | Público |
| /eventos/:id | Detalle y compra | Público; compra con sesión |
| /login, /registro | Cuenta | Público |
| /entradas | Entradas propias | Sesión |
| /admin/eventos | Administración | ADMIN |
| /admin/eventos/nuevo | Alta | ADMIN |
| /admin/eventos/:id/editar | Edición | ADMIN |
| /admin/entradas | Registro general | ADMIN |

## Organización y decisiones técnicas

Utilicé páginas, componentes, servicios, modelos y guards con responsabilidades separadas. EventCardComponent recibe el evento mediante input y comunica la selección mediante output; EventPosterComponent presenta su afiche o una alternativa si la imagen falta o falla.

Centralicé negro, morado y rosado en `_tokens.scss` y utilicé mixins SASS para reutilizar reglas y adaptar la interfaz. Incorporé Inter localmente con su licencia. Los afiches mantienen su aspecto original: no aplico filtros ni capas de color sobre ellos.

Añadí `imagenUrl` como atributo opcional del evento y lo persistí en MySQL. El formulario permite un enlace http/https o una ruta local `/eventos/archivo.jpg`, con máximo 1000 caracteres y validación en ambos extremos.

Almaceno el JWT en sessionStorage y restauro la identidad con `/api/auth/me`. El interceptor adjunta Bearer a mi API; los guards reflejan los roles y Spring Security aplica la autorización definitiva. La compra verifica la identidad también en el servicio.

Incorporé bloqueo PESSIMISTIC_WRITE y transacciones READ_COMMITTED en compras y cambios de aforo. No permito capacidad inferior a lo vendido ni reactivar un evento sin cupos.

## Entregables y verificación

Incluyo informe PDF y versión editable, backend, frontend, scripts SQL, colección Postman y evidencias. Los resultados se encuentran en `06_Evidencias/RESULTADOS.md`.
