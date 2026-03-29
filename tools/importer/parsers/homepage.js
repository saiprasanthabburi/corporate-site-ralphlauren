/**
 * Homepage block parsers
 * Converts div-based EDS block markup back to table format for import round-trip.
 */

/**
 * Convert a class name to a block table header name.
 * "hero" → "Hero"
 * "columns about" → "Columns (about)"
 * "section-metadata" → "Section Metadata"
 */
export function classToBlockName(className) {
  const parts = className.trim().split(/\s+/);
  const base = parts[0]
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  if (parts.length > 1) {
    return `${base} (${parts.slice(1).join(', ')})`;
  }
  return base;
}

/**
 * Convert a block div (e.g. <div class="hero">) to a table element
 * suitable for WebImporter html2md conversion.
 */
export function blockDivToTable(blockDiv, document) {
  const className = blockDiv.getAttribute('class');
  const blockName = classToBlockName(className);

  const rows = [...blockDiv.children];
  const maxCols = rows.reduce((max, row) => Math.max(max, row.children.length), 1);

  const table = document.createElement('table');

  // Header row
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.colSpan = maxCols;
  th.textContent = blockName;
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  // Data rows
  for (const row of rows) {
    const tr = document.createElement('tr');
    const cells = [...row.children];
    for (const cell of cells) {
      const td = document.createElement('td');
      // Move child nodes instead of using innerHTML to preserve DOM references
      while (cell.firstChild) {
        td.appendChild(cell.firstChild);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  return table;
}
