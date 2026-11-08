"""Lanza un análisis asíncrono de texto e imprime las líneas detectadas."""
import time

import boto3

REGION = "eu-west-3"
BUCKET = "miax-TU_ALIAS-datos"
DOCUMENTO = "documento.pdf"

textract = boto3.client("textract", region_name=REGION)

trabajo = textract.start_document_text_detection(
    DocumentLocation={"S3Object": {"Bucket": BUCKET, "Name": DOCUMENTO}},
)
job_id = trabajo["JobId"]

while True:
    resultado = textract.get_document_text_detection(JobId=job_id)
    if resultado["JobStatus"] != "IN_PROGRESS":
        break
    time.sleep(3)

if resultado["JobStatus"] != "SUCCEEDED":
    raise RuntimeError(resultado.get("StatusMessage", resultado["JobStatus"]))

while True:
    for bloque in resultado["Blocks"]:
        if bloque["BlockType"] == "LINE":
            print(bloque["Text"])
    token = resultado.get("NextToken")
    if not token:
        break
    resultado = textract.get_document_text_detection(JobId=job_id, NextToken=token)
