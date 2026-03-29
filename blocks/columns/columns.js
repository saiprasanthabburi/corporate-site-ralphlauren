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

  // auto-detect about variant: columns with "About Us" heading
  if (!block.classList.contains('about')) {
    const h2 = block.querySelector('h2');
    if (h2 && h2.textContent.trim().toLowerCase() === 'about us') {
      block.classList.add('about');
    }
  }

  // auto-detect newsroom variant: columns with "Newsroom" heading + multiple images
  if (!block.classList.contains('newsroom')) {
    const h2 = block.querySelector('h2');
    const hasNewsroom = h2 && h2.textContent.trim().toLowerCase().includes('newsroom');
    const hasMultiPics = [...block.querySelectorAll('div > div')].some(
      (col) => col.querySelectorAll('picture').length >= 2,
    );
    if (hasNewsroom && hasMultiPics) {
      block.classList.add('newsroom');
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
