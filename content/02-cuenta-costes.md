# Cuenta, costes y alertas

Antes de crear nada: saber qué se paga y cómo enterarse a tiempo.

---

# Qué se paga en AWS

| Concepto | Ejemplo |
|---|---|
| **Cómputo** | CPU y RAM de EC2, tiempo de Lambda, Fargate |
| **Almacenamiento** | GB en S3, volúmenes EBS (usados o reservados) |
| **Transferencia de salida** | Datos que salen de AWS hacia Internet |
| **IP pública** | 0,005 $/hora por cada IPv4 pública, también en uso |

- [Precios](https://aws.amazon.com/es/pricing/)
- [Calculadora](https://calculator.aws)

---

# La capa gratuita ha cambiado

::: novedad Cuentas creadas desde el 15 de julio de 2025
Ya no hay 12 meses de uso gratuito limitado por servicio. Ahora funciona con **créditos**.
:::

| | Plan gratuito | Plan de pago |
|---|---|---|
| **Créditos** | 100 $ al registrarte y hasta 100 $ más por completar actividades | Igual |
| **Duración** | 6 meses o hasta agotar créditos | Créditos válidos 12 meses |
| **Al agotarse** | La cuenta se cierra, sin cargos | Se factura a precio normal |
| **Servicios** | Algunos no están disponibles | Todos |

Además, hay ofertas **siempre gratuitas** para todas las cuentas. Detalles: [capa gratuita](https://aws.amazon.com/free/).

---

# Qué plan elegir para el curso

- **Plan gratuito**: sin riesgo de factura. Puede que algún servicio caro no esté disponible.
- **Plan de pago**: acceso completo, pero **responsabilidad tuya** vigilar el gasto.
- Las cuentas anteriores a julio de 2025 mantienen el modelo antiguo de 12 meses.

::: aviso Si tienes un plan gratuito
Añadir la cuenta a AWS Organizations la convierte en cuenta de pago y pierde los créditos. No lo necesitamos en este curso.
:::

---

# Presupuesto y alertas

Las dos herramientas actuales para no llevarse sustos:

- **AWS Budgets**: avisa cuando el gasto real o previsto supera un límite. Es la opción recomendada.
- **CloudWatch**: permite alarmas sobre cualquier métrica, incluida la facturación.

Crearás tu presupuesto en el último ejercicio de esta lección.

::: demo Revisar créditos y gasto
1. Abre [Facturación](aws:billing) y revisa el gasto del mes.
2. Abre [Capa gratuita](aws:freetier) y mira qué estás consumiendo.
:::

---

# Consigue 100 $ más en créditos

AWS da **20 $ por cada actividad** completada. Son cinco y las haremos como ejercicios:

| Actividad | Lección |
|---|---|
| Crear un presupuesto de costes | Esta lección |
| Lanzar una instancia EC2 | [Amazon EC2](#/05-ec2) |
| Crear una web con Lambda | [Disparadores](#/14-lambda-triggers) |
| Crear una base de datos Aurora | [DynamoDB](#/24-dynamodb) |
| Usar un modelo en Bedrock | [Textract](#/26-textract) |

---

# Dónde están las actividades

En la [página de inicio de la consola](aws:home), busca **Explore AWS** y, en **Filtrar**, elige **Earn AWS credits**.

![Widget Explore AWS con las actividades que dan 20 $ de crédito](assets/img/02-cuenta-costes/explore-aws.png)

---

# Reglas de las actividades

- Empieza cada una desde el widget, con **Iniciar actividad**, para seguir sus pasos. Hacer la tarea por tu cuenta también puede contar: el presupuesto se completa así.
- Tienes **6 meses** desde que abriste la cuenta. Los créditos ganados caducan a los 12 meses.
- Casi todas gastan algo de crédito mientras las haces, así que borra lo creado al terminar.
- Los créditos pueden tardar unos minutos en aparecer.

::: nota Si no ves el widget
Con un usuario de IAM puede no aparecer. En ese caso, entra como usuario raíz solo para hacer la actividad.
:::

---

# Ejercicio

::: ejercicio Prepara tu cuenta
1. Comprueba que tu cuenta está activa y con MFA, como vimos en la Introducción.
:::

::: limpieza Hábito de cada clase
- Al terminar, repasa lo creado en la región del curso.
- Una instancia detenida no paga CPU, pero su disco EBS sí.
:::

---

# Actividad de créditos: presupuesto

![Ficha de la actividad de presupuesto de costes, con premio de 20 dólares](assets/img/02-cuenta-costes/actividad-creditos.png)

---

# Ejercicio: presupuesto de costes

::: ejercicio Gana tus primeros 20 $
1. Inicia sesión como usuario raíz y abre [Budgets](aws:budgets).
2. Elige **Create budget** → **Use a template**.
3. Selecciona **Zero spend budget**.
4. Escribe tu correo y crea el presupuesto.
5. En la [consola](aws:home), comprueba en **Explore AWS** que la actividad aparece como completada.
6. Revisa en [Facturación](aws:billing) que los 20 $ se suman a tus créditos.
:::
