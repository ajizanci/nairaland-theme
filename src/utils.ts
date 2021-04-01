import { SavedThreadsModal } from "./components/SavedThreadModal";
import { Attributes, CategoryGroup, ThreadMeta, Tree } from "./types";

export function render(parent: HTMLElement, tree: Tree, prepend = false) {
  let head: HTMLElement | Text;

  const children = tree[tree.length - 1];

  if (tree[0] instanceof HTMLElement) {
    head = tree[0];
  } else if (isValidHtmlTag(tree[0])) {
    head = document.createElement(tree[0] as string);
  } else head = document.createTextNode(tree[0] as string);

  if (Array.isArray(children) && children.length > 0) {
    for (let branch of children) {
      render(head as HTMLElement, branch);
    }
  }

  if (tree.length > 2) {
    const attrs = tree[1] as Attributes;
    Object.keys(attrs).forEach((key) =>
      (head as HTMLElement).setAttribute(key, attrs[key])
    );
  }

  if (prepend) parent.prepend(head);
  else parent.append(head);
  return parent;
}

export const isLoggedIn = () => {
  try {
    (document.querySelector("table[summary] tbody tr td h1 + *") as HTMLElement)
      .innerText !== "Guest";
  } catch {
    return false;
  }
};

const isValidHtmlTag = (tag: string) => {
  try {
    return (
      document.createElement(tag).toString() !== "[object HTMLUnknownElement]"
    );
  } catch {
    return false;
  }
};

export const toArray = (collection: NodeList): HTMLElement[] =>
  [].slice.call(collection);

export const safeQuery = (f: () => any) => {
  try {
    const out = f();
    return out;
  } catch {
    return null;
  }
};

export const removeBrackets = (str: string) => str.substring(1, str.length - 1);

export const getCategoryGroups = (container: HTMLElement | Document = document): CategoryGroup[] =>
  safeQuery(() => {
    let groups;
    groups = localStorage.getItem("categoryGroups");
    if (groups) return JSON.parse(groups);
    groups = toArray(
      container.querySelectorAll("a[name='top'] + table.boards tr td.l")
    ).map((td) => {
      const links = toArray(td.querySelectorAll("a")) as HTMLAnchorElement[];
      const heading = { title: links[0].innerText, link: links[0].href };
      return {
        heading,
        categories: links
          .slice(1)
          .map((a) => ({ title: a.innerText, link: a.href })),
      };
    });
    localStorage.setItem("categoryGroups", JSON.stringify(groups));
    return groups;
  });

export const saveThread = (el: HTMLElement, threadMeta: ThreadMeta) => {
  const savedThreads: ThreadMeta[] = JSON.parse(localStorage.getItem("savedThreads") || "[]") || [];

  if (!savedThreads.find(({ link }) => link === threadMeta.link))
    savedThreads.push(threadMeta);

  localStorage.setItem("savedThreads", JSON.stringify(savedThreads));
  el.textContent = "saved";
  el.onclick = function (e) {
    deleteThread(e.target as HTMLElement, threadMeta);
  };
};

export const deleteThread = (el: HTMLElement, threadMeta: ThreadMeta) => {
  const savedThreads: ThreadMeta[] = JSON.parse(localStorage.getItem("savedThreads") || "[]") || [];
  const idx = savedThreads.findIndex((t) => t.link === threadMeta.link);
  if (idx > -1) savedThreads.splice(idx);
  localStorage.setItem("savedThreads", JSON.stringify(savedThreads));
  el.textContent = "save thread";
  el.onclick = function (e) {
    saveThread(e.target as HTMLElement, threadMeta);
  };
};

export const showModal = () => {
  render(document.body, SavedThreadsModal());
};
