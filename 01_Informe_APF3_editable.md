# Avance de Proyecto Final 3

Universidad Tecnológica del Perú UTP · Desarrollo Web Integrado

Festholic | Frontend Angular integrado con Spring Boot

Docente: Kevin Frederick Sachun Becerra

Integrante: Keenscy Kennedy Sanchez Quispe · Sección 29026 · 2026

## 1. Portada y resumen del proyecto



El APF3 continúa el sistema de eventos del APF2. Añade un frontend Angular 21 con SASS, navegación por rutas, formularios validados y servicios HTTP conectados a la API real. Los clientes se registran, inician sesión, consultan eventos y compran entradas propias; el administrador gestiona la cartelera mediante CRUD y consulta las compras.

La entrega conserva Spring Boot 3.4.5, JPA/Hibernate, MySQL y JWT. Corrige la sobreventa concurrente y la edición inconsistente del aforo. La validación de esta versión obtuvo 42 pruebas backend y 25 comprobaciones HTTP/MySQL aprobadas, además del recorrido automatizado por navegador documentado en las evidencias.

Alcance: aplicación local integrada; sin pasarela de pago ni despliegue final. Las capturas corresponden a datos de prueba del APF3. La modalidad individual se consigna como continuidad de lo indicado en el informe del APF2.

## 2. Correcciones del APF2



| Observación | Mejora aplicada | Evidencia |

| --- | --- | --- |

| Sobreventa simultánea | Bloqueo PESSIMISTIC_WRITE sobre el evento; compra transaccional con READ_COMMITTED. | integracion_mysql.txt: una compra 201 y otra 400. |

| Edición incoherente de aforo | Se rechaza capacidad menor a lo vendido; no se abre venta si no quedan cupos. Mismo bloqueo al editar. | 3 pruebas unitarias nuevas y validación HTTP real. |

| Autorización solo en controlador | @PreAuthorize en comprar y listarPropias. Se mantiene el control HTTP. | EntradaServiceImpl y pruebas de identidad. |

| Falta de comprobación con base real | Script Python contra API en ejecución y MySQL 8.4; verifica consultas, concurrencia y restricciones. | 25 comprobaciones aprobadas. |

| Uso dependiente de Postman | Angular realiza registro, login, CRUD y compra con formularios y servicios. | Capturas 01–09 y navegador.txt. |

| Informe con capturas pequeñas y sin paginación | Documento con páginas numeradas, matriz de trazabilidad y capturas completas externas. | Este informe y 06_Evidencias. |

## 3. Arquitectura general actualizada



Usuario → Angular (rutas, componentes, formularios) → HTTP/JSON + JWT → Spring Security → Controller → Service → Repository JPA → MySQL.

Angular presenta los datos y valida el formulario; el interceptor adjunta el token. Spring Security valida la identidad y el rol, los servicios aplican las reglas del aforo y las transacciones, y JPA persiste las entidades. Angular nunca accede directamente a MySQL.

En desarrollo, el navegador usa localhost:4200. El proxy de Angular reenvía /api a localhost:8080; Spring Boot se conecta a localhost:3306/festholic. Así las solicitudes del navegador mantienen el mismo origen sin habilitar CORS indiscriminado.

## 4. Creación y estructura del proyecto Angular



Proyecto standalone con Angular 21, TypeScript estricto y carga diferida de páginas. package.json y package-lock.json fijan las dependencias; angular.json configura compilación y servidor. main.ts registra HttpClient, router, idioma español e inicialización de sesión. proxy.conf.json establece el destino de la API.

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

| EventCardComponent | Tarjeta de evento; emite selección al padre. |

| AuthPage | Formularios de registro y login. |

| EventsPage / DetailPage | Catálogo, filtro por fecha, detalle y compra. |

| AdminPage / EventFormPage | Listar, confirmar borrado, crear y editar eventos. |

| TicketsPage | Entradas propias o listado general para ADMIN. |

## 6. Estilos con SASS



src/app/shared/_tokens.scss define colores y mixins panel/mobile. styles.scss los importa con @use, reutiliza variables y @include, y agrupa las reglas adaptables bajo el mixin móvil. La paleta comparte con el informe el morado #7C4DFF y el rosado #F21E87, sobre fondos lavanda claros. Hay estados de foco, errores, carga y botones deshabilitados. El diseño se adapta a 390 px sin desbordamiento horizontal.

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

authGuard conserva la ruta de retorno al enviar al usuario al login. adminGuard devuelve al catálogo a un CLIENTE. La API verifica los permisos en cada solicitud, incluso si se intenta omitir el guard desde el navegador.

## 8. Comunicación entre componentes



EventsPage entrega cada Evento al hijo EventCardComponent con [evento]. El hijo declara input.required&lt;Evento&gt;() y output&lt;Evento&gt;(). Al pulsar “Ver evento”, emite seleccionar.emit(evento()); el padre recibe (seleccionar)="abrir($event)" y navega al detalle correspondiente. Este intercambio se usa en la compra real.

## 9. Formularios



AuthPage implementa registro y login con ReactiveFormsModule. EventFormPage reutiliza el formulario para POST y PUT. DetailPage valida la cantidad antes de comprar. Los controles se marcan al intentar enviar; si son inválidos no se llama a la API. La búsqueda por fecha usa FormsModule.

