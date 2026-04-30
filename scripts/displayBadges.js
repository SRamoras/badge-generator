const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let allBadges = [];

async function getData() {
  try {
    const response = await fetch(
      "https://69de8fdad6de26e1192810df.mockapi.io/badges"
    );

    allBadges = await response.json();

    renderPage(currentPage);
    renderPagination();
  } catch (e) {
    console.error(e.message);
    showEmpty("Couldn't load badges. Please try again.");
  }
}

function renderPage(page) {
  const badgeList = document.getElementById("badge-list");
  badgeList.innerHTML = "";

  if (!allBadges.length) {
    showEmpty("No badges found.");
    return;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = allBadges.slice(start, start + ITEMS_PER_PAGE);

  paginated.forEach(badge => {
    const el = document.createElement("badge-item");
    badgeList.appendChild(el);
    setTimeout(() => { el.data = badge; }, 500);
  });
}

function renderPagination() {
  let pagination = document.getElementById("pagination");

  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "pagination";
    document.querySelector(".container-all-badges").appendChild(pagination);
  }

  pagination.innerHTML = "";

  const totalPages = Math.ceil(allBadges.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "← Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      updatePagination(totalPages);
    }
  };

  const pageInfo = document.createElement("span");
  pageInfo.id = "page-info";
  pageInfo.textContent = `${currentPage} / ${totalPages}`;

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next →";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      updatePagination(totalPages);
    }
  };

  pagination.appendChild(prevBtn);
  pagination.appendChild(pageInfo);
  pagination.appendChild(nextBtn);
}

function updatePagination(totalPages) {
  document.getElementById("page-info").textContent =
    `${currentPage} / ${totalPages}`;

  const [prevBtn, , nextBtn] = document.getElementById("pagination").children;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function showEmpty(message) {
  const badgeList = document.getElementById("badge-list");
  badgeList.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4">
          <rect x="2" y="4" width="14" height="11" rx="2"/>
          <path d="M6 4V3a3 3 0 0 1 6 0v1"/>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;
}

getData();