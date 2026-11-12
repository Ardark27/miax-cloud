# Aplicaciones de datos con Streamlit

Paneles web hechos solo con Python: primero en tu ordenador y después en EC2, con los datos en S3.

---

# Qué es Streamlit

- **[Streamlit](https://docs.streamlit.io/)** convierte un script de Python en una aplicación web: tablas, gráficos, filtros y formularios, sin escribir HTML ni JavaScript.
- Muy usado para paneles de datos, prototipos y demos de modelos.

Su modelo es muy sencillo: **cada vez que el usuario toca algo, Streamlit vuelve a ejecutar el script entero, de arriba abajo**.

::: flow
Usuario :: mueve un filtro -> Streamlit :: ejecuta el script de nuevo -> Página :: se redibuja con los valores nuevos
:::

En esta lección:

1. Aprendemos lo básico con ejemplos en local.
2. Conectamos el panel con S3.
3. Lo publicamos en una instancia EC2.

---

# Instalar y arrancar

Necesitas Python 3.11 o superior.

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install streamlit pandas boto3
streamlit hello                    # demo oficial: comprueba que funciona
```

Para ejecutar una aplicación:

```bash
streamlit run 01_hola.py
```

Se abre el navegador en `http://localhost:8501`. Al guardar cambios en el fichero, pulsa **Rerun** arriba a la derecha (o activa **Always rerun**). Para pararla, <kbd>Ctrl</kbd>+<kbd>C</kbd> en la terminal.

Los ejemplos de esta lección están en [ejemplos/streamlit](ejemplos/LEEME.txt). Descarga también [market_data_proc.csv](market_data/market_data_proc.csv) en esa carpeta.

---

# Tu primera aplicación

```python
# 01_hola.py
import pandas as pd
import streamlit as st

st.title("Hola, Streamlit")
st.write("Esto es una aplicación web escrita solo en Python.")
st.markdown("Admite **Markdown**: listas, *cursiva*, `código` y enlaces.")

precios = pd.DataFrame({"VALOR": ["SAN", "TEF"], "PRECIO": [5.41, 8.12]})
st.write(precios)
```

| Función | Muestra |
|---|---|
| `st.title`, `st.header`, `st.subheader` | Títulos |
| `st.write` | Casi cualquier cosa: texto, números, diccionarios, DataFrames |
| `st.markdown`, `st.caption`, `st.code` | Texto con formato, notas y código |

---

# Ejercicio: tu primera aplicación

::: ejercicio Hola, Streamlit
1. Instala Streamlit en un entorno virtual y ejecuta `streamlit hello`.
2. Ejecuta `01_hola.py`.
3. Añade un subtítulo con tu nombre y un párrafo en Markdown con una lista.
4. Añade una fila más a la tabla, guarda y pulsa **Rerun**.
5. Muestra con `st.code` el propio código de la aplicación.
:::

---

# Datos, métricas y gráficos

```python
# 02_datos.py
datos = pd.read_csv("market_data_proc.csv", parse_dates=["TIME"])

col1, col2, col3 = st.columns(3)
col1.metric("Operaciones", f"{len(datos):,}")
col2.metric("Valores", datos["VALOR"].nunique())
col3.metric("Volumen total", f"{datos['VOLUMEN'].sum():,}")

st.dataframe(datos.head(100), hide_index=True)          # tabla interactiva
st.bar_chart(datos.groupby("VALOR")["VOLUMEN"].sum())    # barras
st.line_chart(datos[datos["VALOR"] == "SAN"], x="TIME", y="PRECIO")   # líneas
```

| Función | Para |
|---|---|
| `st.metric` | Un número destacado, con variación opcional (`delta`) |
| `st.dataframe` | Tabla que se puede ordenar, buscar y ampliar |
| `st.line_chart`, `st.bar_chart`, `st.area_chart`, `st.scatter_chart` | Gráficos rápidos a partir de un DataFrame |

Para gráficos más elaborados, `st.plotly_chart` o `st.pyplot` aceptan figuras de Plotly o Matplotlib.

---

# Ejercicio: datos y gráficos

::: ejercicio Market data en tablas y gráficos
1. Ejecuta `02_datos.py` con `market_data_proc.csv`.
2. Añade una métrica con el **precio medio** de todas las operaciones.
3. Añade el gráfico de precio de `TEF`.
4. Muestra con `st.bar_chart` el **número de operaciones por hora** (pista: `datos["TIME"].dt.hour`).
5. Muestra una tabla con las 10 operaciones de mayor volumen.
:::

---

# Widgets: la parte interactiva

Cada widget **devuelve el valor** que ha elegido el usuario. Al cambiarlo, el script se vuelve a ejecutar con el valor nuevo.

```python
# 03_filtros.py
valor = st.selectbox("Valor", sorted(datos["VALOR"].unique()))
desde, hasta = st.slider("Horas", 9, 17, (9, 17))
volumen_min = st.number_input("Volumen mínimo", min_value=0, value=0, step=100)
solo_grandes = st.checkbox("Solo operaciones de más de 10.000 acciones")

seleccion = datos[(datos["VALOR"] == valor) & datos["TIME"].dt.hour.between(desde, hasta)]
st.line_chart(seleccion, x="TIME", y="PRECIO")

if st.button("Mostrar estadísticas"):      # True solo en la ejecución del clic
    st.write(seleccion[["PRECIO", "VOLUMEN"]].describe())
```

| Widget | Devuelve |
|---|---|
| `st.selectbox`, `st.radio` | Una opción |
| `st.multiselect` | Una lista de opciones |
| `st.slider` | Un valor, o una tupla si das un rango |
| `st.number_input`, `st.text_input`, `st.date_input` | Número, texto o fecha |
| `st.checkbox`, `st.toggle` | `True` o `False` |
| `st.button` | `True` solo en el clic |

---

# Ejercicio: filtros

::: ejercicio Filtra las operaciones
1. Ejecuta `03_filtros.py` y prueba cada control.
2. Sustituye el `selectbox` por un `multiselect` para ver varios valores a la vez (pista: `isin` y `color="VALOR"` en el gráfico).
3. Añade un `st.text_input` que filtre por un precio exacto o déjalo vacío para no filtrar.
4. Muestra con `st.metric` cuántas operaciones quedan tras los filtros.
5. Comprueba que con `SAN`, de 9 a 17 h y sin más filtros, salen **9.585** operaciones.
:::

---

# Organizar la página

```python
# 04_layout.py
st.set_page_config(page_title="Panel MIAX", layout="wide")   # siempre lo primero

@st.cache_data                     # se ejecuta una vez y guarda el resultado
def cargar_datos():
    return pd.read_csv("market_data_proc.csv", parse_dates=["TIME"])

with st.sidebar:                   # barra lateral
    valores = st.multiselect("Valores", ["SAN", "TEF"], default=["SAN"])

grafico, tabla = st.tabs(["Gráfico", "Tabla"])     # pestañas
with grafico:
    st.line_chart(seleccion, x="TIME", y="PRECIO", color="VALOR")
with tabla:
    st.dataframe(seleccion)

with st.expander("Sobre los datos"):                 # desplegable
    st.write("Operaciones del 19 de marzo de 2018.")
```

**`st.cache_data`**: como el script se ejecuta en cada clic, sin caché leería el CSV cada vez. Con el decorador lo lee una vez y reutiliza el resultado mientras los argumentos no cambien. Con `ttl=300`, el resultado caduca a los 5 minutos.

---

# Ejercicio: tu panel

::: ejercicio Un panel ordenado
1. Ejecuta `04_layout.py`.
2. Mueve a la barra lateral los filtros que hiciste en el ejercicio anterior.
3. Añade una pestaña **Por hora** con el volumen agrupado por hora.
4. Pon tres `st.metric` en columnas encima de las pestañas.
5. Quita `@st.cache_data`, añade `print("leyendo CSV")` dentro de `cargar_datos` y mira en la terminal cuántas veces se lee al mover un filtro. Vuelve a ponerlo.
:::

---

# Ficheros y estado

```python
# 05_ficheros.py
fichero = st.file_uploader("Sube un CSV", type="csv")
if fichero is None:
    st.info("Prueba con market_data_proc.csv.")
    st.stop()                                   # no sigue hasta que haya fichero

datos = pd.read_csv(fichero)                    # el fichero subido se lee como uno local
resumen = datos.groupby("VALOR").agg(operaciones=("PRECIO", "size"), volumen=("VOLUMEN", "sum"))
st.dataframe(resumen)

st.download_button("Descargar resumen", resumen.to_csv(), file_name="resumen.csv")
```

Las variables normales se pierden en cada ejecución. Para conservar algo entre clics, usa **`st.session_state`**:

```python
if "contador" not in st.session_state:
    st.session_state.contador = 0
if st.button("Sumar"):
    st.session_state.contador += 1
st.write(st.session_state.contador)
```

---

# Ejercicio: subir y descargar

::: ejercicio Subir, transformar y descargar
1. Ejecuta `05_ficheros.py` y sube `market_data_proc.csv`.
2. Descarga el resumen y ábrelo.
3. Añade un `multiselect` para elegir qué columnas se incluyen en la descarga.
4. Añade un botón **Añadir a favoritos** que guarde el valor elegido en `st.session_state` y muestra la lista de favoritos.
:::

---

# Leer los datos de S3

El panel definitivo lee el CSV del bucket. El nombre llega por una **variable de entorno**:

```python
# app.py
BUCKET = os.environ["BUCKET"]

@st.cache_data(ttl=300)
def cargar_datos(clave: str) -> pd.DataFrame:
    objeto = boto3.client("s3").get_object(Bucket=BUCKET, Key=clave)
    return pd.read_csv(objeto["Body"], parse_dates=["TIME"])
```

En tu ordenador, con la sesión de `aws login` abierta:

```bash
BUCKET=miax-{{alias}}-datos streamlit run app.py            # macOS y Linux
$env:BUCKET="miax-{{alias}}-datos"; streamlit run app.py    # Windows PowerShell
```

El `ttl=300` hace que, como mucho cada 5 minutos, vuelva a descargar el fichero: si lo cambias en S3, el panel lo verá.

---

# Ejercicio: panel con datos de S3

::: ejercicio De local a S3
1. Sube `market_data_proc.csv` a tu bucket `miax-{{alias}}-datos`.
2. Ejecuta `app.py` en tu ordenador con la variable `BUCKET`.
3. Comprueba que `SAN` tiene **9.585** operaciones y un precio medio de **5.3936**.
4. Copia en `app.py` las mejoras de tus ejercicios anteriores: filtros, pestañas, métricas.
5. Sin la variable `BUCKET`, ¿qué error aparece? ¿Y si escribes mal el nombre del bucket?
:::

---

# Publicarlo en EC2

::: flow
Navegador :: http://IP:8501 -> Grupo de seguridad :: puerto 8501 -> EC2 :: Streamlit -> Rol de IAM :: sin claves -> S3 :: market_data_proc.csv
:::

- Streamlit es un servidor web: escucha en el **puerto 8501**.
- La instancia lee S3 con su **rol de IAM**: no hay claves en el código ni en la máquina.
- Para que siga funcionando al cerrar la terminal, lo dejamos como **servicio** del sistema.

---

# Preparar la instancia

::: demo Puerto y permisos
1. En [Security Groups](aws:ec2-sg), edita las reglas de entrada de tu instancia.
2. Añade **Custom TCP**, puerto **8501**, origen **My IP**.
3. En [Instancias](aws:ec2-instances), selecciona la tuya y abre **Actions** → **Security** → **Modify IAM role**.
4. Asigna el rol de S3 que creaste en la lección de S3 (`miax-ec2-s3`), o uno con `AmazonS3ReadOnlyAccess`.
5. Conéctate por SSH y comprueba el acceso con `aws s3 ls s3://miax-{{alias}}-datos/`.
:::

::: aviso Streamlit no pide contraseña
Quien llegue al puerto ve el panel y tus datos. Deja el origen en **My IP**.
:::

---

# Instalar y arrancar en la instancia

Amazon Linux 2023 trae Python 3.9 y Streamlit necesita 3.11 o superior. Usamos [uv](https://docs.astral.sh/uv/), como en el API de FastAPI:

```bash
# Desde tu ordenador: copia la aplicación
scp -i miax.pem app.py requirements.txt miax-streamlit.service ec2-user@IP_PUBLICA:~/streamlit/
```

```bash
# En la instancia
curl -LsSf https://astral.sh/uv/install.sh | sh && source ~/.bashrc
cd ~/streamlit
uv venv --python 3.13 .venv && source .venv/bin/activate
uv pip install -r requirements.txt

BUCKET=miax-{{alias}}-datos streamlit run app.py \
  --server.address 0.0.0.0 --server.port 8501 --server.headless true
```

Abre `http://IP_PUBLICA:8501`.

| Opción | Por qué |
|---|---|
| `--server.address 0.0.0.0` | Acepta conexiones desde fuera de la máquina |
| `--server.headless true` | No intenta abrir un navegador ni pide un correo al arrancar |

Si `scp` dice que no existe la carpeta, créala antes con `ssh ... mkdir -p streamlit`.

---

# Que siga funcionando

Al cerrar la conexión SSH, el proceso se para. Un **servicio de systemd** lo mantiene en marcha y lo arranca solo si la máquina se reinicia.

```ini
# /etc/systemd/system/miax-streamlit.service
[Unit]
Description=Panel Streamlit MIAX
After=network-online.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/streamlit
Environment=BUCKET=miax-{{alias}}-datos
Environment=AWS_DEFAULT_REGION={{region}}
ExecStart=/home/ec2-user/streamlit/.venv/bin/streamlit run app.py --server.address 0.0.0.0 --server.port 8501 --server.headless true
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo cp ~/streamlit/miax-streamlit.service /etc/systemd/system/   # cambia antes TU_ALIAS
sudo systemctl daemon-reload
sudo systemctl enable --now miax-streamlit
systemctl status miax-streamlit                          # active (running)
journalctl -u miax-streamlit -f                          # logs
```

Fichero listo: [miax-streamlit.service](ejemplos/LEEME.txt).

---

# Ejercicio: panel en EC2

::: ejercicio Tu panel en Internet
1. Prepara el puerto 8501 y el rol de la instancia.
2. Copia `app.py`, `requirements.txt` y `miax-streamlit.service` a la instancia con `scp`.
3. Instala Python 3.13 con uv y las dependencias.
4. Arranca Streamlit a mano y ábrelo desde tu navegador.
5. Créalo como servicio de systemd, cierra la sesión SSH y comprueba que sigue funcionando.
6. Sube a S3 un cambio en el CSV y comprueba que aparece en el panel en menos de 5 minutos.
:::

---

# Ejercicio: elegir el fichero

::: ejercicio Cualquier CSV del bucket
1. En `app.py`, lista los ficheros `.csv` del bucket con `list_objects_v2`.
2. Muestra un `selectbox` en la barra lateral para elegir uno.
3. Muéstralo con `st.dataframe`, junto con su tamaño y su fecha (`LastModified`).
4. Si el fichero tiene las columnas `VALOR`, `PRECIO` y `TIME`, muestra además el gráfico.
5. Despliega el cambio en la instancia y reinicia el servicio con `sudo systemctl restart miax-streamlit`.
:::

---

# Limpieza

::: limpieza Al terminar
1. Para el servicio: `sudo systemctl disable --now miax-streamlit`.
2. En [Security Groups](aws:ec2-sg), borra la regla del puerto 8501.
3. [Detén o termina la instancia](aws:ec2-instances) si no vas a seguir usándola.
:::
