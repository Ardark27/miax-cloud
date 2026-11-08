# Primeros pasos con Lambda

Ejecutar código sin administrar servidores.

---

# Qué es Lambda

- Subes una función; AWS gestiona servidores, sistema operativo, escalado y logs.
- Se paga por petición y por tiempo de ejecución según la memoria.
- Tiene un [nivel gratuito](https://aws.amazon.com/lambda/pricing/) mensual permanente.

| Límite | Valor |
|---|---|
| Duración máxima | 15 minutos |
| Memoria | 128 MB a 10.240 MB |
| Disco temporal `/tmp` | 512 MB a 10 GB |
| Paquete .zip | 50 MB directo, 250 MB descomprimido |
| Imagen de contenedor | 10 GB |

::: novedad Runtimes
Python **3.14** y 3.13 son las versiones recomendadas. Python 3.8, 3.9 y 3.10 ya han llegado al fin de soporte. [Calendario de runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).
:::

---

# Vocabulario

| Término | Significado |
|---|---|
| **Función** | Tu código y su configuración |
| **Trigger** | Lo que invoca la función |
| **Evento** | JSON con los datos de la invocación |
| **Controlador** | Método que Lambda ejecuta |
| **Rol de ejecución** | Permisos que tiene la función |

::: flow
Trigger :: S3, cron, HTTP -> Evento JSON -> Tu función -> Logs en CloudWatch
:::

---

# Casos de uso

- **Procesado de datos**: al llegar un CSV a S3, transformarlo.
- **Backends web**: una petición HTTP invoca una función.
- **Procesos periódicos**: ejecutar algo a una hora, sin máquina encendida.

::: nota Nombre nuevo
En la documentación actual verás «Lambda Event Functions», que es lo que usamos aquí. Las nuevas «Web Functions» son servidores HTTP y, por ahora, solo admiten Node.js.
:::

---

# Crear una función

::: demo Primera función
1. Abre [Crear función](aws:lambda-create).
2. Deja **Author from scratch**.
3. **Function name**: `miax-hola`.
4. **Runtime**: Python 3.14.
5. Pulsa **Create function**.
6. Revisa el código en la pestaña **Code**.
:::

::: demo Probarla
1. Abre la pestaña **Test**.
2. Deja la plantilla `hello-world` y pulsa **Test**.
3. Despliega los detalles y lee el resultado.
4. Lee la línea `REPORT` del log: duración y memoria usada.
5. Abre **Monitor** → **View CloudWatch logs**, o ve a [los grupos de logs](aws:cw-logs).
:::

::: aviso Pulsa Deploy
Los cambios en el editor no se ejecutan hasta pulsar **Deploy**.
:::

---

# El controlador

```python
def lambda_handler(event, context):
    print("Recibido:", event)
    return {"mensaje": "Hola"}
```

- El handler configurado, `lambda_function.lambda_handler`, es `fichero.función`.
- `event`: normalmente un `dict` con los datos.
- `context`: información de la ejecución.
- `print` y `logging` llegan a CloudWatch.
- El valor devuelto debe poder serializarse con `json.dumps`.

---

# El objeto context

```python
import time


def lambda_handler(event, context):
    print("Grupo de logs:", context.log_group_name)
    print("Stream de logs:", context.log_stream_name)
    print("ID de petición:", context.aws_request_id)
    print("Memoria (MB):", context.memory_limit_in_mb)
    time.sleep(1)
    print("Tiempo restante (ms):", context.get_remaining_time_in_millis())
```

---

# Cómo escala

- Cada invocación simultánea usa un entorno de ejecución separado.
- Si llegan más peticiones, Lambda crea más entornos, hasta el límite de concurrencia.
- Un entorno nuevo tarda un poco en arrancar: es el **arranque en frío**.
- Los entornos se reutilizan: lo definido fuera del controlador se conserva.

::: novedad Facturación
Desde agosto de 2025 también se factura la fase de inicialización de las funciones gestionadas.
:::

---

# Ejercicio

::: ejercicio Función con fecha
1. Crea una función con el runtime Python 3.14.
2. Modifícala para que imprima la fecha de ejecución.
3. Imprime también `event` y `context`.
4. Pulsa **Deploy** y pruébala.
5. Busca la salida en CloudWatch.
:::
