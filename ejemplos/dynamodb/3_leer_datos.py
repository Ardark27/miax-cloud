"""Lee todas las operaciones de un valor, siguiendo la paginación."""
import boto3
import pandas as pd
from boto3.dynamodb.conditions import Key

REGION = "eu-west-3"

table = boto3.resource("dynamodb", region_name=REGION).Table("MARKET_DATA")

items = []
parametros = {"KeyConditionExpression": Key("VALOR").eq("SAN")}
while True:
    respuesta = table.query(**parametros)
    items.extend(respuesta["Items"])
    if "LastEvaluatedKey" not in respuesta:
        break
    parametros["ExclusiveStartKey"] = respuesta["LastEvaluatedKey"]

df = pd.DataFrame(items)
print(len(df))
print(df.head())
