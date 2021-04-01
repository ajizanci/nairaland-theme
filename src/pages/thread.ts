import { Container, Header, Thread, ThreadMetaComp } from "../components";
import { ThreadMeta } from "../types";
import { render, safeQuery, toArray } from "../utils";

export function ThreadPage(threadMeta: ThreadMeta) {
  return Container(
    {},
    Header(),
    ThreadMetaComp(threadMeta),
    Thread(getThreadPosts(threadMeta.author), threadMeta)
  );
}

function getThreadPosts(author: string) {
  return safeQuery(() => {
    const tds = toArray(
      document.querySelectorAll("table[summary='posts'] td:not(.pu.pd)")
    );
    const groupedTds = [];

    while (tds.length > 0) groupedTds.push(tds.splice(0, 2));

    return groupedTds.map(([info, main]) => {
      let replyingTo = safeQuery(() =>
        main.querySelector("div.narrow > blockquote > a")
      );
      replyingTo =
        replyingTo && new URL(replyingTo.href).pathname.startsWith("/post")
          ? replyingTo.innerText
          : author;
      return {
        replyingTo,
        author:
          safeQuery(
            () => (info.querySelector("a.user") as HTMLElement).innerText
          ) || "Nobody",
        timeOfPub: (info.querySelector("span.s") as HTMLElement).innerText,
        html: main.querySelector("div.narrow")?.innerHTML,
        likes:
          safeQuery(
            () =>
              +(main.querySelector("p.s b") as HTMLElement).innerText.match(
                /\d+/
              )![0]
          ) || 0,
        shares:
          safeQuery(
            () =>
              +(main.querySelector(
                "p.s b:last-child"
              ) as HTMLElement).innerText.match(/\d+/)![0]
          ) || 0,
        attachmentImages: toArray(
          main.querySelectorAll("img.attachmentimage")
        ).map((img) => (img as HTMLImageElement).src),
      };
    });
  });
}

export function renderThread(id: string) {
  const savedThreads = JSON.parse(localStorage.getItem("savedThreads") || "[]");
  const threadMeta = savedThreads.find(
    (t: ThreadMeta) => t.link === `https://www.nairaland.com/${id}`
  );
  console.log("saved", savedThreads);
  if (threadMeta) {
    render(document.body, ThreadPage(threadMeta));
  } else {
    window
      .fetch(`https://www.nairaland.com/${id}`)
      .then((r) => r.text())
      .then((body) => body.match(/<body>([\w\W\s]*?)<\/body>/)![1])
      .then((html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div;
      })
      .then((div) =>
        safeQuery(() => {
          const td = div.querySelector(
            "table[summary='posts'] td:not(.pu.pd)"
          )!;
          return {
            link: `https://www.nairaland.com/${id}`,
            title: (td.querySelector("a[href]") as HTMLElement).innerText,
            author: (td.querySelector("a.user") as HTMLElement).innerText,
            timeOfPub: (td.querySelector("span.s") as HTMLElement).innerText,
          };
        })
      )
      .then((threadMeta) => {
        console.log("threadMeta", threadMeta);
        render(document.body, ThreadPage(threadMeta));
      });
  }
}
