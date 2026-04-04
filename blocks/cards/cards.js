import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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

function applyFilters(ul, filterBar) {
  const activeYears = [...filterBar.querySelectorAll('[data-filter-type="year"] + .cards-filter-dropdown .cards-filter-option.active')]
    .map((o) => o.dataset.value);
  const activeTopics = [...filterBar.querySelectorAll('[data-filter-type="topic"] + .cards-filter-dropdown .cards-filter-option.active')]
    .map((o) => o.dataset.value);

  [...ul.querySelectorAll('li')].forEach((card) => {
    const body = card.querySelector('.cards-card-body');
    if (!body) return;
    const category = body.querySelector('p:first-child')?.textContent.trim() || '';
    const dateText = body.querySelector('p:last-child')?.textContent.trim() || '';
    const yearMatch = dateText.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : '';

    const matchYear = activeYears.length === 0 || activeYears.includes(year);
    const matchTopic = activeTopics.length === 0 || activeTopics.includes(category);
    card.style.display = (matchYear && matchTopic) ? '' : 'none';
  });
}

function getAuthorFilterConfig(block) {
  const section = block.closest('.section');
  const filtersBlock = section?.querySelector('.filters[data-filter-config]');
  if (!filtersBlock) return null;
  try {
    return JSON.parse(filtersBlock.dataset.filterConfig);
  } catch (e) {
    return null;
  }
}

function buildArticleFilters(block, ul) {
  const authorConfig = getAuthorFilterConfig(block);

  let yearOptions;
  let topicOptions;

  if (authorConfig) {
    yearOptions = authorConfig.year || [];
    topicOptions = authorConfig.topic || [];
  } else {
    const cards = [...ul.querySelectorAll('li')];
    const topics = new Set();
    const years = new Set();

    cards.forEach((card) => {
      const body = card.querySelector('.cards-card-body');
      if (!body) return;
      const category = body.querySelector('p:first-child');
      const date = body.querySelector('p:last-child');
      if (category) topics.add(category.textContent.trim());
      if (date) {
        const match = date.textContent.trim().match(/\d{4}/);
        if (match) years.add(match[0]);
      }
    });

    yearOptions = [...years].sort().reverse();
    topicOptions = [...topics].sort();
  }

  const filterBar = document.createElement('div');
  filterBar.className = 'cards-filter-bar';
  filterBar.innerHTML = '<span class="cards-filter-label">Filter by</span>';
  const controls = document.createElement('div');
  controls.className = 'cards-filter-controls';
  controls.append(createDropdown('Year', yearOptions));
  controls.append(createDropdown('Topic', topicOptions));
  filterBar.append(controls);
  block.prepend(filterBar);

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.cards-filter-btn');
    if (!btn) return;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // close all dropdowns
    filterBar.querySelectorAll('.cards-filter-btn').forEach((b) => {
      b.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) btn.setAttribute('aria-expanded', 'true');
  });

  filterBar.addEventListener('click', (e) => {
    const option = e.target.closest('.cards-filter-option');
    if (!option) return;
    const dropdown = option.closest('.cards-filter-dropdown');
    const btn = dropdown.previousElementSibling;
    const type = btn.dataset.filterType;
    option.classList.toggle('active');

    // update button text
    const activeOptions = dropdown.querySelectorAll('.cards-filter-option.active');
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    btn.querySelector('.cards-filter-btn-text').textContent = activeOptions.length
      ? `${label} (${activeOptions.length})`
      : label;

    applyFilters(ul, filterBar);
    btn.setAttribute('aria-expanded', 'false');
  });

  // close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!filterBar.contains(e.target)) {
      filterBar.querySelectorAll('.cards-filter-btn').forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

export default function decorate(block) {
  // auto-detect team variant: cards with h4 headings (team member pattern)
  if (!block.classList.contains('team') && block.querySelector('h4')) {
    block.classList.add('team');
  }

  // auto-detect articles variant: cards with h3 + category/date paragraphs
  if (!block.classList.contains('articles') && !block.classList.contains('team')) {
    const firstCard = block.querySelector(':scope > div');
    if (firstCard) {
      const body = [...firstCard.children].find((d) => !d.querySelector('picture') || d.children.length > 1);
      if (body && body.querySelector('h3') && body.querySelectorAll('p').length >= 2) {
        block.classList.add('articles');
      }
    }
  }

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const imgUrl = new URL(img.src, window.location.href);
    if (imgUrl.origin === window.location.origin) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
  block.replaceChildren(ul);

  // articles variant: style authored CTA links or add default
  if (block.classList.contains('articles')) {
    ul.querySelectorAll('.cards-card-body').forEach((body) => {
      const existingLink = body.querySelector('a');
      if (existingLink) {
        existingLink.classList.add('cards-read-more');
      } else {
        const link = document.createElement('a');
        link.className = 'cards-read-more';
        link.href = '#';
        link.textContent = 'Read the Story';
        body.append(link);
      }
    });
    buildArticleFilters(block, ul);
  }
}
