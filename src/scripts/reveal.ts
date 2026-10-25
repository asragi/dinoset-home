// §7.5: fade elements in once when they enter the viewport.
const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const revealAll = () => {
  for (const element of elements) element.classList.add("is-revealed");
};

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  for (const element of elements) {
    const delay = Number(element.dataset.revealDelay) || 0;
    if (delay) element.style.setProperty("--reveal-delay", `${delay}ms`);
    observer.observe(element);
  }
  reduceMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer.disconnect();
    revealAll();
  });
}
