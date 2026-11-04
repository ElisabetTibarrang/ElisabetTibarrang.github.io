// src/scripts/load-noncritical-fonts.js
(function () {
  "use strict";

  function loadFontCss() {
    if (document.querySelector('link[data-fonts="noncritical"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/fonts/fonts.css";
    link.dataset.fonts = "noncritical";

    document.head.appendChild(link);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFontCss, { once: true });
  } else {
    loadFontCss();
  }
})();