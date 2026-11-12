# Cómo usar Docker

Las bases de Docker que usamos en el curso: imágenes, contenedores, `Dockerfile` y los comandos del día a día.

Para instalarlo, consulta [Docker en tu ordenador](#/15a-docker-local).

---

# Imagen y contenedor

::: flow
Dockerfile :: receta -> docker build -> Imagen :: plantilla de solo lectura -> docker run -> Contenedor :: proceso en marcha
:::

| Concepto | Qué es | Analogía |
|---|---|---|
| **Imagen** | Sistema de ficheros con tu código, sus librerías y el comando de arranque | Una clase |
| **Contenedor** | Una ejecución de una imagen, aislada del resto | Un objeto de esa clase |
| **Registro** | Almacén de imágenes: Docker Hub, ECR... | Un repositorio de Git |

- De una imagen puedes lanzar muchos contenedores.
- El contenedor lleva todo lo que necesita: funciona igual en tu portátil, en EC2, en ECS o en Lambda.
- Lo que escribe un contenedor se pierde al borrarlo, salvo que uses volúmenes.

---

# Ejecutar imágenes de otros

```bash
docker run hello-world                              # descarga la imagen y la ejecuta
docker run -it --rm python:3.14-slim python         # un Python interactivo
docker run -it --rm python:3.14-slim bash           # una terminal dentro del contenedor
```

| Opción | Significado |
|---|---|
| `-it` | Interactivo, con terminal |
| `--rm` | Borra el contenedor al salir |
| `-d` | En segundo plano |
| `-p 8080:8080` | Puerto del ordenador `:` puerto del contenedor |
| `-e CLAVE=valor` | Variable de entorno |
| `--name api` | Nombre para referirte a él |

`python:3.14-slim` es `nombre:etiqueta`. Sin etiqueta se usa `latest`. Las imágenes oficiales están en [Docker Hub](https://hub.docker.com/).

---

# El Dockerfile

El API de suma del curso ([ejemplos/api-suma](ejemplos/LEEME.txt)):

```dockerfile
# Imagen de partida
FROM python:3.14-slim
# Carpeta de trabajo dentro de la imagen
WORKDIR /code
# Primero, solo las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Después, el código
COPY src/ .
# Documenta el puerto que usa la aplicación
EXPOSE 8080
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
```

Los comentarios van en su propia línea: al final de una instrucción, Docker los tomaría como argumentos.

| Instrucción | Cuándo se ejecuta |
|---|---|
| `FROM`, `WORKDIR`, `COPY`, `RUN` | Al **construir** la imagen |
| `CMD` | Al **arrancar** cada contenedor |

El fichero se llama `Dockerfile`, con mayúscula y sin extensión.

---

# Capas y caché

Cada instrucción crea una **capa**. Al reconstruir, Docker reutiliza las capas que no han cambiado.

- Por eso se copia `requirements.txt` y se instala **antes** de copiar el código: si solo cambias el código, `pip install` no se repite.
- Si copiases todo al principio, cualquier cambio volvería a instalar las librerías.

Un fichero `.dockerignore` evita copiar a la imagen lo que no hace falta:

```text
.venv/
__pycache__/
.git/
.env
*.pem
```

Así la imagen es más pequeña y no acaban dentro secretos ni claves.

---

# Construir y ejecutar tu imagen

```bash
cd ejemplos/api-suma
docker build -t miax-suma .                  # -t: nombre de la imagen. ".": carpeta con el Dockerfile
docker run --rm -p 8080:8080 miax-suma       # abre http://localhost:8080/docs
```

`--host 0.0.0.0` en el `CMD` es necesario: con `127.0.0.1`, el API solo escucharía dentro del contenedor y no llegarías desde el navegador.

Para AWS, si tu ordenador es ARM (Mac con Apple silicon):

```bash
docker build --platform linux/amd64 -t miax-suma .
```

---

# Gestionar contenedores e imágenes

```bash
docker run -d -p 8080:8080 --name api miax-suma    # en segundo plano
docker ps                    # contenedores en marcha (-a: también los parados)
docker logs -f api           # ver su salida
docker exec -it api bash     # entrar en un contenedor en marcha
docker stop api              # pararlo
docker rm api                # borrarlo

docker images                # imágenes locales
docker rmi miax-suma         # borrar una imagen
docker system prune          # borrar contenedores parados e imágenes sin usar
```

Todo esto también se ve en Docker Desktop, en **Containers** e **Images**.

---

# Variables de entorno y volúmenes

Configuración sin reconstruir la imagen:

```bash
docker run --rm -e MODO=test -p 8080:8080 miax-suma
docker run --rm --env-file .env -p 8080:8080 miax-suma
```

Un **volumen** monta una carpeta de tu ordenador dentro del contenedor:

```bash
docker run --rm -v "$(pwd)/datos:/datos" python:3.14-slim ls /datos
```

En el curso no usaremos volúmenes: en AWS los datos van a S3 o a una base de datos.

---

# Del ordenador a AWS

::: flow
docker build -> docker tag :: nombre del registro -> docker push -> ECR -> ECS, Lambda o EC2
:::

```bash
docker tag miax-suma {{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-suma:latest
docker push {{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-suma:latest
```

El nombre completo de la imagen indica a qué registro se sube. Lo vemos en detalle en [Amazon ECR](#/16-ecr).

---

# Ejercicio: tu primera imagen

::: ejercicio Contenedor del API de suma
1. Entra en `ejemplos/api-suma` y construye la imagen con `docker build -t miax-suma .`.
2. Arráncala con `docker run --rm -p 8080:8080 miax-suma` y abre `http://localhost:8080/docs`.
3. Prueba `http://localhost:8080/suma?a=1&b=2`.
4. Añade un método `/resta`, reconstruye y fíjate en qué capas se reutilizan.
5. Arráncala en segundo plano con `--name api`, mira sus logs con `docker logs` y entra con `docker exec -it api bash`.
6. Para y borra el contenedor, y borra la imagen.
:::
