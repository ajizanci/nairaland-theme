(function () {
  const getThreads = safeQuery(() =>
    toArray(
      document.querySelectorAll("table[summary='links'] > tbody > tr > td a")
    ).map((a) => ({ title: a.innerText, link: a.href }))
  );

  const getPagination = safeQuery(() => {
    const p = document.querySelector("table[summary='links'] + p");
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
        JSON.parse(localStorage.getItem("categoryGroups")),
        getPagination()
      )
    )
  );
})();
