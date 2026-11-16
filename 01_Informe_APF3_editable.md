# Avance de Proyecto Final 3

Universidad Tecnológica del Perú UTP · Desarrollo Web Integrado

Festholic | Frontend Angular integrado con Spring Boot

Docente: Kevin Frederick Sachun Becerra

Integrante: Keenscy Kennedy Sanchez Quispe · Sección 29026 · 2026

## 1. Portada y resumen del proyecto



En este avance continúo mi sistema de eventos Festholic del APF2. Incorporé un frontend Angular 21 con SASS, rutas, formularios validados y servicios HTTP conectados a la API. Organicé el acceso para que los clientes consulten eventos y compren entradas propias, mientras el administrador gestiona sus eventos mediante CRUD y consulta las compras. Preparé tres eventos de ejemplo en un script SQL, con fechas, lugares y afiches obtenidos de una API externa. El catálogo de Festholic consulta siempre los eventos guardados en mi base MySQL.

Mantuve Spring Boot 3.4.5, JPA/Hibernate, MySQL y JWT del avance anterior. Corregí la sobreventa concurrente y la edición inconsistente del aforo. Incluyo los resultados de validación de esta versión: 42 pruebas backend, 25 comprobaciones HTTP/MySQL y los recorridos de navegador documentados en las evidencias.

Delimité este avance a una aplicación local integrada, sin pasarela de pago ni despliegue final. Incluyo capturas con datos de prueba del APF3. Mantengo la modalidad individual autorizada que indiqué en el informe del APF2.

## 2. Correcciones del APF2



| Observación | Mejora aplicada | Evidencia |
| --- | --- | --- |
| Sobreventa simultánea | Incorporé PESSIMISTIC_WRITE sobre el evento y READ_COMMITTED en la compra. | integracion_mysql.txt: una compra 201 y otra 400. |
| Edición incoherente de aforo | Impedí reducir la capacidad por debajo de las ventas y reactivar un evento sin cupos. Apliqué el bloqueo al editar. | 3 pruebas unitarias nuevas y validación HTTP real. |
| Autorización solo en controlador | Añadí @PreAuthorize en comprar y listarPropias, manteniendo el control HTTP. | EntradaServiceImpl y pruebas de identidad. |
| Falta de comprobación con base real | Incorporé un script Python para comprobar consultas, concurrencia y restricciones contra la API y MySQL. | 25 comprobaciones aprobadas. |
| Uso dependiente de Postman | Integré registro, login, CRUD y compra mediante formularios y servicios Angular. | Capturas 01–09 y navegador.txt. |
| Informe con capturas pequeñas y sin paginación | Añadí páginas numeradas, una matriz de trazabilidad y capturas completas. | Este informe y 06_Evidencias. |

## 3. Arquitectura general actualizada



Usuario → Angular (rutas, componentes, formularios) → HTTP/JSON + JWT → Spring Security → Controller → Service → Repository JPA → MySQL.

Distribuí las responsabilidades por capas: Angular presenta los datos y valida formularios; el interceptor adjunta el token; Spring Security controla la identidad y los permisos; los servicios aplican las reglas de aforo y las transacciones; y JPA persiste los datos en MySQL. No establecí acceso directo desde Angular a la base de datos. Utilicé una API externa únicamente como fuente de algunos datos iniciales; la aplicación mantiene el flujo Angular → Spring Boot → MySQL.

Configuré Angular en localhost:4200, el proxy /api hacia Spring Boot en localhost:8080 y MySQL en localhost:3306/festholic. Con este esquema mantengo las solicitudes del navegador bajo el mismo origen durante el desarrollo.

## 4. Creación y estructura del proyecto Angular



Organicé el frontend como una aplicación standalone de Angular 21, con TypeScript estricto y carga diferida de páginas. Definí las dependencias en package.json y package-lock.json, la compilación en angular.json y la inicialización del router, HttpClient, idioma y sesión en main.ts. Configuré el destino de la API en proxy.conf.json.

