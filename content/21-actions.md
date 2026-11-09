# GitHub Actions

Automatizar build y tests desde el propio repositorio.

---

# Conceptos

::: flow
Evento :: push, PR, cron -> Workflow -> Job :: en un runner -> Steps -> Actions o comandos
:::

| Término | Significado |
|---|---|
| **Workflow** | Proceso automatizado definido en YAML |
| **Evento** | Lo que lo inicia |
| **Job** | Conjunto de pasos en una misma máquina |
| **Step** | Una tarea: comando o action |
| **Action** | Bloque reutilizable |
| **Runner** | Máquina de ejecución, de GitHub o tuya |

Los workflows viven en `.github/workflows/`.

---

# De workflow a action

![Jerarquía de workflow, job, step y action](assets/img/21-actions/workflow.png)

<p class="pie">La versión de <code>checkout</code> del dibujo es antigua: usa la del ejemplo siguiente.</p>

---

# Ejemplo

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.14"
      - run: python -m pip install -r requirements.txt
      - run: ruff check .
      - run: pytest
```

::: novedad Cambios respecto a versiones antiguas
- Actualiza las actions: las versiones viejas pierden soporte.
- `::set-output` está obsoleto. Se escribe en el fichero `$GITHUB_OUTPUT`.
- Los workflows deben pedir solo los permisos necesarios con `permissions`.
:::

---

# Ejercicio

::: ejercicio Tu primer workflow
1. Crea un repositorio.
2. Añade `requirements.txt` con `pytest` y `ruff`.
3. Crea una función con su test.
4. Añade el workflow en `.github/workflows/ci.yml`.
5. Haz push y sigue la ejecución en la pestaña **Actions**.
6. Rompe un test a propósito y comprueba que falla.
:::
