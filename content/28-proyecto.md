# Proyecto final

Integra Lambda, S3, DynamoDB y despliegue automático.

---

# Caso de uso 1: tipos de cambio

::: flow
EventBridge Scheduler :: una vez al día -> Lambda -> BCE :: tipos de cambio -> S3 :: CSV -> DynamoDB :: histórico
:::

::: ejercicio Ingesta diaria
1. Crea una función que obtenga los [tipos de cambio de referencia del BCE](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html).
2. Guarda un CSV en S3 en cada ejecución.
3. Guarda los datos en DynamoDB en cada ejecución.
4. Prográmala una vez al día con EventBridge Scheduler.
5. Da al rol de ejecución los permisos necesarios.
6. Pon todo en un repositorio Git con despliegue automático por OIDC.
:::

::: nota Variante
Haz lo mismo con los datos de cierre del IBEX desde el API de BME.
:::

---

# Caso de uso 2: documentos

::: flow
PDF :: bucket S3 -> Lambda -> Textract -> DynamoDB :: datos extraídos
:::

::: ejercicio Procesado de documentos
1. Crea una función que se ejecute al subir un documento a un bucket.
2. Lanza Textract sobre el documento.
3. Guarda una parte del resultado en DynamoDB.
4. Da al rol de ejecución los permisos necesarios.
5. Pon todo en un repositorio Git con despliegue automático por OIDC.
:::

---

# Criterios de calidad

- **Permisos**: empieza con `AmazonS3FullAccess`, `AmazonDynamoDBFullAccess` o `AmazonTextractFullAccess`. Para nota, limítalos a tus recursos.
- **Sin secretos en Git**: variables de entorno y OIDC.
- **Lógica separada** del controlador y con tests.
- **Timeout y memoria** ajustados.
- **Extra**: define toda la infraestructura con Terraform.

::: limpieza Al entregar
- Borra la programación diaria, las funciones, las tablas y los buckets.
:::
