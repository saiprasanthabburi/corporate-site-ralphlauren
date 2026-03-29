export default function decorate(block) {
  // Move hero picture out of its row wrapper to be a direct child of the block.
  // This lets CSS `position: absolute; inset: 0` on the picture reference the
  // hero block itself (position: relative) rather than the intermediate row div.
  const pic = block.querySelector('picture');
  if (pic) {
    const row = pic.closest('.hero > div');
    block.prepend(pic);
    if (row && !row.textContent.trim() && !row.querySelector('picture, img, video')) {
      row.remove();
    }
  }
}
