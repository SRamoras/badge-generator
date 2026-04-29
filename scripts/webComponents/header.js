class BadgeGenNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["logo-href", "login-href", "register-href"];
  }

  connectedCallback() {
    this.render();
    this._bindMenu();
  }

  attributeChangedCallback() {
    this.render();
    this._bindMenu();
  }

  _bindMenu() {
    const toggle = this.shadowRoot.querySelector(".hamburger");
    const menu   = this.shadowRoot.querySelector(".nav-links");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.classList.toggle("active", open);
    });

    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", false);
      });
    });
  }

  render() {
    const logoHref     = this.getAttribute("logo-href")     || "/";
    const loginHref    = this.getAttribute("login-href")    || "/pages/login.html";
    const registerHref = this.getAttribute("register-href") || "/pages/register.html";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Geist', system-ui, -apple-system, sans-serif;
        }

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem var(--padding-lateral, 2rem);
          height: 60px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #f0f0f0;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        /* ── Logo ── */

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #111;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .logo:hover { opacity: 0.7; }

        .logo-mark {
          width: 22px;
          height: 22px;
          background: #111;
          border-radius: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-mark svg { width: 12px; height: 12px; }

        /* ── Nav links ── */

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          font-size: 13px;
          color: #888;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .nav-links a:hover { color: #111; }

        /* ── Auth buttons (desktop) ── */

        .auth-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .btn-login {
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          background: none;
          border: none;
          padding: 0.5rem 0.9rem;
          border-radius: 7px;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }
        .btn-login:hover {
          color: #111;
          background: #f5f5f5;
        }

        .btn-register {
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          background: #111;
          border: none;
          border-radius: 7px;
          padding: 0.5rem 1.1rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          white-space: nowrap;
          transition: opacity 0.15s, transform 0.1s;
        }
        .btn-register:hover  { opacity: 0.8; }
        .btn-register:active { transform: scale(0.97); }

        /* ── Mobile actions ── */

        .mobile-actions {
          display: none;
          align-items: center;
          gap: 6px;
        }

        .btn-register-mobile {
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          background: #111;
          border-radius: 7px;
          padding: 0.45rem 1rem;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.15s, transform 0.1s;
        }
        .btn-register-mobile:hover  { opacity: 0.8; }
        .btn-register-mobile:active { transform: scale(0.97); }

        /* ── Hamburger ── */

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: background 0.15s;
        }
        .hamburger:hover { background: #f5f5f5; }

        .hamburger span {
          display: block;
          height: 1.5px;
          background: #111;
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
          transform-origin: center;
        }

        .hamburger.active span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile ── */

        @media (max-width: 680px) {
          nav {
            padding: 0.85rem 1.25rem;
            flex-wrap: wrap;
            height: auto;
          }

          .auth-actions  { display: none; }
          .mobile-actions { display: flex; }

          .nav-links {
            display: none;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            width: 100%;
            padding: 0.5rem 0 0.25rem;
            border-top: 1px solid #f0f0f0;
            margin-top: 0.5rem;
          }

          .nav-links.open { display: flex; }

          .nav-links li { width: 100%; }

          .nav-links a {
            display: block;
            padding: 0.65rem 0;
            font-size: 14px;
            border-bottom: 1px solid #f8f8f8;
          }

          .nav-links li:last-child a { border-bottom: none; }

          /* Login link in mobile menu */
          .nav-links .mobile-login {
            display: block;
            padding: 0.65rem 0;
            font-size: 14px;
            color: #888;
            border-bottom: 1px solid #f8f8f8;
          }
          .nav-links .mobile-login:hover { color: #111; }
        }
      </style>

      <nav role="banner">
        <a class="logo" href="${logoHref}" aria-label="Badge.Gen home">
          <div class="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="white"/>
              <rect x="7" y="1" width="4" height="4" rx="1" fill="white" opacity="0.55"/>
              <rect x="1" y="7" width="4" height="4" rx="1" fill="white" opacity="0.55"/>
              <rect x="7" y="7" width="4" height="4" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          Badge.Gen
        </a>

        <ul class="nav-links" role="list" id="nav-menu">
          <li><a href="/#features">Features</a></li>
          <li><a href="/#how-it-works">How it works</a></li>
          <li><a href="/#faq">FAQ</a></li>
          <li><a href="/pages/all-badges.html">All badges</a></li>
          <!-- Login shown only in mobile menu -->
          <li class="mobile-only-item"><a class="mobile-login" href="${loginHref}">Log in</a></li>
        </ul>

        <!-- Desktop auth -->
        <div class="auth-actions">
          <a class="btn-login" href="${loginHref}">Log in</a>
          <a class="btn-register" href="${registerHref}">Sign up →</a>
        </div>

        <!-- Mobile auth -->
        <div class="mobile-actions">
          <a class="btn-register-mobile" href="${registerHref}">Sign up →</a>
          <button
            class="hamburger"
            aria-label="Toggle navigation"
            aria-expanded="false"
            aria-controls="nav-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    `;
  }
}

customElements.define("badge-header", BadgeGenNavbar);