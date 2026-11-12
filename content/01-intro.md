# Introducción a AWS

Qué es, cómo se organiza físicamente y qué modelos de servicio ofrece.

---

# AWS en contexto

- **2002**: primeros servicios para desarrolladores, de uso interno.
- **2004**: lanzamiento público.
- **2006**: lanzamiento de S3 y EC2, el origen de la nube actual.
- **2010**: todo amazon.com funciona sobre AWS.
- **Hoy**: más de 200 servicios.
- **Ingresos**: unos 46.000 M$ solo en el tercer trimestre de 2026.
- **Cuota de mercado**: líder con cerca del 26 %, por delante de Microsoft (19 %) y Google (16 %), según Synergy Research.
- **Tendencia**: el mercado crece un 55 % anual, impulsado por la IA, y aparecen los llamados *neoclouds*, especializados en GPU.

---

# Más de 200 servicios

![Tabla periódica de los servicios de AWS, agrupados por categoría](assets/img/01-intro/aws_periodic.jpg)

<p class="pie">Ilustración de @awsgeek. No incluye los servicios más recientes.</p>

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
- Al lanzar un recurso puedes elegir la zona o dejar que AWS la elija.
- Las regiones están aisladas entre sí para tolerar fallos, y se unen por una red de gran ancho de banda y redundante.
- Además existen **Local Zones** (cerca de grandes ciudades), **Outposts** (hardware de AWS en tu centro de datos) y **Wavelength** (dentro de redes 5G).

---

# IaaS, PaaS y SaaS

Son tres formas de alquilar tecnología. La diferencia está en **de qué te encargas tú** y de qué se encarga el proveedor. Piensa en cómo te mueves por la ciudad:

| Modelo | En el día a día | Te encargas de | Se encarga otro de |
|---|---|---|---|
| **On-site** | Tu propio coche | Todo: comprarlo, seguro, taller y conducir | Nada |
| **IaaS** | Coche de alquiler | Conducir, la gasolina y la ruta | Comprarlo, seguro y taller |
| **PaaS** | Taxi | Decir adónde vas | El coche y la conducción |
| **SaaS** | Autobús | Subirte y bajarte | El vehículo, la ruta y el horario |

---

# Los tres modelos, uno a uno

- **IaaS (infraestructura como servicio)**: alquilas un servidor virtual vacío. Instalas y actualizas tú el sistema, las librerías y tu aplicación. Netflix, por ejemplo, alquila a AWS gran parte de sus servidores.
- **PaaS (plataforma como servicio)**: subes tu código y el proveedor lo ejecuta. No ves el servidor ni lo actualizas. Snapchat, por ejemplo, nació sobre Google App Engine.
- **SaaS (software como servicio)**: usas una aplicación ya terminada y solo necesitas una cuenta. Outlook, Gmail, Google Drive, Spotify o Microsoft 365 son SaaS.

::: nota Ejemplo: quieres publicar un blog
**IaaS**: alquilas un servidor e instalas WordPress. **PaaS**: subes el código del blog a Vercel. **SaaS**: abres una cuenta en Substack y escribes.
:::

---

# Quién gestiona qué

![Capas que gestionas tú y capas que gestiona el proveedor en on-site, IaaS, PaaS y SaaS](assets/img/01-intro/iaas-paas-saas.png)

<p class="pie">De izquierda a derecha, el proveedor asume cada vez más capas. On-site son tus propios servidores.</p>

---

# Los modelos en AWS

| Modelo | Tú gestionas | AWS gestiona | Ejemplos |
|---|---|---|---|
| **IaaS** | Sistema, runtime, datos, app | Hardware y virtualización | EC2, EBS, VPC |
| **PaaS / Serverless** | Tu código y datos | También sistema y escalado | Lambda, ECS Fargate, DynamoDB |
| **SaaS** | Solo el uso | Todo | Athena desde la consola, Textract |

Cuanto más gestiona AWS, menos operas y menos control tienes.

Más información: [tipos de computación en la nube](https://aws.amazon.com/es/types-of-cloud-computing/).

---

# Documentación

- [Documentación oficial](https://docs.aws.amazon.com/index.html)
- [Precios](https://aws.amazon.com/es/pricing/) y [calculadora](https://calculator.aws)
- [Novedades de AWS](https://aws.amazon.com/new/)

::: aviso Consejo para todo el curso
AWS cambia a menudo sus pantallas. Si un botón no coincide con lo que dice un paso, busca la misma opción por su nombre en la página.
:::

---

# Crea tu cuenta de AWS

Si ya tienes una cuenta, salta directamente a «La región importa», la última diapositiva de esta lección.

Para registrarte necesitas:

- Un **correo** al que tengas acceso: será el usuario raíz y sirve para recuperar la cuenta.
- Un **teléfono** que pueda recibir SMS.
- Una **tarjeta** de crédito o débito. AWS retiene 1 $ para verificarla y luego lo devuelve.

::: aviso Hazlo antes de la primera clase
La activación suele tardar unos minutos, pero puede llegar a 24 horas.
:::

---

# Registro: datos de acceso

::: demo Crear la cuenta
1. Abre el [registro avanzado de AWS](aws:signup). Entra por este enlace: otros botones de la web pueden llevarte al registro nuevo.
2. Escribe el correo y un nombre de cuenta, como `nombre-apellido-miax`, y pulsa **Verify email address**.
3. Introduce el código que recibes por correo y pulsa **Verify**.
4. Crea una contraseña de al menos 8 caracteres que combine tres tipos: mayúsculas, minúsculas, números o símbolos.
5. Elige el plan de la cuenta.
:::

---

# Registro: código y contraseña

Tras escribir el correo, verás estas dos pantallas.

![Pantalla para introducir el código de verificación](assets/img/01-intro/registro-codigo.png)
![Pantalla para crear la contraseña del usuario raíz](assets/img/01-intro/registro-password.png)

---

# Registro: elige el plan

Si tienes dudas, elige **Gratuito** (*Free*): en la siguiente lección vemos las diferencias.

![Pantalla de elección entre el plan gratuito y el plan de pago](assets/img/01-intro/registro-plan.png)

---

# Registro: facturación y activación

::: demo Completar el alta
1. Rellena tus datos de contacto y acepta el acuerdo de cliente.
2. Elige el plan de soporte gratuito, **Basic**.
3. Añade la tarjeta: sin un método de pago válido no se puede continuar.
4. Si te lo pide, escribe tu teléfono, pulsa **Send SMS** e introduce el código.
:::

---

# Dentro de la consola

Cuando la cuenta está activa, inicia sesión y verás la página de inicio.

![Página de inicio de la consola de AWS](assets/img/01-intro/consola-inicio.png)

<p class="pie">La consola puede abrirse en otra región, como aquí Estocolmo. Al final de la lección vemos cómo cambiarla.</p>

---

# Protege la cuenta

El usuario raíz puede hacer cualquier cosa, incluido cerrar la cuenta. Actívale el MFA nada más entrar.

::: demo Activar MFA en el usuario raíz
1. Abre [Credenciales de seguridad](aws:mfa).
2. En **Multi-factor authentication (MFA)**, pulsa **Assign MFA device**.
3. Elige una clave de acceso o una aplicación de autenticación y sigue los pasos.
:::

::: aviso Usuario raíz
No le crees claves de acceso. En la lección de IAM crearás un usuario para el día a día.
:::

---

# Dónde se asigna el MFA

![Bloque de autenticación multifactor en las credenciales de seguridad](assets/img/01-intro/mfa-asignar.png)

<p class="pie">Con la consola en español, el botón se llama «Asignar dispositivo MFA».</p>

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
