export default function decorate(block) {
  let pic = block.querySelector('picture');

  if (!pic) {
    const img = block.querySelector(':scope > div > div > img, :scope > div > div > p > img');
    if (img) {
      pic = document.createElement('picture');
      img.parentElement.replaceChild(pic, img);
      pic.appendChild(img);
    }
  }

  if (pic) {
    const row = pic.closest('.hero > div');
    block.prepend(pic);

    if (row && !row.textContent.trim() && !row.querySelector('picture, img, video')) {
      row.remove();
    }
  }

  const contentDiv = block.querySelector(':scope > div');
  if (!contentDiv || !contentDiv.textContent.trim()) {
    if (contentDiv) contentDiv.remove();
    block.classList.add('image-only');
  }

  /* =========================
     FILTER LOGIC STARTS HERE
  ========================= */

  function createDropdown(label, options) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cards-filter-group';

    wrapper.innerHTML = `
      <button class="cards-filter-btn" data-filter-type="${label.toLowerCase()}" aria-expanded="false">
        <span class="cards-filter-btn-text">${label}</span>
        <span class="cards-filter-arrow">&#9662;</span>
      </button>
      <div class="cards-filter-dropdown">
        ${options.map((o) => `<button class="cards-filter-option" data-value="${o}">${o}</button>`).join('')}
      </div>`;

    return wrapper;
  }

  function applyFilters(cardsBlock, filterBar) {
    const ul = cardsBlock.querySelector('ul');

    const activeYears = [...filterBar.querySelectorAll('[data-filter-type="year"] + .cards-filter-dropdown .active')]
      .map((o) => o.dataset.value);

    const activeTopics = [...filterBar.querySelectorAll('[data-filter-type="topic"] + .cards-filter-dropdown .active')]
      .map((o) => o.dataset.value);

    [...ul.querySelectorAll('li')].forEach((card) => {
      const body = card.querySelector('.cards-card-body');
      if (!body) return;

      const category = body.querySelector('p:first-child')?.textContent.trim() || '';
      const dateText = body.querySelector('p:last-child')?.textContent.trim() || '';
      const year = dateText.match(/\d{4}/)?.[0] || '';

      const matchYear = !activeYears.length || activeYears.includes(year);
      const matchTopic = !activeTopics.length || activeTopics.includes(category);

      card.style.display = (matchYear && matchTopic) ? '' : 'none';
    });
  }

  function buildFilters(cardsBlock) {
    const ul = cardsBlock.querySelector('ul');
    if (!ul) return;

    const topics = new Set();
    const years = new Set();

    ul.querySelectorAll('li').forEach((card) => {
      const body = card.querySelector('.cards-card-body');
      if (!body) return;

      const category = body.querySelector('p:first-child');
      const date = body.querySelector('p:last-child');

      if (category) topics.add(category.textContent.trim());
      if (date) {
        const match = date.textContent.match(/\d{4}/);
        if (match) years.add(match[0]);
      }
    });

    const filterBar = document.createElement('div');
    filterBar.className = 'cards-filter-bar';
    filterBar.innerHTML = '<span class="cards-filter-label">Filter by</span>';

    const controls = document.createElement('div');
    controls.className = 'cards-filter-controls';

    controls.append(createDropdown('Year', [...years].sort().reverse()));
    controls.append(createDropdown('Topic', [...topics].sort()));

    filterBar.append(controls);
    block.append(filterBar);

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.cards-filter-btn');
      if (!btn) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      filterBar.querySelectorAll('.cards-filter-btn')
        .forEach((b) => b.setAttribute('aria-expanded', 'false'));

      if (!isOpen) btn.setAttribute('aria-expanded', 'true');
    });

    filterBar.addEventListener('click', (e) => {
      const option = e.target.closest('.cards-filter-option');
      if (!option) return;

      const dropdown = option.closest('.cards-filter-dropdown');
      const btn = dropdown.previousElementSibling;

      option.classList.toggle('active');

      const active = dropdown.querySelectorAll('.active');
      const type = btn.dataset.filterType;
      const label = type.charAt(0).toUpperCase() + type.slice(1);

      btn.querySelector('.cards-filter-btn-text').textContent =
        active.length ? `${label} (${active.length})` : label;

      applyFilters(cardsBlock, filterBar);
      btn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', (e) => {
      if (!filterBar.contains(e.target)) {
        filterBar.querySelectorAll('.cards-filter-btn')
          .forEach((b) => b.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  // Find cards block below hero
  const cardsBlock = document.querySelector('.cards.articles');

  if (cardsBlock) {
    buildFilters(cardsBlock);
  }
}