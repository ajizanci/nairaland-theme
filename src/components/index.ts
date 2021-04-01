import {
  Attributes,
  CategoryGroup,
  Page,
  ThreadLink,
  ThreadMeta,
  ThreadPost,
  Tree,
} from "../types";
import { deleteThread, render, saveThread, showModal } from "../utils";

export const el = (tag: string, attrs: Attributes = {}, ...children: Tree[]): Tree => [
  tag,
  attrs,
  children,
];

export const t = (text: any): Tree => [String(text)];

export const Container = (attrs: Attributes, ...children: Tree[]) =>
  el(
    "div",
    { class: `th-container ${attrs.class || ""}`, ...attrs },
    ...children
  );

export const AuthHeader = () => [];

export const Header = () => {
  const navlinks: Attributes = {
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

export const SavedThreadsLi = (): Tree => {
  const el = document.createElement("li");
  el.classList.add("btn");
  el.textContent = "saved threads";
  el.onclick = showModal;
  return [el];
};

export const Hero = () =>
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

export const Logo = (e = "h1", classes = ""): Tree => {
  const el = document.createElement(e);
  el.classList.add("logo");
  classes
    .split(" ")
    .filter((c) => c)
    .forEach((c) => el.classList.add(c));
  el.innerHTML = "&#8358;airaland Forum";
  return [el];
};

export const QuoteIcon = (): Tree => {
  const el = document.createElement("span");
  el.innerHTML = `<svg class="reaction" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>`;
  return [el];
};

export const HeartIcon = (): Tree => {
  const el = document.createElement("span");
  el.innerHTML = `<svg class="reaction" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>`;
  return [el];
};

const ShareIcon = (): Tree => {
  const el = document.createElement("span");
  el.innerHTML = `<svg class="reaction" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>`;
  return [el];
};

export const ThreadBoard = (
  threads: ThreadLink[],
  categoryGroups: CategoryGroup[],
  pagination: Page[],
  heading = "Latest News"
) =>
  el(
    "main",
    {},
    Threads(threads, pagination, heading),
    CategoryNav(categoryGroups)
  );

export const Thread = (posts: ThreadPost[], threadMeta: ThreadMeta) =>
  el(
    "div",
    { class: "thread" },
    ...posts.map((post) => PostWrapper(post, threadMeta))
  );

export const ThreadMetaComp = (threadMeta: ThreadMeta) =>
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

const SaveThreadButton = (threadMeta: ThreadMeta): Tree => {
  const thread = (
    JSON.parse(localStorage.getItem("savedThreads") || "[]")
  ).find((t: ThreadMeta) => t.link === threadMeta.link);
  const el = document.createElement("button");
  el.classList.add("save");
  if (thread) {
    el.textContent = "saved";
    el.onclick = function (e: Event) {
      deleteThread(e.target as HTMLElement, thread);
    };
  } else {
    el.textContent = "save thread";
    el.onclick = function (e) {
      saveThread(e.target as HTMLElement, threadMeta);
    };
  }
  return [el];
};

const PostWrapper = (post: ThreadPost, threadMeta: ThreadMeta) =>
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

const Post = (post: ThreadPost, threadMeta: ThreadMeta): Tree => {
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

const Threads = (threads: ThreadLink[], pagination: Page[], heading: string) =>
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

const Pagination = (pages: Page[]) =>
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

const CategoryNav = (categoryGroups: CategoryGroup[]) =>
  el(
    "aside",
    { class: "category-nav" },
    ...categoryGroups.map((group) => ThreadCategories(group))
  );

const ThreadCategories = (categoryGroup: CategoryGroup) =>
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
