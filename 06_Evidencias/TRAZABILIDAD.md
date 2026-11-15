# Trazabilidad de las guías APF3

| Sección obligatoria | Implementación / evidencia |
|---|---|
| 1. Portada y resumen | Informe PDF, sección 1; identidad y alcance Festholic. |
| 2. Correcciones APF2 | Bloqueo de evento, aforo consistente, autorización en servicio; 42 pruebas y 25 comprobaciones de integración. |
| 3. Arquitectura | Angular → HTTP/JWT → Spring Boot → JPA → MySQL; informe y README. |
| 4. Estructura Angular | angular.json, package-lock.json, main.ts, proxy.conf.json; components/pages/services/models/guards/shared. |
| 5. Componentes | Navbar, EventCard; Auth, Events, Detail, Admin, EventForm, Tickets. |
| 6. SASS | src/styles.scss y src/app/shared/_tokens.scss: variables, mixins panel/mobile, @use y adaptación móvil. |
| 7. Rutas | src/app/app.routes.ts; authGuard y adminGuard. |
| 8. Comunicación | EventCard recibe Evento con input() y emite seleccionar con output(); EventsPage abre el detalle. |
| 9. Formularios | AuthPage, EventFormPage y DetailPage con formularios reactivos; filtro de fecha con FormsModule. |
| 10. Validación / errores | Validators y mensajeError; capturas 01, 02 y 03. |
| 11. Servicios REST | AuthService y ApiService; colección Postman APF3. |
| 12. JWT y roles | sessionStorage, interceptor, restauración mediante /me, guards, menú por rol y autorización Spring Security. |
| 13. Demostración integrada | Capturas 04–08; navegador.txt, integracion_mysql.txt y persistencia.txt. |
| 14. Evidencias / conclusiones | Informe sección 14; registros de ejecución y capturas de esta carpeta. |

## Lista de verificación técnica

- [x] Backend APF2 operativo y corregido.
- [x] Angular inicia y compila sin errores.
- [x] Componentes con responsabilidades claras.
- [x] Navegación por rutas.
- [x] SASS organizado.
- [x] Formularios validados antes de enviar.
- [x] Errores de API comprensibles.
- [x] Servicios conectados a endpoints reales.
- [x] Login obtiene JWT y el interceptor lo utiliza.
- [x] Restricciones ADMIN/CLIENTE en interfaz, rutas y backend.
- [x] CRUD de eventos desde Angular.

Los ejemplos de reservas deportivas de la guía se adaptan a eventos y compra de entradas de Festholic. No son requisitos de crear canchas o reservas ajenas al dominio del APF2.

## Continuidad con el diseño del negocio

La interfaz adapta entradas.html, evento.html y login.html de Live Fest Perú, proporcionados por el autor. El detalle, el login y los boletos conservan la API y las reglas del APF3. Consulte DISENO_REFERENCIAS.md; las nuevas interacciones están verificadas en negocio_navegador.txt.
