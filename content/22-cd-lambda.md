# Despliegue continuo de Lambda

Cada `git push` a `main` construye la imagen y actualiza la función.

---

# El flujo

::: flow
git push -> Actions :: se autentica con OIDC -> docker build -> ECR -> Lambda :: nueva imagen
:::

::: novedad Sin claves guardadas en GitHub
Antes se guardaban `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` como secretos. Con **OIDC**, GitHub obtiene credenciales temporales de un rol. No hay nada que pueda filtrarse.
:::

---

# Configurar OIDC

::: demo Crear el proveedor de identidad
1. Abre [Proveedores de identidad](aws:iam-idp) → **Add provider**.
2. Tipo: **OpenID Connect**.
3. URL: `https://token.actions.githubusercontent.com`
4. Audience: `sts.amazonaws.com`
5. Pulsa **Add provider**.
:::

::: demo Crear el rol para GitHub
1. Abre [Roles](aws:iam-roles) → **Create role** → **Web identity**.
2. Elige el proveedor anterior y la audiencia `sts.amazonaws.com`.
3. Rellena **GitHub organization** y **GitHub repository**, y opcionalmente la rama.
4. Añade las políticas `AmazonEC2ContainerRegistryPowerUser` y `AWSLambda_FullAccess`.
5. Nómbralo `miax-github-deploy`.
:::

La condición de confianza es la que limita el acceso a tu repositorio.

---

# El workflow

```yaml
name: Deploy Lambda

on:
  push:
    branches: [main]

env:
  AWS_REGION: {{region}}
  ECR_REPOSITORY: miax-lambda
  FUNCTION_NAME: miax-docker

permissions:
  id-token: write   # necesario para OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: arn:aws:iam::{{account}}:role/miax-github-deploy
          aws-region: ${{ env.AWS_REGION }}

      - id: ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push
        env:
          IMAGE: ${{ steps.ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${{ github.sha }}
        run: |
          docker build --platform linux/amd64 --provenance=false -t "$IMAGE" .
          docker push "$IMAGE"
          echo "IMAGE=$IMAGE" >> "$GITHUB_ENV"

      - name: Update function
        run: |
          aws lambda update-function-code \
            --function-name "$FUNCTION_NAME" \
            --image-uri "$IMAGE"
          aws lambda wait function-updated --function-name "$FUNCTION_NAME"
```

Fichero listo: [deploy-lambda.yml](ejemplos/github-actions/deploy-lambda.yml).

---

# Ejercicio

::: ejercicio Despliegue automático
1. Crea un repositorio nuevo con el código de Lambda con Docker.
2. Crea el repositorio ECR y la función con una primera imagen manual.
3. Configura OIDC y el rol.
4. Añade el workflow y haz push.
5. Cambia el mensaje de la función, haz push y compruébalo en [Lambda](aws:lambda).
:::

::: nota En un proyecto real
Fija las actions por el hash de un commit y limita la política a tu función y repositorio concretos.
:::
