"""Tablas, métricas y gráficos con market_data_proc.csv. Ejecuta: streamlit run 02_datos.py"""
import pandas as pd
import streamlit as st

DATOS = "market_data_proc.csv"  # descárgalo en esta misma carpeta

datos = pd.read_csv(DATOS, parse_dates=["TIME"])

st.title("Market data")

# Métricas: números destacados
col1, col2, col3 = st.columns(3)
col1.metric("Operaciones", f"{len(datos):,}")
col2.metric("Valores", datos["VALOR"].nunique())
col3.metric("Volumen total", f"{datos['VOLUMEN'].sum():,}")

# Tabla interactiva: se puede ordenar, buscar y ampliar
st.subheader("Primeras operaciones")
st.dataframe(datos.head(100), hide_index=True)

# Gráfico de barras a partir de una agregación
st.subheader("Volumen por valor")
st.bar_chart(datos.groupby("VALOR")["VOLUMEN"].sum())

# Gráfico de líneas: precio del Santander a lo largo del día
st.subheader("Precio de SAN")
san = datos[datos["VALOR"] == "SAN"]
st.line_chart(san, x="TIME", y="PRECIO")
