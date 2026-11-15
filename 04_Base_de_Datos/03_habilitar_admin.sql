-- Primero registrar la cuenta desde Angular /registro.
-- Sustituir el correo por la cuenta del responsable y ejecutar en Workbench.
USE festholic;
UPDATE usuario SET rol = 'ADMIN' WHERE email = 'tu_correo@ejemplo.com';
SELECT id, nombre, email, rol FROM usuario;
-- Cerrar sesión y volver a ingresar en Angular para actualizar la interfaz.
-- El registro público siempre asigna CLIENTE; no se puede solicitar ADMIN desde Angular.
