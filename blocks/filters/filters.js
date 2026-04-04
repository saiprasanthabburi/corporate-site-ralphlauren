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
 * Single-column (positional – row 1 = Year, row 2 = Topic):
 *   | Filters                                          |
 *   | 2024, 2023, 2022                                 |
 *   | Financial, Corporate, Style & Strategy            |
 *
 * The block hides itself and exposes the parsed config via a data attribute
 * so the cards (articles) block can read it.
 */
const DEFAULT_KEYS = ['year', 'topic'];

export default function decorate(block) {
  const config = {};
  const rows = [...block.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      // two-column format: key | values
      const key = cells[0].textContent.trim().toLowerCase();
      const values = cells[1].textContent
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (key && values.length) {
        config[key] = values;
      }
    } else if (cells.length === 1 && index < DEFAULT_KEYS.length) {
      // single-column format: positional (row 0 = year, row 1 = topic)
      const values = cells[0].textContent
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (values.length) {
        config[DEFAULT_KEYS[index]] = values;
      }
    }
  });

  block.dataset.filterConfig = JSON.stringify(config);
  block.style.display = 'none';
}
