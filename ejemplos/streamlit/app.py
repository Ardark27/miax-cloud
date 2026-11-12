"""Panel de market data leyendo de S3. Necesita la variable de entorno BUCKET.

En local:  BUCKET=miax-TU_ALIAS-datos streamlit run app.py
En EC2:    ver la lección; las credenciales llegan del rol de la instancia.
"""
import os

import boto3
import pandas as pd
import streamlit as st

BUCKET = os.environ["BUCKET"]
FICHERO = "market_data_proc.csv"

st.set_page_config(page_title="Market data", layout="wide")


@st.cache_data(ttl=300)  # vuelve a leer S3 como mucho cada 5 minutos
def cargar_datos(clave: str) -> pd.DataFrame:
    objeto = boto3.client("s3").get_object(Bucket=BUCKET, Key=clave)
    return pd.read_csv(objeto["Body"], parse_dates=["TIME"])


datos = cargar_datos(FICHERO)

with st.sidebar:
    st.header("Filtros")
    valor = st.selectbox("Valor", sorted(datos["VALOR"].unique()))

seleccion = datos[datos["VALOR"] == valor]

st.title("Market data")
st.caption(f"s3://{BUCKET}/{FICHERO}")

operaciones, volumen, precio = st.columns(3)
operaciones.metric("Operaciones", f"{len(seleccion):,}")
volumen.metric("Volumen total", f"{int(seleccion['VOLUMEN'].sum()):,}")
precio.metric("Precio medio", f"{seleccion['PRECIO'].mean():.4f}")

st.line_chart(seleccion, x="TIME", y="PRECIO")
