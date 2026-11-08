# Redes: Amazon VPC

Tu porción aislada de la red de AWS.

---

# Qué es una VPC

- Red virtual privada dentro de una **región**.
- Se divide en **subredes**, cada una en una zona de disponibilidad.
- Cada región trae una **VPC por defecto**, lista para usar.

<div class="nest">
  <span class="nest-label">Región</span>
  <div class="nest">
    <span class="nest-label">VPC 172.31.0.0/16 · con Internet Gateway</span>
    <div class="nest row">
      <span class="nest-label">Zonas de disponibilidad</span>
      <div class="nest pub"><span class="nest-label">Subred pública · AZ A</span>EC2 con IP pública</div>
      <div class="nest priv"><span class="nest-label">Subred privada · AZ B</span>Base de datos sin IP pública</div>
    </div>
  </div>
</div>

---

# Subred pública y privada

| | Pública | Privada |
|---|---|---|
| **Ruta a Internet** | Por Internet Gateway | Sin ruta directa |
| **IP pública** | Sí | No |
| **Uso típico** | Balanceadores, webs | Bases de datos, procesos internos |

Una subred privada puede salir a Internet con un **NAT Gateway**, que tiene coste por hora y por GB.

---

# Acceso a S3 desde una VPC

::: flow
EC2 en subred privada -> Gateway Endpoint :: sin coste -> Amazon S3
:::

Un **Gateway Endpoint** lleva el tráfico a S3 o DynamoDB por la red de AWS, sin pasar por Internet ni por un NAT Gateway.

---

# Demo

::: demo Explora tu red
1. Abre [VPC](aws:vpc) y localiza la VPC marcada como **Default**.
2. Entra en **Subnets** y cuenta una por zona de disponibilidad.
3. Entra en **Route tables** y localiza la ruta `0.0.0.0/0` hacia el Internet Gateway.
:::

::: aviso No borres la VPC por defecto
Muchos asistentes la usan, incluido ECS Express Mode, que veremos más adelante.
:::
