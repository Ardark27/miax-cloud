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

# El muro entre Dev y Ops

![Desarrollo y operaciones separados por un muro](assets/img/19-devops/1.png)

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

# Muchas definiciones

![Distintas definiciones de DevOps alrededor de un elefante](assets/img/19-devops/2.png)

---

# El ciclo DevOps

![Bucle infinito de plan, build, integration, deploy y operate](assets/img/19-devops/3.png)

---

# Herramientas

![Herramientas habituales en cada fase del ciclo DevOps](assets/img/19-devops/11.png)

---

# Prácticas

![Prácticas: repositorio único, builds automatizadas, tests, iteraciones, entornos, visibilidad y despliegues](assets/img/19-devops/5.png)

---

# CI/CD

| | Qué hace |
|---|---|
| **Integración continua** | Une el código a menudo y ejecuta build y tests automáticos |
| **Entrega continua** | Deja siempre una versión lista para desplegar |
| **Despliegue continuo** | Lleva cada cambio válido a producción automáticamente |

**Prácticas clave**: un único repositorio, builds automatizadas, tests automáticos, entornos estables, iteraciones frecuentes, máxima visibilidad y despliegues automáticos.

---

# CI y CD

![Bucle de integración y despliegue continuos](assets/img/19-devops/6.png) ![Continuous Delivery y Continuous Deployment](assets/img/19-devops/4.png)

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

# Un proceso o varios

![Monolito en un solo proceso](assets/img/19-devops/9.png) ![Microservicios en procesos separados que se comunican](assets/img/19-devops/10.png)

---

# Nuestro flujo de trabajo

::: flow
git push -> GitHub Actions :: tests y linter -> Build :: imagen Docker -> ECR -> Lambda o ECS :: despliegue
:::

En las próximas lecciones lo construimos paso a paso.

---

# Del código a producción

![Código, tests, pull request, servidor de CI y despliegue](assets/img/19-devops/13.png)
