/* Aloe Eventos — main.js (classic script, no modules) */
(function () {
  "use strict";

  var CFG = window.__ALOE__ || { whatsapp: "", instagram: "aloeventsrd" };
  var hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[aloe] " + name + " failed", e); } }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- Splash ---------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    /* No esperamos a "load" (fuentes e imágenes): el contenido ya está listo. */
    setTimeout(hide, 600);
  }

  /* ---------- Split words ---------- */
  function esc(t) { return t.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function initSplit() {
    $$("[data-split]").forEach(function (el) {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "1";
      el.classList.remove("reveal");
      var fullText = el.textContent.trim().replace(/\s+/g, " ");
      var i = 0;
      var wrap = function (text) {
        return text.split(/(\s+)/).map(function (w) {
          if (!w) return "";
          if (/^\s+$/.test(w)) return " ";
          return '<span class="split-word" aria-hidden="true"><span style="--i:' + (i++) + '">' + esc(w) + "</span></span>";
        }).join("");
      };
      el.innerHTML = Array.prototype.map.call(el.childNodes, function (n) {
        if (n.nodeType === 3) return wrap(n.textContent);
        if (n.nodeName === "BR") return "<br>";
        if (n.nodeType === 1) { var t = n.tagName.toLowerCase(); return "<" + t + ">" + wrap(n.textContent) + "</" + t + ">"; }
        return "";
      }).join("") + '<span class="sr-only">' + esc(fullText) + "</span>";
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var targets = $$(".reveal, [data-split]");
    var show = function (el) {
      if (el.hasAttribute("data-split")) el.classList.add("is-split-in");
      else el.classList.add("is-visible");
    };
    if (!("IntersectionObserver" in window)) { targets.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });
    targets.forEach(function (t) { io.observe(t); });
    // hero title: animate after splash
    var h = $(".hero-title");
    if (h) setTimeout(function () { show(h); }, 850);
    // safety net
    setTimeout(function () {
      targets.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) show(el); });
    }, 6000);
  }

  /* ---------- Nav ---------- */
  function initNav() {
    var nav = $("[data-nav]"), burger = $("[data-burger]"), bar = $(".progress span");
    var onScroll = function () {
      var y = window.scrollY;
      nav.classList.toggle("is-solid", y > 40);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (burger) {
      burger.addEventListener("click", function () {
        var open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
      });
      $$("[data-menu] a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
        });
      });
    }
  }

  /* ---------- Cursor ---------- */
  function initCursor() {
    if (!hoverCapable) return;
    var c = $(".cursor"), dot = $(".cursor-dot"), ring = $(".cursor-ring");
    if (!c) return;
    var mx = 0, my = 0, rx = 0, ry = 0, first = false;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      if (!first) { first = true; rx = mx; ry = my; c.classList.add("is-ready"); }
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", function (e) {
      c.classList.toggle("is-hover", !!e.target.closest("a, button, label, [data-tilt], .rail-item"));
    });
    document.addEventListener("mouseleave", function () { c.classList.remove("is-ready"); first = false; });
  }

  /* ---------- Hero balloon parallax ---------- */
  function initParallax() {
    var wrap = $("[data-parallax]");
    if (!wrap || !hoverCapable) return;
    var items = $$(".balloon", wrap), tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) {
      tx = (e.clientX / window.innerWidth - 0.5); ty = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      var sy = Math.min(window.scrollY, 900);
      items.forEach(function (b) {
        var d = parseFloat(b.dataset.depth || 1);
        b.style.transform = "translate3d(" + (cx * 40 * d) + "px," + (cy * 30 * d - sy * 0.25 * d) + "px,0)";
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Tilt + halo ---------- */
  function initTilt() {
    if (!hoverCapable) return;
    $$("[data-tilt]").forEach(function (el) {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = "1";
      var isPol = el.classList.contains("polaroid");
      var base = isPol ? getComputedStyle(el).getPropertyValue("--r").trim() || "0deg" : "0deg";
      var max = isPol ? 9 : 6;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
        el.style.transition = "transform .12s linear, box-shadow .5s";
        el.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * max) + "deg) rotateY(" + ((px - 0.5) * max) + "deg) rotate(" + base + ")" + (isPol ? " scale(1.04)" : " translateY(-4px)");
        if (isPol) el.style.zIndex = 5;
      });
      el.addEventListener("mouseout", function (e) {
        if (el.contains(e.relatedTarget)) return;
        el.style.transition = "transform .8s cubic-bezier(.16,1,.3,1), box-shadow .5s";
        el.style.transform = isPol ? "rotate(" + base + ")" : "";
        if (isPol) el.style.zIndex = "";
      });
    });
    // after polaroid drop-in finishes, release animation so tilt can control transform
    setTimeout(function () { $$(".polaroid").forEach(function (p) { p.style.animation = "none"; p.style.transform = "rotate(" + getComputedStyle(p).getPropertyValue("--r").trim() + ")"; }); }, 3000);
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!hoverCapable) return;
    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = "translate(" + x * 0.18 + "px," + (y * 0.28 - 2) + "px)";
      });
      b.addEventListener("mouseout", function (e) {
        if (b.contains(e.relatedTarget)) return;
        b.style.transition = "transform .6s cubic-bezier(.16,1,.3,1), background .3s, box-shadow .4s";
        b.style.transform = "";
        setTimeout(function () { b.style.transition = ""; }, 600);
      });
    });
  }

  /* ---------- Gallery rail (drag + buttons) ---------- */
  function initRail() {
    var rail = $("[data-rail]");
    if (!rail) return;
    var step = function () { var it = $(".rail-item", rail); return it ? it.getBoundingClientRect().width + 20 : 300; };
    var prev = $("[data-rail-prev]"), next = $("[data-rail-next]");
    if (prev) prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: "smooth" }); });
    if (!hoverCapable) return;
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("mousedown", function (e) { down = true; moved = false; sx = e.pageX; sl = rail.scrollLeft; rail.classList.add("is-drag"); });
    window.addEventListener("mouseup", function () { down = false; rail.classList.remove("is-drag"); });
    rail.addEventListener("mousemove", function (e) {
      if (!down) return;
      var dx = e.pageX - sx; if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = sl - dx;
    });
    rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    rail.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  /* ---------- Order builder ---------- */
  function balloonBurst() {
    if (reduced) return;
    var colors = ["#4f7fd9", "#e0529c", "#6cb24f", "#2f6b2a", "#f6c945"];
    for (var i = 0; i < 16; i++) {
      var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("viewBox", "0 0 100 180");
      s.setAttribute("class", "confetti-balloon");
      s.style.left = (Math.random() * 96) + "vw";
      s.style.color = colors[i % colors.length];
      s.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
      s.style.setProperty("--rot", (Math.random() * 40 - 20) + "deg");
      s.style.animationDelay = (Math.random() * 0.6) + "s";
      s.style.animationDuration = (2.6 + Math.random() * 1.4) + "s";
      var sc = 0.7 + Math.random() * 0.7;
      s.style.width = 44 * sc + "px"; s.style.height = 80 * sc + "px";
      s.innerHTML = '<use href="#balloon"/>';
      document.body.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 4800); })(s);
    }
  }

  function isoDate(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function initOrder() {
    var form = $("[data-order]");
    if (!form) return;
    var date = $("#f-fecha"), ocasionEl = $("#f-ocasion"), notasEl = $("#f-notas");
    if (date) {
      date.min = isoDate(new Date(Date.now() + 24 * 3600 * 1000));
      date.max = isoDate(new Date(Date.now() + 365 * 24 * 3600 * 1000));
    }
    var hint = $("[data-hint]"), done = $("[data-done]"), doneText = $("[data-done-text]"), label = $("[data-submit-label]");
    var hasWa = /^\d{8,15}$/.test(String(CFG.whatsapp || ""));
    if (label) label.textContent = hasWa ? "Enviar por WhatsApp" : "Preparar mi pedido";

    /* ---- Anti-spam: honeypot + tiempo mínimo + límite de envíos ---- */
    var startedAt = Date.now();
    var MIN_MS = 3000, MAX_SENDS = 3, WINDOW_MS = 10 * 60 * 1000;
    var sends = [];

    function setError(input, msg) {
      var f = input.closest(".field");
      var err = f && f.querySelector(".field-error");
      if (f) f.classList.toggle("is-error", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg || "";
    }

    function validate(input) {
      var v = String(input.value || "").trim();
      if (input === ocasionEl) {
        if (!v) return "Cuéntanos qué celebras.";
        if (v.length < 3) return "Escribe al menos 3 caracteres.";
        if (v.length > 80) return "Máximo 80 caracteres.";
      }
      if (input === date) {
        if (!v) return "Elige la fecha de entrega.";
        if (date.min && v < date.min) return "Necesitamos 24 horas de antelación: elige a partir de mañana.";
        if (date.max && v > date.max) return "Elige una fecha dentro de los próximos 12 meses.";
      }
      if (input === notasEl) {
        if (v.length > 500) return "Máximo 500 caracteres.";
        if ((v.match(/https?:\/\/|www\./gi) || []).length > 1) return "Quita los enlaces del mensaje, por favor.";
      }
      return "";
    }

    [ocasionEl, date, notasEl].forEach(function (input) {
      if (!input) return;
      input.addEventListener("blur", function () { if (input.value) setError(input, validate(input)); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") setError(input, validate(input));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);

      /* Bots: rellenan el campo oculto o envían al instante. Se ignora en silencio. */
      if (String(fd.get("website") || "") !== "" || Date.now() - startedAt < MIN_MS) {
        hint.textContent = "Revisa los datos e inténtalo de nuevo en unos segundos.";
        return;
      }
      var now = Date.now();
      sends = sends.filter(function (t) { return now - t < WINDOW_MS; });
      if (sends.length >= MAX_SENDS) {
        hint.textContent = "Ya preparaste varios pedidos. Espera unos minutos o escríbenos directamente por Instagram.";
        return;
      }

      var firstBad = null;
      [ocasionEl, date, notasEl].forEach(function (input) {
        var msg = validate(input);
        setError(input, msg);
        if (msg && !firstBad) firstBad = input;
      });
      if (firstBad) {
        hint.textContent = "Revisa los campos marcados.";
        firstBad.focus();
        return;
      }
      hint.textContent = "";
      sends.push(now);

      var ocasion = String(fd.get("ocasion")).trim();
      var notas = String(fd.get("notas") || "").trim();
      var f = String(fd.get("fecha")).split("-");
      var msg = "¡Hola Aloe Eventos! Quiero hacer un pedido 🎈\n" +
        "• Producto: " + fd.get("producto") + "\n" +
        "• Ocasión: " + ocasion + "\n" +
        "• Fecha: " + f[2] + "/" + f[1] + "/" + f[0] + "\n" +
        "• Entrega: " + fd.get("entrega") +
        (notas ? "\n• Detalles: " + notas : "");

      if (typeof window.aloeTrack === "function") {
        window.aloeTrack("generate_lead", { producto: String(fd.get("producto")), canal: hasWa ? "whatsapp" : "instagram" });
      }

      balloonBurst();
      done.hidden = false;

      if (hasWa) {
        doneText.textContent = "Abriendo WhatsApp con tu pedido…";
        setTimeout(function () { window.open("https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); }, 700);
      } else {
        var openIg = function (copied) {
          doneText.textContent = copied
            ? "Lo copiamos. Pégalo en el chat de Instagram que se abrirá."
            : "Escríbenos por Instagram con estos datos.";
          setTimeout(function () { window.open("https://ig.me/m/" + CFG.instagram, "_blank", "noopener"); }, 1100);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(msg).then(function () { openIg(true); }, function () { openIg(false); });
        } else { openIg(false); }
      }
    });
  }

  function initYear() { var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear(); }

  /* Carga la hoja de Google Fonts sin bloquear el primer pintado. */
  function initFonts() {
    $$("link[data-async-css]").forEach(function (l) { l.media = "all"; });
  }

  function boot() {
    safe(initFonts, "fonts");
    safe(initSplash, "splash");
    safe(initSplit, "split");
    safe(initReveal, "reveal");
    safe(initNav, "nav");
    safe(initCursor, "cursor");
    safe(initParallax, "parallax");
    safe(initTilt, "tilt");
    safe(initMagnetic, "magnetic");
    safe(initRail, "rail");
    safe(initOrder, "order");
    safe(initYear, "year");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
