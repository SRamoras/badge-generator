class BadgeGenNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['cta-href', 'logo-href'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const logoHref = this.getAttribute('logo-href') || '/';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Geist', system-ui, -apple-system, sans-serif;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid #f0f0f0;
          background: #fff;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        .logo {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #111;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.15s;
        }

        .logo:hover {
          opacity: 0.75;
        }

        .logo-mark {
          width: 20px;
          height: 20px;
          background: #111;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-mark svg {
          width: 11px;
          height: 11px;
        }

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
        }

        .nav-links a:hover {
          color: #111;
        }

        .btn-cta {
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          background: #111;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1.1rem;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
        }

        .btn-cta:hover {
          background: #333;
        }

        .btn-cta:active {
          transform: scale(0.97);
        }

        /* Mobile */
        @media (max-width: 640px) {
          nav {
            padding: 1rem 1.25rem;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .nav-links {
            gap: 1.25rem;
          }
        }
      </style>

      <nav>
        <a class="logo" href="${logoHref}">
          <div class="logo-mark">
            <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="white"/>
              <rect x="6" y="1" width="4" height="4" rx="1" fill="white" opacity="0.5"/>
              <rect x="1" y="6" width="4" height="4" rx="1" fill="white" opacity="0.5"/>
              <rect x="6" y="6" width="4" height="4" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          Badge.Gen
        </a>

        <ul class="nav-links">
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="/pages/all-badges.html">All badges</a></li>
        </ul>

        <a class="btn-cta" href="/pages/generate-badges.html">Generate badges →</a>
      </nav>
    `;
  }
}

customElements.define('badge-gen-navbar', BadgeGenNavbar);