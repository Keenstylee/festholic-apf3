# Festholic · Avance de Proyecto Final 3

Continuidad del APF2: Angular + SASS → API REST Spring Boot/JWT → JPA → MySQL.
Autor: Keenscy Kennedy Sanchez Quispe · UTP · sección 29026.

## Requisitos

- Java 17 o 21, Maven 3.9+.
- Node.js 22.12+ o 24 y npm (Angular 21).
- MySQL 8, local o Docker Compose. Puertos: MySQL 3306, API 8080, Angular 4200.

## 1. Base de datos

Con MySQL existente, ejecutar `04_Base_de_Datos/01_crear_bd.sql`.
Alternativa: copiar `.env.example` como `.env`, cambiar claves y ejecutar en esta carpeta:

```sh
docker compose up -d
```

El `.env` de Compose no exporta variables a Maven: configurarlas también en la terminal del backend.
Hibernate crea las tablas al iniciar. No se requiere importar datos anteriores.

## 2. Backend (terminal 1)

PowerShell en Windows:

```powershell
$env:DB_USER="festholic"
$env:DB_PASS="la_clave_configurada"
$env:JWT_SECRET="un_secreto_aleatorio_privado_de_al_menos_32_bytes"
cd 02_Backend_SpringBoot
mvn test
mvn spring-boot:run
```

Bash:

```sh
export DB_USER=festholic
export DB_PASS='la_clave_configurada'
export JWT_SECRET='un_secreto_aleatorio_privado_de_al_menos_32_bytes'
cd 02_Backend_SpringBoot
mvn test
mvn spring-boot:run
```

La API usa `localhost:3306/festholic`. En MySQL propio, utilizar el usuario y contraseña reales de tu instancia. Para cambiar la URL sin editar código se puede exportar `SPRING_DATASOURCE_URL`.

## 3. Angular (terminal 2)

```sh
cd 03_Frontend_Angular
npm ci
npm start
```

Abrir http://localhost:4200. El proxy reenvía `/api` al puerto 8080: no hay acceso directo a MySQL ni necesidad de habilitar CORS. Para cambiar el destino, editar `proxy.conf.json` y reiniciar Angular.

```sh
npm run build
```

La compilación queda en `dist/festholic/browser`. Para servir esa compilación, el servidor debe reenviar las rutas de Angular a `index.html` y `/api` al backend. La publicación no es requisito del APF3.

## 4. Primer uso y demostración

1. Crear una cuenta desde `/registro`. Siempre recibe rol CLIENTE.
2. Para el administrador, ejecutar `04_Base_de_Datos/03_habilitar_admin.sql` sustituyendo el correo. Volver a iniciar sesión.
3. ADMIN: ir a Administrar, crear un evento futuro, editarlo y comprobarlo en Explorar.
4. Registrar otra cuenta CLIENTE; entrar, abrir el evento, comprar y consultar Mis entradas.
5. Intentar eliminar un evento con entradas: la interfaz muestra el conflicto de integridad.
6. Crear y eliminar un evento sin compras para demostrar el DELETE exitoso.
7. Probar validación vacía, credenciales incorrectas, restricción de `/admin/eventos` para CLIENTE y filtro de fecha.
8. Reiniciar el backend y comprobar que eventos y entradas permanecen en MySQL.

No se incluyen cuentas ni tokens reales. No hay pasarela de pago: la compra registra una entrada académica.

## Rutas y responsabilidades

| Ruta | Componente | Acceso |
|---|---|---|
| /eventos | EventsPage + EventCardComponent | Público |
| /eventos/:id | DetailPage | Público; compra autenticada |
| /registro, /login | AuthPage | Público |
| /entradas | TicketsPage | Sesión |
| /admin/eventos | AdminPage | ADMIN |
| /admin/eventos/nuevo | EventFormPage | ADMIN |
| /admin/eventos/:id/editar | EventFormPage | ADMIN |
| /admin/entradas | TicketsPage | ADMIN |

`EventCardComponent` recibe un Evento mediante `input()` y emite `seleccionar` mediante `output()`; EventsPage recibe el evento y navega al detalle. Los formularios son reactivos; la búsqueda usa FormsModule. Los servicios centralizan HTTP; los modelos definen contratos. SASS usa variables, mixins, anidación e interfaz adaptable. La web comparte el morado `#7C4DFF` y rosado `#F21E87` del informe, con fondos lavanda claros; la paleta se centraliza en `shared/_tokens.scss`.

## Seguridad y correcciones

JWT en `sessionStorage`, limitado a la pestaña. Se revisa vencimiento antes de enviarlo; al recargar se consulta `/api/auth/me`. El interceptor solo adjunta Bearer a la API propia. Un 401 protegido elimina la sesión. El backend verifica firma, vencimiento y rol actual en MySQL. Guards e interfaz reflejan el rol, pero la autorización efectiva corresponde a Spring Security.

Compras y cambios de aforo bloquean la misma fila de evento con PESSIMISTIC_WRITE, en transacción READ_COMMITTED. Esto evita leer un recuento antiguo después de esperar por el bloqueo. No se permite capacidad inferior a ventas; un evento sin cupos no se reactiva. La compra también verifica identidad con `@PreAuthorize` en el servicio.

Nuevos endpoints: GET `/api/auth/me` y GET `/api/entradas/mis`, ambos autenticados. Se mantienen los endpoints del APF2. La colección actualizada está en `05_Pruebas_API`.

## Evidencias y límites

Consultar `06_Evidencias/RESULTADOS.md` y el informe PDF. Las evidencias de este paquete se generan sobre una base local de prueba; las capturas del APF2 no se presentan como pruebas del APF3. El sistema no incluye pagos, recuperación de contraseña ni despliegue en nube porque no son requisitos de estas guías.
