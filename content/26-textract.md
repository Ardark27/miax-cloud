# Amazon Textract

Extraer texto, tablas y formularios de PDF e imágenes.

---

# Qué ofrece

| Operación | Devuelve |
|---|---|
| **Detect Document Text** | Líneas y palabras |
| **Analyze Document** | También tablas, formularios y consultas |
| **Analyze Expense** | Facturas y recibos |
| **Analyze ID** | Documentos de identidad |

Se invoca desde Python y devuelve JSON con el contenido del documento. Documentación: [qué es Textract](https://docs.aws.amazon.com/textract/latest/dg/what-is.html) y [análisis de documentos](https://docs.aws.amazon.com/textract/latest/dg/analyzing-document-text.html).

::: nota Capa gratuita
Solo tres meses para clientes nuevos: 1.000 páginas al mes con Detect Document Text y 100 con tablas o formularios. [Precios](https://aws.amazon.com/textract/pricing/).
:::

::: aviso Documentos sensibles
Prueba con documentos ficticios o públicos. No uses tu DNI ni datos personales en los ejercicios.
:::

---

# Demo

::: demo Probar sin programar
1. Abre [Textract](aws:textract).
2. Usa un documento de ejemplo o sube un PDF de pocas páginas.
3. Revisa las pestañas de texto, tablas y formularios.
:::

---

# Síncrono o asíncrono

| Modo | Para | API |
|---|---|---|
| **Síncrono** | Una imagen o PDF de una página | `detect_document_text`, `analyze_document` |
| **Asíncrono** | PDF de varias páginas en S3 | `start_...` y `get_...` |

El bucket debe estar en la misma región en la que llamas a Textract.

---

# Análisis asíncrono

```python
import time

import boto3

textract = boto3.client("textract", region_name="{{region}}")

trabajo = textract.start_document_text_detection(
    DocumentLocation={
        "S3Object": {"Bucket": "miax-{{alias}}-datos", "Name": "documento.pdf"}
    },
)
job_id = trabajo["JobId"]

while True:
    resultado = textract.get_document_text_detection(JobId=job_id)
    if resultado["JobStatus"] != "IN_PROGRESS":
        break
    time.sleep(3)

for bloque in resultado["Blocks"]:
    if bloque["BlockType"] == "LINE":
        print(bloque["Text"])
```

Si hay muchos resultados, sigue `NextToken`. En producción, usa una notificación de SNS en lugar de consultar en bucle.

Formato de salida: [objeto Block](https://docs.aws.amazon.com/textract/latest/dg/API_Block.html). Hay un PDF de ejemplo y su salida en [ejemplos/textract/salida](ejemplos/LEEME.txt).

---

# Tablas y formularios, con salida a S3

```python
textract.start_document_analysis(
    DocumentLocation={
        "S3Object": {"Bucket": "miax-{{alias}}-datos", "Name": "documento.pdf"}
    },
    FeatureTypes=["TABLES", "FORMS"],
    OutputConfig={"S3Bucket": "miax-{{alias}}-datos", "S3Prefix": "textract/"},
)
```

Con `OutputConfig`, Textract guarda además el JSON del resultado en el bucket indicado.

---

# Ejercicio

::: ejercicio Extrae un documento
1. Sube un PDF público a tu bucket.
2. Ejecuta el análisis de texto desde Python.
3. Repite con `start_document_analysis` y `FeatureTypes=["TABLES"]`.
4. Busca las tablas en los bloques devueltos.
:::

---

# Actividad de créditos: Bedrock

Textract resuelve una tarea concreta. **Amazon Bedrock** da acceso a modelos fundacionales de distintos proveedores.

![Ficha de la actividad de usar un modelo fundacional en Bedrock, con premio de 20 dólares](assets/img/26-textract/actividad-creditos.png)

---

# Ejercicio: Bedrock

::: ejercicio Gana 20 $ con Bedrock
1. En la [consola](aws:home), abre **Explore AWS**, filtra por **Earn AWS credits**, elige **Utilice un modelo fundacional en el entorno de experimentación de Amazon Bedrock** y pulsa **Iniciar actividad**.
2. Elige un modelo en el entorno de experimentación.
3. Envía una petición, como `Explica en tres frases qué es una zona de disponibilidad`.
4. Comprueba en **Explore AWS** que aparece como completada.
:::

::: nota Coste
Cada petición gasta créditos según su longitud, pero no deja recursos que borrar.
:::
