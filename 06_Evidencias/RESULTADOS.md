# Resultados de verificación APF3

Ejecución local el 15 de noviembre de 2026, zona America/Lima.

- Backend: Java 17, Maven 3.9.11, Spring Boot 3.4.5. **42 pruebas, 0 fallos, 0 errores, 0 omitidas**.
- Angular 21: `npm run build` aprobado con TypeScript y plantillas estrictos.
- API y MySQL 8.4 reales: **25 comprobaciones aprobadas**.
- Chromium / Playwright: **18 comprobaciones UI aprobadas**, sin errores JavaScript.
- Persistencia: resultados SQL idénticos tras detener y reiniciar Spring Boot; API devuelve los cuatro eventos existentes.

## Qué se comprobó con MySQL

Registro y login; perfil protegido; roles HTTP 401/403; consultas por fecha; validación; identidad del comprador; dos compras simultáneas; último cupo; aforo menor a ventas; intento de reactivación agotada; listado propio; aislamiento de otro cliente; contraseña no serializada; integridad referencial 409; edición y borrado reales; 404 tras borrado.

En concurrencia, dos POST de cuatro entradas compitieron por cinco cupos: uno respondió 201 y otro 400. La venta final, tras comprar el cupo restante, fue exactamente cinco. Esta comprobación usa transacciones y consultas reales, además de la suite con mocks.

## Capturas

01 login con validación; 02 error de credenciales; 03 formulario de evento inválido; 04 administración CRUD; 05 catálogo real; 06 menú CLIENTE y ruta ADMIN rechazada; 07 compra confirmada; 08 entradas propias; 09 vista móvil de 390 px.

Las capturas usan cuentas de prueba y no contienen tokens. El informe incluye una selección; los PNG completos permiten ampliación. La base de pruebas no se entrega como volcado: el proyecto inicia en una base nueva siguiendo el README.

## Corrección encontrada durante la verificación

Se bloqueó el formulario de edición durante la carga inicial para impedir que una respuesta tardía sobrescribiera los campos ya escritos. El recorrido se repitió con esa corrección y aprobó sus 18 comprobaciones.

## Límites

Aplicación local académica; sin pago en línea, recuperación de contraseña o despliegue final. La revisión de concurrencia cubre las solicitudes documentadas, no una prueba de carga de producción. Las capturas del APF2 no se reutilizaron como evidencias del APF3.
