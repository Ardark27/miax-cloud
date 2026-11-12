# Cómo usar esta web

Una presentación pensada para tener AWS abierto al lado.

---

# Dos formas de verla

| Vista | Para qué | Cómo |
|---|---|---|
| **Diapositivas** | Seguir la clase | Flechas del teclado o barra inferior |
| **Guía** | Repasar en casa o en el móvil | Botón «Guía» o tecla <kbd>G</kbd> |

Tu progreso y los pasos marcados se guardan en tu navegador.

---

# Ir y volver de AWS

La consola de AWS no se puede incrustar dentro de otra web, así que trabajamos con dos pestañas:

::: flow
Esta web :: la explicación -> Botón naranja :: abre la pantalla exacta -> Consola de AWS :: siempre la misma pestaña -> Ctrl + Tab :: y de vuelta
:::

Prueba: [Abrir la consola](aws:home)

::: nota Con una sola pantalla
Pulsa <kbd>P</kbd> o «Ventana lateral». Los pasos quedan en una ventana estrecha junto a AWS y avanzan a la vez que la clase.
:::

---

# Configura tus datos

Pulsa la **región** de la barra superior, o la tecla <kbd>A</kbd>, y rellena:

- **Región**: el curso usa por defecto `eu-west-3` (París).
- **ID de cuenta**: aparece en el menú de tu nombre, arriba a la derecha de la consola.
- **Alias**: por ejemplo tus iniciales. Los nombres de bucket deben ser únicos en todo AWS.

A partir de ahí, comandos como este salen listos para copiar:

```bash
aws s3 mb s3://miax-{{alias}}-datos --region {{region}}
```

Estos datos no salen de tu navegador.

---

# Qué significa cada bloque

::: demo Pasos en la consola
1. Se marcan al completarlos.
:::

::: ejercicio Para hacer en clase
- También se pueden marcar.
:::

::: limpieza Antes de irte
- Borra lo que siga costando dinero.
:::

---

# Qué necesitas instalar

- [VS Code](https://code.visualstudio.com/) con la extensión **Remote - SSH**.
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), versión 2.32 o superior.
- [Python 3.13 o 3.14](https://www.python.org/downloads/) y [Git](https://git-scm.com/).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), o Docker en una instancia EC2. Paso a paso: [Docker en tu ordenador](#/15a-docker-local).
- [Terraform](https://developer.hashicorp.com/terraform/install) para el módulo final.

El código de los ejemplos está en la carpeta [ejemplos](ejemplos/LEEME.txt).
