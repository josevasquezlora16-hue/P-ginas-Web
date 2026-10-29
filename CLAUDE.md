# Memoria del proyecto (léela al empezar)

Repositorio de páginas web de demostración para negocios locales en República Dominicana. El usuario escribe en español; responde siempre en español, con lenguaje sencillo.

## Demo de Express Barber (proyecto principal)

- **Carpeta:** `the-family-barber-shop-ii/demo/` (el nombre de la carpeta es histórico: empezó como "The Family Barber Shop II" y se convirtió en Express Barber).
- **Página:** un solo archivo, `index.html`, con el CSS y el JS dentro. Las fotos y videos están en `media/` (`media/ig/` son fotos del Instagram del negocio).
- **Plan de marketing y web:** `the-family-barber-shop-ii/plan-pagina-web.md`.
- **Rama de trabajo:** `claude/upbeat-fermat-ejl14h` (borrador de PR #1 en `josevasquezlora16-hue/P-ginas-Web`).

### Datos reales del negocio (no inventar otros)

- **Nombre:** Express Barber · Lema: "Un corte hace la diferencia" · "Estilo · Precisión · Actitud".
- **Dirección:** Plaza Central, primer nivel, frente a Óptica López (dentro de Hollywood), Av. 27 de Febrero, Piantini, Santo Domingo 10100.
- **WhatsApp/teléfono:** 809-229-8089 (en el código: `18092298089`).
- **Instagram:** @express_barber01.
- **Horario:** lunes a sábado de 9:00 a.m. a 8:00 p.m.; domingo de 10:00 a.m. a 8:00 p.m.
- **Google:** 5.0 estrellas, 22 opiniones. Reseñas reales usadas: Yildary V. y Alejandro V.
- **Precios (RD$):** corte adulto 600 · corte y barba 800 · corte infantil 500 · barba 350 · tintado de barba 500 · facial 500 · mantenimiento 500 · lavado 300. Cada corte dura unos 35 minutos.
- **Promociones reales:** cortes a RD$600 de lunes a jueves; experiencia premium a domicilio en Piantini, Naco, Bella Vista, Serrallés, Evaristo Morales, Los Cacicazgos, Julieta Morales y Arroyo Hondo Viejo. Tarjeta de fidelidad y referidos son **propuestas** (marcadas así en la página).
- **De ejemplo todavía:** los barberos (nombres y fotos de Unsplash). Pedir los datos reales al usuario.

### Decisiones ya tomadas

- **Entrada:** puertas de vidrio oscuro que se abren en 3D (CSS/JS, no es un video). Se abren solas 1.5 s después de cargar la página; se pueden saltar. El usuario **no quiso** el video de entrada anterior: no volver a ponerlo.
- La portada tiene un video de fondo hecho con fotos de su Instagram (`media/portada.*`) y un poste de barbero 3D con Three.js.
- La página siempre empieza arriba (no restaurar el scroll ni saltar a `#secciones`).
- No usar fotos o videos donde aparezca la marca de otra barbería.

### Publicación

- **Cloudflare (actual):** https://express-barber-demo.dour-fernleaf.workers.dev, en la cuenta de Cloudflare del usuario. `wrangler.jsonc` (en la raíz) publica la carpeta de la demo como archivos estáticos con el nombre `express-barber-demo`; `.assetsignore` deja fuera los archivos de Netlify.
- Esta sesión no tiene acceso a la cuenta de Cloudflare del usuario. Para publicar cambios: que el usuario conecte el repositorio en Cloudflare (Production branch `claude/upbeat-fermat-ejl14h`, deploy command `npx wrangler deploy`), que agregue `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en la configuración del entorno, o enviarle un `.zip` de la carpeta `demo` para subirlo en Pages → Upload assets. Nunca pedir que pegue un token en el chat.
- **Netlify (viejo):** `express-barber-demo.netlify.app` quedó con una versión anterior; la cuenta se quedó sin créditos.

### Cómo probar antes de publicar

Servir la carpeta con `python3 -m http.server` y probar con Playwright usando `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`, en 1366 px y 390 px de ancho. Revisar: que no haya errores de JS, que no haya desplazamiento horizontal, que las puertas se cierren y la página quede arriba, y que la reserva termine en `wa.me/18092298089`.

## Otros proyectos en el repositorio

- Rama `claude/web-optimization-checklist-7fpsrr`: sitio de Aloe Eventos.
