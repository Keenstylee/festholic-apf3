# Adaptación visual de Live Fest Perú a Festholic

Referencias proporcionadas por el autor: entradas.html, evento.html y login.html. Se inspeccionaron como documentos de diseño; los scripts de la web comercial no se copiaron ni se ejecutaron.

| Referencia | Elemento adaptado | Implementación Angular |
|---|---|---|
| entradas.html | Atmósfera oscura de concierto, cabecera de marca, portada y catálogo de tarjetas | EventsPage, EventCardComponent, NavbarComponent |
| login.html | Acceso centrado, panel translúcido, campos oscuros y mostrar/ocultar contraseña | AuthPage, signal visible y formularios reactivos |
| evento.html | Banner de evento, ficha de información, selección en boleto y botones + / − | DetailPage, FormControl cantidad y cambiarCantidad |
| evento.html | Resumen de selección y confirmación | Datos del formulario y compra real POST /api/entradas |
| Entradas del negocio | Boleto con separación punteada y talón | TicketsPage muestra identificador, cantidad y estado reales |

## Identidad y recursos

Se mantiene Festholic como proyecto académico. Colores: morado #7C4DFF, rosado #F21E87, fondo #100B19 y texto #FAF7FF. Variables y mixins en shared/_tokens.scss; iluminación, transparencias y adaptación móvil en styles.scss.

Los archivos referencian videos, fotografías y CSS externos que no estaban adjuntos. El ambiente se recreó con luces y gradientes SASS; el proyecto no depende de esos recursos ausentes. Los boletos usan un código de barras puramente decorativo, sin afirmar validación QR o control de acceso.

## Funciones de esta adaptación

Login y registro JWT, roles, CRUD, compra propia y entradas siguen conectados a Spring Boot/MySQL. El selector impide bajar de 1 o superar la capacidad total; el backend determina el cupo restante real. Una cantidad inválida no envía la compra. Mostrar contraseña cambia únicamente la visibilidad del campo.

Google, recuperación de contraseña, precios, descuentos, noticias, WhatsApp y pagos Yape/Plin pertenecen al sitio comercial de referencia; no se incorporan como funciones simuladas del APF3.

## Verificación

- Compilación Angular en producción aprobada.
- 11 comprobaciones de flujo, paleta y compra real.
- 10 comprobaciones nuevas de contraseña, pestañas, cantidad, validación y móvil.
- Vistas comprobadas a 1440 px y 390 px.
- Contraste de texto blanco en botón morado: 4.81:1.
- Capturas 01–12 y PDF regenerados con el nuevo diseño.

## Ajuste del pie de página

Footer con fondo de ancho completo, contenedor alineado con la cartelera, tipografía de 14 px en los enlaces, columnas proporcionadas en escritorio y una columna en móvil. Navegación mediante RouterLink sin recarga de página. Se verificaron cuatro tamaños y el recorrido del enlace Mi cuenta. Ver footer_navegador.txt.
