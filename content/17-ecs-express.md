# ECS Express Mode

Desplegar un contenedor web con URL pública usando una imagen y dos roles.

---

# Por qué no App Runner

::: aviso App Runner está cerrado a clientes nuevos
Desde el **30 de abril de 2026** las cuentas nuevas no pueden usarlo. Las cuentas existentes continúan, pero no tendrá funciones nuevas. AWS [recomienda migrar](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html) a **ECS Express Mode**.
:::

ECS Express Mode ofrece la misma comodidad, y todos los recursos quedan visibles en tu cuenta.

---

# Qué crea

::: flow
Tu imagen :: en ECR -> ECS Express Mode -> Load balancer :: HTTPS -> Fargate :: tus contenedores -> URL :: servicio.ecs.región.on.aws
:::

- Servicio ECS sobre **Fargate**, sin servidores que gestionar.
- **Application Load Balancer** con HTTPS y certificado.
- Autoescalado, logs, alarmas y despliegues canary.

Necesita dos roles:

| Rol | Permite |
|---|---|
| `ecsTaskExecutionRole` | Descargar la imagen y escribir logs |
| `ecsInfrastructureRoleForExpressServices` | Crear el balanceador y la red |

::: aviso Tiene coste por hora
Sin nivel gratuito propio: se paga Fargate, el balanceador y sus IP públicas, del orden de 2 a 3 $ al día con la configuración por defecto (estimación). **Bórralo al terminar la clase.**
:::

---

# Salud del servicio

El balanceador comprueba periódicamente una ruta. Por defecto es `/`, y nuestro API no la tenía: daría error 404 y el despliegue fallaría.

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/suma")
def suma(a: int, b: int) -> int:
    return a + b
```

---

# Demo: desde la consola

::: demo Crear el servicio
1. Abre [ECS](aws:ecs) y elige **Express mode** en el menú lateral.
2. En **Image URI**, pulsa **Browse ECR images** y selecciona `miax-suma:latest`.
3. En **Task execution role** e **Infrastructure role**, usa **Create new role** si no existen.
4. Despliega **Additional configurations**.
5. **Name**: `miax-suma`.
6. **Container port**: `8080`.
7. **Health check path**: `/health`.
8. Pulsa **Create** y sigue el progreso en la pestaña **Resources**.
9. Abre la **Application URL** y añade `/docs`.
:::

---

# Desde la CLI

```bash
aws ecs create-express-gateway-service \
  --service-name miax-suma \
  --execution-role-arn arn:aws:iam::{{account}}:role/ecsTaskExecutionRole \
  --infrastructure-role-arn arn:aws:iam::{{account}}:role/ecsInfrastructureRoleForExpressServices \
  --primary-container '{"image":"{{account}}.dkr.ecr.{{region}}.amazonaws.com/miax-suma:latest","containerPort":8080}' \
  --health-check-path /health \
  --monitor-resources
```

::: nota Si la consola o la CLI dan error de rol
Los roles recién creados tardan alrededor de un minuto en propagarse. Vuelve a intentarlo.
:::

---

# Ejercicio y limpieza

::: ejercicio Publica el API
1. Añade la ruta `/health` y sube la imagen a ECR.
2. Despliega con ECS Express Mode.
3. Prueba `https://URL/suma?a=1&b=2`.
4. Mira los logs y los recursos creados en el balanceador.
:::

::: limpieza Obligatorio al terminar
1. En [ECS](aws:ecs), abre el clúster `default` y borra el servicio, o usa el comando de abajo.
2. Comprueba que ya no existe en [Load Balancers](aws:ec2-lb).
3. Revisa que no queden tareas en ejecución.
:::

```bash
aws ecs delete-express-gateway-service \
  --service-arn arn:aws:ecs:{{region}}:{{account}}:service/default/miax-suma
```
