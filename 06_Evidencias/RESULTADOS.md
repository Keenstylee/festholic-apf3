# Resultados de verificación de mi APF3

Reúno las evidencias de la integración Angular → Spring Boot → MySQL de Festholic. La revisión actual corresponde al 16 de noviembre de 2026; conservo también las comprobaciones de persistencia e integración registradas el 15 de noviembre.

| Verificación | Resultado | Archivo |
|---|---|---|
| Backend Spring Boot | 42 pruebas, 0 fallos y 0 errores | backend_pruebas.txt |
| Integración base con MySQL | 25 comprobaciones aprobadas | integracion_mysql.txt |
| Persistencia y validación de imágenes | 10 comprobaciones HTTP aprobadas | imagenes_api.txt |
| Interfaz Angular | 32 comprobaciones de funciones y diseño | interfaz_actual.txt |
| Compilación Angular | Compilación aprobada | angular_build.txt |
| Persistencia tras reinicio | Datos SQL conservados | persistencia.txt |

Los recorridos son independientes y no representan una prueba de carga de producción.

## Datos y afiches

Preparé tres eventos de ejemplo en `04_datos_iniciales.sql`, con fechas, lugares y afiches obtenidos como datos de referencia. El aforo se configura para la demostración académica. El catálogo de la web consulta mi backend Spring Boot y los eventos se conservan en MySQL.

Las imágenes mantienen sus colores originales. La identidad de la interfaz utiliza negro, morado y rosado; incorporé la fuente Inter localmente y una presentación adaptable a escritorio y móvil.

## Funciones comprobadas

Incluyo registro, login, JWT, restricciones ADMIN/CLIENTE, CRUD de eventos, validación de imágenes, filtro de fecha, selector de cantidad, compra propia y consulta de entradas. También comprobé formularios inválidos, errores de permisos, persistencia al recargar e integridad referencial al borrar un evento comprado.

En la prueba de concurrencia registrada, dos compras de cuatro entradas compitieron por cinco cupos: una respondió 201 y otra 400. Tras comprar el cupo restante, el total vendido fue cinco. Apliqué bloqueo del evento y aislamiento READ_COMMITTED para respaldar esa regla.

## Evidencias

- 01–03: validaciones y errores de formularios.
- 04–06: administración, catálogo y restricciones por rol.
- 07–08: compra confirmada y entradas propias.
- 09–12: acceso, detalle y presentación móvil.
- 13–14: footer en escritorio y móvil.

Los PNG completos permiten ampliación. Utilicé cuentas de prueba y omití tokens completos y contraseñas de las evidencias. Documenté la ejecución en README.md y los casos de API en la colección Postman.

## Alcance

Mi entrega corresponde a una aplicación académica local. No implementé cobros en línea, recuperación de contraseña ni despliegue final. La fuente externa de datos no se consulta al abrir la aplicación: el catálogo funciona desde la base MySQL del proyecto.
