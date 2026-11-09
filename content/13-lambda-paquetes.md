# Empaquetado y buenas prácticas

Cómo llevar tu código y sus librerías a Lambda.

---

# Dos formatos

| Formato | Límite | Cuándo |
|---|---|---|
| **Archivo .zip** | 50 MB directo, 250 MB descomprimido | Código y dependencias ligeras |
| **Imagen de contenedor** | 10 GB | Dependencias pesadas o de sistema |

boto3 ya viene incluido en el runtime. AWS recomienda fijar la versión e incluirlo en el paquete si tu código depende de una concreta.

---

# Zip sin dependencias

```bash
mkdir mi-funcion && cd mi-funcion
# guarda aquí lambda_function.py
zip paquete.zip lambda_function.py

aws lambda update-function-code \
  --function-name miax-hola \
  --zip-file fileb://paquete.zip
```

::: nota En Windows
Usa `Compress-Archive lambda_function.py paquete.zip` en PowerShell.
:::

---

# Zip con dependencias

Lambda corre en Linux. Si instalas en Windows o Mac, o con otra versión de Python, las librerías compiladas como pandas fallarán.

::: novedad Pide el binario adecuado
En vez de empaquetar tu entorno virtual, indica a pip la plataforma de destino.
:::

```bash
pip install \
  --platform manylinux2014_x86_64 \
  --target package \
  --implementation cp \
  --python-version 3.14 \
  --only-binary=:all: \
  pandas

cd package
zip -r ../paquete.zip .
cd ..
zip paquete.zip lambda_function.py
```

La arquitectura de la función debe ser x86_64. Para arm64 usa `manylinux2014_aarch64`.

---

# Paquetes grandes: vía S3

Por encima de 50 MB, súbelo a un bucket primero:

```bash
aws s3 mb s3://miax-{{alias}}-lambda --region {{region}}
aws s3 cp paquete.zip s3://miax-{{alias}}-lambda/

aws lambda update-function-code \
  --function-name miax-pandas \
  --s3-bucket miax-{{alias}}-lambda \
  --s3-key paquete.zip
```

::: nota Una alternativa para pandas
AWS publica una capa gestionada, **AWS SDK for pandas**, que se añade desde **Layers** en la página de la función. Así tu paquete solo lleva tu código.
:::

Si superas 250 MB descomprimidos, usa una imagen de contenedor.

---

# Permisos: el rol de ejecución

- Toda función tiene un rol que define lo que puede hacer.
- El rol por defecto solo permite escribir logs.
- Para acceder a S3 u otros servicios, hay que añadir permisos.

::: demo Dar permisos a la función
1. Abre tu función desde [Lambda](aws:lambda).
2. Ve a **Configuration** → **Permissions**.
3. Pulsa el nombre del rol: se abre IAM.
4. **Add permissions** → **Attach policies** y añade la que necesites.
:::

---

# Dónde está el rol

![Rol de ejecución en Configuration, Permissions](assets/img/13-lambda-paquetes/role.png)

<p class="pie">Captura de una versión anterior de la consola: la pantalla actual puede variar.</p>

---

# Configuración

En **Configuration** → **General configuration** ajustamos:

- **Memory**: también aumenta la CPU disponible.
- **Timeout**: por defecto son **3 segundos**. Súbelo para procesar ficheros.

En **Configuration** → **Environment variables** añadimos variables:

```python
import os

BUCKET = os.environ["BUCKET"]
```

---

# Memoria y timeout

![Pantalla Edit basic settings con memoria y timeout](assets/img/13-lambda-paquetes/memory.png)

<p class="pie">Captura de una versión anterior de la consola: la pantalla actual puede variar.</p>

---

# Buenas prácticas

- Separa el controlador de la lógica de negocio: será más fácil de probar.
- Pasa la configuración por variables de entorno.
- Crea clientes de boto3 **fuera** del controlador para reutilizarlos.
- Mantén el paquete pequeño.
- Limita los permisos del rol.

```python
import os

import boto3

s3 = boto3.client("s3")          # se reutiliza entre invocaciones
BUCKET = os.environ["BUCKET"]


def procesar(datos):
    return datos.upper()


def lambda_handler(event, context):
    s3.put_object(Bucket=BUCKET, Key="salida.txt", Body=procesar("hola"))
    return {"ok": True}
```

---

# Ejercicios

::: ejercicio Función con pandas
1. Crea una función que use pandas.
2. Crea el paquete .zip con las dependencias para Linux.
3. Crea un bucket y sube el paquete.
4. Crea o actualiza la función indicando la ruta en S3.
5. Sube el timeout y la memoria, y pruébala.
:::

::: ejercicio Datos desde el API de BME
1. Crea una función que descargue datos del Santander desde el API de los algoritmos de BME.
2. Empaqueta las librerías necesarias.
3. Guarda el API key en una variable de entorno.
4. Guarda un CSV en S3 llamado `Santander_{HH_MM_SS_DD_MM_YYYY}.csv`.
5. Añade al rol los permisos necesarios.
:::
