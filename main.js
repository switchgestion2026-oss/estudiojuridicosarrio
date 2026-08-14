// Estudio Jurídico Sarrio & Asociados — interacciones
(function () {
  "use strict";

  /* Header: sombra al hacer scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Menú mobile */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav-mobile");
  if (toggle && nav) {
    var closeMenu = function () {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    var openMenu = function () {
      toggle.setAttribute("aria-expanded", "true");
      nav.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* Acordeón FAQ accesible */
  document.querySelectorAll(".accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";

      // cerrar otros paneles abiertos (comportamiento tipo acordeón exclusivo)
      document.querySelectorAll(".accordion-trigger[aria-expanded='true']").forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute("aria-expanded", "false");
          var p = document.getElementById(t.getAttribute("aria-controls"));
          if (p) p.style.maxHeight = null;
        }
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });

  /* Formulario de contacto */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    var showError = function (field, message) {
      var wrap = field.closest(".field");
      wrap.classList.add("has-error");
      var err = wrap.querySelector(".field-error");
      if (err) err.textContent = message;
    };
    var clearError = function (field) {
      var wrap = field.closest(".field");
      wrap.classList.remove("has-error");
    };

    var validate = function () {
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        clearError(field);
        if (field.type === "checkbox" && !field.checked) {
          showError(field, "Debés aceptar la Política de Privacidad para continuar.");
          valid = false;
          return;
        }
        if (field.type !== "checkbox" && !field.value.trim()) {
          showError(field, "Este campo es obligatorio.");
          valid = false;
          return;
        }
        if (field.type === "email" && field.value.trim()) {
          var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(field.value.trim())) {
            showError(field, "Ingresá un email válido.");
            valid = false;
          }
        }
      });
      return valid;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.removeAttribute("data-state");

      if (!validate()) {
        status.dataset.state = "error";
        status.textContent = "Revisá los campos marcados antes de continuar.";
        return;
      }

      // NOTA TÉCNICA: este formulario no tiene backend conectado.
      // Integrar con un servicio de envío (ej. Formspree, EmailJS) o backend propio
      // reemplazando este bloque por el fetch/POST correspondiente.
      submitBtn.dataset.loading = "true";
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.dataset.loading = "false";
        submitBtn.disabled = false;
        status.dataset.state = "success";
        status.textContent = "Consulta enviada. Te responderemos a la brevedad.";
        form.reset();
      }, 900);
    });

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.type === "checkbox") return;
        if (!field.value.trim()) return;
        clearError(field);
      });
    });
  }
})();
