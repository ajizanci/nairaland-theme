(function () {
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
        current: "current",
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
      ThreadBoard(
        getThreads(),
        getCategoryGroups(),
        getPagination()
      )
    )
  );
})();
