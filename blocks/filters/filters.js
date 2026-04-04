/**
 * Filters block – author-configurable filter options.
 *
 * Authors create a two-column table where each row defines a filter dimension:
 *   | Filters |                                      |
 *   | Year    | 2024, 2023, 2022                     |
 *   | Topic   | Financial, Corporate, Style & Strategy |
 *
 * The block hides itself and exposes the parsed config via a data attribute
 * so the cards (articles) block can read it.
 */
export default function decorate(block) {
  const config = {};

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const values = cells[1].textContent
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    if (key && values.length) {
      config[key] = values;
    }
  });

  block.dataset.filterConfig = JSON.stringify(config);
  block.style.display = 'none';
}
