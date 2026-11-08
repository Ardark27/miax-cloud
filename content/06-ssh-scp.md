# Conexión SSH y SCP

Entrar en la máquina y mover ficheros desde tu terminal.

---

# Conectar por SSH

```bash
ssh -i "miax.pem" ec2-user@IP_PUBLICA
```

- `miax.pem`: la clave privada descargada al crear la instancia.
- `ec2-user`: el usuario por defecto en Amazon Linux.
- `IP_PUBLICA`: la encuentras en [Instancias](aws:ec2-instances), o con el botón **Connect** → pestaña **SSH client**.

Para salir: `exit` o <kbd>Ctrl</kbd>+<kbd>D</kbd>.

---

# Permisos de la clave

Si aparece `WARNING: UNPROTECTED PRIVATE KEY FILE!`:

**macOS y Linux**

```bash
chmod 400 miax.pem
```

**Windows (PowerShell)**

```powershell
icacls miax.pem /inheritance:r
icacls miax.pem /grant:r "$($env:USERNAME):(R)"
```

---

# Copiar ficheros con SCP

De tu ordenador a la instancia:

```bash
scp -i miax.pem ./datos.txt ec2-user@IP_PUBLICA:~/
```

De la instancia a tu ordenador:

```bash
scp -i miax.pem ec2-user@IP_PUBLICA:~/datos.txt ./
```

---

# Ejercicio

::: ejercicio Conectar
1. Conéctate a tu instancia por SSH.
2. Instala htop con `sudo dnf install -y htop`.
3. Ejecuta `htop`.
:::

::: nota htop en AL2023
Si `dnf` no encuentra `htop`, prueba `top`, que ya viene instalado.
:::

::: ejercicio Transferir ficheros
1. Descarga [market_data_proc.csv](https://github.com/fernandodelacalle/miax-aws/blob/main/market_data/market_data_proc.csv).
2. Súbelo a la instancia con `scp`.
3. Edítalo en la instancia y tráelo de vuelta.
:::
