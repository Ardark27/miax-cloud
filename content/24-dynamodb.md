# Amazon DynamoDB

Base de datos NoSQL gestionada, con latencia baja a cualquier escala.

---

# Conceptos

| Concepto | Descripción |
|---|---|
| **Tabla** | Colección de elementos |
| **Elemento** | Grupo de atributos, con clave única |
| **Atributo** | Dato individual |
| **Índice secundario** | Otra forma de consultar |

Excepto la clave principal, la tabla **no tiene esquema**: cada elemento puede tener atributos distintos.

---

# Clave principal

| Tipo | Composición | Ejemplo |
|---|---|---|
| **Simple** | Clave de partición | `usuario_id` |
| **Compuesta** | Partición y ordenación | `VALOR` + `TIME_ID` |

- La **clave de partición** decide dónde se guarda el elemento.
- La **clave de ordenación** ordena los elementos de una misma partición.
- No puede haber dos elementos con la misma clave: el segundo **sobrescribe** al primero.

::: aviso Diseña primero las consultas
En DynamoDB se modela la tabla a partir de cómo se va a leer.
:::

---

# Modo de capacidad

::: novedad Bajo demanda es la opción recomendada
Es el modo por defecto en la consola y se ajusta solo. Se abarató un 50 % en noviembre de 2024. No hay que decidir unidades de lectura y escritura.
:::

```python
import boto3

dynamodb = boto3.resource("dynamodb", region_name="{{region}}")

table = dynamodb.create_table(
    TableName="Movies",
    KeySchema=[
        {"AttributeName": "year", "KeyType": "HASH"},
        {"AttributeName": "title", "KeyType": "RANGE"},
    ],
    AttributeDefinitions=[
        {"AttributeName": "year", "AttributeType": "N"},
        {"AttributeName": "title", "AttributeType": "S"},
    ],
    BillingMode="PAY_PER_REQUEST",
)
table.wait_until_exists()
```

---

# Insertar y leer

```python
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key

table = boto3.resource("dynamodb", region_name="{{region}}").Table("Movies")

table.put_item(Item={
    "year": 2015,
    "title": "The Big New Movie",
    "info": {"plot": "Nothing happens at all.", "rating": Decimal("7.5")},
})

respuesta = table.get_item(Key={"year": 2015, "title": "The Big New Movie"})
print(respuesta["Item"])

respuesta = table.query(KeyConditionExpression=Key("year").eq(2015))
print(respuesta["Items"])
```

boto3 no admite `float`: usa `Decimal`. Prefiere `query` a `scan`, que recorre y cobra toda la tabla.

---

# Demo en la consola

::: demo Explorar una tabla
1. Abre [Crear tabla](aws:dynamodb-create).
2. Nombre `Movies`, clave de partición `year` (Number), de ordenación `title` (String).
3. Deja los valores por defecto y crea la tabla.
4. Cuando esté activa, abre [Tablas](aws:dynamodb) → **Explore table items**.
5. Crea un elemento a mano.
:::

---

# Ejercicio

::: aviso Una trampa en estos datos
En `market_data_proc.csv` hay 16.769 filas, pero solo 8.544 combinaciones distintas de `VALOR` y `TIME`: muchas operaciones son del mismo instante. Con `TIME` como clave de ordenación se **perdería casi la mitad de las filas**. Por eso añadimos un número de secuencia.
:::

::: ejercicio Market data en DynamoDB
1. Crea la tabla `MARKET_DATA`: `VALOR` como partición y `TIME_ID` como ordenación.
2. Descarga [market_data_proc.csv](https://github.com/fernandodelacalle/miax-aws/blob/main/market_data/market_data_proc.csv).
3. Carga las filas con `batch_writer` y `TIME_ID` como `TIME#000123`.
4. Lee las operaciones del Santander (`SAN`) con paginación.
5. Comprueba que llegan las 9.585 filas.
:::

---

# Carga por lotes

```python
with table.batch_writer() as lote:
    for i, fila in enumerate(registros):
        lote.put_item(Item={
            "VALOR": fila["VALOR"],
            "TIME_ID": f"{fila['TIME']}#{i:06d}",
            "VOLUMEN": int(fila["VOLUMEN"]),
            "PRECIO": Decimal(str(fila["PRECIO"])),
        })
```

Soluciones: [ejemplos/dynamodb](ejemplos/LEEME.txt).

::: limpieza Al terminar
- Borra las tablas en [DynamoDB](aws:dynamodb).
:::
