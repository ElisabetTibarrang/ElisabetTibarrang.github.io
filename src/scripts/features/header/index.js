// src/scripts/features/header/index.js

(function () {
  "use strict";

  function initHeaderMenu() {
    const toggleBtn =
      document.querySelector("[data-header-menu-toggle]") ||
      document.getElementById("menu-toggle");

    if (!toggleBtn || toggleBtn.dataset.ready === "true") return;

    toggleBtn.dataset.ready = "true";

    const hamburgerIcon = document.querySelector(
      toggleBtn.dataset.menuIcon || "#menu-icon"
    );

    const closeIcon = document.querySelector(
      toggleBtn.dataset.closeIcon || "#close-icon"
    );

    const selector = toggleBtn.getAttribute("data-targets") || "";
    const targets = selector
      .split(",")
      .map((value) => document.querySelector(value.trim()))
      .filter(Boolean);

    const navItems = Array.from(document.querySelectorAll(".nav-item.dropdown"));
    const activeClass = "dropdown-active";
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    let isDesktop = mediaQuery.matches;

    navItems.forEach((item) => {
      item._button = item.querySelector("button[data-action]");
      item._menu = item.querySelector(".dropdown-menu");
    });

    function setMobileOpen(open) {
      targets.forEach((el) => el.classList.toggle("is-open", open));
      toggleBtn.setAttribute("aria-expanded", String(open));

      if (hamburgerIcon) hamburgerIcon.classList.toggle("display-none", open);
      if (closeIcon) closeIcon.classList.toggle("display-none", !open);
    }

    function openMenu(item) {
      item.classList.add(activeClass);
      item._menu?.setAttribute("aria-hidden", "false");
      item._button?.setAttribute("aria-expanded", "true");
    }

    function closeMenu(item) {
      item.classList.remove(activeClass);
      item._menu?.setAttribute("aria-hidden", "true");
      item._button?.setAttribute("aria-expanded", "false");
    }

    function closeAllMenusExcept(exceptItem) {
      navItems.forEach((item) => {
        if (item !== exceptItem) closeMenu(item);
      });
    }

    function setupDropdowns() {
      navItems.forEach((item) => {
        const button = item._button;
        const menu = item._menu;

        if (!button || !menu) return;

        if (item._hoverIn) item.removeEventListener("mouseenter", item._hoverIn);
        if (item._hoverOut) item.removeEventListener("mouseleave", item._hoverOut);

        button.onclick = null;

        if (isDesktop) {
          item._hoverIn = () => openMenu(item);
          item._hoverOut = () => closeMenu(item);

          item.addEventListener("mouseenter", item._hoverIn);
          item.addEventListener("mouseleave", item._hoverOut);
        }

        button.onclick = (event) => {
          event.preventDefault();

          if (item.classList.contains(activeClass)) {
            closeMenu(item);
          } else {
            closeAllMenusExcept(item);
            openMenu(item);
          }
        };
      });
    }

    toggleBtn.addEventListener("click", () => {
      const isOpen = targets.some((el) => el.classList.contains("is-open"));
      setMobileOpen(!isOpen);
    });

    document.addEventListener("click", (event) => {
      navItems.forEach((item) => {
        if (!item.contains(event.target)) closeMenu(item);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navItems.forEach(closeMenu);
        setMobileOpen(false);
      }
    });

    mediaQuery.addEventListener("change", (event) => {
      isDesktop = event.matches;
      setupDropdowns();
    });

    setupDropdowns();
  }

  function initThemeSwitcher() {
    const button =
      document.querySelector("[data-header-theme-button]") ||
      document.getElementById("theme-button");

    if (!button || button.dataset.ready === "true") return;

    const menuId = button.getAttribute("aria-controls");
    const menu = menuId
      ? document.getElementById(menuId)
      : document.getElementById("theme-menu");

    const items = menu
      ? Array.from(menu.querySelectorAll(".theme-option"))
      : [];

    if (!menu || !items.length) return;

    button.dataset.ready = "true";

    const iconSystem = button.querySelector('[data-theme-icon="system"]');
    const iconLight = button.querySelector('[data-theme-icon="light"]');
    const iconDark = button.querySelector('[data-theme-icon="dark"]');

    function getStoredTheme() {
      try {
        const theme = localStorage.getItem("theme");
        return ["light", "dark", "system"].includes(theme) ? theme : "system";
      } catch {
        return "system";
      }
    }

    function showIcon(theme) {
      [iconSystem, iconLight, iconDark].forEach((el) =>
        el?.classList.add("display-none")
      );

      if (theme === "light") iconLight?.classList.remove("display-none");
      else if (theme === "dark") iconDark?.classList.remove("display-none");
      else iconSystem?.classList.remove("display-none");
    }

    function applyTheme(theme) {
      const activeTheme =
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme;

      document.documentElement.setAttribute("data-theme", activeTheme);
      document.documentElement.dataset.themeChoice = theme;

      showIcon(theme);

      items.forEach((item) => {
        item.setAttribute(
          "aria-checked",
          String(item.dataset.theme === theme)
        );
      });
    }

    function setTheme(theme) {
      try {
        localStorage.setItem("theme", theme);
      } catch {}

      applyTheme(theme);
    }

    function isOpen() {
      return button.getAttribute("aria-expanded") === "true";
    }

    function openMenu() {
      button.setAttribute("aria-expanded", "true");
      menu.classList.remove("display-none");

      const current =
        items.find((item) => item.getAttribute("aria-checked") === "true") ||
        items[0];

      current?.setAttribute("tabindex", "0");
      current?.focus();
    }

    function closeMenu(restoreFocus = true) {
      menu.classList.add("display-none");
      button.setAttribute("aria-expanded", "false");

      items.forEach((item) => item.setAttribute("tabindex", "-1"));

      if (restoreFocus) button.focus();
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      isOpen() ? closeMenu(true) : openMenu();
    });

    button.addEventListener("keydown", (event) => {
      if (["ArrowDown", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !button.contains(event.target)) {
        closeMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        closeMenu(true);
      }
    });

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const theme = item.dataset.theme || "system";
        setTheme(theme);
        closeMenu(true);
      });
    });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (getStoredTheme() === "system") applyTheme("system");
      });

    applyTheme(getStoredTheme());
  }

  function initHeader() {
    initHeaderMenu();
    initThemeSwitcher();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader, { once: true });
  } else {
    initHeader();
  }

  document.addEventListener("astro:page-load", initHeader);
})();