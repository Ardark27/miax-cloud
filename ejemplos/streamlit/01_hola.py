"""Primera aplicación: texto, Markdown y una tabla. Ejecuta: streamlit run 01_hola.py"""
import pandas as pd
import streamlit as st

st.title("Hola, Streamlit")
st.write("Esto es una aplicación web escrita solo en Python.")

st.markdown("Admite **Markdown**: listas, *cursiva*, `código` y [enlaces](https://docs.streamlit.io/).")

# st.write muestra casi cualquier cosa: texto, números, diccionarios o tablas.
precios = pd.DataFrame({"VALOR": ["SAN", "TEF"], "PRECIO": [5.41, 8.12]})
st.write(precios)

st.caption("Cada vez que guardas el fichero, pulsa Rerun en la esquina superior derecha.")
