const dialog = document.querySelector<HTMLDialogElement>("#work-dialog");
const content = dialog?.querySelector<HTMLElement>("[data-dialog-content]");
let opener: HTMLButtonElement | null = null;

function openWork(id: string, trigger: HTMLButtonElement | null = null) {
  const template = document.getElementById(`work-${id}`);
  if (!dialog || !content || !(template instanceof HTMLTemplateElement)) return;
  opener = trigger;
  content.replaceChildren(template.content.cloneNode(true));
  if (!dialog.open) dialog.showModal();
  const url = new URL(location.href);
  url.hash = `work=${encodeURIComponent(id)}`;
  history.replaceState(null, "", url);
}
document
  .querySelectorAll<HTMLButtonElement>("button[data-work-id]")
  .forEach((button) => {
    button.addEventListener("click", () =>
      openWork(button.dataset.workId!, button),
    );
  });
dialog
  ?.querySelector(".work-dialog__close")
  ?.addEventListener("click", () => dialog.close());
let backdropPointer = false;
dialog?.addEventListener("pointerdown", (event) => {
  backdropPointer = event.target === dialog;
});
dialog?.addEventListener("click", (event) => {
  if (backdropPointer && event.target === dialog) dialog.close();
});
dialog?.addEventListener("close", () => {
  if (location.hash.startsWith("#work=")) {
    const url = new URL(location.href);
    url.hash = "";
    history.replaceState(null, "", url);
  }
  opener?.focus({ preventScroll: true });
  opener = null;
});
function openFromHash() {
  const match = /^#work=(.+)$/.exec(location.hash);
  if (!match) return;
  try {
    openWork(decodeURIComponent(match[1]!));
  } catch {
    /* Ignore malformed URL encoding. */
  }
}
openFromHash();
window.addEventListener("hashchange", openFromHash);
export {};
