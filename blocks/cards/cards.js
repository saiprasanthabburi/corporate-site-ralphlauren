import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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
}
