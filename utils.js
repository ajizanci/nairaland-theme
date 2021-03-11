function render(parent, tree) {
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

  parent.append(head);
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
    return () => f();
  } catch {
    return () => null;
  }
};

const getCategoryGroups = safeQuery(() =>
  toArray(document.querySelectorAll("table.boards tr td.l")).map((td) => {
    const links = toArray(td.querySelectorAll("a"));
    const heading = { title: links[0].innerText, link: links[0].href };
    return {
      heading,
      categories: links
        .slice(1)
        .map((a) => ({ title: a.innerText, link: a.href })),
    };
  })
);

const getThreads = safeQuery(() =>
  toArray(
    document.querySelectorAll("table.boards tbody tr td.featured.w a")
  ).map((a) => ({ title: a.innerText, link: a.href }))
);

const removeBrackets = (str) => str.substring(1, str.length - 1);

const getPagination = safeQuery(() => {
  const pagesTd = document.querySelector(
    "table.boards:nth-child(6) tbody tr:last-child td"
  );
  return [
    {
      page: removeBrackets(pagesTd.querySelector("b").innerText),
      link: window.location.href,
      current: true,
    },
  ].concat(
    toArray(pagesTd.querySelectorAll("a")).map((a) => ({
      page: removeBrackets(a.innerText),
      link: a.href,
    }))
  );
});