| Carpeta | Responsabilidad |
| --- | --- |
| components/ | NavbarComponent y EventCardComponent reutilizables. |
| pages/ | Vistas asociadas a rutas: autenticación, catálogo, detalle, formulario, administración y entradas. |
| services/ | AuthService centraliza sesión; ApiService centraliza eventos y entradas. |
| models/ | Contratos TypeScript: Usuario, AuthResponse, Evento y Entrada. |
| guards/ | Autenticación y acceso ADMIN. |
| shared/ | Interceptor JWT, traducción de errores y tokens SASS. |

## 5. Componentes



| Componente | Responsabilidad |
| --- | --- |
| NavbarComponent | Menú por rol y cierre de sesión. |
| EventCardComponent / EventPosterComponent | Tarjeta, afiche, alternativa ante imagen ausente y selección al padre. |
| AuthPage | Formularios de registro y login. |
| EventsPage / DetailPage | Catálogo, filtro por fecha, detalle y compra. |
| AdminPage / EventFormPage | Listar, confirmar borrado, crear y editar eventos. |
| TicketsPage | Entradas propias o listado general para ADMIN. |

## 6. Estilos con SASS



Centralicé el negro, morado #7C4DFF y rosado #F21E87 en src/app/shared/_tokens.scss. Utilicé @use, variables y mixins para organizar SASS y la adaptación móvil. Incorporé la fuente Inter localmente y prioricé títulos claros, afiches y controles legibles, sin rótulos decorativos. Conservé los colores originales de los afiches y mantuve estados de foco, error y carga.

## 7. Sistema de rutas



| Ruta | Vista | Acceso |
| --- | --- | --- |
| /eventos | EventsPage | Público |
| /eventos/:id | DetailPage | Público; compra con sesión |
| /login, /registro | AuthPage | Público |
| /entradas | TicketsPage | Autenticado |
| /admin/eventos | AdminPage | ADMIN |
| /admin/eventos/nuevo | EventFormPage | ADMIN |
| /admin/eventos/:id/editar | EventFormPage | ADMIN |
| /admin/entradas | TicketsPage | ADMIN |

Implementé authGuard para conservar la ruta de retorno cuando es necesario iniciar sesión y adminGuard para impedir el acceso de CLIENTE a la administración. Mantuve la comprobación de permisos en cada solicitud del backend, ya que los guards del navegador no reemplazan la autorización de la API.

## 8. Comunicación entre componentes



Implementé la comunicación entre EventsPage y EventCardComponent mediante input.required&lt;Evento&gt;() y output&lt;Evento&gt;(). El listado entrega cada evento al hijo con [evento]. Al seleccionar una tarjeta, el hijo emite seleccionar.emit(evento()); el padre recibe (seleccionar)="abrir($event)" y abre su detalle. Utilicé este intercambio en el recorrido de compra.

## 9. Formularios



Construí el registro y login con ReactiveFormsModule en AuthPage. Reutilicé EventFormPage para registrar y editar eventos, y validé la cantidad en DetailPage antes de comprar. Vinculé los botones + / − al control de cantidad y añadí la opción de mostrar u ocultar la contraseña. Añadí el campo opcional de afiche, validado y persistido como imagenUrl en la API y MySQL. Impedí el envío de datos inválidos y utilicé FormsModule para los filtros.

Bloqueé los controles de edición durante la carga inicial para evitar que una respuesta tardía sobrescriba los datos escritos. También bloqueé los envíos repetidos durante el guardado y la compra.

## 10. Validación de datos y manejo de errores



| Dato / situación | Validación o respuesta |
| --- | --- |
| Nombre / lugar | Obligatorios, sin solo espacios; máximos de 120 / 160 caracteres. |
| Correo / contraseña | Formato de correo, máximo 120; registro con contraseña entre 8 y 72 caracteres. |
| Fecha / capacidad | Fecha actual o futura; capacidad entera positiva hasta el límite Integer del backend. |
| Cantidad de compra | Entero positivo y máximo de capacidad total; la API valida el cupo disponible real. |
| Afiche | URL opcional http/https o ruta local válida; máximo 1000 caracteres. |
| HTTP 400 / 409 | Mensajes de validación, aforo insuficiente o integridad referencial. |
| HTTP 401 / 403 / 404 | Credenciales o sesión, permisos insuficientes y registro inexistente. |
| Error de red / servidor | Mensaje comprensible; no se muestran trazas ni detalles internos. |

