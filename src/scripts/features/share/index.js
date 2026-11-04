// src/scripts/features/share/index.js

(function () {
  "use strict";

  function initShare() {
    const buttons = document.querySelectorAll("[data-share-copy]");

    buttons.forEach((button) => {
      if (button.dataset.ready === "true") return;
      button.dataset.ready = "true";

      button.addEventListener("click", async () => {
        const url =
          button.dataset.url ||
          button.closest("[data-share-root]")?.dataset.url ||
          location.href;

        try {
          await navigator.clipboard.writeText(url);
          button.dataset.copied = "true";
          document.dispatchEvent(
            new CustomEvent("share:copied", {
              detail: { url },
            })
          );

          setTimeout(() => {
            button.dataset.copied = "false";
          }, 1500);
        } catch {
          const input = document.createElement("input");
          input.value = url;
          input.setAttribute("readonly", "");
          input.style.position = "absolute";
          input.style.left = "-9999px";

          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          input.remove();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShare, { once: true });
  } else {
    initShare();
  }

  document.addEventListener("astro:page-load", initShare);
})();