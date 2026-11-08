"""Crea la tabla MARKET_DATA."""
import boto3

REGION = "eu-west-3"

dynamodb = boto3.resource("dynamodb", region_name=REGION)
table = dynamodb.create_table(
    TableName="MARKET_DATA",
    KeySchema=[
        {"AttributeName": "VALOR", "KeyType": "HASH"},
        {"AttributeName": "TIME_ID", "KeyType": "RANGE"},
    ],
    AttributeDefinitions=[
        {"AttributeName": "VALOR", "AttributeType": "S"},
        {"AttributeName": "TIME_ID", "AttributeType": "S"},
    ],
    BillingMode="PAY_PER_REQUEST",
)
table.wait_until_exists()
print("Tabla lista")
