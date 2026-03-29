export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // auto-detect leader-featured variant: columns with h2 + "Read Full Bio" link
  if (!block.classList.contains('leader-featured')) {
    const hasH2 = block.querySelector('h2');
    const hasBioLink = [...block.querySelectorAll('a')].some(
      (a) => a.textContent.trim().toLowerCase().includes('read full bio'),
    );
    if (hasH2 && hasBioLink) {
      block.classList.add('leader-featured');
    }
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
