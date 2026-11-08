"""Consulta Athena desde Python. Requiere: pip install "pyathena[pandas]"."""
from pyathena import connect
from pyathena.pandas.cursor import PandasCursor

cursor = connect(
    s3_staging_dir="s3://miax-TU_ALIAS-athena-resultados/",
    region_name="eu-west-3",
    cursor_class=PandasCursor,
).cursor()

df = cursor.execute("SELECT * FROM miax.market_data LIMIT 100").as_pandas()
print(df)
