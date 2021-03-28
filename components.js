const el = (tag, attrs, ...children) => [tag, attrs, children];

const t = (text) => [text];

const Container = (attrs = {}, ...children) =>
  el(
    "div",
    { class: `th-container ${attrs.class || ""}`, ...attrs },
    ...children
  );

const AuthHeader = () => [];

const Header = () => {
  const navlinks = {
    home: "/",
    new: "/new",
    recent: "/recent",
    trending: "/trending",
    login: "/login",
    "sign up": "/register",
  };
  return el(
    "header",
    {},
    Logo(),
    el(
      "nav",
      {},
      el(
        "ul",
        {},
        ...Object.keys(navlinks)
          .map((l) =>
            el(
              "li",
              {},
              el(
                "a",
                {
                  href: navlinks[l],
                  class: `btn ${l == "login" ? "primary" : ""}`,
                },
                t(l)
              )
            )
          )
          .concat(
            localStorage.getItem("savedThreads") ? [SavedThreadsLi()] : []
          )
      )
    )
  );
};

const SavedThreadsLi = () => {
  const el = document.createElement("li");
  el.classList.add("btn");
  el.textContent = "saved threads";
  el.onclick = showModal;
  return [el];
};

const Hero = () =>
  el(
    "div",
    { class: "hero" },
    Logo("h2", "big"),
    el(
      "form",
      { action: "/search", class: "search" },
      el("input", {
        name: "query",
        placeholder: "Topic, Thread, Phrase, News, Information...",
      }),
      el("button", { type: "submit" }, t("Submit"))
    )
  );

const Logo = (e = "h1", classes = "") => {
  const el = document.createElement(e);
  el.classList.add("logo");
  classes
    .split(" ")
    .filter((c) => c)
    .forEach((c) => el.classList.add(c));
  el.innerHTML = "&#8358;airaland Forum";
  return [el];
};

const QuoteIcon = () => {
  const el = document.createElement("span");
  el.innerHTML = `<svg class="reaction" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>`;
  return [el];
};

const HeartIcon = () => {
  const el = document.createElement("span");
  el.innerHTML = `<svg class="reaction" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>`;
  return [el];
};

const ShareIcon = () => {
  const el = document.createElement("span");
  el.innerHTML = `<svg class="reaction" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>`;
  return [el];
};

const ThreadBoard = (
  threads,
  categoryGroups,
  pagination,
  heading = "Latest News"
) =>
  el(
    "main",
    {},
    Threads(threads, pagination, heading),
    CategoryNav(categoryGroups)
  );

const Thread = (posts, threadMeta) =>
  el(
    "div",
    { class: "thread" },
    ...posts.map((post) => PostWrapper(post, threadMeta))
  );

const SavedThread = (threadMeta, savedThreadsEl) =>
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

const ThreadMeta = (threadMeta) =>
  el(
    "div",
    { class: "thread-meta" },
    el(
      "div",
      { class: "wrapper" },
      el(
        "div",
        { class: "details" },
        el("h1", {}, t(threadMeta.title)),
        el(
          "p",
          { class: "pub-meta" },
          t("by "),
          el("a", { class: "author" }, t(threadMeta.author)),
          t(": "),
          el("span", { class: "time" }, t(threadMeta.timeOfPub))
        )
      ),
      SaveThreadButton(threadMeta)
    )
  );

const SaveThreadButton = (threadMeta) => {
  const thread = (JSON.parse(localStorage.getItem("savedThreads")) || []).find(
    (t) => t.link === threadMeta.link
  );
  const el = document.createElement("button");
  el.classList.add("save");
  if (thread) {
    el.textContent = "saved";
    el.onclick = function (e) {
      deleteThread(e.target, thread);
    };
  } else {
    el.textContent = "save thread";
    el.onclick = function (e) {
      saveThread(e.target, threadMeta);
    };
  }
  return [el];
};

const DeleteThreadButton = (threadLink, savedThreadsEl) => {
  const el = document.createElement("button");
  el.textContent = "delete";
  el.classList.add("delete");

  el.onclick = function (ev) {
    let savedThreads = JSON.parse(localStorage.getItem("savedThreads")) || [];
    savedThreads = JSON.stringify(
      savedThreads.filter((sv) => sv.link !== threadLink)
    );
    localStorage.setItem("savedThreads", savedThreads);
    savedThreadsEl.setAttribute("threads", savedThreads);
  };

  return [el];
};

