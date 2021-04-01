import { Container, Header, Hero, ThreadBoard } from "../components";
import { safeQuery, toArray, removeBrackets, render } from "../utils";

export function NewsPage() {
  const threads = safeQuery(() =>
    toArray(
      document.querySelectorAll("table[summary='links'] > tbody > tr > td a")
    ).map((a) => ({ title: a.innerText, link: (a as HTMLAnchorElement).href }))
  );

  const pagination = safeQuery(() => {
    const p = document.querySelector("table[summary='links'] + p")!;
    return [
      {
        page: +removeBrackets(p.querySelector("b")?.innerText!),
        link: window.location.href,
        current: "current",
      },
    ]
      .concat(
        toArray(p.querySelectorAll("a"))
          .filter((a) => +removeBrackets(a.innerText))
          .map((a) => ({
            page: +removeBrackets(a.innerText),
            link: (a as HTMLAnchorElement).href,
            current: "",
          }))
      )
      .sort((a1, a2) => +a1.page - +a2.page);
  });

  return Container(
    {},
    Header(),
    Hero(),
    ThreadBoard(
      threads,
      JSON.parse(localStorage.getItem("categoryGroups") || "[]"),
      pagination
    )
  );
}
