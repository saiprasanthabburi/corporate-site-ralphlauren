export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const blockquote = cell.querySelector('blockquote');
      if (blockquote) {
        cell.classList.add('quote-text');
      }
      const img = cell.querySelector('img');
      if (img && !blockquote) {
        cell.classList.add('quote-signature');
      }
    });
  });
}
