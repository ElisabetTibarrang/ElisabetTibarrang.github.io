// src/scripts/features/contact/index.js
// Sends the contact form as JSON to /api/contact/ and reports the result.

(function () {
  "use strict";

  var MESSAGES = {
    sending: "Sending…",
    ok: "Thank you. Your message was sent.",
    not_configured: "The contact form is not set up yet. Please email us instead.",
    invalid_email: "Please enter a valid email address.",
    missing_fields: "Please fill in every field.",
    network: "Could not reach the server. Please try again.",
    fallback: "Sorry, your message could not be sent. Please try again later.",
  };

  var form = document.querySelector("[data-contact-form]");
  if (!form || form.dataset.ready === "true") return;
  form.dataset.ready = "true";

  var status = form.querySelector("[data-contact-status]");
  var button = form.querySelector("button[type='submit']");

  function show(text, kind) {
    if (!status) return;
    status.textContent = text;
    status.className = "contact-status " + (kind || "");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (button && button.disabled) return;

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      payload[key] = String(value);
    });

    if (button) button.disabled = true;
    show(MESSAGES.sending, "");

    fetch(form.getAttribute("action") || "/api/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            return null;
          })
          .then(function (data) {
            if (response.ok && data && data.ok) {
              form.reset();
              show(MESSAGES.ok, "success-box");
              return;
            }
            var key = data && data.error;
            show(MESSAGES[key] || MESSAGES.fallback, "error");
          });
      })
      .catch(function () {
        show(MESSAGES.network, "error");
      })
      .then(function () {
        if (button) button.disabled = false;
      });
  });
})();
