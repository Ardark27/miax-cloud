# Amazon ECR

Tu registro privado de imágenes Docker.

---

# Qué es ECR

::: flow
Dockerfile -> docker build -> Imagen -> docker push -> Amazon ECR -> Lambda o ECS
:::

- Registro de imágenes gestionado, seguro y privado por defecto.
- Se integra con IAM y los demás servicios de AWS.
- Necesitas Docker, la CLI con sesión iniciada y permisos sobre ECR.

---

# Crear el repositorio

::: demo Desde la consola
1. Abre [ECR](aws:ecr) y pulsa **Create repository**.
2. Nombre: `miax-suma`.
3. Crea el repositorio y copia su **URI**.
:::

O desde la CLI:

```bash
aws ecr create-repository --repository-name miax-suma --region {{region}}
```

---

# Construir y subir

```bash
# 1. Iniciar sesión de Docker en tu registro
aws ecr get-login-password --region {{region}} \
  | docker login --username AWS --password-stdin {{account}}.dkr.ecr.{{region}}.amazonaws.com

# 2. Construir con el nombre del repositorio
docker build --platform linux/amd64 \
  -t {{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-suma:latest .

# 3. Subir
docker push {{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-suma:latest
```

El login debe responder `Login Succeeded`. Caduca a las 12 horas.

En ordenadores Apple Silicon, `--platform linux/amd64` evita imágenes incompatibles.

---

# El proyecto

```dockerfile
FROM python:3.14-slim

WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ .

EXPOSE 8080
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
```

::: aviso Fichero `Dockerfile`, con mayúscula
En Linux es sensible a mayúsculas. Si se llama de otra forma, necesitas `docker build -f nombre`.
:::

---

# Ejercicio

::: ejercicio Publica tu imagen
1. Prepara el API del ejemplo.
2. Construye la imagen y pruébala con `docker run -p 8080:8080`.
3. Crea un repositorio en ECR.
4. Sube la imagen.
5. Encuéntrala en la [consola de ECR](aws:ecr).
:::

::: limpieza Coste
ECR cobra por GB almacenado. Borra las imágenes y repositorios que no uses, o añade una **lifecycle policy**.
:::
