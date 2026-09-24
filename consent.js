/* Aloe Eventos — consent.js
   Banner de cookies + analítica (Google Analytics 4).
   GA4 solo se carga si hay un ID en config.js y el visitante pulsa "Aceptar".
   Se incluye en todas las páginas, después de config.js. */
(function () {
  "use strict";

  var CFG = window.__ALOE__ || {};
  var KEY = "aloe-consent-v1";
  var GA_ID = /^G-[A-Z0-9]{4,}$/.test(String(CFG.ga4 || "")) ? CFG.ga4 : "";

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* modo privado */ } }

  /* ---------- Analítica ---------- */
  var gaLoaded = false;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function loadAnalytics() {
    if (!GA_ID || gaLoaded) return;
    gaLoaded = true;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  if (GA_ID) {
    window.gtag("consent", "default", {
      analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied"
    });
  }

  /* Evento de conversión reutilizable (main.js lo llama al enviar el pedido). */
  window.aloeTrack = function (name, params) {
    if (gaLoaded && typeof window.gtag === "function") window.gtag("event", name, params || {});
  };

  /* ---------- Banner ---------- */
  var banner;
  function hide() { if (banner) { banner.classList.remove("is-in"); setTimeout(function () { banner.hidden = true; }, 350); } }
  function choose(v) {
    write(v);
    if (v === "all") loadAnalytics();
    else if (gaLoaded) window.gtag("consent", "update", { analytics_storage: "denied" });
    hide();
  }

  function build() {
    banner = document.createElement("div");
    banner.className = "cookie";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.innerHTML =
      '<p class="cookie-text">Usamos cookies propias necesarias y, si lo aceptas, cookies de analítica para saber qué partes de la web se usan más. ' +
      '<a href="/privacidad.html#cookies">Más información sobre cookies</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn cookie-btn--ghost" data-cookie="necessary">Solo necesarias</button>' +
      '<button type="button" class="cookie-btn" data-cookie="all">Aceptar</button>' +
      "</div>";
    banner.hidden = true;
    document.body.appendChild(banner);
    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cookie]");
      if (b) choose(b.getAttribute("data-cookie"));
    });
  }

  function show() {
    if (!banner) build();
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add("is-in"); });
  }

  function boot() {
    var v = read();
    if (v === "all") loadAnalytics();
    if (!v) show();
    /* Cualquier enlace con data-cookie-settings reabre el banner. */
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-cookie-settings]");
      if (!a) return;
      e.preventDefault();
      show();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
