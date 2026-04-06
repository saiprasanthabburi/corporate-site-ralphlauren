/**
 * Filters block – author-configurable filter options.
 *
 * Supports two authoring formats:
 *
 * Two-column (explicit labels):
 *   | Filters |                                        |
 *   | Year    | 2024, 2023, 2022                       |
 *   | Topic   | Financial, Corporate, Style & Strategy  |
 *
 * Single-column (positional – row 1 = Year, row 2 = Topic, row 3 = CTA):
 *   | Filters                                          |
 *   | 2024, 2023, 2022                                 |
 *   | Financial, Corporate, Style & Strategy            |
 *   | Read the Story                                    |
 *
 * The block hides itself and exposes the parsed config via a data attribute
 * so the cards (articles) block can read it.
 */
const DEFAULT_KEYS = ['year', 'topic', 'cta'];

export default function decorate(block) {
  const config = {};
  const rows = [...block.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const values = cells[1].textContent
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (key && values.length) config[key] = values;
    } else if (cells.length === 1 && index < DEFAULT_KEYS.length) {
      const values = cells[0].textContent
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (values.length) config[DEFAULT_KEYS[index]] = values;
    }
  });

  block.dataset.filterConfig = JSON.stringify(config);
  block.style.display = 'none';

  // Build the visible filter UI after the block
  const bar = document.createElement('div');
  bar.className = 'filter-bar';

  const label = document.createElement('p');
  label.className = 'filter-bar-label';
  label.textContent = 'Filter By';
  bar.appendChild(label);

  ['year', 'topic'].forEach((key) => {
    if (!config[key]) return;

    const group = document.createElement('div');
    group.className = 'filter-group';

    // Trigger button
    const trigger = document.createElement('button');
    trigger.className = 'filter-select';
    trigger.setAttribute('aria-expanded', 'false');

    const triggerLabel = document.createElement('span');
    triggerLabel.className = 'filter-select-label';
    triggerLabel.textContent = key === 'year' ? 'Year' : 'Topic';
    trigger.appendChild(triggerLabel);

    // Options panel
    const options = document.createElement('div');
    options.className = 'filter-options';
    options.setAttribute('role', 'listbox');

    // "All" default option
    const allOption = document.createElement('button');
    allOption.className = 'filter-option default active';
    allOption.textContent = key === 'year' ? 'All Years' : 'All Topics';
    options.appendChild(allOption);

    config[key].forEach((val) => {
      const opt = document.createElement('button');
      opt.className = 'filter-option';
      opt.textContent = val;
      options.appendChild(opt);
    });

    // Toggle open/close
    trigger.addEventListener('click', () => {
      const isOpen = options.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
      trigger.setAttribute('aria-expanded', isOpen);
    });

    // Option selection
    options.querySelectorAll('.filter-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        options.querySelectorAll('.filter-option').forEach((o) => o.classList.remove('active'));
        opt.classList.add('active');
        triggerLabel.textContent = opt.textContent;
        options.classList.remove('open');
        trigger.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    group.appendChild(trigger);
    group.appendChild(options);
    bar.appendChild(group);
  });

  // Insert filter bar after the hidden block
  block.closest('.filters-wrapper')?.after(bar);
}