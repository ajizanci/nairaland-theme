function render(parent = document, tree, prepend = false) {
  let head;

  const children = tree[tree.length - 1];
  const attrs = isPojo(tree[1]) ? tree[1] : {};

  if (isValidHtmlTag(tree[0])) {
    head = document.createElement(tree[0]);
  } else if (tree[0] instanceof HTMLElement) {
    head = tree[0];
  } else head = document.createTextNode(tree[0]);

  if (Array.isArray(children) && children.length > 0) {
    for (let branch of children) {
      render(head, branch);
    }
  }

  Object.keys(attrs).forEach((key) => head.setAttribute(key, attrs[key]));

  if (prepend) parent.prepend(head);
  else parent.append(head);

  return parent;
}

const isLoggedIn = () =>
  document.querySelector("table[summary] tbody tr td h1 + *").innerText !==
  "Guest";

const isPojo = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype;
};

const isValidHtmlTag = (tag) => {
  try {
    return (
      document.createElement(tag).toString() !== "[object HTMLUnknownElement]"
    );
  } catch {
    return false;
  }
};

const toArray = (collection) => [].slice.call(collection);

const safeQuery = (f) => {
  try {
    const out = f();
    return out;
  } catch {
    return null;
  }
};

const removeBrackets = (str) => str.substring(1, str.length - 1);

const getCategoryGroups = (container = document) =>
  safeQuery(() => {
    let groups = localStorage.getItem("categoryGroups");
    if (groups) return JSON.parse(groups);
    groups = toArray(
      container.querySelectorAll("a[name='top'] + table.boards tr td.l")
    ).map((td) => {
      const links = toArray(td.querySelectorAll("a"));
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

const saveThread = (el, threadMeta) => {
  const savedThreads = JSON.parse(localStorage.getItem("savedThreads")) || [];
  
  if (!savedThreads.find(({link}) => link === threadMeta.link))
    savedThreads.push(threadMeta);

  localStorage.setItem("savedThreads", JSON.stringify(savedThreads));
  el.textContent = "saved";
  el.onclick = function (e) {
    deleteThread(e.target, link);
  };
};

const deleteThread = (el, link) => {
  const savedThreads = JSON.parse(localStorage.getItem("savedThreads")) || [];
  const idx = savedThreads.findIndex(t => t.link === link);
  if (idx > -1) savedThreads.splice(idx);
  localStorage.setItem("savedThreads", JSON.stringify(savedThreads));
  el.textContent = "save thread";
  el.onclick = function (e) {
    saveThread(e.target, link);
  };
};

const showModal = () => {
  render(document.querySelector("body"), SavedThreadsModal())
  console.log("here")
}
