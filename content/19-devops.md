# Filosofía DevOps

Unir desarrollo y operación para entregar software con frecuencia y seguridad.

---

# El problema

Todo necesita software, y el software debe ejecutarse en un servidor para ser un servicio. Los síntomas habituales de una mala entrega:

- Errores que llegan a producción.
- Fallos difíciles de diagnosticar.
- Problemas que solo aparecen en algunos entornos.
- Esperas entre equipos y culpas cruzadas.
- Errores manuales.

::: flow
Desarrollo :: quiere cambiar rápido -> El muro de la confusión -> Operaciones :: quiere estabilidad
:::

---

# Qué propone DevOps

Automatizar y medir cada paso de la construcción del software.

::: flow
Planificar -> Código -> Build -> Test -> Publicar -> Desplegar -> Operar -> Monitorizar
:::

**Resultados**

- Ciclos de desarrollo más cortos.
- Despliegues más frecuentes y fiables.
- Mejor alineación con el negocio.

---

# CI/CD

| | Qué hace |
|---|---|
| **Integración continua** | Une el código a menudo y ejecuta build y tests automáticos |
| **Entrega continua** | Deja siempre una versión lista para desplegar |
| **Despliegue continuo** | Lleva cada cambio válido a producción automáticamente |

**Prácticas clave**: un único repositorio, builds automatizadas, tests automáticos, entornos estables, iteraciones frecuentes, máxima visibilidad y despliegues automáticos.

---

# Monolito y microservicios

| | Monolito | Microservicios |
|---|---|---|
| **Despliegue** | Todo junto | Por servicio |
| **Escalado** | Toda la aplicación | Solo lo necesario |
| **Complejidad** | En el código | En la red y la operación |
| **Buen punto de partida** | Equipos pequeños | Varios equipos independientes |

Los microservicios no son mejores por defecto: tienen un coste de operación real.

---

# Nuestro flujo de trabajo

::: flow
git push -> GitHub Actions :: tests y linter -> Build :: imagen Docker -> ECR -> Lambda o ECS :: despliegue
:::

En las próximas lecciones lo construimos paso a paso.
