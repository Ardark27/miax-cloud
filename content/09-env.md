# Variables de entorno

Configurar programas sin escribir valores dentro del código.

---

# Qué son

- Variables con nombre que el sistema pasa a cada programa que se ejecuta y que pueden cambiar su comportamiento.
- Uso típico: configuración y secretos, como contraseñas o claves de API, fuera del código.

---

# En bash

```bash
echo $PATH        # ver una variable
env               # ver todas
export API_KEY=valor   # disponible para los programas que lances
```

Con `VARIABLE=valor`, sin `export`, la variable solo existe en la shell actual y no la heredan los programas.

Para que estén siempre disponibles, añade la línea `export` a `~/.bashrc`.

---

# En Python

```python
import os

api_key = os.environ["API_KEY"]      # error si no existe
timeout = os.environ.get("TIMEOUT", "30")  # con valor por defecto

os.environ["MODO"] = "test"          # solo afecta a este proceso y sus hijos
```

Usa `environ["X"]` cuando la variable sea obligatoria: fallará pronto y con un mensaje claro.

---

# Secretos

::: aviso No subas secretos a Git
Añade `.env` a tu `.gitignore`. Una clave publicada debe considerarse comprometida, aunque borres el commit.
:::

| Dónde | Para qué |
|---|---|
| Fichero `.env` local | Desarrollo |
| Variables de Lambda o ECS | Configuración no sensible |
| [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) o Parameter Store | Secretos en producción |
| Secretos de GitHub | Valores del pipeline |