const PostWrapper = (post, threadMeta) =>
  el(
    "div",
    { class: "post-wrapper" },
    Post(post, threadMeta),
    el(
      "div",
      { class: "reactions" },
      el("button", { class: "quote" }, QuoteIcon()),
      el(
        "button",
        { class: "like" },
        HeartIcon(),
        el("span", {}, t(post.likes))
      ),
      el(
        "button",
        { class: "share" },
        ShareIcon(),
        el("span", {}, t(post.shares))
      )
    )
  );

const Post = (post, threadMeta) => {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");
  postDiv.innerHTML = post.html;
  if (
    !(
      post.author === threadMeta.author &&
      post.timeOfPub === threadMeta.timeOfPub
    )
  )
    render(
      postDiv,
      el(
        "div",
        { class: "meta" },
        el(
          "div",
          {},
          el(
            "p",
            {},
            el(
              "a",
              { class: "author", href: `/${post.author}` },
              t(post.author)
            ),
            t(" commented on "),
            el(
              "a",
              { class: "author", href: `/${post.replyingTo}` },
              t(post.replyingTo)
            )
          ),
          el("p", {}, t(post.timeOfPub))
        )
      ),
      true
    );
  return [postDiv];
};

const Threads = (threads, pagination, heading) =>
  el(
    "section",
    { class: "threads" },
    el("h2", { class: "heading" }, t(heading)),
    el(
      "div",
      { class: "posts" },
      ...threads.map((thread) =>
        el("a", { class: "link post", href: thread.link }, t(thread.title))
      )
    ),
    Pagination(pagination),
    GoToTop(),
    Disclaimer()
  );

const Pagination = (pages) =>
  el(
    "div",
    { class: "pagination" },
    ...pages.map((page) =>
      el(
        "a",
        { class: `link page ${page.current}`, href: page.link },
        t(page.page)
      )
    )
  );

const GoToTop = () => el("div", { class: "gototop" }, t("Go to the top"));

const Disclaimer = () =>
  el(
    "p",
    { class: "disclaimer" },
    t(
      "Every member of Nairaland is solely responsible for what he or she posts on Nairaland."
    )
  );

const CategoryNav = (categoryGroups) =>
  el(
    "aside",
    { class: "category-nav" },
    ...categoryGroups.map((group) => ThreadCategories(group))
  );

const ThreadCategories = (categoryGroup) =>
  el(
    "div",
    { class: "categories" },
    el("h2", { class: "heading" }, t(categoryGroup.heading.title)),
    ...categoryGroup.categories.map((category) =>
      el(
        "a",
        { class: `link category ${category.current}`, href: category.link },
        t(category.title)
      )
    )
  );

const HowToPlaceAds = () =>
  el(
    "a",
    { href: "#", class: "link how" },
    t("How to PLACE TARGETED ADS on Nairaland")
  );

const SavedThreadsModalContent = () => {
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

const SavedThreadsModal = () => {
  const el = document.createElement("div");
  el.classList.add("modal-container");
  el.onclick = function (ev) {
    ev.target.remove();
  };
  return [render(el, SavedThreadsModalContent())];
};

class SavedThreadsFilterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const threads = JSON.parse(localStorage.getItem("savedThreads")) || [];
    const filter = document.createElement("div");
    const savedThreadsEl = document.createElement("saved-threads");
    savedThreadsEl.setAttribute("threads", JSON.stringify(threads));
    const filterInput = document.createElement("input");
    filterInput.placeholder = "Search..."
    filterInput.addEventListener("input", (ev) =>
      updateList(threads, ev.target.value, savedThreadsEl)
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
    this.shadowRoot.append(styles, filter, savedThreadsEl);
  }
}

function updateList(threads, query, el) {
  el.setAttribute(
    "threads",
    JSON.stringify(
      threads.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
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
    this.shadowRoot.appendChild(styles);
    renderList(JSON.parse(this.getAttribute("threads")) || [], this);
  }

  attributeChangedCallback(name, oldV, newV) {
    if (name === "threads") {
      renderList(JSON.parse(newV) || [], this);
    }
  }
}

function renderList(list = [], parent) {
  let elem;
  try {
    elem = parent.shadowRoot.querySelector(".saved-threads");
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
  parent.shadowRoot.appendChild(elem);
}

window.customElements.define("saved-threads", SavedThreadsComponent);
window.customElements.define(
  "saved-threads-filter",
  SavedThreadsFilterComponent
);
