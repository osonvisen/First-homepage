export const HEADER_HEIGHT_VAR = "--header-height";

/**
 * Keeps a CSS variable on <html> equal to the sticky header's height, so scroll-padding-top can keep
 * anchor targets and focused elements clear of it. The header grows when the menu wraps on narrow
 * screens or the text is zoomed, which a fixed value in CSS cannot follow. Returns a cleanup function.
 */
export function trackHeaderHeight(header: HTMLElement, root: HTMLElement = document.documentElement): () => void {
  function update() {
    root.style.setProperty(HEADER_HEIGHT_VAR, `${Math.ceil(header.getBoundingClientRect().height)}px`);
  }
  update();
  const observer = new ResizeObserver(update);
  observer.observe(header);
  return () => observer.disconnect();
}
