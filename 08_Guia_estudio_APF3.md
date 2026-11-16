# Guía de exposición · Festholic APF3

18 diapositivas · Semanas 11 a 15

Practica las ideas con tus palabras. El guion es para hablar; no es la redacción del informe. Dedica unos 30–45 segundos a cada diapositiva.

## Método de repaso

1. Lee el guion en voz alta.
2. Explícalo sin mirar.
3. Responde la pregunta técnica.
4. Ubica la función en la web o en el código.

## Diapositiva 01 · De la API a una experiencia completa

### Cómo explicarla

Festholic permite consultar eventos y comprar entradas. El avance anterior contiene el backend con Spring Boot y MySQL. Este tercer avance incorpora Angular para utilizar las funciones desde una interfaz web, incluyendo autenticación y permisos por rol.

### Idea que debes recordar

Continuidad del APF2 más frontend integrado. La compra registra entradas; no realiza cobros.

### Pregunta técnica

**{q}**

El frontend Angular, sus rutas, formularios y servicios conectados al backend existente.

### Ampliación para estudiar

Presentación: explicar que el APF3 mantiene el backend del APF2 e incorpora un frontend funcional. No afirmar que se implementó una pasarela de pago. Duración sugerida de exposición: 10 a 12 minutos; las notas sirven para repasar.

---

## Diapositiva 02 · Lo que demuestra este avance

### Cómo explicarla

El sistema tiene tres recorridos principales: explorar el catálogo, comprar entradas como cliente y administrar eventos como ADMIN. Las operaciones utilizan datos de la API y los cambios se guardan en MySQL.

### Idea que debes recordar

Relacionar cada rol con una función concreta.

### Pregunta técnica

**{q}**

Una aplicación local integrada; la pasarela de pago y el despliegue final quedan fuera del alcance.

### Ampliación para estudiar

Los entregables son informe, backend, frontend, scripts de base de datos, colección de API y README, además de evidencias. El despliegue final no es requisito principal. Las entradas se registran sin cobro en línea.

---

## Diapositiva 03 · Cinco semanas, un flujo integrado

### Cómo explicarla

El proyecto aplica las semanas 11 a 15: componentes y SASS; rutas y comunicación; formularios y validación; servicios REST y seguridad; e integración de todo el recorrido. Los ejemplos de clases se adaptan al dominio de eventos.

### Idea que debes recordar

Semana 11: base. 12: navegación. 13: formularios. 14: API. 15: integración.

### Pregunta técnica

**{q}**

Se aplican los requisitos de las guías al proyecto. FormArray, PATCH o rutas hijas son alternativas que no necesariamente se necesitan en cada módulo.

### Ampliación para estudiar

Los documentos recibidos son de las semanas 11 a 15. No confundir los ejemplos de matrícula y reservas de las diapositivas con funciones obligatorias del dominio de eventos.

---

## Diapositiva 04 · Cada capa tiene una responsabilidad

### Cómo explicarla

Angular presenta información y captura acciones. Spring Boot recibe solicitudes, valida permisos y aplica reglas de negocio. JPA/Hibernate permite persistir las entidades en MySQL. La API responde en JSON y Angular actualiza la pantalla.

### Idea que debes recordar

Usuario → Angular → API → servicio → repositorio → MySQL.

### Pregunta técnica

**{q}**

No. Angular consume endpoints HTTP; únicamente el backend accede a la base de datos.

### Ampliación para estudiar

Recorrido: usuario → componente → servicio HttpClient → Spring Security → controller → service → repository JPA → MySQL. La respuesta vuelve como JSON. Angular nunca accede directamente a MySQL.

---

## Diapositiva 05 · Angular organizado para crecer

### Cómo explicarla

El frontend está dividido por responsabilidades: components contiene elementos reutilizables; pages, las vistas; services, las llamadas a la API; models, los contratos TypeScript; guards, el acceso a rutas; y shared, recursos comunes. SASS organiza colores y estilos reutilizables.

### Idea que debes recordar

Componente: lógica, plantilla y estilos. Servicio: lógica compartida o acceso a datos.

### Pregunta técnica

**{q}**

Para describir la estructura esperada de los datos durante el desarrollo. No sustituyen la validación del backend.

### Ampliación para estudiar

Un componente reúne lógica TypeScript, plantilla y estilos. La aplicación usa componentes standalone. Angular CLI y npm permiten ejecutar y compilar. ApiService evita repetir llamadas HTTP. Los modelos TypeScript tipan los contratos, pero la validación definitiva ocurre en el backend.

