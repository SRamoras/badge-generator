class BadgeItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(badge) {
    this._badge = badge;
    this.render();
  }

  getInitials(name, surname) {
    const first = name ? name.charAt(0).toUpperCase() : "";
    const second = surname ? surname.charAt(0).toUpperCase() : "";
    return first + second;
  }

  render() {
    const badge = this._badge;
    if (!badge) return;

    const initials = this.getInitials(badge.name, badge.surname);
    const fullName = `${badge.name || ""} ${badge.surname || ""}`.trim();

    const link = `/pages/badge.html?id=${badge.id}`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        .card {
          border: 1px solid #eee;
          border-radius: 14px;
          padding: 16px;
          background: white;
          font-family: Arial, sans-serif;
          position: relative;
          overflow: hidden;
          transition: 0.25s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          border-color: #ddd;
        }

        .top-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background: linear-gradient(90deg, #111, #6366f1, #f59e0b);
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          background: #f4f4f5;
          margin-bottom: 10px;
        }

        .name {
          font-size: 14px;
          font-weight: 600;
          color: #111;
        }

        .role {
          font-size: 11px;
          color: #888;
          margin-bottom: 10px;
        }

        .divider {
          height: 1px;
          background: #f1f1f1;
          margin: 10px 0;
        }

        .info {
          font-size: 11px;
          color: #999;
          margin-bottom: 4px;
        }

        .hint {
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 10px;
          color: #ddd;
        }
      </style>

      <a href="${link}">
        <div class="card">
          <div class="top-bar"></div>

          <div class="avatar">${initials}</div>

          <div class="name">${fullName}</div>
          <div class="role">Colaborador</div>

          <div class="divider"></div>

          <div class="info">${badge.email || "—"}</div>
          <div class="info">${badge.phone || "—"}</div>

          <div class="hint">ver →</div>
        </div>
      </a>
    `;
  }
}

customElements.define("badge-item", BadgeItem);