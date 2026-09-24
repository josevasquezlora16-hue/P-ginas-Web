# P-ginas-Web

Sitio estático de **Aloe Eventos** (flores, globos y detalles en Santo Domingo), listo para Hostinger.
Instrucciones de publicación en [`LEEME.txt`](LEEME.txt).

## Checklist de lanzamiento

| # | Punto | Dónde |
|---|-------|-------|
| 1 | Política de privacidad | `privacidad.html` |
| 2 | Términos y condiciones | `terminos.html` |
| 3 | Sin secretos en el frontend | `config.js` solo tiene datos públicos (aviso incluido); `.htaccess` bloquea archivos internos |
| 4 | Forzar HTTPS | `.htaccess` (redirección 301 + HSTS) |
| 5 | Banner de cookies | `consent.js` (Aceptar / Solo necesarias, se puede reabrir desde el footer) |
| 6 | Meta títulos y descripciones | `<head>` de cada página + canonical + JSON-LD |
| 7 | Imagen para redes | `assets/img/og-image.jpg` (1200×630) + Open Graph / Twitter |
| 8 | Favicon | `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `site.webmanifest` |
| 9 | Sitemap + robots.txt | `sitemap.xml`, `robots.txt` |
| 10 | Texto alternativo | Todas las imágenes con descripciones específicas |
| 11 | Imágenes comprimidas | WebP de 12–28 KB; imagen OG en JPEG progresivo |
| 12 | Velocidad de carga | Lighthouse móvil: 100 en rendimiento (fuentes no bloqueantes, splash más corto, precarga de la imagen principal) |
| 13 | Contraste de color | Tokens `--ink-mute`, `--pink-ink`, `--leaf-light` (texto ≥ 4.5:1) |
| 14 | Adaptado a móvil | Probado a 375 px sin scroll horizontal |
| 15 | Página 404 | `404.html` + `ErrorDocument` en `.htaccess` |
| 16 | Enlaces rotos | Todos los enlaces y anclas verificados |
| 17 | Validación de formulario | Errores por campo, fecha mín./máx., longitudes, `aria-invalid` |
| 18 | Protección anti-spam | Campo trampa (honeypot), tiempo mínimo, límite de envíos, filtro de enlaces |
| 19 | Analítica | Google Analytics 4 con Consent Mode (solo tras aceptar) + evento `generate_lead` |
| 20 | Una llamada a la acción clara | «Haz tu pedido» en nav, hero y 404; la acción secundaria es un enlace discreto |
