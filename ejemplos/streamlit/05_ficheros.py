"""Subir un CSV, transformarlo y descargar el resultado. Ejecuta: streamlit run 05_ficheros.py"""
import pandas as pd
import streamlit as st

st.title("Resumen de un CSV")

fichero = st.file_uploader("Sube un CSV con las columnas VALOR, VOLUMEN y PRECIO", type="csv")

if fichero is None:
    st.info("Prueba con market_data_proc.csv.")
    st.stop()  # termina aquí la ejecución hasta que haya fichero

datos = pd.read_csv(fichero)
st.write(f"{len(datos):,} filas y {len(datos.columns)} columnas")

resumen = (
    datos.groupby("VALOR")
    .agg(operaciones=("PRECIO", "size"), volumen=("VOLUMEN", "sum"), precio_medio=("PRECIO", "mean"))
    .round(4)
    .reset_index()
)
st.dataframe(resumen, hide_index=True)

st.download_button(
    "Descargar resumen",
    data=resumen.to_csv(index=False),
    file_name="resumen.csv",
    mime="text/csv",
)

# session_state conserva valores entre ejecuciones del script
if "ejecuciones" not in st.session_state:
    st.session_state.ejecuciones = 0
st.session_state.ejecuciones += 1
st.caption(f"El script se ha ejecutado {st.session_state.ejecuciones} veces en tu sesión.")