Figura 1. Formulario de evento con validación visual antes de llamar al backend.

Imagen: 06_Evidencias/03_evento_validacion.png

Figura 2. Respuesta comprensible ante credenciales incorrectas.

Imagen: 06_Evidencias/02_login_error.png

## 11. Servicios Angular para consumir la API REST



| Servicio / método | HTTP y endpoint | Uso |
| --- | --- | --- |
| AuthService.registrar | POST /api/auth/registro | Nueva cuenta CLIENTE |
| AuthService.login | POST /api/auth/login | Obtiene JWT |
| AuthService.restaurar | GET /api/auth/me | Perfil y rol actual |
| ApiService.eventos | GET /api/eventos o /buscar?fecha= | Catálogo / filtro |
| ApiService.evento | GET /api/eventos/{id} | Detalle / edición |
| ApiService.guardar | POST /api/eventos; PUT /{id} | Alta / actualización |
| ApiService.eliminar | DELETE /api/eventos/{id} | Borrado confirmado |
| ApiService.comprar | POST /api/entradas | Registra compra propia |
| ApiService.entradas | GET /api/entradas/mis o /api/entradas | Propias / general ADMIN |

Centralicé las llamadas HTTP en los servicios para evitar duplicarlas en las páginas. Desde los componentes presento los estados de carga, resultado y error. Incorporé /api/auth/me y /api/entradas/mis para consultar la identidad y las compras propias. El afiche forma parte del evento y se conserva en MySQL mediante el atributo imagenUrl. Angular obtiene el catálogo desde mi API Spring Boot.

## 12. Autenticación y autorización en Angular



Implementé el flujo Login → JWT en sessionStorage → interceptor Bearer → API protegida. Al recargar, compruebo el vencimiento y consulto /api/auth/me; ante un 401 protegido, elimino la sesión. Al cerrar sesión, borro el token. No almaceno contraseñas en el navegador ni incluyo tokens completos en las evidencias.

Adapté el menú y las rutas a los roles ADMIN y CLIENTE. Conservé en Spring Security la comprobación de firma, vencimiento y rol actual en MySQL. Restringí las escrituras y el listado general; el registro público asigna CLIENTE y la habilitación de ADMIN se realiza mediante el script SQL.

Elegí sessionStorage para limitar la persistencia a la pestaña. Reconozco que el token sigue siendo accesible a JavaScript. Para una futura versión de producción tendría que evaluar cookies, renovación de sesión y otras medidas; no incluyo esas funciones en el alcance actual.

## 13. Demostración funcional integrada · administración



Para demostrar el CRUD, ingreso como ADMIN y accedo a Administrar. Registro un evento futuro desde Angular, compruebo su aparición en la cartelera y edito el lugar. Luego elimino un evento temporal sin ventas. Finalmente, compruebo que un evento con entradas quede protegido por la restricción de integridad referencial.

Figura 3. Administración con datos obtenidos de la API, edición y borrado disponibles para ADMIN.

Imagen: 06_Evidencias/04_admin_crud.png

Figura 4. Catálogo Angular con eventos persistidos en MySQL.

Imagen: 06_Evidencias/05_catalogo.png

## 13. Demostración funcional integrada · compra



Para demostrar la compra, registro una cuenta CLIENTE, inicio sesión y selecciono un evento del catálogo Festholic. Elijo dos entradas y confirmo la operación. Angular envía el POST con JWT; Spring Boot comprueba identidad, fecha y disponibilidad, bloquea el evento y guarda la compra. Consulto el resultado en Mis entradas.

Figura 5. Confirmación de una compra real desde Angular contra Spring Boot y MySQL.

