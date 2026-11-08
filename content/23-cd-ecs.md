# Despliegue continuo en ECS

Publicar automáticamente el API en ECS Express Mode.

---

# Permisos

El rol `miax-github-deploy` necesita, además de ECR, permisos para ECS Express Mode y para pasar los dos roles del servicio.

::: demo Ampliar el rol
1. Abre [Roles](aws:iam-roles) y entra en `miax-github-deploy`.
2. **Add permissions** → **Attach policies**: añade `AmazonECS_FullAccess`.
3. **Add permissions** → **Create inline policy** y pega el JSON de abajo.
:::

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "iam:PassRole",
    "Resource": [
      "arn:aws:iam::{{account}}:role/ecsTaskExecutionRole",
      "arn:aws:iam::{{account}}:role/ecsInfrastructureRoleForExpressServices"
    ]
  }]
}
```

---

# El paso de despliegue

Se construye la imagen como en Lambda y se despliega con la action oficial:

```yaml
- uses: aws-actions/amazon-ecs-deploy-express-service@v1
  with:
    service-name: miax-suma
    image: ${{ env.IMAGE }}
    execution-role-arn: arn:aws:iam::{{account}}:role/ecsTaskExecutionRole
    infrastructure-role-arn: arn:aws:iam::{{account}}:role/ecsInfrastructureRoleForExpressServices
    container-port: 8080
    health-check-path: /health
```

La action crea el servicio si no existe y lo actualiza si existe.

Fichero completo: [deploy-ecs.yml](ejemplos/github-actions/deploy-ecs.yml). Más información: [la action en GitHub](https://github.com/aws-actions/amazon-ecs-deploy-express-service).

---

# Ejercicio

::: ejercicio API con despliegue automático
1. Crea un repositorio con los ficheros del API de suma.
2. Añade un test del método `/suma`.
3. Añade el workflow, ejecutando los tests antes de desplegar.
4. Haz push y abre la URL del servicio.
5. Añade un método `/resta` y despliégalo con otro push.
:::

::: limpieza Obligatorio al terminar
1. Borra el servicio en [ECS](aws:ecs).
2. Comprueba [Load Balancers](aws:ec2-lb).
3. Desactiva el workflow, o el siguiente push volverá a crear el servicio.
:::
