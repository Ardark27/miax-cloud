# Terraform

Definir la infraestructura en ficheros de texto.

---

# Infraestructura como código

- La infraestructura se describe en ficheros versionables.
- Se puede revisar, repetir y destruir de forma fiable.
- Terraform funciona con muchos proveedores, incluidos AWS, Azure y Google Cloud, y permite infraestructuras híbridas.
- Usa un lenguaje **declarativo**: describes el resultado, no los pasos.
- Es un único binario escrito en Go, para Linux, Windows y macOS, con los mismos comandos en todos.

Terraform usa la licencia BSL, que no es de código abierto. [OpenTofu](https://opentofu.org/) es su alternativa abierta, con comandos muy similares.

[Instalar Terraform](https://developer.hashicorp.com/terraform/install).

---

# Terraform y los proveedores

![Terraform usa un proveedor para llamar al API de destino](assets/img/27-terraform/tf2.png)

---

# Ciclo de trabajo

::: flow
Escribir .tf -> terraform init :: descarga proveedores -> terraform plan :: previsualiza -> terraform apply :: aplica -> terraform destroy :: elimina
:::

```bash
terraform version
terraform help
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform destroy
```

---

# Qué hace cada comando

| Comando | Qué hace |
|---|---|
| `init` | Descarga proveedores y módulos en `.terraform`. Repítelo si los cambias |
| `fmt` / `validate` | Formatea y comprueba la sintaxis |
| `plan` | Muestra los cambios sin aplicarlos |
| `apply` | Calcula el plan y, si lo apruebas, lo aplica |
| `destroy` | Si lo apruebas, borra todo lo creado |

---

# Write, plan y apply

![Escribir la configuración, revisar el plan y aplicar los cambios](assets/img/27-terraform/tf1.png)

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

Terraform necesita al menos un proveedor. Las versiones de Terraform y del proveedor se declaran en el bloque `terraform`; sin versión, usa la más reciente:

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

`use_lockfile` bloquea el estado en el propio S3 para que dos personas no lo modifiquen a la vez.

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
