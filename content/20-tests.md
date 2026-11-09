# Tests y calidad de código

La red de seguridad que permite automatizar despliegues.

---

# pytest

```bash
pip install pytest
pytest
```

- Busca ficheros `test_*.py` o `*_test.py`.
- Ejecuta las funciones cuyo nombre empieza por `test`.
- Una prueba pasa si no lanza excepciones.

```python
import my_module


def test_resta():
    assert my_module.resta(4, 2) == 2
    assert my_module.resta(2, 2) == 0
```

Documentación: [pytest](https://docs.pytest.org/en/stable/).

---

# VS Code

- La pestaña **Testing** detecta tus tests.
- Permite ejecutar uno concreto y depurarlo con puntos de ruptura.

---

# Panel de tests

![Panel Testing de VS Code con los tests superados](assets/img/20-tests/tests_vscode.png)

---

# Ejercicio: primeros tests

::: ejercicio Primeros tests
1. Ejecuta los tests de [ejemplos/tests/ejemplo_1](ejemplos/LEEME.txt).
2. Cambia `my_module.py` y mira qué ocurre.
3. Ejecútalos desde VS Code.
4. Añade un test nuevo.
5. Depura un test.
:::

---

# Probar un API

```python
from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_suma():
    response = client.get("/suma", params={"a": 1, "b": 2})
    assert response.status_code == 200
    assert response.json() == 3
```

`TestClient` necesita tener instalado `httpx`.

---

# Desarrollo guiado por tests

::: flow
Rojo :: escribe un test que falla -> Verde :: código mínimo que pasa -> Refactor :: mejora sin romper
:::

---

# El ciclo de TDD

![Escribir test, ver que falla, escribir código, ver que pasa y refactorizar](assets/img/20-tests/tdd.png)

---

# Linter y formato: Ruff

::: novedad Ruff sustituye a flake8
[Ruff](https://docs.astral.sh/ruff/) aplica las mismas reglas que flake8, mucho más rápido, y además formatea el código.
:::

```bash
pip install ruff
ruff check .          # busca problemas
ruff check . --fix    # corrige los automáticos
ruff format .         # formatea
```

---

# Ejercicio: limpia el código

::: ejercicio Limpia el código
1. Instala Ruff en tu entorno virtual.
2. Ejecútalo en `ejemplo_2`.
3. Corrige los problemas que aparezcan.
:::
