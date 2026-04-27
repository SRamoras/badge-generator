class BadgeFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .footer {
          margin-top: 4rem;
          border-top: 1px solid #eee;
          background: #fff;
          font-family: Arial, sans-serif;
        }

        .inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .left h3 {
          font-size: 14px;
          margin: 0 0 6px 0;
          color: #111;
        }

        .left p {
          font-size: 12px;
          color: #888;
          max-width: 260px;
          margin: 0;
        }

        .right {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        a {
          font-size: 12px;
          color: #666;
          text-decoration: none;
          transition: 0.2s;
        }

        a:hover {
          color: #111;
        }

        .bottom {
          border-top: 1px solid #f1f1f1;
          text-align: center;
          padding: 1rem;
          font-size: 11px;
          color: #aaa;
        }
      </style>

      <footer class="footer">
        <div class="inner">
          <div class="left">
            <h3>Badge System</h3>
            <p>Gerador e gestão de badges simples e rápidos.</p>
          </div>

          <div class="right">
            <a href="/">Home</a>
            <a href="/generate-badges.html">Gerar Badge</a>
            <a href="/pages/badges.html">Lista</a>
          </div>
        </div>

        <div class="bottom">
          © 2026 Badge System. Todos os direitos reservados.
        </div>
      </footer>
    `;
  }
}

customElements.define("badge-footer", BadgeFooter);