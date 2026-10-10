/* 可选增强：基础交互不可用时，文章和链接仍可直接阅读。 */
(() => {
  const search = document.querySelector('.canglan-header [data-open-dialog="search-dialog"]');
  if (search) {
    const shortcut = search.querySelector('.search-shortcut');
    if (shortcut) {
      shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
      shortcut.hidden = false;
    }
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !event.altKey) {
        event.preventDefault();
        if (!document.getElementById('search-dialog')?.open) search.click();
      }
    });
  }
  const scroll = document.querySelector('.article-scroll');
  const viewport = document.querySelector('.article-viewport');
  if (!scroll || !viewport) return;
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  viewport.append(progress);
  let pending = false;
  const update = () => {
    const distance = scroll.scrollHeight - scroll.clientHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, scroll.scrollTop / distance) : 0})`;
    pending = false;
  };
  scroll.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update, { once: true });
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(update);
    const main = scroll.querySelector('main');
    if (main) observer.observe(main);
    observer.observe(scroll);
  }
  update();
})();
