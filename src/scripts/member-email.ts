// §6.4: assemble mailto: links from data-user / data-domain at runtime.
for (const link of document.querySelectorAll<HTMLAnchorElement>(
  "a[data-user][data-domain]",
)) {
  link.href = `mailto:${link.dataset.user}@${link.dataset.domain}`;
}
