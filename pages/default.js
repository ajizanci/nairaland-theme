(async function () {
  if (!localStorage.getItem("categoryGroups")) {
    const body = await window
      .fetch("https://www.nairaland.com")
      .then((r) => r.text());
    const contents = body.match(/<div class="body">([\w\W\s]*?)<\/div>/)[1];
    const div = document.createElement("div");
    div.innerHTML = contents;
    getCategoryGroups(div);
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
    categoryGroup.current = "current";
    renderBoard(categoryGroups, categoryGroup.title);
  } else if (/^\/(\d+)\/.*/.test(url.pathname)) {
    renderThread();
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
        current: "current",
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
      ThreadBoard(getThreads(), categoryGroups, getPagination(), title)
    )
  );
}

function renderThread() {
  const getPosts = () => {
    const tds = toArray(document.querySelectorAll("table[summary='posts'] td:not(.pu.pd)"))
    const groupedTds = [];

    while (tds.length > 0)
      groupedTds.push(tds.splice(0, 2));
    
    return groupedTds.map(([info, main]) => {
      let replyingTo = safeQuery(() => main.querySelector("div.narrow > blockquote > a"))()
      replyingTo = replyingTo && new URL(replyingTo.href).pathname.startsWith("/post")
                    ? replyingTo.innerText : "Nobody"
      return {
        replyingTo,
        author: safeQuery(() => info.querySelector('a.user').innerText)() || "Nobody",
        timeOfPub: info.querySelector('span.s').innerText,
        html: main.querySelector('div.narrow').innerHTML,
        likes: safeQuery(() =>  +main.querySelector('p.s b').innerText.match(/\d+/)[0])() || 0,
        shares: safeQuery(() => +main.querySelector('p.s b:last-child').innerText.match(/\d+/)[0])() || 0,
        attachmentImages: toArray(main.querySelectorAll('img.attachmentimage')).map(img => img.src)
      }
    })
  }

  render(document.querySelector("body"),
    Container({},
      Header(),
      el("div", { class: "thread" },
        ...getPosts().map(post => {
          const postDiv = document.createElement("div");
          postDiv.classList.add("post");
          postDiv.innerHTML = post.html;
          render(postDiv,
            el("div", { class: "meta" },
              el("div", {},
                el("p", {},
                  el("a", { class: "author", href: `/${post.author}` },
                    t(post.author)
                  ),
                  t(" commented on "),
                  el("a", { class: "author", href: `/${post.replyingTo}` },
                    t(post.replyingTo)
                  )
                ),
                el("p", {},
                  t(post.timeOfPub)
                )
              )
            ), true
          )
          return el("div", { class: "post-wrapper" },
            [postDiv],
            el("div", { class: "reactions" },
              el("button", { class: "quote" },
                QuoteIcon()
              ),
              el("button", { class: "like" },
                HeartIcon(),
                el("span", {},
                  t(post.likes)
                )
              ),
              el("button", { class: "share" },
                ShareIcon(),
                el("span", {},
                  t(post.shares)
                )
              )
            )
          )
        })
      )
    )
  )
}
