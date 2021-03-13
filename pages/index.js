const getCategoryGroups = safeQuery(() => {
  let groups = localStorage.getItem("categoryGroups");
  if (groups) return JSON.parse(groups);
  groups = toArray(document.querySelectorAll("table.boards tr td.l")).map(
    (td) => {
      const links = toArray(td.querySelectorAll("a"));
      const heading = { title: links[0].innerText, link: links[0].href };
      return {
        heading,
        categories: links
          .slice(1)
          .map((a) => ({ title: a.innerText, link: a.href })),
      };
    }
  );
  localStorage.setItem("categoryGroups", JSON.stringify(groups));
  return groups;
});

const getThreads = safeQuery(() =>
  toArray(
    document.querySelectorAll("table.boards tbody tr td.featured.w a")
  ).map((a) => ({ title: a.innerText, link: a.href }))
);

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
    toArray(pagesTd.querySelectorAll("a"))
      .filter((a) => +removeBrackets(a.innerText))
      .map((a) => ({
        page: removeBrackets(a.innerText),
        link: a.href,
      }))
  );
});

render(
  document.querySelector("body"),
  Container(
    {},
    Header(),
    Hero(),
    ThreadBoard(getThreads(), getCategoryGroups(), getPagination())
  )
);
