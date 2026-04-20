
async function getData() {
  try {
    const response = await fetch("https://69de8fdad6de26e1192810df.mockapi.io/badges");
    const data = await response.json();
    displayBadges(data);
  } catch (e) {
    console.error(e.message);
  }
}

function displayBadges(badges) {
    const badgeList = document.getElementById('badge-list');
    badgeList.innerHTML = ''; 

    badges.forEach(badge => {
        const badgeItem = document.createElement('div');
        badgeItem.classList.add('badge-item');
        badgeItem.innerHTML = `
            <img src="${badge.imageUrl || 'https://via.placeholder.com/80'}" alt="${badge.name}">
            <h3>${badge.name}</h3>
            <p>${badge.description || 'No description available'}</p>
        `;
        badgeList.appendChild(badgeItem);
    });
}

getData();