USE festholic;

-- Modelo y claves foráneas generados por Hibernate.
SHOW TABLES;
SHOW CREATE TABLE entrada;

-- Persistencia: ejecutar después de crear registros y nuevamente tras reiniciar la API.
SELECT id, nombre, fecha, capacidad, activo FROM evento ORDER BY id;
SELECT id, nombre, email, rol FROM usuario ORDER BY id;
SELECT id, usuario_id, evento_id, cantidad, estado, fecha_compra FROM entrada ORDER BY id;

-- Cupos vendidos por evento (equivalente de verificación a la consulta JPQL).
SELECT e.id, e.nombre, e.capacidad,
       COALESCE(SUM(CASE WHEN en.estado = 'ACTIVA' THEN en.cantidad ELSE 0 END), 0) AS vendidas
FROM evento e
LEFT JOIN entrada en ON en.evento_id = e.id
GROUP BY e.id, e.nombre, e.capacidad
ORDER BY e.id;

-- Integridad referencial: cambie usuario_id y evento_id por IDs inexistentes.
-- Es una prueba que DEBE fallar con el error MySQL 1452; no ejecutarla sobre datos reales.
-- INSERT INTO entrada (usuario_id, evento_id, cantidad, estado, fecha_compra)
-- VALUES (999999, 999999, 1, 'ACTIVA', NOW());
