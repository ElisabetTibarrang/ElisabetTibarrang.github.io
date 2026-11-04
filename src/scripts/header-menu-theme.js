/* eslint-disable no-underscore-dangle */
// src/scripts/header-menu-theme.js
'use strict';

function initMenu() {
  const toggleBtn = document.querySelector('[data-header-menu-toggle]') || document.getElementById('menu-toggle');
  if (!toggleBtn || toggleBtn.dataset.headerMenuReady === 'true') return;

  const hamburgerIcon = document.querySelector(toggleBtn.dataset.menuIcon || '#menu-icon');
  const closeIcon = document.querySelector(toggleBtn.dataset.closeIcon || '#close-icon');
  const selector = toggleBtn.getAttribute('data-targets');
  const targets = selector ? selector.split(',').map((s) => document.querySelector(s.trim())).filter(Boolean) : [];
  const navItems = Array.from(document.querySelectorAll('.nav-item.dropdown'));
  const activeClass = 'dropdown-active';
  let isDesktop = window.matchMedia('(min-width: 768px)').matches;

  toggleBtn.dataset.headerMenuReady = 'true';

  navItems.forEach((item) => {
    item._button = item.querySelector('button[data-action]');
    item._menu = item.querySelector('.dropdown-menu');
  });

  toggleBtn.addEventListener('click', () => {
    const isOpen = targets[0]?.classList.contains('is-open');
    const willOpen = !isOpen;
    targets.forEach((el) => el.classList.toggle('is-open', willOpen));
    toggleBtn.setAttribute('aria-expanded', String(willOpen));
    if (hamburgerIcon) hamburgerIcon.classList.toggle('display-none', willOpen);
    if (closeIcon) closeIcon.classList.toggle('display-none', !willOpen);
  });

  const openMenu = (item) => {
    item.classList.add(activeClass);
    item._menu?.setAttribute('aria-hidden', 'false');
    item._button?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = (item) => {
    item.classList.remove(activeClass);
    item._menu?.setAttribute('aria-hidden', 'true');
    item._button?.setAttribute('aria-expanded', 'false');
  };

  const closeAllMenusExcept = (exceptItem) => {
    navItems.forEach((item) => {
      if (item !== exceptItem) closeMenu(item);
    });
  };

  const setupNavBehavior = () => {
    navItems.forEach((item) => {
      const button = item._button;
      const menu = item._menu;
      if (!button || !menu) return;

      if (item._hoverIn) item.removeEventListener('mouseenter', item._hoverIn);
      if (item._hoverOut) item.removeEventListener('mouseleave', item._hoverOut);
      button.onclick = null;

      if (isDesktop) {
        item._hoverIn = () => openMenu(item);
        item._hoverOut = () => closeMenu(item);
        item.addEventListener('mouseenter', item._hoverIn);
        item.addEventListener('mouseleave', item._hoverOut);
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
  };

  setupNavBehavior();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const nextIsDesktop = window.matchMedia('(min-width: 768px)').matches;
      if (nextIsDesktop !== isDesktop) {
        isDesktop = nextIsDesktop;
        setupNavBehavior();
      }
    }, 150);
  });

  document.addEventListener('click', (event) => {
    navItems.forEach((item) => {
      if (!item.contains(event.target)) closeMenu(item);
    });
  });
}

window.initMenu = window.initMenu || initMenu;

window.initThemeSwitcher = window.initThemeSwitcher || (() => {
  let initialized = false;

  return function initThemeSwitcher() {
    if (initialized) return;

    const button = document.querySelector('[data-header-theme-button]') || document.querySelector('#theme-button');
    const menuId = button?.getAttribute('aria-controls');
    const menu = menuId ? document.getElementById(menuId) : document.querySelector('#theme-menu');
    const items = menu ? Array.from(menu.querySelectorAll('.theme-option')) : [];
    if (!button || !menu || !items.length) return;
    initialized = true;

    const iconSystem = button.querySelector('svg[data-icon="bw"]');
    const iconLight = button.querySelector('svg[data-icon="light"]');
    const iconDark = button.querySelector('svg[data-icon="moon"]');

    const showIcon = (theme) => {
      [iconSystem, iconLight, iconDark].forEach((el) => el?.classList.add('display-none'));
      if (theme === 'light') iconLight?.classList.remove('display-none');
      else if (theme === 'dark') iconDark?.classList.remove('display-none');
      else iconSystem?.classList.remove('display-none');
    };

    const applyTheme = (theme) => {
      if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
        showIcon(theme);
      } else {
        const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        showIcon('system');
      }
      items.forEach((item) => item.setAttribute('aria-checked', String(item.dataset.theme === theme)));
    };

    const setTheme = (theme) => {
      try { localStorage.setItem('theme', theme); } catch (_) {}
      applyTheme(theme);
    };

    const getStoredTheme = () => {
      try {
        const theme = localStorage.getItem('theme');
        return theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'light';
      } catch (_) {
        return 'light';
      }
    };

    const isOpen = () => button.getAttribute('aria-expanded') === 'true';
    const openMenu = () => {
      button.setAttribute('aria-expanded', 'true');
      menu.classList.remove('display-none');
      const current = items.find((item) => item.getAttribute('aria-checked') === 'true') || items[0];
      current?.setAttribute('tabindex', '0');
      current?.focus();
    };
    const closeMenu = (opts = { restoreFocus: true }) => {
      menu.classList.add('display-none');
      button.setAttribute('aria-expanded', 'false');
      items.forEach((item) => item.setAttribute('tabindex', '-1'));
      if (opts.restoreFocus) button.focus();
    };

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      isOpen() ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !button.contains(event.target)) closeMenu({ restoreFocus: false });
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMenu();
      }
    });

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const theme = item.getAttribute('data-theme');
        if (theme) setTheme(theme);
        closeMenu({ restoreFocus: true });
      });
    });

    applyTheme(getStoredTheme());
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getStoredTheme() === 'system') applyTheme('system');
    });
  };
})();

(function bootstrapHeader() {
  const features = [
    { name: 'menu', selector: '[data-header-menu-toggle],#menu-toggle', init: () => window.initMenu?.() },
    { name: 'theme', selector: '[data-header-theme-button],#theme-button', init: () => window.initThemeSwitcher?.() },
  ];

  const run = () => {
    features.forEach((feature) => {
      if (document.querySelector(feature.selector)) {
        try { feature.init(); }
        catch (error) { console.error('[init]', feature.name, error); }
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();

  window.addEventListener('load', run);
  document.addEventListener('astro:page-load', run);

  const debounced = (() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(run, 50);
    };
  })();

  new MutationObserver(debounced).observe(document.documentElement, { childList: true, subtree: true });
})();
