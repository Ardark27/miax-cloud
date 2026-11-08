# Desarrollo remoto con VS Code

Editar en la instancia EC2 como si fuese tu ordenador.

---

# Cómo funciona

::: flow
VS Code local :: interfaz -> Túnel SSH -> VS Code Server :: dentro de EC2 -> Ficheros y terminal :: en la máquina remota
:::

Tu editor corre en local; los ficheros, terminales y depuración, en la instancia.

Documentación: [Remote - SSH](https://code.visualstudio.com/docs/remote/ssh).

::: aviso Elige una instancia con memoria suficiente
VS Code Server puede quedarse justo en 1 GB de RAM. Si `t3.micro` va lenta, usa `t3.small`, también incluida en la capa gratuita para cuentas nuevas.
:::

---

# Preparar la instancia

::: demo Instancia lista para SSH
1. Abre [Lanzar instancia](aws:ec2-launch) con Amazon Linux 2023.
2. Asegúrate de que el puerto **22** está abierto desde **My IP**.
3. Descarga la clave `.pem`.
4. Anota la **IP pública** o el **DNS público** en [Instancias](aws:ec2-instances).
:::

---

# Configurar VS Code

::: demo Conectar el editor
1. Instala la extensión **Remote - SSH**.
2. Abre la paleta con <kbd>F1</kbd> y ejecuta **Remote-SSH: Open SSH Configuration File...**
3. Elige el fichero de tu usuario y añade el bloque de abajo.
4. Abre otra vez la paleta y ejecuta **Remote-SSH: Connect to Host...**
5. Elige `aws-ec2` y **Linux** como plataforma.
6. Usa **File → Open Folder** para abrir `/home/ec2-user`.
:::

```text
Host aws-ec2
    HostName IP_O_DNS_PUBLICO
    User ec2-user
    IdentityFile C:\ruta\a\miax.pem
```

| Campo | Significado |
|---|---|
| `Host` | Nombre que quieras darle |
| `HostName` | IP o DNS público de la instancia |
| `User` | Usuario de la máquina |
| `IdentityFile` | Ruta a la clave privada |

---

# Trucos

- La IP pública cambia al detener la instancia: actualiza `HostName` o usa una IP elástica.
- Instala en el servidor las extensiones que necesites, como Python.
- El panel **Remote Explorer** lista tus máquinas.
- Si no conecta, revisa los permisos de la clave y que tu IP no haya cambiado.

---

# Ejercicio

::: ejercicio Trabaja en remoto
1. Conecta VS Code a tu instancia.
2. Abre una terminal integrada y ejecuta `hostname`.
3. Crea un fichero `hola.py` y ejecútalo.
:::
