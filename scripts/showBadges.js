const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let allBadges = [];

async function getData() {
  try {
    const response = await fetch("https://69de8fdad6de26e1192810df.mockapi.io/badges");
    allBadges = await response.json();
    renderPage(currentPage);
    renderPagination();
  } catch (e) {
    console.error(e.message);
    showEmpty("Erro ao carregar badges.");
  }
}

function renderPage(page) {
  const badgeList = document.getElementById('badge-list');
  badgeList.innerHTML = '';

  if (!allBadges || allBadges.length === 0) {
    showEmpty("Nenhum badge encontrado.");
    return;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = allBadges.slice(start, start + ITEMS_PER_PAGE);

  paginated.forEach(badge => {
    const initials = getInitials(badge.name, badge.surname);
    const badgeItem = document.createElement('div');
    badgeItem.classList.add('badge-item');
    badgeItem.innerHTML = `
      <div class="b-avatar">${initials}</div>
      <div class="b-name">${badge.name || ''} ${badge.surname || ''}</div>
      <div class="b-role">Colaborador</div>
      <div class="b-sep"></div>
      <div class="b-detail">${badge.email || '—'}</div>
      <div class="b-detail">${badge.phone || '—'}</div>
    `;
    badgeList.appendChild(badgeItem);
  });
}

function getInitials(name, surname) {
  const first = name ? name.charAt(0).toUpperCase() : '';
  const second = surname ? surname.charAt(0).toUpperCase() : '';
  return first + second;
}

function renderPagination() {
  let pagination = document.getElementById('pagination');

  if (!pagination) {
    pagination = document.createElement('div');
    pagination.id = 'pagination';
    document.querySelector('.container').appendChild(pagination);
  }

  pagination.innerHTML = '';

  const totalPages = Math.ceil(allBadges.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Anterior';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      updatePagination(totalPages);
    }
  });

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Próximo →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      updatePagination(totalPages);
    }
  });

  const pageInfo = document.createElement('span');
  pageInfo.id = 'page-info';
  pageInfo.textContent = `${currentPage} / ${totalPages}`;

  pagination.appendChild(prevBtn);
  pagination.appendChild(pageInfo);
  pagination.appendChild(nextBtn);
}

function updatePagination(totalPages) {
  document.getElementById('page-info').textContent = `${currentPage} / ${totalPages}`;
  const [prevBtn, , nextBtn] = document.getElementById('pagination').children;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function showEmpty(message) {
  const badgeList = document.getElementById('badge-list');
  badgeList.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `;
}

getData();