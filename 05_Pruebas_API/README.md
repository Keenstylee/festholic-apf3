# Pruebas APF3

Importar Festholic_APF3.postman_collection.json. Configurar correo y clave de ADMIN ya habilitado por SQL. Usar un correo CLIENTE nuevo en cada ejecución; cambiar fechaEvento por una fecha futura. Ejecutar en orden. La colección guarda tokens solo en variables locales: no compartir una exportación con valores actuales.

La colección APF2 se conserva como antecedente. verificar_integracion.py prueba también concurrencia y aislamiento contra una API real: configurar APF3_ADMIN_EMAIL y APF3_ADMIN_PASSWORD. Crea datos de prueba con correos únicos y conserva el evento comprado para comprobar persistencia. No borra datos previos.