Imagen: 06_Evidencias/07_compra_confirmada.png

Figura 6. La compra aparece en el listado propio y permanece después de recargar la página.

Imagen: 06_Evidencias/08_mis_entradas.png

## 14. Evidencias y conclusiones



| Comprobación | Resultado y archivo |
| --- | --- |
| Suite backend | 42 pruebas; 0 fallos, 0 errores. backend_pruebas.txt. |
| Integración API + MySQL 8.4 | 25 comprobaciones aprobadas. integracion_mysql.txt. |
| Concurrencia de compra | Con 5 cupos, dos solicitudes de 4: una 201 y una 400. Tras comprar el último cupo, total = 5. |
| Recorrido en Chromium | Registro, login, validación, CRUD, compra, guards, recarga de sesión y vista móvil. navegador.txt. |
| Interfaz actual | 32 comprobaciones de CRUD, afiches, login, compra y móvil. interfaz_actual.txt. |
| Imagen persistente | 10 comprobaciones HTTP de alta, edición, validación y archivo. imagenes_api.txt. |
| Persistencia después de reinicio | Comparación de eventos y entradas antes/después; datos conservados. persistencia.txt. |
| Compilación frontend | npm run build exitoso con plantillas y TypeScript estrictos. angular_build.txt. |

Organizo las capturas 01–14 en 06_Evidencias y relaciono los requisitos con sus archivos en TRAZABILIDAD.md. Conservo los resultados de ejecución sin tokens ni contraseñas. El script de integración recibe las credenciales ADMIN mediante variables de entorno.

## Conclusiones técnicas



Integré las operaciones principales en Angular para utilizar el sistema sin depender de Postman. Separé las páginas, los componentes y los servicios; añadí validación visual y mantuve la validación y autorización definitivas en el backend. Vinculé la compra con la identidad autenticada mediante JWT y conservé la persistencia de eventos y entradas en MySQL.

Incorporé un bloqueo compartido entre compras y edición con aislamiento READ_COMMITTED para evitar la sobreventa concurrente. Corregí también la carga inicial del formulario de edición. Respaldo estas decisiones con las pruebas y evidencias de la entrega. Mantengo fuera del alcance los pagos, la recuperación de contraseña y el despliegue final.

Documenté la ejecución en README.md: configurar MySQL y las variables DB_USER, DB_PASS y JWT_SECRET, iniciar Spring Boot y ejecutar npm ci / npm start en Angular. Utilizo variables de entorno para mantener las credenciales fuera del código.

## Anexo · interfaz adaptable y restricciones por rol



Figura 7. Sesión CLIENTE: navegación de exploración y entradas; la ruta administrativa se rechaza mediante guard.

Imagen: 06_Evidencias/06_cliente_roles.png

Figura 8. Cartelera a 390 px de ancho, comprobada sin desbordamiento horizontal.

Imagen: 06_Evidencias/09_movil.png

Tomé como base APF3_01_Estructura_del_entregable.pdf y APF3_02_Guia_explicada_con_ejemplos.pdf. Apliqué sus requisitos al dominio de eventos y entradas de Festholic para mantener la continuidad con mi APF2.

## Anexo · presentación de Festholic



Desarrollé la presentación de Festholic centrada en los eventos y sus afiches. Utilicé negro, morado y rosado; la fuente Inter; títulos sin rótulos adicionales; formularios sencillos y un footer compacto. Conservé la plantilla institucional del APF2 para este informe.

Figura 9. Acceso con tipografía Inter, campos legibles y opción de mostrar la contraseña.

Imagen: 06_Evidencias/10_login_diseno.png

Figura 10. Detalle de un evento del módulo Festholic y selector de cantidad + / −.

Imagen: 06_Evidencias/11_detalle_diseno.png

Mantuve la presentación en SASS y cargué la fuente localmente. Los afiches provienen de la API o del campo de imagen del evento. El catálogo y las compras académicas de Festholic utilizan el backend Spring Boot y mi base MySQL. Detallo estas decisiones en DISENO_REFERENCIAS.md.