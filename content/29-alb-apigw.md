# Load Balancer y API Gateway

Distribuir tráfico y publicar API.

---

# Elastic Load Balancing

Reparte el tráfico entre instancias EC2, contenedores, direcciones IP o funciones Lambda, en una o varias zonas de disponibilidad.

| Tipo | Capa | Uso |
|---|---|---|
| **Application (ALB)** | HTTP y HTTPS | Webs y API; lo que crea ECS Express Mode |
| **Network (NLB)** | TCP y UDP | Latencia muy baja |
| **Gateway (GWLB)** | Red | Dispositivos virtuales de seguridad |
| **Classic** | Anterior | No usar en proyectos nuevos |

---

# Público o interno

::: flow
Internet -> ALB público :: subredes públicas -> Aplicación :: subredes privadas -> ALB interno -> Base de datos o servicio interno
:::

::: demo Ver un balanceador
1. Abre [Load Balancers](aws:ec2-lb).
2. Revisa **Listeners** y **Target groups**.
:::

---

# Balanceador público e interno

![Balanceador de cara a Internet](assets/img/29-alb-apigw/internet_facing_load_balancer.png) ![Balanceador interno entre subredes privadas](assets/img/29-alb-apigw/internal_load_balancer.png)

---

# Amazon API Gateway

Crea, publica, supervisa y protege API.

::: flow
Cliente -> API Gateway :: autorización, límites -> Lambda u otro backend
:::

| Tipo | Elegir cuando |
|---|---|
| **HTTP API** | Caso general: más simple y más barato |
| **REST API** | Claves de API, transformaciones, caché |
| **WebSocket API** | Comunicación bidireccional |

::: demo Explorar
1. Abre [API Gateway](aws:apigw).
2. Abre la HTTP API creada con la función de suma.
3. Revisa rutas, integraciones y stages.
:::

---

# Cómo funciona API Gateway

![Clientes, API Gateway y servicios de destino](assets/img/29-alb-apigw/API-Gateway-How-Works.png)
