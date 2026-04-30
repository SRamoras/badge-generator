class BadgeItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._renderLoading();
  }

  _renderLoading() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: flex; align-items: center; justify-content: center; width: 100%; }
      </style>
      <dotlottie-wc
        src="https://lottie.host/21f5f3a3-a3c7-4d98-a54e-3600c1eafa25/FoLZdLEL0p.lottie"
        style="width: 200px; height: 200px"
        autoplay loop>
      </dotlottie-wc>
    `;
  }

  set data(badge) {
    this._badge = badge;
    this.render();
  }

  getInitials(name, surname) {
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase();
  }

  /* Derive a readable text color (black or white) for a given hex bg */
  _contrastColor(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    // perceived luminance
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55 ? "#111111" : "#ffffff";
  }

  render() {
    const badge = this._badge;
    if (!badge) return;

    const initials  = this.getInitials(badge.name, badge.surname);
    const fullName  = `${badge.name || ""} ${badge.surname || ""}`.trim();
    const color     = badge.color || "#111111";
    const textColor = this._contrastColor(color);
    const isLinked  = !!badge.id;
    const _base     = window.location.pathname.includes('/pages/') ? '..' : '.';
    const link      = isLinked ? `${_base}/pages/badge.html?id=${badge.id}` : null;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        :host { display: block; width: 100%; }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        a { text-decoration: none; color: inherit; display: block; }

        /* ── Card ── */
        .card {
          font-family: 'DM Sans', system-ui, sans-serif;
          width: 100%;
          max-width: 320px;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
          transition: box-shadow .25s ease, transform .25s ease;
          position: relative;
        }

        ${isLinked ? `
        a:hover .card {
          transform: translateY(-3px);
          box-shadow: 0 2px 6px rgba(0,0,0,.06), 0 12px 36px rgba(0,0,0,.1);
        }` : ""}

        /* ── Hero band ── */
        .hero {
          background: ${color};
          padding: 28px 24px 48px;
          position: relative;
        }

        .badge-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: ${textColor};
          opacity: .55;
          margin-bottom: 20px;
        }

        .avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: ${textColor === "#ffffff" ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.1)"};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          color: ${textColor};
          letter-spacing: -.01em;
          border: 1.5px solid ${textColor === "#ffffff" ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.12)"};
        }

        /* ── Pull-up content ── */
        .body {
          padding: 0 24px 24px;
          margin-top: -24px;
          position: relative;
        }

        .name-block {
          background: #fff;
          border-radius: 12px;
          padding: 14px 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
          margin-bottom: 16px;
        }

        .name {
          font-size: 16px;
          font-weight: 600;
          color: #0f0f0f;
          letter-spacing: -.02em;
          line-height: 1.2;
          margin-bottom: 3px;
        }

        .role {
          font-size: 12px;
          font-weight: 400;
          color: #888;
          letter-spacing: .01em;
        }

        .company-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f5f5f5;
          border-radius: 99px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
          color: #555;
          margin-top: 8px;
        }
        .company-chip svg { flex-shrink: 0; }

        /* ── Info rows ── */
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #555;
          line-height: 1.4;
        }

        .info-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-icon svg { width: 13px; height: 13px; }

        .info-value {
          color: #333;
          font-size: 12.5px;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          flex: 1;
        }

        .empty { color: #ccc; font-style: italic; }

        /* ── Footer strip ── */
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 24px;
          border-top: 1px solid #f0f0f0;
          margin-top: 16px;
        }

        .footer-brand {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #ccc;
        }

        .color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 0 2px ${color}33;
        }
      </style>

      ${isLinked ? `<a href="${link}">` : "<div>"}
        <div class="card">

          <div class="hero">
            <div class="badge-label">Badge.Gen</div>
            <div class="avatar">${initials}</div>
          </div>
          
          <div class="body">
            <div class="name-block">
              <div class="name">${fullName || '<span class="empty">—</span>'}</div>
              <div class="role">${badge.jobTitle || '<span class="empty">No role</span>'}</div>
              ${badge.company ? `
              <div class="company-chip">${badge.company}</div>` : ""}
            </div>

            <div class="info-list">
              ${badge.email ? `
              <div class="info-row">
                <div class="info-icon">
                  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#888" stroke-width="1.1"/>
                    <path d="M1.5 3.5L7 8L12.5 3.5" stroke="#888" stroke-width="1.1" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span class="info-value">${badge.email}</span>
              </div>` : ""}

              ${badge.phone ? `
              <div class="info-row">
                <div class="info-icon">
                  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2.5C2 2 2.5 1.5 3 1.5H5L6 4.5L4.5 5.5C5.2 7.1 6.9 8.8 8.5 9.5L9.5 8L12.5 9V11C12.5 11.5 12 12 11.5 12C6.2 12 2 7.8 2 2.5Z" stroke="#888" stroke-width="1.1" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span class="info-value">${badge.phone}</span>
              </div>` : ""}

              ${badge.location ? `
              <div class="info-row">
                <div class="info-icon">
                  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1.5C5.07 1.5 3.5 3.07 3.5 5C3.5 7.75 7 12.5 7 12.5C7 12.5 10.5 7.75 10.5 5C10.5 3.07 8.93 1.5 7 1.5Z" stroke="#888" stroke-width="1.1"/>
                    <circle cx="7" cy="5" r="1.2" stroke="#888" stroke-width="1"/>
                  </svg>
                </div>
                <span class="info-value">${badge.location}</span>
              </div>` : ""}
            </div>

            <div class="card-footer">
              <span class="footer-brand">Badge.Gen</span>
              <div class="color-dot"></div>
            </div>
          </div>

        </div>
      ${isLinked ? "</a>" : "</div>"}
    `;
  }
}

if (!customElements.get("badge-item")) {
  customElements.define("badge-item", BadgeItem);
}