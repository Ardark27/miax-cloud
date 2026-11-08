# Docker en EC2

Una alternativa si no puedes instalar Docker en tu ordenador.

---

# Instalación en Amazon Linux 2023

::: novedad Los comandos han cambiado
`yum` y `amazon-linux-extras` eran de Amazon Linux 2. En AL2023 se usa `dnf` y `systemctl`.
:::

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
```

Cierra la sesión y vuelve a entrar para aplicar el grupo. Después comprueba:

```bash
docker info
docker run -it --rm python:3.14-slim python --version
```

---

# Ejercicio

::: ejercicio API en un contenedor
1. Instala Docker en tu instancia EC2.
2. Crea un API con FastAPI y un método GET.
3. Escribe un `Dockerfile`, sin volúmenes.
4. Construye la imagen y pruébala en la instancia.
5. Abre el puerto en el [grupo de seguridad](aws:ec2-sg).
6. Comprueba el acceso desde tu ordenador.
:::

El ejemplo está en [ejemplos/api-suma](ejemplos/LEEME.txt).

::: nota Ejecutar la imagen
`docker run -p 8080:8080 miax-suma` publica el puerto del contenedor en la instancia.
:::
