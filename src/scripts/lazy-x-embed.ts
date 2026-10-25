interface TwitterWidget {
  _e?: Array<(widget: TwitterWidget) => void>;
  ready: (callback: (widget: TwitterWidget) => void) => void;
  events?: {
    bind: (
      name: string,
      handler: (event: { target: HTMLElement }) => void,
    ) => void;
  };
}
declare global {
  interface Window {
    twttr?: TwitterWidget;
  }
}
const embed = document.querySelector<HTMLElement>("[data-x-embed]");
const news = document.getElementById("news");

function loadTimeline() {
  if (!embed) return;
  let rendered = false;
  const collapse = () => {
    if (!rendered) embed.classList.add("is-collapsed");
  };
  // Also handle a request that stalls without firing load or error.
  let timer = window.setTimeout(collapse, 8000);
  // Official asynchronous snippet: queue ready callbacks before widgets.js runs.
  window.twttr = ((d: Document, s: string, id: string) => {
    const widget = window.twttr ?? ({} as TwitterWidget);
    if (d.getElementById(id)) return widget;
    const script = d.createElement(s) as HTMLScriptElement;
    script.id = id;
    script.async = true;
    script.src = "https://platform.twitter.com/widgets.js";
    script.onerror = () => {
      window.clearTimeout(timer);
      collapse();
    };
    script.onload = () => {
      window.clearTimeout(timer);
      if (!rendered) timer = window.setTimeout(collapse, 8000);
    };
    widget._e = [];
    widget.ready = (callback) => {
      widget._e!.push(callback);
    };
    const firstScript = d.getElementsByTagName(s)[0];
    firstScript!.parentNode!.insertBefore(script, firstScript!);
    return widget;
  })(document, "script", "twitter-wjs");
  window.twttr.ready((twitter) => {
    twitter.events?.bind("rendered", (event) => {
      if (!embed.contains(event.target)) return;
      rendered = true;
      window.clearTimeout(timer);
      embed.classList.remove("is-collapsed");
    });
  });
}
if (embed && news) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadTimeline();
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(news);
  } else loadTimeline();
}
export {};
