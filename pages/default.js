(async function () {
  if (!localStorage.getItem("categoryGroups")) {
    const body = await window
      .fetch("https://www.nairaland.com")
      .then((r) => r.text());
    const contents = body.match(/<div class="body">([\w\W\s]*?)<\/div>/)[1];
    const div = document.createElement("div");
    div.innerHTML = contents;
    const groups = toArray(div.querySelectorAll("table.boards tr td.l")).map(
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
  }

  renderDefault();
})();

function renderDefault() {
  const url = new URL(window.location.href);
  const categoryGroups = JSON.parse(localStorage.getItem("categoryGroups"));
  const categoryRoutes = categoryGroups
    .map((g) => g.categories)
    .reduce((a, b) => a.concat(b), []);
  const categoryGroup = categoryRoutes.find((cr) =>
    url.pathname.startsWith(new URL(cr.link).pathname)
  );

  if (categoryGroup) {
    renderBoard(categoryGroups, categoryGroup.title);
  }
}

function renderBoard(categoryGroups, title) {
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
        title
      )
    )
  );
}
