// §8.1: toggle the scrolled look and close the mobile menu after navigation.
const header = document.querySelector<HTMLElement>("#global-header");
const menu = document.querySelector<HTMLElement>("#mobile-menu");

if (header) {
  let ticking = false;
  const update = () => {
    header.toggleAttribute("data-scrolled", window.scrollY > 0);
    ticking = false;
  };
  update();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
}

if (menu) {
  menu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menu.hidePopover();
    }
  });
  matchMedia("(min-width: 48rem)").addEventListener("change", (event) => {
    if (event.matches && menu.matches(":popover-open")) menu.hidePopover();
  });
}
