(function () {
  const url = new URL(window.location.href);
  const categoryGroups = JSON.parse(localStorage.getItem("categoryGroups"));
  const categoryRoutes = categoryGroups
    .map((g) => g.categories)
    .reduce((a, b) => a.concat(b), []);
  const categoryGroup = categoryRoutes.find((cr) =>
    url.pathname.startsWith(new URL(cr.link).pathname)
  );

  if (categoryGroup) {
    const getThreads = safeQuery(() =>
      toArray(
        document.querySelectorAll("table:not([summary]) tbody tr td > b > a")
      ).map((a) => ({ title: a.innerText, link: a.href }))
    );

    const getPagination = safeQuery(() => {
      const p = document.querySelector("table:not([summary]) + p");
      return [
        {
          page: removeBrackets(p.querySelector("b").innerText),
          link: window.location.href,
          current: true,
        },
      ]
        .concat(
          toArray(p.querySelectorAll("a"))
            .filter((a) => +removeBrackets(a.innerText))
            .map((a) => ({
              page: removeBrackets(a.innerText),
              link: a.href,
            }))
        )
        .sort((a1, a2) => +a1.page - +a2.page);
    });

    render(
      document.querySelector("body"),
      Container(
        {},
        Header(),
        Hero(),
        ThreadBoard(
          getThreads(),
          categoryGroups,
          getPagination(),
          categoryGroup.title
        )
      )
    );
  }
})();
