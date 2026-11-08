# Lambda con Docker

Cuando las dependencias no caben en un zip o necesitan paquetes de sistema.

---

# Ventajas

- Imágenes de hasta **10 GB**, frente a 250 MB del zip descomprimido.
- Puedes instalar utilidades de sistema.
- Pruebas locales idénticas al entorno real.
- Las imágenes base oficiales incluyen el cliente de runtime.

Ficheros necesarios: `app.py`, `Dockerfile` y `requirements.txt`.

---

# Los ficheros

```python
# app.py
def handler(event, context):
    return "Hola"
```

```dockerfile
FROM public.ecr.aws/lambda/python:3.14

COPY requirements.txt ${LAMBDA_TASK_ROOT}
RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt --target "${LAMBDA_TASK_ROOT}"

COPY app.py ${LAMBDA_TASK_ROOT}

CMD ["app.handler"]
```

---

# Probar en local

```bash
docker build --platform linux/amd64 --provenance=false -t miax-lambda .
docker run --rm -p 9000:8080 miax-lambda
```

En otra terminal:

```bash
curl -X POST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

`--provenance=false` evita un formato de imagen que Lambda rechaza.

---

# Desplegar

```bash
aws ecr create-repository --repository-name miax-lambda --region {{region}}

aws ecr get-login-password --region {{region}} \
  | docker login --username AWS --password-stdin {{account}}.dkr.ecr.{{region}}.amazonaws.com

docker tag miax-lambda:latest {{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-lambda:latest
docker push {{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-lambda:latest
```

::: demo Crear la función
1. Abre [Crear función](aws:lambda-create).
2. Elige **Container image**.
3. Nombre: `miax-docker`.
4. Pulsa **Browse images** y selecciona `miax-lambda:latest`.
5. Pulsa **Create function** y pruébala en **Test**.
:::

Para actualizarla tras subir una imagen nueva:

```bash
aws lambda update-function-code \
  --function-name miax-docker \
  --image-uri {{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-lambda:latest
```

---

# Ejercicio

::: ejercicio Función con imagen
1. Crea los tres ficheros.
2. Prueba la imagen en local.
3. Súbela a ECR.
4. Crea la función desde la imagen.
5. Cambia el mensaje, sube la imagen y actualiza la función.
:::