---

## Diapositiva 06 · Navegar sin recargar toda la aplicación

### Cómo explicarla

Angular Router relaciona cada URL con una vista. /eventos abre el catálogo y /eventos/:id carga un detalle específico. Las rutas administrativas requieren ADMIN. routerLink permite navegar y router-outlet muestra el componente de la ruta activa.

### Idea que debes recordar

Una ruta Angular muestra una vista; un endpoint devuelve datos o ejecuta una operación.

### Pregunta técnica

**{q}**

Es un parámetro variable. Por ejemplo, /eventos/4 identifica el evento 4 para solicitar su detalle.

### Ampliación para estudiar

routerLink navega; router-outlet muestra la vista activa. :id es un parámetro dinámico leído por el componente. Router permite navegar desde TypeScript al completar una operación. No confundir la ruta /eventos con el endpoint GET /api/eventos.

---

## Diapositiva 07 · Los datos bajan; las acciones suben

### Cómo explicarla

EventsPage envía un evento a EventCardComponent mediante un input. Cuando el usuario selecciona la tarjeta, el hijo emite un output. El padre recibe la acción y abre el detalle. Así la tarjeta conserva una responsabilidad reutilizable.

### Idea que debes recordar

Padre → hijo: datos. Hijo → padre: evento.

### Pregunta técnica

**{q}**

El proyecto utiliza input() y output(), APIs modernas de Angular para recibir datos y emitir acciones. Cumplen esas mismas direcciones de comunicación.

### Ampliación para estudiar

La clase explica @Input y @Output/EventEmitter. Este proyecto usa las APIs modernas input() y output(): misma dirección de comunicación, sintaxis diferente. El padre pasa [evento] y escucha (seleccionar); el hijo no decide toda la navegación.

---

## Diapositiva 08 · Validar antes de enviar

### Cómo explicarla

Los formularios reactivos comprueban nombre, lugar, fecha, capacidad y credenciales antes de enviar. Si hay errores, muestran mensajes junto al campo e impiden guardar. La API también valida porque las solicitudes pueden llegar sin pasar por Angular.

### Idea que debes recordar

FormControl: campo. FormGroup: grupo. touched: visitado. dirty: modificado. invalid: falla una regla.

### Pregunta técnica

**{q}**

La validación del frontend orienta al usuario; la del backend protege la integridad de los datos y las reglas del sistema.

### Ampliación para estudiar

FormControl representa un campo; FormGroup agrupa controles. Validators.required/email/min/max y validadores propios permiten bloquear el envío. touched significa visitado; dirty significa valor modificado. FormArray sirve para colecciones dinámicas, pero no es necesario para este formulario. El backend vuelve a validar.

---

## Diapositiva 09 · La API se consume desde servicios

### Cómo explicarla

ApiService y AuthService centralizan las solicitudes mediante HttpClient. GET consulta, POST crea o ejecuta una operación, PUT actualiza y DELETE elimina. Los componentes reaccionan al resultado y representan carga, éxito o error.

### Idea que debes recordar

Evitar repetir solicitudes y URL en cada página.

### Pregunta técnica

**{q}**

Un Observable representa un flujo asíncrono. En HttpClient, subscribe permite recibir la respuesta y manejar el error; la solicitud se ejecuta al suscribirse.

### Ampliación para estudiar

Un Observable representa un flujo asíncrono. subscribe permite manejar next y error. GET consulta; POST crea o ejecuta una operación; PUT actualiza; DELETE elimina. PATCH permite cambios parciales, pero el proyecto utiliza PUT. Los modelos tipan las respuestas. La colección Postman complementa las pruebas de navegador.

---

## Diapositiva 10 · Identidad, credencial y permisos

### Cómo explicarla

El login envía credenciales al backend. Si son válidas, Angular recibe un JWT y lo conserva en sessionStorage. El interceptor lo añade como Authorization: Bearer a las solicitudes de la API. El servidor verifica el token y los permisos.

### Idea que debes recordar

Autenticación: quién es. Autorización: qué puede hacer.

### Pregunta técnica

**{q}**

No. Está limitado a la pestaña pero es accesible desde JavaScript, por lo que debe considerarse el riesgo de XSS. La firma del JWT no cifra su contenido.

### Ampliación para estudiar

