# Terraform

Definir la infraestructura en ficheros de texto.

---

# Infraestructura como código

- La infraestructura se describe en ficheros versionables.
- Se puede revisar, repetir y destruir de forma fiable.
- Terraform funciona con muchos proveedores, incluidos AWS, Azure y Google Cloud.

::: novedad Licencia
Desde 2023 Terraform usa la licencia BSL en vez de una licencia de código abierto. [OpenTofu](https://opentofu.org/) es su alternativa abierta y mantiene comandos muy similares.
:::

[Instalar Terraform](https://developer.hashicorp.com/terraform/install).

---

# Ciclo de trabajo

::: flow
Escribir .tf -> terraform init :: descarga proveedores -> terraform plan :: previsualiza -> terraform apply :: aplica -> terraform destroy :: elimina
:::

```bash
terraform version
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform destroy
```

---

# Estructura de un proyecto

| Fichero | Contenido |
|---|---|
| `main.tf` | Recursos principales |
| `variables.tf` | Variables de entrada |
| `outputs.tf` | Valores que se muestran al terminar |
| `*.tfvars` | Valores de las variables |

Cada recurso tiene la misma forma:

```hcl
resource "aws_s3_bucket" "datos" {
  bucket = "miax-{{alias}}-tf"
}
```

`aws_s3_bucket` es el tipo y `datos`, el nombre interno.

---

# Proveedor

::: novedad Forma actual
`version` dentro de `provider` está obsoleto. Las versiones se declaran en `required_providers`.
:::

```hcl
terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "{{region}}"
}
```

Con `aws login`, usa una versión reciente del proveedor o exporta credenciales con `aws configure export-credentials`.

[Documentación del proveedor](https://registry.terraform.io/providers/hashicorp/aws/latest/docs).

---

# El estado

- Terraform guarda lo creado en `terraform.tfstate`.
- Puede contener secretos: **no lo subas a Git**.
- En equipo se guarda en un backend remoto.

```hcl
terraform {
  backend "s3" {
    bucket       = "miax-{{alias}}-tfstate"
    key          = "curso/terraform.tfstate"
    region       = "{{region}}"
    use_lockfile = true
  }
}
```

::: novedad Bloqueo sin DynamoDB
`use_lockfile` bloquea el estado usando el propio S3. Ya no hace falta una tabla DynamoDB.
:::

---

# Demo

::: demo Del código a la consola
1. Entra en `ejemplos/terraform/1_bucket`, y cambia el nombre del bucket por uno único.
2. Ejecuta `terraform init` y `terraform plan`.
3. Ejecuta `terraform apply` y confirma.
4. Busca el bucket en [S3](aws:s3).
5. Ejecuta `terraform destroy`.
:::

Ejemplos: bucket, EC2, DynamoDB, ECS Express Mode y Lambda en [ejemplos/terraform](ejemplos/LEEME.txt).

---

# Ejercicio

::: ejercicio Lambda con Terraform
1. Copia `ejemplos/terraform/5_lambda`.
2. Crea el repositorio ECR con `-target=aws_ecr_repository.lambda`.
3. Sube una imagen de los ejercicios anteriores.
4. Ejecuta `terraform apply` completo.
5. Prueba la función en [Lambda](aws:lambda).
:::

::: limpieza Al terminar
- Ejecuta `terraform destroy` en cada ejemplo.
:::
