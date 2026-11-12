# Disparadores: cron, S3 y HTTP

Las tres formas de invocar funciones que más usaremos.

---

# Qué puede invocar una función

![Lista de servicios disponibles como disparador de Lambda](assets/img/14-lambda-triggers/events.png)

<p class="pie">Captura de una versión anterior de la consola: la lista actual es más larga. Veremos EventBridge, S3 y API Gateway.</p>

---

# Programar con EventBridge Scheduler

EventBridge Scheduler es el servicio de AWS para ejecutar tareas programadas. Admite zonas horarias y ejecuciones únicas.

Expresiones de frecuencia o cron:

```text
rate(1 minute)
cron(0 8 ? * MON-FRI *)
```

Referencia: [tipos de programación](https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html).

::: aviso El cron de AWS tiene seis campos
`minuto hora día-mes mes día-semana año`. Uno de los dos campos de día debe ser `?`. Es distinto del crontab de Linux.
:::

---

# Demo: ejecución periódica

::: demo Programar una Lambda
1. Abre [EventBridge Scheduler](aws:scheduler) → **Create schedule**.
2. Nombre: `miax-cada-minuto`.
3. **Occurrence**: Recurring schedule. **Type**: Rate-based, `1 minutes`.
4. **Flexible time window**: Off.
5. **Target**: AWS Lambda **Invoke**, y elige tu función.
6. Deja que cree un rol nuevo y pulsa **Create schedule**.
7. Mira las ejecuciones en [CloudWatch Logs](aws:cw-logs).
:::

::: limpieza Para no dejarla corriendo
- Borra la programación en [EventBridge Scheduler](aws:scheduler).
:::

---

# Reaccionar a ficheros en S3

::: flow
Fichero nuevo :: bucket de entrada -> Evento S3 -> Lambda :: procesa -> Fichero :: bucket de salida
:::

```python
from urllib.parse import unquote_plus


def lambda_handler(event, context):
    registro = event["Records"][0]["s3"]
    bucket = registro["bucket"]["name"]
    # Las claves llegan codificadas: «mi fichero.csv» es «mi+fichero.csv»
    key = unquote_plus(registro["object"]["key"])
    print(bucket, key)
```

::: aviso Bucles infinitos y facturas
Si la función escribe en el mismo bucket que la dispara, se invocará sin fin. Usa **otro bucket**, o un prefijo distinto y filtros.
:::

---

# El evento de S3

```json
{
  "Records": [{
    "eventSource": "aws:s3",
    "awsRegion": "{{region}}",
    "eventTime": "1970-01-01T00:00:00.000Z",
    "eventName": "ObjectCreated:Put",
    "s3": {
      "bucket": {
        "name": "miax-{{alias}}-entrada",
        "arn": "arn:aws:s3:::miax-{{alias}}-entrada"
      },
      "object": {
        "key": "market_data.txt",
        "size": 1024,
        "eTag": "0123456789abcdef0123456789abcdef"
      }
    }
  }]
}
```

Nos interesan sobre todo `bucket.name` y `object.key`.

---

# Cómo encaja S3 con Lambda

![S3 notifica a Lambda, que usa su rol de ejecución](assets/img/14-lambda-triggers/push-s3-example-10.png)

---

# Demo: disparador S3

::: demo Conectar S3 con Lambda
1. Crea dos buckets en [S3](aws:s3): `miax-{{alias}}-entrada` y `miax-{{alias}}-salida`.
2. Abre tu función en [Lambda](aws:lambda) y pulsa **Add trigger**.
3. Elige **S3** y el bucket de entrada.
4. **Event types**: All object create events.
5. Marca el aviso de invocación recursiva y pulsa **Add**.
6. Añade al rol de la función acceso a S3.
7. Sube un fichero y mira el log en CloudWatch.
:::

---

# El disparador creado

![Función con S3 como disparador](assets/img/14-lambda-triggers/s3.png) ![Detalle del disparador S3](assets/img/14-lambda-triggers/s3_2.png)

<p class="pie">Captura de una versión anterior de la consola: la pantalla actual puede variar.</p>

---

# Exponer una función por HTTP

| Opción | Cuándo |
|---|---|
| **Function URL** | Lo más sencillo: una URL HTTPS para una función |
| **API Gateway HTTP API** | Varias rutas, autorización, dominios, barato |
| **API Gateway REST API** | Funciones avanzadas: claves de API, transformaciones |

