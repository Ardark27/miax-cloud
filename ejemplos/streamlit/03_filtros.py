"""Widgets para filtrar los datos. Ejecuta: streamlit run 03_filtros.py"""
import pandas as pd
import streamlit as st

DATOS = "market_data_proc.csv"

datos = pd.read_csv(DATOS, parse_dates=["TIME"])
st.title("Filtros")

# Lista desplegable: devuelve el elemento elegido
valor = st.selectbox("Valor", sorted(datos["VALOR"].unique()))

# Deslizador con un rango: devuelve una tupla (desde, hasta)
hora_min, hora_max = int(datos["TIME"].dt.hour.min()), int(datos["TIME"].dt.hour.max())
desde, hasta = st.slider("Horas", hora_min, hora_max, (hora_min, hora_max))

# Número mínimo de acciones por operación
volumen_min = st.number_input("Volumen mínimo", min_value=0, value=0, step=100)

# Casilla: devuelve True o False
solo_grandes = st.checkbox("Solo operaciones de más de 10.000 acciones")

seleccion = datos[
    (datos["VALOR"] == valor)
    & datos["TIME"].dt.hour.between(desde, hasta)
    & (datos["VOLUMEN"] >= volumen_min)
]
if solo_grandes:
    seleccion = seleccion[seleccion["VOLUMEN"] > 10_000]

st.write(f"**{len(seleccion):,}** operaciones de {valor} entre las {desde}:00 y las {hasta}:59")
st.line_chart(seleccion, x="TIME", y="PRECIO")

# Un botón solo es True en la ejecución en la que se pulsa
if st.button("Mostrar estadísticas"):
    st.write(seleccion[["PRECIO", "VOLUMEN"]].describe())
