(function () {
  if (!window.__CAIGE_MOJIBAKE_NORMALIZER__) {
    window.__CAIGE_MOJIBAKE_NORMALIZER__ = true;

    const MOJIBAKE_PATTERN = /[ÃÂâðŸ�]/;

    function normalizeMojibake(value) {
      if (typeof value !== 'string' || !MOJIBAKE_PATTERN.test(value)) {
        return value;
      }

      try {
        const decoded = decodeURIComponent(escape(value));
        return decoded || value;
      } catch {
        return value;
      }
    }

    function normalizeDocumentText() {
      const root = document.body;
      if (!root) {
        return;
      }

      if (document.title) {
        document.title = normalizeMojibake(document.title);
      }

      const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (textWalker.nextNode()) {
        const node = textWalker.currentNode;
        const normalized = normalizeMojibake(node.nodeValue);
        if (normalized !== node.nodeValue) {
          node.nodeValue = normalized;
        }
      }

      const attributeNames = ['title', 'placeholder', 'aria-label', 'alt'];
      root.querySelectorAll('*').forEach((element) => {
        attributeNames.forEach((attributeName) => {
          if (element.hasAttribute(attributeName)) {
            const currentValue = element.getAttribute(attributeName);
            const normalized = normalizeMojibake(currentValue);
            if (normalized !== currentValue) {
              element.setAttribute(attributeName, normalized);
            }
          }
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', normalizeDocumentText, { once: true });
    } else {
      normalizeDocumentText();
    }
  }

  function initSidebarMenus(options = {}) {
    const closeOthers = options.closeOthers !== false;
    const toggleActiveClass = options.toggleActiveClass === true;

    const toggles = document.querySelectorAll('.sidebar__menu-toggle');

    toggles.forEach((toggle) => {
      const menuId = toggle.getAttribute('data-expand');
      const submenu = menuId ? document.getElementById(menuId) : null;
      if (!submenu) return;

      const isOpen = submenu.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (toggleActiveClass) {
        toggle.classList.toggle('sidebar__menu-toggle--active', isOpen);
      }

      toggle.addEventListener('click', () => {
        const currentlyOpen = submenu.classList.contains('open');

        if (closeOthers) {
          document.querySelectorAll('.sidebar__submenu').forEach((menu) => {
            if (menu.id !== menuId) {
              menu.classList.remove('open');
            }
          });

          if (toggleActiveClass) {
            toggles.forEach((otherToggle) => {
              if (otherToggle !== toggle) {
                otherToggle.classList.remove('sidebar__menu-toggle--active');
                otherToggle.setAttribute('aria-expanded', 'false');
              }
            });
          } else {
            toggles.forEach((otherToggle) => {
              if (otherToggle !== toggle) {
                const otherMenuId = otherToggle.getAttribute('data-expand');
                const otherMenu = otherMenuId ? document.getElementById(otherMenuId) : null;
                if (otherMenu && !otherMenu.classList.contains('open')) {
                  otherToggle.setAttribute('aria-expanded', 'false');
                }
              }
            });
          }
        }

        const nowOpen = !currentlyOpen;
        submenu.classList.toggle('open', nowOpen);
        toggle.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');

        if (toggleActiveClass) {
          toggle.classList.toggle('sidebar__menu-toggle--active', nowOpen);
        }
      });
    });
  }

  function bindSidebarPlaceholderLinks(options = {}) {
    const selector = options.selector || '.sidebar__submenu-link[href="#"]';
    const keyword = options.keyword || 'Prontuários';
    const message = options.message || '📋 Funcionalidade de Prontuários em desenvolvimento';

    document.querySelectorAll(selector).forEach((link) => {
      if (!link.textContent.includes(keyword)) {
        return;
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.notify && typeof window.notify.info === 'function') {
          window.notify.info(message);
          return;
        }
        window.alert(message);
      });
    });
  }

  function initSidebarMobile() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) {
      return;
    }

    if (document.body.dataset.caigeSidebarMobileInit === 'true') {
      return;
    }

    const BREAKPOINT = 767;
    const styleId = 'caige-mobile-sidebar-style';

    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .mobile-quick-nav {
          display: none;
        }

        @media (max-width: 767px) {
          html,
          body {
            overflow-x: hidden;
          }

          .sidebar,
          .mobile-menu-btn,
          .mobile-menu-overlay {
            display: none !important;
          }

          body.caige-mobile-quicknav {
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 78px);
          }

          body.caige-mobile-quicknav .mobile-quick-nav {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1400;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 6px;
            padding: 10px 10px calc(env(safe-area-inset-bottom, 0px) + 10px) 10px;
            background: rgba(255, 255, 255, 0.96);
            border-top: 1px solid rgba(31, 96, 232, 0.14);
            box-shadow: 0 -10px 24px rgba(15, 23, 42, 0.08);
            backdrop-filter: blur(8px);
          }

          .mobile-quick-nav__link {
            min-height: 54px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            border-radius: 12px;
            text-decoration: none;
            color: #334155;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.01em;
            transition: transform 0.16s ease, background-color 0.16s ease, color 0.16s ease;
          }

          .mobile-quick-nav__link span:first-child {
            font-size: 18px;
            line-height: 1;
          }

          .mobile-quick-nav__link:active {
            transform: scale(0.97);
          }

          .mobile-quick-nav__link--active {
            background: rgba(31, 96, 232, 0.14);
            color: #1f60e8;
          }

          @media (prefers-reduced-motion: reduce) {
            .mobile-quick-nav__link {
              transition: none !important;
            }
          }
        }

        @media (min-width: 768px) {
          .mobile-quick-nav {
            display: none !important;
          }

          body.caige-mobile-quicknav {
            padding-bottom: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const antigos = document.querySelectorAll('#mobile-menu-btn, .mobile-menu-overlay');
    antigos.forEach((item) => item.remove());
    document.body.classList.remove('caige-mobile-menu-open');

    const sidebarLinks = Array.from(document.querySelectorAll('.sidebar__link[href]'));
    const submenuLinks = Array.from(document.querySelectorAll('.sidebar__submenu-link[href]')).filter((link) => link.getAttribute('href') !== '#');
    const allLinks = [...sidebarLinks, ...submenuLinks];

    function findLink(rotulos) {
      return allLinks.find((link) => {
        const texto = (link.textContent || '').toLowerCase();
        return rotulos.some((rotulo) => texto.includes(rotulo));
      });
    }

    const acoes = [
      { rotulo: 'Painel', icone: '🏠', link: findLink(['dashboard', 'painel']) },
      { rotulo: 'Pacientes', icone: '👥', link: findLink(['pacientes', 'paciente']) },
      { rotulo: 'Moviment.', icone: '📋', link: findLink(['moviment', 'atividades']) },
      { rotulo: 'Prontuários', icone: '📄', link: findLink(['prontu', 'question']) }
    ]
      .filter((item) => item.link && item.link.getAttribute('href'))
      .slice(0, 4);

    if (acoes.length === 0) {
      return;
    }

    let quickNav = document.getElementById('mobile-quick-nav');
    if (!quickNav) {
      quickNav = document.createElement('nav');
      quickNav.id = 'mobile-quick-nav';
      quickNav.className = 'mobile-quick-nav';
      quickNav.setAttribute('aria-label', 'Ações rápidas');
      document.body.appendChild(quickNav);
    }

    const paginaAtual = (window.location.pathname || '').toLowerCase();
    quickNav.innerHTML = '';

    acoes.forEach((item) => {
      const href = item.link.getAttribute('href');
      const hrefNormalizado = href.toLowerCase().replace(/^\.\//, '').replace(/^\.\.\//, '');
      const ativo = hrefNormalizado && paginaAtual.includes(hrefNormalizado);

      const botao = document.createElement('a');
      botao.className = 'mobile-quick-nav__link' + (ativo ? ' mobile-quick-nav__link--active' : '');
      botao.href = href;
      botao.innerHTML = '<span>' + item.icone + '</span><span>' + item.rotulo + '</span>';
      quickNav.appendChild(botao);
    });

    function aplicarLayoutPorLargura() {
      if (window.innerWidth <= BREAKPOINT) {
        document.body.classList.add('caige-mobile-quicknav');
      } else {
        document.body.classList.remove('caige-mobile-quicknav');
      }
    }

    aplicarLayoutPorLargura();
    window.addEventListener('resize', aplicarLayoutPorLargura);

    document.body.dataset.caigeSidebarMobileInit = 'true';
  }

  function bootstrapSidebarMobile() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSidebarMobile, { once: true });
      return;
    }
    initSidebarMobile();
  }

  window.initSidebarMenus = initSidebarMenus;
  window.bindSidebarPlaceholderLinks = bindSidebarPlaceholderLinks;
  window.initSidebarMobile = initSidebarMobile;

  bootstrapSidebarMobile();
})();
