import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // mobile accordion: toggle list visibility when heading is clicked
  footer.querySelectorAll('h2').forEach((heading) => {
    heading.addEventListener('click', () => {
      const section = heading.closest('.section');
      if (section) {
        section.classList.toggle('expanded');
      }
    });
  });

  block.append(footer);
}