Login envía credenciales por POST /api/auth/login. El JWT se guarda en sessionStorage y el interceptor agrega Authorization: Bearer. sessionStorage está ligado a la pestaña y es accesible a JavaScript; no es inmune a XSS. Un JWT normalmente está firmado, no cifrado. Spring valida firma y vencimiento, además del rol. Nunca mostrar tokens o contraseñas durante la exposición.

---

## Diapositiva 11 · ADMIN gestiona. CLIENTE compra

### Cómo explicarla

El menú cambia según el rol. ADMIN dispone de administración; CLIENTE consulta eventos y sus entradas. En la prueba, un cliente intentó abrir /admin/eventos en la misma pestaña con sesión activa y fue redirigido a /eventos.

### Idea que debes recordar

Guard: navegación. Spring Security: autorización del backend.

### Pregunta técnica

**{q}**

No. Un usuario puede llamar directamente a la API; el backend también debe comprobar el rol y rechazar operaciones sin permiso.

### Ampliación para estudiar

Sin sesión, la ruta administrativa lleva al login. Con CLIENTE en la misma pestaña, /admin/eventos redirige a /eventos. Ocultar un botón no basta: Spring Security debe rechazar también la solicitud directa. La evidencia de redirección es la captura de destino y el recorrido confirmado por el usuario.

---

## Diapositiva 12 · CRUD: crear, consultar, editar y eliminar

### Cómo explicarla

La prueba creó Omar Courtz con capacidad 100. Después modificó la capacidad a 20 y confirmó la eliminación. El evento desapareció del listado. Las capturas muestran las respuestas de la aplicación durante el recorrido.

### Idea que debes recordar

Alta = POST; consulta = GET; edición = PUT; eliminación = DELETE.

### Pregunta técnica

**{q}**

Después de que la API confirme el resultado. La interfaz no debe asumir éxito antes de recibir la respuesta.

### Ampliación para estudiar

Se creó el evento #7 con capacidad de 100; se editó a 20; se confirmó su eliminación y desapareció del listado. Mostrar las capturas y, si el profesor lo pide, repetir con un evento temporal sin ventas. No eliminar eventos usados para otras pruebas.

---

## Diapositiva 13 · Una compra que vuelve desde la API

### Cómo explicarla

La prueba registró una entrada para JUNGLE y recibió la confirmación #7. Angular envió evento y cantidad con JWT. El backend identificó al usuario, validó disponibilidad y guardó la compra. Mis entradas recuperó el registro y siguió mostrándolo tras recargar.

### Idea que debes recordar

El usuario de la compra debe obtenerse de la identidad autenticada.

### Pregunta técnica

**{q}**

No. Confirma que la aplicación recupera la entrada tras recargar. Un reinicio del backend requiere una comprobación distinta; una consulta SQL verifica directamente el registro.

### Ampliación para estudiar

Angular envía evento y cantidad con JWT. El backend determina la identidad, valida el evento y la disponibilidad, registra la entrada y devuelve la confirmación. No se realiza un cobro. Después se consulta /api/entradas/mis. El usuario confirmó que la entrada permanece tras F5; esto no prueba por sí solo un reinicio del servidor.

---

## Diapositiva 14 · Integrar también es resolver fallos

### Cómo explicarla

Se probaron dos situaciones diferentes: un correo sin @ se bloquea en el formulario; una contraseña incorrecta con correo válido produce un error de la API. La interfaz traduce el resultado en un mensaje comprensible.

### Idea que debes recordar

400: datos. 401: credencial. 403: permiso. 404: recurso.

### Pregunta técnica

**{q}**

El primero puede detener el envío sin solicitud HTTP. El segundo llega como respuesta del servidor y puede revisarse en Network.

### Ampliación para estudiar

La captura muestra credenciales incorrectas. Distinguir validación local de error HTTP: un correo sin @ se bloquea antes de enviar; una contraseña incorrecta con correo válido llega al backend. Para depurar: Network del navegador, logs de Spring y consulta de MySQL. Bloquear el botón evita repeticiones desde UI, pero no reemplaza transacciones en el servidor.

---

## Diapositiva 15 · La interfaz no decide el aforo

### Cómo explicarla

El backend verifica los cupos dentro de una transacción. PESSIMISTIC_WRITE bloquea el registro del evento para coordinar operaciones concurrentes. También se impide reducir la capacidad por debajo de las entradas ya vendidas.

### Idea que debes recordar

La disponibilidad definitiva se comprueba en el servidor.

### Pregunta técnica

**{q}**