El evento de una **HTTP API** (formato 2.0) incluye lo esencial:

```json
{
  "version": "2.0",
  "rawPath": "/suma",
  "queryStringParameters": { "a": "1", "b": "2" },
  "requestContext": { "http": { "method": "GET" } },
  "body": null
}
```

---

# API Gateway como disparador

![Función con API Gateway como disparador](assets/img/14-lambda-triggers/api_1.png)

<p class="pie">Captura de una versión anterior de la consola: la pantalla actual puede variar.</p>

---

# El API de suma, sin servidor

Los parámetros llegan como texto y `body` debe ser una cadena ([integración de Lambda con HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)):

```python
import json


def lambda_handler(event, context):
    params = event.get("queryStringParameters") or {}
    try:
        resultado = int(params["a"]) + int(params["b"])
    except (KeyError, ValueError):
        return {"statusCode": 400, "body": json.dumps({"error": "a y b deben ser enteros"})}
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"resultado": resultado}),
    }
```

::: demo Añadir API Gateway
1. Abre tu función en [Lambda](aws:lambda) y pulsa **Add trigger**.
2. Elige **API Gateway** → **Create a new API** → **HTTP API**.
3. **Security**: Open, solo para esta prueba.
4. Copia la URL de **API endpoint**.
5. Prueba `URL?a=1&b=2`.
6. Revisa la API en [API Gateway](aws:apigw).
:::

---

# Ejercicios

::: ejercicio Cada minuto
1. Crea una función que imprima la hora de ejecución.
2. Comprímela en un .zip y créala con la CLI (ver abajo).
3. Prográmala con EventBridge Scheduler.
4. Comprueba los logs y borra la programación.
:::

```bash
aws lambda create-function \
  --function-name miax-reloj \
  --runtime python3.14 \
  --handler lambda_function.lambda_handler \
  --role arn:aws:iam::{{account}}:role/NOMBRE_DEL_ROL \
  --zip-file fileb://paquete.zip
```

---

# Ejercicio: procesar ficheros

Descarga los datos: [market_data.txt](market_data/market_data.txt) (32 MB).

::: ejercicio Procesar market data
1. Crea buckets de entrada y salida, y el disparador S3.
2. Lee el fichero `market_data.txt` subido.
3. Conserva solo los tickers `SAN`, `TEF` e `IDX`.
4. Escribe un CSV con las columnas `VALOR,VOLUMEN,PRECIO,TIME` en el bucket de salida.
5. Ajusta memoria y timeout.
:::

Prueba primero el código en local. El fichero de entrada va separado por `;` y tiene muchas más columnas:

```text
FECHA;SECUENCIA;VALOR;VOLUMEN;PRECIO;...;HORAEJEC;...
20180319;2119807;A3M     ;2;7.7000;...;09:00:18.002;...
```

La salida debe quedar así:

```text
VALOR,VOLUMEN,PRECIO,TIME
SAN,1,5.41,2018-03-19 09:00:18.002
```

```python
df = pd.read_csv(
    f"s3://{bucket}/{key}",
    sep=";",
    usecols=["FECHA", "VALOR", "VOLUMEN", "PRECIO", "HORAEJEC"],
)
df["VALOR"] = df["VALOR"].str.strip()  # los tickers traen espacios
```

---

# Ejercicio: API HTTP

::: ejercicio API HTTP
1. Crea el método `suma` con Lambda y API Gateway.
2. Pruébalo con parámetros correctos e incorrectos.
:::

---

# Actividad de créditos: web con Lambda

![Ficha de la actividad de crear una aplicación web con Lambda, con premio de 20 dólares](assets/img/14-lambda-triggers/actividad-creditos.png)

---

# Ejercicio: web con Lambda

::: ejercicio Gana 20 $ con Lambda
1. En la [consola](aws:home), abre **Explore AWS**, filtra por **Earn AWS credits**, elige **Creación de una aplicación web con AWS Lambda** y pulsa **Iniciar actividad**.
2. Sigue sus pasos: crearás una función con una **Function URL**.
3. Abre la URL en el navegador y comprueba que responde.
4. Comprueba en **Explore AWS** que aparece como completada.
:::

::: limpieza Al terminar
- Borra la función en [Lambda](aws:lambda): su URL puede ser accesible desde Internet.
:::
