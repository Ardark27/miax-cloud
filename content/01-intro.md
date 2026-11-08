# Introducción a AWS

Qué es, cómo se organiza físicamente y qué modelos de servicio ofrece.

---

# AWS en contexto

- **2002**: primeros servicios para desarrolladores.
- **2006**: lanzamiento de S3 y EC2, el origen de la nube actual.
- **Hoy**: más de 200 servicios.
- **Ingresos**: unos 46.000 M$ solo en el tercer trimestre de 2026.
- **Cuota de mercado**: líder con cerca del 26 %, por delante de Microsoft (19 %) y Google (16 %), según Synergy Research.

::: novedad Un mercado que cambia
La cuota de AWS baja mientras el mercado crece un 55 % anual, impulsado por la IA. La oferta de la nube ya incluye a los llamados *neoclouds*, especializados en GPU.
:::

---

# Infraestructura global

[39 regiones y 124 zonas de disponibilidad](https://aws.amazon.com/about-aws/global-infrastructure/), y sigue creciendo.

<div class="nest row">
  <span class="nest-label">Región: eu-west-3 (París)</span>
  <div class="nest"><span class="nest-label">Zona A</span>Uno o más centros de datos</div>
  <div class="nest"><span class="nest-label">Zona B</span>Uno o más centros de datos</div>
  <div class="nest"><span class="nest-label">Zona C</span>Uno o más centros de datos</div>
</div>

- **Región**: área geográfica independiente y aislada del resto.
- **Zona de disponibilidad (AZ)**: ubicación aislada dentro de la región, unida a las demás por una red redundante de baja latencia.

---

# La región importa

- La consola solo muestra los recursos de la **región seleccionada**.
- Los datos no se replican a otra región salvo que lo configures.
- Elige región por **latencia**, **coste**, **servicios disponibles** y **requisitos legales**.

::: demo Compruébalo
1. Abre [EC2](aws:ec2) y fíjate en el selector de región, arriba a la derecha.
2. Cambia a otra región: la lista de recursos es distinta.
3. Vuelve a tu región.
:::

::: nota España
`eu-south-2` es la región de España, pero no todos los servicios están allí. Por ejemplo, comprueba Textract antes de usarla. En el curso usamos `eu-west-3`.
:::

---

# IaaS, PaaS y SaaS

| Modelo | Tú gestionas | AWS gestiona | Ejemplos |
|---|---|---|---|
| **IaaS** | Sistema, runtime, datos, app | Hardware y virtualización | EC2, EBS, VPC |
| **PaaS / Serverless** | Tu código y datos | También sistema y escalado | Lambda, ECS Fargate, DynamoDB |
| **SaaS** | Solo el uso | Todo | Athena desde la consola, Textract |

Cuanto más arriba subes, menos operas y menos control tienes.

Más información: [tipos de computación en la nube](https://aws.amazon.com/es/types-of-cloud-computing/).

---

# Servicios públicos y privados

- **Públicos**: tienen un endpoint accesible desde Internet, como S3 o DynamoDB. Eso no significa que tus datos sean públicos: siguen protegidos por IAM.
- **Privados**: viven dentro de tu red (VPC), como una instancia EC2 o una base de datos RDS.

Lo veremos en detalle en la lección de VPC.

---

# Documentación

- [Documentación oficial](https://docs.aws.amazon.com/index.html)
- [Precios](https://aws.amazon.com/es/pricing/) y [calculadora](https://calculator.aws)
- [Novedades de AWS](https://aws.amazon.com/new/)

::: aviso Consejo para todo el curso
AWS cambia a menudo sus pantallas. Si un botón no coincide con lo que dice un paso, busca la misma opción por su nombre en la página.
:::
