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
    return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase();
  }

  render() {
    const badge = this._badge;
    if (!badge) return;

    const initials = this.getInitials(badge.name, badge.surname);
    const fullName = `${badge.name || ""} ${badge.surname || ""}`.trim();

    const link = `/pages/badge.html?id=${badge.id}`;

    const color = badge.color || "#111";

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
          border-radius: 16px;
          padding: 16px;
          background: white;
          font-family: system-ui, Arial;
          position: relative;
          overflow: hidden;
          transition: 0.25s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        /* TOP COLOR BAR DINÂMICA */
        .top-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 4px;
          width: 100%;
          background: ${color};
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          color: white;
          background: ${color};
          margin-bottom: 10px;
        }

        .name {
          font-size: 14px;
          font-weight: 600;
        }

        .role {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .company {
          font-size: 11px;
          color: #999;
          margin-bottom: 10px;
        }

        .divider {
          height: 1px;
          background: #f1f1f1;
          margin: 10px 0;
        }

        .info {
          font-size: 11px;
          color: #777;
          margin-bottom: 4px;
        }

        .location {
          font-size: 11px;
          color: #aaa;
          margin-top: 6px;
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
          <div class="role">${badge.jobTitle || "No role"}</div>

          <div class="company">${badge.company || "No company"}</div>

          <div class="divider"></div>

          <div class="info">📧 ${badge.email || "—"}</div>
          <div class="info">📞 ${badge.phone || "—"}</div>

          <div class="location">📍 ${badge.location || "No location"}</div>

          <div class="hint">ver →</div>
        </div>
      </a>
    `;
  }
}

customElements.define("badge-item", BadgeItem);