"""Carga market_data_proc.csv en DynamoDB.

Hay operaciones con el mismo VALOR y TIME, así que TIME_ID añade un número
de secuencia para que ninguna fila sobrescriba a otra.
"""
from decimal import Decimal

import boto3
import pandas as pd

REGION = "eu-west-3"

data = pd.read_csv("market_data_proc.csv")
table = boto3.resource("dynamodb", region_name=REGION).Table("MARKET_DATA")

with table.batch_writer() as lote:
    for i, fila in enumerate(data.to_dict(orient="records")):
        lote.put_item(
            Item={
                "VALOR": fila["VALOR"],
                "TIME_ID": f"{fila['TIME']}#{i:06d}",
                "VOLUMEN": int(fila["VOLUMEN"]),
                "PRECIO": Decimal(str(fila["PRECIO"])),
            }
        )
print(f"Cargadas {len(data)} filas")
