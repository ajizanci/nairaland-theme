import { el, t } from ".";
import { ThreadMeta, Tree } from "../types";
import { render } from "../utils";

const SavedThread = (threadMeta: ThreadMeta, savedThreadsEl: HTMLElement) =>
  el(
    "div",
    { class: "saved-thread" },
    el(
      "div",
      {},
      el("p", {}, el("a", { href: threadMeta.link }, t(threadMeta.title))),
      el(
        "p",
        {},
        t("by "),
        el(
          "a",
          { class: "author", href: `/${threadMeta.author}` },
          t(threadMeta.author)
        ),
        t(`: ${threadMeta.timeOfPub}`)
      )
    ),
    DeleteThreadButton(threadMeta.link, savedThreadsEl)
  );

  
const DeleteThreadButton = (threadLink: string, savedThreadsEl: HTMLElement): Tree => {
  const el = document.createElement("button");
  el.textContent = "delete";
  el.classList.add("delete");

  el.onclick = function (ev: Event) {
    const savedThreads: ThreadMeta[] = JSON.parse(localStorage.getItem("savedThreads") || "[]");
    const serialized = JSON.stringify(
      savedThreads.filter((sv) => sv.link !== threadLink)
    );
    localStorage.setItem("savedThreads", serialized);
    savedThreadsEl.setAttribute("threads", serialized);
  };

  return [el];
};

const SavedThreadsModalContent = (): Tree => {
  const e = document.createElement("div");
  e.classList.add("modal-content");
  e.onclick = (e) => e.stopPropagation();
  return [
    render(
      e,
      el(
        "div",
        {},
        el("div", { class: "modal-header" }, el("h2", {}, t("saved threads"))),
        el("div", { class: "modal-body" }, el("saved-threads-filter", {}))
      )
    ),
  ];
};

export const SavedThreadsModal = (): Tree => {
  const el = document.createElement("div");
  el.classList.add("modal-container");
  el.onclick = function (ev: Event) {
    (ev.target as HTMLElement).remove();
  };
  return [render(el, SavedThreadsModalContent())];
};

class SavedThreadsFilterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const threads: ThreadMeta[] = JSON.parse(localStorage.getItem("savedThreads") || "[]");
    const filter = document.createElement("div");
    const savedThreadsEl = document.createElement("saved-threads");
    savedThreadsEl.setAttribute("threads", JSON.stringify(threads));
    const filterInput = document.createElement("input");
    filterInput.placeholder = "Search...";
    filterInput.addEventListener("input", (ev) =>
      updateList((ev.target as HTMLInputElement).value, savedThreadsEl)
    );
    filter.classList.add("filter");
    filter.appendChild(filterInput);

    const styles = document.createElement("style");
    styles.textContent = `
      .filter {
        padding: 1.5em 2em;
      }
      
      .filter input {
        display: block;
        width: 100%;
        font-size: 0.97rem;
        font-family: Roboto;
        border: 2px solid var(--dark-gray);
        padding: 0.5em;
        border-radius: 0.3em;
        box-sizing: border-box;
      }
      
      .filter input:focus {
        outline: none;
        border-color: #86de85;
      }
    `;
    this.shadowRoot?.append(styles, filter, savedThreadsEl);
  }
}

function updateList(query: string, el: HTMLElement) {
  const threads = JSON.parse(localStorage.getItem("savedThreads") || "[]");
  el.setAttribute(
    "threads",
    JSON.stringify(
      threads.filter((t: ThreadMeta) => t.title.toLowerCase().includes(query.toLowerCase()))
    )
  );
}

class SavedThreadsComponent extends HTMLElement {
  static get observedAttributes() {
    return ["threads"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const styles = document.createElement("style");
    styles.textContent = `
      .saved-threads {
        max-height: 20em;
        overflow-y: auto;
        padding-bottom: 1.5em;
      }
      
      .saved-threads > div > * + * {
        border-top: 1px solid var(--dark-gray);
      }
      
      .saved-thread {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 1em 2em;
      }

      p.no-thread {
        padding: 1em 2em;
        text-align: center;
        text-transform: capitalize;
      }
      
      .saved-thread > div > p:first-child {
        text-transform: capitalize;
        margin-bottom: 0.4em;
      }
      
      .saved-thread > div > p:first-child a {
        color: inherit;
        text-decoration: none;
      }
      
      .saved-thread > div > p:last-child {
        color: #727d72;
        font-size: 0.95rem;
      }
      
      .saved-thread a.author {
        color: inherit;
        text-decoration: none;
        text-decoration: underline;
      }
      
      .saved-thread button.delete {
        text-transform: capitalize;
        font-size: 0.95rem;
        border-radius: 0.3em;
        color: var(--danger);
        border: 0;
        font-family: inherit;
        background: transparent;
        margin-left: 0.5rem;
        cursor: pointer;
      }
      
      .saved-thread button.delete:hover {
        text-decoration: underline;
      }
    `;
    this.shadowRoot?.appendChild(styles);
    renderList(JSON.parse(this.getAttribute("threads") || "[]"), this);
  }

  attributeChangedCallback(name: string, oldV: string, newV: string) {
    if (name === "threads") {
      renderList(JSON.parse(newV) || [], this);
    }
  }
}

function renderList(list: ThreadMeta[], parent: HTMLElement) {
  let elem: HTMLElement;
  try {
    elem = parent.shadowRoot?.querySelector(".saved-threads")! as HTMLElement;
    elem.querySelectorAll("*").forEach((sts) => sts.remove());
  } catch {
    elem = document.createElement("div");
    elem.classList.add("saved-threads");
  }
  if (list.length) {
    render(elem, el("div", {}, ...list.map((t) => SavedThread(t, parent))));
  } else {
    const p = document.createElement("p");
    p.classList.add("no-thread");
    p.append("no saved threads");
    elem.append(p);
  }
  parent.shadowRoot?.appendChild(elem);
}

window.customElements.define("saved-threads", SavedThreadsComponent);
window.customElements.define(
  "saved-threads-filter",
  SavedThreadsFilterComponent
);