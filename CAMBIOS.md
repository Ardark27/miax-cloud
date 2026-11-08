# Cambios respecto a la presentación original

Revisado el 8 de noviembre de 2026.

## Cambios por obsolescencia

| Tema | Antes | Ahora |
|---|---|---|
| Contenedores web | App Runner | ECS Express Mode (App Runner cerró a clientes nuevos el 30/04/2026) |
| Capa gratuita | 12 meses | Créditos y plan gratuito o de pago (cuentas desde el 15/07/2025) |
| Sistema operativo | Amazon Linux 2, `yum`, `amazon-linux-extras` | Amazon Linux 2023, `dnf`, `systemctl` |
| Instancia | `t2.micro` | `t3.micro` |
| IP pública | Sin coste | 0,005 $/hora |
| Credenciales locales | Claves de acceso y `aws configure` | `aws login` |
| Credenciales en EC2 | Claves | Rol de IAM |
| GitHub Actions a AWS | Claves en secretos | OIDC |
| Alertas de coste | Alarma de CloudWatch | AWS Budgets |
| Runtime de Lambda | Python 3.8 y 3.9 | Python 3.14 |
| Python en Docker | 3.8 | 3.14 |
| Cron en Lambda | Reglas de EventBridge | EventBridge Scheduler |
| HTTP en Lambda | REST API | HTTP API (formato 2.0) y Function URL |
| DynamoDB | Capacidad aprovisionada | Bajo demanda |
| Actions | `checkout@v2`, `setup-python@v1`, Python 3.6, `set-output` | `checkout@v7`, `setup-python@v7`, Python 3.14, `$GITHUB_ENV` |
| Linter | flake8 | Ruff |
| Terraform | Proveedor `~> 4.16`, `version` en `provider` | Proveedor `~> 6.0`, `required_providers` |
| Bloqueo de estado | No se trataba | `use_lockfile` en S3 |
| Balanceadores | Classic | ALB y NLB |
| Límite de S3 | 5 TB por objeto | 50 TB |
| Datos generales | 24 regiones, datos de 2020 | 39 regiones, 124 zonas, datos de 2026 |

## Errores corregidos

- La carga de `market_data_proc.csv` en DynamoDB perdía casi la mitad de las filas (16.769 filas, 8.544 claves únicas). Se añade `TIME_ID`.
- `aws lambda update-function-code --zip-file s3://...` no es válido. Ahora usa `--s3-bucket` y `--s3-key`.
- `boto3.resource('s3').download_file` no existe. Se usa el cliente.
- El ejemplo de Terraform de Lambda usaba un rol sin definir.
- La API de ejemplo de tests definía dos funciones `suma`.
- El Dockerfile se llamaba `dockerfile`, y `docker build` no lo encuentra en Linux.
- El body de API Gateway debe ser una cadena.
- Empaquetar un entorno virtual de otro sistema falla en Lambda. Se usa `pip --platform`.
- Lambda con disparador S3: se añade `unquote_plus` y el aviso de bucles recursivos.
- Athena: se ignora la cabecera del CSV.
- El SSH se cierra con Ctrl+D, no Ctrl+X.
- Los 45.000 M$ de 2020 eran ingresos, no beneficio.
- P5 son GPU H100, no V100.
- ECS Express comprueba `/` por defecto: se añade `/health` al API.
- Cron no viene instalado en Amazon Linux 2023.

## Decisiones de publicación

- **Imágenes**: no se reutilizan. Varias eran de terceros y las capturas de la consola estaban desfasadas. Los diagramas se han redibujado y las capturas se sustituyen por enlaces directos.
- **Datos personales**: se han retirado el ID de cuenta, el nombre de host y las rutas personales que aparecían en el material.
- **Datos de mercado**: no se duplican; se enlazan al repositorio original.
- **DNI en Textract**: el ejemplo se ha cambiado por un documento genérico.

## Pendiente de comprobar con sesión iniciada

- Los enlaces directos a la consola no se han podido abrir sin una cuenta de AWS.
- Los ejemplos no se han ejecutado contra AWS. Las imágenes Docker no se han construido.
