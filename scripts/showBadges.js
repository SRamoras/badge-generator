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
    showEmpty("Erro ao carregar badges.");
  }
}

function renderPage(page) {
  const badgeList = document.getElementById("badge-list");
  badgeList.innerHTML = "";

  if (!allBadges.length) {
    showEmpty("Nenhum badge encontrado.");
    return;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = allBadges.slice(start, start + ITEMS_PER_PAGE);

  paginated.forEach(badge => {
    const el = document.createElement("badge-item");
    el.data = badge; // 🔥 envia dados para o Web Component
    badgeList.appendChild(el);
  });
}

function renderPagination() {
  let pagination = document.getElementById("pagination");

  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "pagination";
    document.querySelector(".container").appendChild(pagination);
  }

  pagination.innerHTML = "";

  const totalPages = Math.ceil(allBadges.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "← Anterior";
  prevBtn.disabled = currentPage === 1;

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      updatePagination(totalPages);
    }
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Próximo →";
  nextBtn.disabled = currentPage === totalPages;

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      updatePagination(totalPages);
    }
  };

  const pageInfo = document.createElement("span");
  pageInfo.id = "page-info";
  pageInfo.textContent = `${currentPage} / ${totalPages}`;

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
      <p>${message}</p>
    </div>
  `;
}

getData();