# Cloud con AWS · MIAX

Presentación web del curso de AWS, con enlaces directos a la consola, pasos marcables, ejercicios y código actualizado.

## Ver en local

La web carga el contenido con `fetch`, así que hay que servirla:

```bash
python -m http.server 8000
```

Después abre <http://localhost:8000>.

## Editar el contenido

No hay paso de compilación. Cada lección es un fichero en `content/`, y el índice está en `content/curso.json`.

| Sintaxis | Resultado |
|---|---|
| `---` en una línea | Nueva diapositiva |
| `[Texto](aws:ec2-launch)` | Botón a la consola, en la región del alumno |
| `::: demo Título` … `:::` | Pasos en la consola, marcables |
| `::: ejercicio`, `::: limpieza` | Ejercicio o limpieza, marcables |
| `::: aviso`, `::: nota` | Bloques informativos |
| `::: flow` … `A :: detalle -> B` … `:::` | Diagrama de flujo |
| `{{region}}`, `{{account}}`, `{{alias}}` | Datos del alumno |

Las claves `aws:` se definen en `AWS_LINKS`, dentro de `assets/app.js`.

## Publicar

GitHub Pages sirve directamente la raíz de la rama `main`: basta con hacer push.

## Qué ha cambiado

Consulta [CAMBIOS.md](CAMBIOS.md).
