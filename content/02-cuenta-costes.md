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

::: demo Crear un presupuesto de gasto cero
1. Inicia sesión como usuario raíz y abre [Budgets](aws:budgets).
2. Elige **Create budget** → **Use a template**.
3. Selecciona **Zero spend budget**.
4. Escribe tu correo y crea el presupuesto.
:::

::: demo Revisar créditos y gasto
1. Abre [Facturación](aws:billing) y revisa el gasto del mes.
2. Abre [Capa gratuita](aws:freetier) y mira qué estás consumiendo.
:::

---

# Ejercicio

::: ejercicio Prepara tu cuenta
1. Crea una cuenta en [aws.amazon.com](https://aws.amazon.com/).
2. Activa la autenticación multifactor (MFA) del usuario raíz.
3. Crea un presupuesto de gasto cero.
4. Crea otro presupuesto mensual de 10 $ con aviso al 80 %.
:::

::: limpieza Hábito de cada clase
- Al terminar, repasa lo creado en la región del curso.
- Una instancia detenida no paga CPU, pero su disco EBS sí.
:::
