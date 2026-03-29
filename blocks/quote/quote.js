export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      let blockquote = cell.querySelector('blockquote');
      // wrap plain paragraph text in a blockquote if not already present
      if (!blockquote) {
        const p = cell.querySelector('p');
        if (p && !cell.querySelector('img')) {
          blockquote = document.createElement('blockquote');
          blockquote.innerHTML = p.innerHTML;
          p.replaceWith(blockquote);
          cell.classList.add('quote-text');
        }
      } else {
        cell.classList.add('quote-text');
      }
      const img = cell.querySelector('img');
      if (img && !cell.querySelector('blockquote')) {
        cell.classList.add('quote-signature');
      }
    });
  });
}
