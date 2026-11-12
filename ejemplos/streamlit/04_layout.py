"""Organizar la página: barra lateral, pestañas y desplegables. Ejecuta: streamlit run 04_layout.py"""
import pandas as pd
import streamlit as st

DATOS = "market_data_proc.csv"

st.set_page_config(page_title="Panel MIAX", layout="wide")  # debe ir antes que cualquier otro st.*


@st.cache_data  # el CSV se lee una vez, no en cada interacción
def cargar_datos():
    return pd.read_csv(DATOS, parse_dates=["TIME"])


datos = cargar_datos()

# Barra lateral: los controles
with st.sidebar:
    st.header("Filtros")
    valores = st.multiselect("Valores", sorted(datos["VALOR"].unique()), default=["SAN"])

seleccion = datos[datos["VALOR"].isin(valores)]

st.title("Panel de market data")

# Pestañas: solo se ve una a la vez
grafico, tabla, resumen = st.tabs(["Gráfico", "Tabla", "Resumen"])

with grafico:
    st.line_chart(seleccion, x="TIME", y="PRECIO", color="VALOR")

with tabla:
    st.dataframe(seleccion, hide_index=True)

with resumen:
    por_valor = seleccion.groupby("VALOR").agg(
        operaciones=("PRECIO", "size"),
        volumen=("VOLUMEN", "sum"),
        precio_medio=("PRECIO", "mean"),
    )
    st.dataframe(por_valor)

# Desplegable: información secundaria, cerrada por defecto
with st.expander("Sobre los datos"):
    st.write("Operaciones del 19 de marzo de 2018 en el mercado continuo.")