Al editar, los controles permanecen bloqueados mientras llegan los datos para evitar sobrescribir lo que el usuario acaba de escribir. El guardado y la compra bloquean envíos repetidos durante la solicitud.

## 10. Validación de datos y manejo de errores



| Dato / situación | Validación o respuesta |

| --- | --- |

| Nombre / lugar | Obligatorios, sin solo espacios; máximos de 120 / 160 caracteres. |

| Correo / contraseña | Formato de correo, máximo 120; registro con contraseña entre 8 y 72 caracteres. |

| Fecha / capacidad | Fecha actual o futura; capacidad entera positiva hasta el límite Integer del backend. |

| Cantidad de compra | Entero positivo y máximo de capacidad total; la API valida el cupo disponible real. |

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

Los componentes no duplican llamadas HTTP: invocan métodos de los servicios y muestran estados de carga, resultado y error. Los nuevos endpoints /me y /mis permiten obtener la identidad y compras propias sin pedir IDs al cliente.

## 12. Autenticación y autorización en Angular



Login → JWT en sessionStorage → interceptor Bearer → API protegida. Al recargar la aplicación se valida el vencimiento y se consulta /api/auth/me. Un 401 protegido elimina la sesión. Al salir se borra el token. No se guardan contraseñas; los tokens completos no se incluyen en las evidencias.

El menú y los guards reflejan ADMIN/CLIENTE. Spring Security sigue siendo la autoridad: comprueba firma y vencimiento del JWT, recupera el rol actual de MySQL y restringe las escrituras y el listado general. El registro público siempre crea CLIENTE; el responsable habilita ADMIN mediante SQL local.

sessionStorage limita la persistencia a la pestaña, pero sigue siendo accesible a JavaScript. Para un producto en producción serían necesarias decisiones adicionales sobre cookies, renovación y endurecimiento. Esas funciones no se presentan como implementadas.

## 13. Demostración funcional integrada · administración



1. El ADMIN inicia sesión. 2. Accede a Administrar. 3. Crea eventos futuros desde el formulario Angular. 4. La API valida y JPA guarda en MySQL. 5. La cartelera refleja el alta. 6. Edita el lugar y verifica el cambio. 7. Crea y borra un evento temporal sin ventas; un evento con entradas queda protegido por integridad referencial.

Figura 3. Administración con datos obtenidos de la API, edición y borrado disponibles para ADMIN.

Imagen: 06_Evidencias/04_admin_crud.png

Figura 4. Cartelera Angular con eventos registrados a través del formulario integrado.

Imagen: 06_Evidencias/05_catalogo.png

## 13. Demostración funcional integrada · compra



1. Se registra un CLIENTE. 2. Inicia sesión y selecciona un evento. 3. Elige dos entradas. 4. Angular envía POST /api/entradas con Bearer. 5. Spring Boot comprueba identidad, disponibilidad y fecha, bloquea el evento y confirma la transacción. 6. Angular muestra el identificador de compra y actualiza Mis entradas.

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

| Revisión de la paleta | 11 comprobaciones aprobadas; contraste 4.81:1 en botones principales. paleta_navegador.txt. |

| Persistencia después de reinicio | Comparación de eventos y entradas antes/después; datos conservados. persistencia.txt. |

| Compilación frontend | npm run build exitoso con plantillas y TypeScript estrictos. angular_build.txt. |

Las capturas 01–09 están completas en 06_Evidencias. La matriz TRAZABILIDAD.md relaciona los requisitos con archivos y evidencias. Los registros de prueba no contienen tokens ni contraseñas. El script de integración utiliza credenciales ADMIN proporcionadas por variables de entorno.

## Conclusiones técnicas



Angular permite ejecutar las operaciones principales sin Postman y mantiene responsabilidades separadas entre páginas, componentes y servicios. La validación visual previene solicitudes incompletas, mientras el backend conserva la validación y autorización definitivas. JWT vincula la compra con la identidad actual. MySQL conserva eventos y entradas tras reiniciar la API.

El bloqueo compartido entre compras y edición, unido a READ_COMMITTED, corrigió la sobreventa reproducida por solicitudes simultáneas. Las pruebas de navegador detectaron y permitieron corregir la carrera de carga del formulario de edición. La entrega cumple el alcance local de las dos guías; pagos, recuperación de contraseña y despliegue quedan fuera de este avance.

Reproducción: seguir README.md, configurar MySQL y las variables DB_USER, DB_PASS y JWT_SECRET, iniciar Spring Boot y ejecutar npm ci / npm start. No se requiere compartir credenciales personales.

## Anexo · interfaz adaptable y restricciones por rol



Figura 7. Sesión CLIENTE: navegación de exploración y entradas; la ruta administrativa se rechaza mediante guard.

Imagen: 06_Evidencias/06_cliente_roles.png

Figura 8. Cartelera a 390 px de ancho, comprobada sin desbordamiento horizontal.

Imagen: 06_Evidencias/09_movil.png

Fuentes de requisitos: APF3_01_Estructura_del_entregable.pdf y APF3_02_Guia_explicada_con_ejemplos.pdf. Los ejemplos del centro deportivo se adaptaron a Festholic; no se incorporaron módulos ajenos al proyecto.