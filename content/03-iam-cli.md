# IAM, CLI y boto3

Quién puede hacer qué en tu cuenta, y cómo trabajar desde tu ordenador.

---

# AWS Identity and Access Management

- IAM gestiona identidades y permisos. Es un servicio **global**.
- La cuenta recién creada es el **usuario raíz**: tiene todos los permisos y no se puede limitar.
- Úsalo solo para tareas de cuenta, protegido con MFA, y nunca para trabajar a diario.

::: flow
Identidad :: usuario, grupo o rol -> Política :: documento JSON de permisos -> Recurso :: bucket, tabla, función...
:::

---

# Conceptos

| Elemento | Qué es | Ejemplo |
|---|---|---|
| **Usuario** | Persona o aplicación con credenciales propias | `ana` |
| **Grupo** | Colección de usuarios | `administradores` |
| **Rol** | Identidad temporal que asume un servicio o persona | Rol de una Lambda |
| **Política** | Permisos en JSON | `AdministratorAccess` |

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::miax-{{alias}}-datos/*"
  }]
}
```

**Mínimo privilegio**: concede solo lo necesario. En clase usamos permisos amplios por sencillez; en un trabajo real, no.

---

# Autenticación

::: novedad Evita las claves de acceso permanentes
Desde noviembre de 2025 `aws login` permite usar tus credenciales de la consola en la CLI y los SDK, con credenciales temporales.
:::

| Método | Uso | Recomendación |
|---|---|---|
| Contraseña + MFA | Consola web | Siempre con MFA |
| `aws login` | CLI y SDK desde tu ordenador | **La opción por defecto en el curso** |
| Rol de IAM | EC2, Lambda, ECS | **Siempre para servicios** |
| OIDC | GitHub Actions | **Sin secretos guardados** |
| Claves de acceso | Último recurso | Evitar, y nunca subirlas a Git |

En organizaciones grandes se usa IAM Identity Center y `aws sso login`.

---

# Crear tu usuario de trabajo

::: demo Grupo y usuario administrador
1. Abre [Grupos de IAM](aws:iam-groups) y crea `administradores` con la política `AdministratorAccess`.
2. Abre [Usuarios](aws:iam-users) → **Create user**.
3. Marca **Provide user access to the AWS Management Console** y define una contraseña.
4. Añádelo al grupo `administradores`.
5. Guarda la URL de inicio de sesión de la cuenta.
6. Cierra sesión y entra con el usuario nuevo.
7. Activa MFA en **Security credentials**.
:::

---

# AWS CLI

Instala la [versión 2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). Ya no se recomienda `pip install awscli`.

```bash
aws --version          # 2.32 o superior
aws login              # abre el navegador; elige tu usuario
aws sts get-caller-identity
```

Configura la región una vez:

```bash
aws configure set region {{region}}
aws configure set output json
```

::: nota En una máquina sin navegador
`aws login --remote` te da un enlace para autorizar desde otro dispositivo.
:::

---

# CloudShell

Una terminal en el navegador con la CLI ya autenticada. Ideal para probar un comando sin instalar nada.

::: demo Abrir CloudShell
1. Abre [CloudShell](aws:cloudshell).
2. Ejecuta `aws sts get-caller-identity`.
3. Ejecuta `aws s3 ls`.
:::

---

# Python: boto3

```bash
python -m pip install --upgrade boto3
```

```python
import boto3

sts = boto3.client("sts")
print(sts.get_caller_identity()["Arn"])
```

boto3 busca las credenciales en este orden, entre otros: parámetros del código, variables de entorno, configuración en `~/.aws` y rol de la máquina.

::: aviso Si una librería no reconoce `aws login`
Exporta credenciales temporales a la sesión actual:

```bash
eval "$(aws configure export-credentials --format env)"
```
:::

Más información: [guía rápida de boto3](https://docs.aws.amazon.com/boto3/latest/guide/quickstart.html).

---

# VS Code

La extensión **AWS Toolkit** permite explorar recursos sin salir del editor: S3, Lambda, CloudWatch y más.

Ábrela desde el panel de extensiones y conéctate con las credenciales de tu perfil.

---

# Ejercicio

::: ejercicio Tu entorno de trabajo
1. Crea el grupo y el usuario de la demo.
2. Instala la AWS CLI y ejecuta `aws login`.
3. Comprueba tu identidad con `aws sts get-caller-identity`.
4. Instala la extensión AWS Toolkit en VS Code.
5. Ejecuta el script de boto3 anterior.
:::
