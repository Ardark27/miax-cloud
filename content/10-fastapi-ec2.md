# Primer API en EC2

Publicar un servicio accesible desde Internet.

---

# La aplicación

```python
# app.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/suma")
def suma(a: int, b: int) -> int:
    return a + b
```

---

# Abrir el puerto

::: demo Grupo de seguridad para el API
1. Abre [Lanzar instancia](aws:ec2-launch), `t3.micro` y Amazon Linux 2023.
2. En **Network settings**, deja SSH desde **My IP**.
3. Pulsa **Add security group rule**: tipo **Custom TCP**, puerto **8080**.
4. En origen elige **My IP** para probar, o **Anywhere** para que acceda otra persona.
5. Lanza la instancia.
:::

::: nota Si la instancia ya existe
Edita las reglas de entrada en [Security Groups](aws:ec2-sg).
:::

---

# Reglas de entrada

![Reglas de entrada para SSH y TCP 8080](assets/img/10-fastapi-ec2/ports_fasta_api_ec2.png)

<p class="pie">Captura de una versión anterior de la consola: la pantalla actual puede variar.</p>

---

# Python actual en la instancia

Amazon Linux 2023 trae Python 3.9, demasiado antiguo para las últimas versiones de muchas librerías. Instala uno reciente con [uv](https://docs.astral.sh/uv/):

```bash
sudo dnf install -y git
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
uv venv --python 3.13 .venv
source .venv/bin/activate
uv pip install fastapi uvicorn
```

---

# Ejercicio

::: ejercicio Despliegue manual
1. Crea un repositorio en GitHub y clónalo en la instancia.
2. Prepara el entorno virtual y genera `requirements.txt`.
3. Escribe `app.py` con el método `/suma`.
4. Añade `.venv/` a `.gitignore`, y haz commit y push.
5. Arranca el API con el comando de abajo.
6. Abre `http://IP_PUBLICA:8080/docs`.
7. Prueba `http://IP_PUBLICA:8080/suma?a=1&b=2`.
8. Prueba el API de otra persona de la clase.
:::

```bash
uvicorn app:app --host 0.0.0.0 --port 8080
```

`app:app` significa fichero `app.py`, objeto `app`. `--host 0.0.0.0` acepta conexiones desde fuera de la máquina.

::: limpieza Al acabar
- Para el servidor con <kbd>Ctrl</kbd>+<kbd>C</kbd>.
- [Termina la instancia](aws:ec2-instances) si no vas a seguir usándola.
:::
