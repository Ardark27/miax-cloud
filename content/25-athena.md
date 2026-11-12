# Amazon Athena

SQL directamente sobre ficheros en S3, sin servidores.

---

# Cómo funciona

::: flow
Ficheros en S3 :: CSV, Parquet... -> Tabla :: define el esquema -> Athena :: consulta SQL -> Resultado
:::

- Se paga por datos escaneados: 5 $ por TB en la mayoría de regiones.
- Con **Parquet** y particiones se lee menos y se paga menos.
- La tabla no copia datos: solo describe cómo leerlos.

---

# Preparar los datos

Sube el CSV a una carpeta propia: Athena lee **todo** lo que haya bajo la ruta.

```bash
aws s3 cp market_data_proc.csv s3://miax-{{alias}}-datos/athena/market/
aws s3 mb s3://miax-{{alias}}-athena-resultados --region {{region}}
```

::: demo Configurar el editor
1. Abre el [editor de Athena](aws:athena).
2. Si lo pide, pulsa **Edit settings** e indica `s3://miax-{{alias}}-athena-resultados/`.
3. Guarda y vuelve al editor.
:::

---

# Crear la tabla

Creamos la base de datos y la tabla con SQL:

```sql
CREATE DATABASE IF NOT EXISTS miax;
```

```sql
CREATE EXTERNAL TABLE miax.market_data (
  valor   string,
  volumen int,
  precio  double,
  `time`  string
)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
LOCATION 's3://miax-{{alias}}-datos/athena/market/'
TBLPROPERTIES ('skip.header.line.count' = '1');
```

Ejecuta cada sentencia por separado en el [editor](aws:athena).

---

# Consultas

```sql
SELECT valor,
       count(*)                           AS operaciones,
       sum(volumen)                       AS volumen,
       sum(precio * volumen) / sum(volumen) AS vwap
FROM miax.market_data
GROUP BY valor;
```

Debajo del resultado verás los **datos escaneados** de la consulta.

---

# Resultado de una consulta

![Filas de market_data devueltas por Athena](assets/img/25-athena/at_6.png)

<p class="pie">Captura de una versión anterior de la consola: la pantalla actual puede variar.</p>

---

# Desde Python

```bash
pip install "pyathena[pandas]"
```

```python
from pyathena import connect
from pyathena.pandas.cursor import PandasCursor

cursor = connect(
    s3_staging_dir="s3://miax-{{alias}}-athena-resultados/",
    region_name="{{region}}",
    cursor_class=PandasCursor,
).cursor()

df = cursor.execute("SELECT * FROM miax.market_data LIMIT 100").as_pandas()
print(df)
```

---

# Ejercicio

::: ejercicio SQL sobre market data
1. Crea la tabla con `market_data_proc.csv`.
2. Calcula el precio medio por valor desde la consola.
3. Repite la misma consulta desde Python.
:::

::: limpieza Al terminar
- Borra la tabla con `DROP TABLE miax.market_data`.
- Vacía el bucket de resultados en [S3](aws:s3).
:::
