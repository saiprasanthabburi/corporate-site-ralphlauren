export default function decorate(block) {
  // Move hero picture out of its row wrapper to be a direct child of the block.
  // This lets CSS `position: absolute; inset: 0` on the picture reference the
  // hero block itself (position: relative) rather than the intermediate row div.
  let pic = block.querySelector('picture');

  // Handle bare <img> without <picture> wrapper (e.g. from content import)
  if (!pic) {
    const img = block.querySelector(':scope > div > div > img, :scope > div > div > p > img');
    if (img) {
      pic = document.createElement('picture');
      img.parentElement.replaceChild(pic, img);
      pic.appendChild(img);
    }
  }

  if (pic) {
    const row = pic.closest('.hero > div');
    block.prepend(pic);
    if (row && !row.textContent.trim() && !row.querySelector('picture, img, video')) {
      row.remove();
    }
  }

  // Clean up any remaining empty content divs and mark image-only heroes
  const contentDiv = block.querySelector(':scope > div');
  if (!contentDiv || !contentDiv.textContent.trim()) {
    if (contentDiv) contentDiv.remove();
    block.classList.add('image-only');
  }
}
