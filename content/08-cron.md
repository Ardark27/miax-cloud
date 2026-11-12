# Cronjobs

Ejecutar programas de forma periódica.

---

# Crontab

Cinco campos definen cuándo se ejecuta algo:

```text
┌ minuto (0-59)
│ ┌ hora (0-23)
│ │ ┌ día del mes (1-31)
│ │ │ ┌ mes (1-12)
│ │ │ │ ┌ día de la semana (0-6, 0 es domingo)
* * * * *  comando
```

- `0 8 * * 1-5`: a las 8:00, de lunes a viernes.
- Comprueba tus expresiones en [crontab.guru](https://crontab.guru/).

---

# Instalar cron en AL2023

::: aviso Amazon Linux 2023 no trae cron
Hay que instalarlo. Si no, `crontab` da «command not found».
:::

```bash
sudo dnf install -y cronie
sudo systemctl enable --now crond
```

La hora del servidor es **UTC** por defecto. Tenlo en cuenta al programar.

---

# Editar y listar

```bash
crontab -e   # editar
crontab -l   # listar
```

- Se abre en vim: <kbd>i</kbd> para editar, <kbd>Esc</kbd> y `:wq` para guardar.
- Para usar nano: `EDITOR=nano crontab -e` (requiere `sudo dnf install -y nano` si no lo tienes).

Usa siempre **rutas absolutas**: cron tiene un `PATH` mínimo y no activa tu entorno virtual.

```bash
* * * * * /home/ec2-user/proyecto/.venv/bin/python /home/ec2-user/proyecto/mi_algo.py
```

---

# Guardar logs

Redirige la salida a un fichero, con la fecha en el nombre:

```bash
1 9 * * 1-5 /home/ec2-user/proyecto/.venv/bin/python /home/ec2-user/proyecto/mi_algo.py > /home/ec2-user/proyecto/logs/cron_$(date +\%F_\%H-\%M-\%S).log 2>&1
```

En crontab el símbolo `%` tiene un significado especial, por eso se escribe `\%`.

---

# Ejercicio

::: ejercicio Un proceso programado
1. Instala y arranca cron en tu instancia.
2. Crea una carpeta y un entorno virtual: `python3 -m venv .venv`.
3. Instala pandas en el entorno.
4. Escribe un programa que use pandas e imprima la hora actual.
5. Crea un script `my_script.sh` que active el entorno y ejecute el programa. Dale permisos con `chmod +x my_script.sh` y pruébalo con `./my_script.sh`.
6. Prográmalo cada minuto con crontab (`* * * * *`).
7. Guarda la salida en un fichero de log.
8. Comprueba los logs y borra la tarea con `crontab -e`.
:::

Más adelante haremos lo mismo sin servidor, con Lambda y EventBridge Scheduler.
