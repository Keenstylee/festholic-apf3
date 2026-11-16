-- Datos iniciales para mi proyecto Festholic.
-- Fuente de consulta: API externa de eventos (GET).
-- Conservo nombre, lugar, fecha e imagen; configuro capacidad 100 solo para las pruebas académicas.
-- Ejecuto después de iniciar el backend actualizado para que exista imagen_url.
-- No borra ni modifica registros existentes.
USE festholic;
SET NAMES utf8mb4;
INSERT INTO evento (nombre,lugar,fecha,capacidad,activo,imagen_url)
SELECT 'JUNGLE - World Tour 2027','MULTIESPACIO COSTA 21 - SAN MIGUEL - LIMA','2027-03-24',100,true,'https://cdn.teleticket.com.pe/images/eventos/vel013_rs.jpg'
WHERE NOT EXISTS (SELECT 1 FROM evento WHERE nombre='JUNGLE - World Tour 2027' AND fecha='2027-03-24');
INSERT INTO evento (nombre,lugar,fecha,capacidad,activo,imagen_url)
SELECT 'SIMPLE PLAN EN LIMA','MULTIESPACIO COSTA 21 - SAN MIGUEL - LIMA','2027-05-06',100,true,'https://cdn.teleticket.com.pe/images/eventos/gls003_rs.jpg'
WHERE NOT EXISTS (SELECT 1 FROM evento WHERE nombre='SIMPLE PLAN EN LIMA' AND fecha='2027-05-06');
INSERT INTO evento (nombre,lugar,fecha,capacidad,activo,imagen_url)
SELECT 'SLIPKNOT EN LIMA','Estadio Nacional - LIMA','2027-09-14',100,true,'https://cdn.teleticket.com.pe/images/eventos/csi047_rs.jpg'
WHERE NOT EXISTS (SELECT 1 FROM evento WHERE nombre='SLIPKNOT EN LIMA' AND fecha='2027-09-14');
