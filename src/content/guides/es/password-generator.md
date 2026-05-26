---
title: "Generación de Contraseñas Criptográficamente Seguras"
description: "Por qué Math.random() no es suficiente y cómo Lumea garantiza que sus contraseñas sean verdaderamente seguras."
category: "dev"
toolId: "password-generator"
---

En el mundo de la ciberseguridad, la aleatoriedad lo es todo. Una contraseña que "parece" aleatoria para un humano puede ser fácilmente adivinable por una computadora si la fuente de aleatoriedad es débil.

### El Problema con las Herramientas Estándar

Muchos sitios web utilizan `Math.random()` para generar contraseñas. Este es un generador de números pseudoaleatorios (PRNG) que no está diseñado para la seguridad. Puede ser predecible bajo ciertas condiciones.

### La Solución de Lumea

Utilizamos el método `crypto.getRandomValues()` de la **API Web Crypto**. Esta es una fuente de aleatoriedad criptográficamente sólida proporcionada por su navegador. Es la misma tecnología utilizada para firmas digitales y cifrado.

### Consejos para Contraseñas Fuertes

- **Longitud**: Utilice al menos 16 caracteres.
- **Complejidad**: Incluya números y símbolos.
- **Unicidad**: Nunca reutilice una contraseña en diferentes sitios.

Nuestro generador le permite personalizar todos estos factores y le proporciona una cadena segura al instante, sin enviar esa cadena a ningún servidor.
