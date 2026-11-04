// src/scripts/features/copy/index.js
// Copy buttons: <button class="copy-btn" data-copy="text to copy">Copy</button>

(function () {
  "use strict";

  var buttons = document.querySelectorAll("[data-copy]");
  if (!buttons.length) return;

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(text);
        }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  buttons.forEach(function (button) {
    if (button.dataset.ready === "true") return;
    button.dataset.ready = "true";

    var label = button.textContent;
    var timer = 0;

    button.addEventListener("click", function () {
      copyText(button.getAttribute("data-copy") || "").then(function (ok) {
        button.textContent = ok ? "Copied" : "Press Ctrl+C";
        button.setAttribute("data-copied", ok ? "true" : "false");
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          button.textContent = label;
          button.removeAttribute("data-copied");
        }, 2000);
      });
    });
  });
})();