Un conjunto de operaciones tratado como una unidad: se confirma o se revierte según las condiciones de fallo. El bloqueo coordina operaciones que compiten por el mismo evento.

### Ampliación para estudiar

La compra usa transacción y bloqueo PESSIMISTIC_WRITE sobre el evento para serializar compras que compiten por el mismo aforo. El aislamiento indicado en el proyecto es READ_COMMITTED. La capacidad no puede reducirse por debajo de lo ya vendido. Las pruebas concurrentes están en registros previos: no se reejecutaron durante el recorrido manual de esta sesión.

---

## Diapositiva 16 · Cuando algo falla, seguir el recorrido

### Cómo explicarla

El diagnóstico empieza en Network: URL, método, datos y respuesta. Continúa en los logs de Spring Boot y, cuando corresponde, en MySQL. El contrato de la API debe mantener coherencia en endpoints, campos, tipos y códigos de respuesta.

### Idea que debes recordar

Navegador → servidor → base de datos.

### Pregunta técnica

**{q}**

CORS regula las solicitudes del navegador entre orígenes distintos. En desarrollo, el proxy reenvía /api al backend; no sustituye JWT ni la autorización.

### Ampliación para estudiar

CORS es una política del navegador para solicitudes entre orígenes distintos. En desarrollo el proxy /api envía al backend; la URL relativa evita que el navegador llame directamente a otro origen. Si frontend y API se publican con orígenes distintos se necesita configuración CORS autorizada. El proxy no desactiva la seguridad ni sustituye JWT.

---

## Diapositiva 17 · Código, documentación y evidencias

### Cómo explicarla

La entrega incluye informe, backend, frontend, scripts SQL, colección Postman, capturas y README. La colección JSON prueba la API sin interfaz. Las capturas documentan recorridos completos desde Angular. Son evidencias complementarias.

### Idea que debes recordar

Distinguir pruebas realizadas del contenido de registros previos.

### Pregunta técnica

**{q}**

Se comprobaron manualmente login, compra, consulta, CRUD, validaciones y protección de rutas. Los registros automatizados previos se conservaron; no se volvió a ejecutar la colección Postman durante ese recorrido.

### Ampliación para estudiar

La colección Postman es un JSON importable, no una captura. Las imágenes muestran las pruebas en Angular. Hay registros previos automatizados en la entrega, pero no decir que se reejecutaron ahora. PDF y Word contienen las 14 secciones; README incluye variables de PowerShell. No es requisito principal desplegar en nube para este avance.

---

## Diapositiva 18 · Un recorrido que puedes demostrar

### Cómo explicarla

El avance integra navegación, formularios, servicios, seguridad y persistencia. Angular guía al usuario; Spring Boot valida identidad, permisos y negocio; MySQL conserva los registros. La demostración conecta estas capas mediante escenarios de éxito y error.

### Idea que debes recordar

Cerrar con el resultado integrado y ofrecer mostrar el código.

### Pregunta técnica

**{q}**

app.routes.ts, auth.guard.ts, servicios, shared/http.ts, event-form.page.ts, SecurityConfig.java y EntradaServiceImpl.java.

### Ampliación para estudiar

Cerrar con la integración demostrada. Si hay preguntas, abrir rutas, servicios, formularios, interceptor, guard y EntradaServiceImpl. Pendiente de comprobación manual adicional: que una segunda cuenta no vea la compra de la primera. Perfil, pagos reales y despliegue final quedan fuera del alcance solicitado. No afirmar que cada técnica de clase es obligatoria: FormArray, PATCH y rutas hijas son opciones.

---

## Repaso final en un minuto

Explica una compra completa: componente → formulario → servicio → HTTP con JWT → Spring Security → controller → servicio transaccional → repositorio → MySQL → respuesta → interfaz.

No confundas: ruta con endpoint; autenticación con autorización; validación local con error HTTP; recarga con reinicio; colección Postman con capturas de navegador.

## Archivos para ubicar durante la exposición

- `app.routes.ts`: rutas.
- `guards/auth.guard.ts`: acceso autenticado y ADMIN.
- `components/event-card.component.ts`: input y output.
- `pages/event-form.page.ts`: formulario y validación.
- `services/api.service.ts`: endpoints y HttpClient.
- `services/auth.service.ts`: sesión.
- `shared/http.ts`: interceptor y errores.
- `SecurityConfig.java`: seguridad HTTP.
- `EntradaServiceImpl.java`: compra y reglas de negocio.