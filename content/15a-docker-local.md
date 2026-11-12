# Docker en tu ordenador

Instalar Docker Desktop para construir y probar imágenes en local.

---

# Qué es Docker Desktop

- Una aplicación que instala en tu ordenador todo lo necesario para usar Docker: el motor, la CLI `docker` y una interfaz gráfica.
- En Windows y macOS, los contenedores Linux se ejecutan dentro de una pequeña máquina virtual que Docker Desktop gestiona por ti.
- Lo usaremos para construir imágenes, probarlas en local y subirlas a ECR.

| Sistema | Qué instalar | Guía oficial |
|---|---|---|
| **Windows 10 o 11** | Docker Desktop con WSL 2 | [Instalar en Windows](https://docs.docker.com/desktop/setup/install/windows-install/) |
| **macOS** | Docker Desktop para tu procesador | [Instalar en Mac](https://docs.docker.com/desktop/setup/install/mac-install/) |
| **Linux** | Docker Engine (Desktop es opcional) | [Instalar Docker Engine](https://docs.docker.com/engine/install/) |

::: nota Licencia
Docker Desktop es gratuito para uso personal, educativo y para empresas pequeñas (menos de 250 empleados y menos de 10 M$ de ingresos). En empresas más grandes requiere una suscripción de pago.
:::

Si no puedes instalarlo, usa Docker en una instancia EC2: lo vemos en la [lección siguiente](#/15-docker-ec2).

---

# Windows: preparar WSL 2

Docker Desktop usa **WSL 2** (el subsistema de Linux para Windows). Necesitas Windows 10 22H2 o Windows 11, 64 bits, y la virtualización activada.

1. Abre **PowerShell como administrador** (clic derecho en el menú Inicio → **Terminal (Administrador)**).
2. Ejecuta `wsl --install`.
3. Si ya lo tenías, ejecuta `wsl --update`.
4. **Reinicia** el ordenador.
5. Comprueba en PowerShell con `wsl --version` que la versión de WSL es 2.x.

Si `wsl --install` dice que la virtualización no está habilitada, actívala en la BIOS/UEFI (opción **Intel VT-x**, **Intel Virtualization Technology** o **AMD-V / SVM**).

---

# Windows: instalar Docker Desktop

1. Descarga **Docker Desktop for Windows - x86_64** desde la [guía oficial](https://docs.docker.com/desktop/setup/install/windows-install/). Si tu equipo es ARM (por ejemplo, Surface con Snapdragon), elige la versión ARM.
2. Ejecuta `Docker Desktop Installer.exe`.
3. Deja marcada **Use WSL 2 instead of Hyper-V**.
4. Pulsa **Ok** y espera a que termine. Pulsa **Close and restart** si te lo pide.
5. Abre **Docker Desktop** desde el menú Inicio y acepta el acuerdo de servicio.
6. Puedes saltarte el inicio de sesión: no hace falta cuenta de Docker para el curso.
7. Espera a que el indicador de abajo a la izquierda diga **Engine running**.

---

# macOS: instalar Docker Desktop

Comprueba tu procesador en el menú Apple → **Acerca de este Mac**: **Chip Apple M1/M2/M3/M4** (Apple silicon) o **Procesador Intel**.

1. Descarga el `.dmg` correspondiente a tu procesador desde la [guía oficial](https://docs.docker.com/desktop/setup/install/mac-install/).
2. Ábrelo y arrastra **Docker** a la carpeta **Aplicaciones**.
3. Abre Docker desde **Aplicaciones** y confirma que quieres abrirlo.
4. Acepta el acuerdo de servicio y la configuración recomendada; te pedirá la contraseña del Mac.
5. Puedes saltarte el inicio de sesión.
6. Espera a que el icono de la ballena en la barra de menús deje de moverse.

::: aviso Mac con Apple silicon
Tu Mac es ARM y AWS usa por defecto x86_64. Construye las imágenes para AWS con `docker build --platform linux/amd64`, como verás en la lección de ECR.
:::

---

# Linux: Docker Engine

En Linux no necesitas Docker Desktop: basta con **Docker Engine**. Sigue la [guía de tu distribución](https://docs.docker.com/engine/install/). En Ubuntu, por ejemplo:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER     # usar docker sin sudo
```

Cierra la sesión y vuelve a entrar para que se aplique el grupo `docker`.

---

# Comprobar la instalación

::: ejercicio Docker funciona
1. Abre una **terminal nueva** (en Windows, PowerShell; no hace falta que sea de administrador).
2. Ejecuta `docker --version`.
3. Ejecuta `docker run hello-world`: debe imprimir `Hello from Docker!`.
4. Ejecuta `docker run -it --rm python:3.14-slim python --version`.
5. Abre Docker Desktop y busca la imagen `hello-world` en **Images**.
:::

```text
$ docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
...
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

---

# Si algo falla

| Error | Causa | Solución |
|---|---|---|
| `docker: command not found` o `no se reconoce` | La terminal se abrió antes de instalar | Abre una terminal nueva o reinicia |
| `Cannot connect to the Docker daemon` / `error during connect` | Docker Desktop no está abierto | Ábrelo y espera a **Engine running** |
| `WSL 2 installation is incomplete` / `WSL needs updating` | WSL antiguo o sin instalar | `wsl --update` como administrador y reinicia |
| `Virtualization support not detected` | Virtualización desactivada | Actívala en la BIOS/UEFI |
| `permission denied ... docker.sock` (Linux) | Tu usuario no está en el grupo `docker` | `sudo usermod -aG docker $USER` y vuelve a entrar |
| Docker Desktop no arranca en un ordenador del trabajo | Políticas de la empresa | Usa [Docker en EC2](#/15-docker-ec2) |

Docker Desktop consume bastante memoria. Ciérralo cuando no lo uses.
