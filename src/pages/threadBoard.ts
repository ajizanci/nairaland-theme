import { Container, Header, Hero, ThreadBoard } from "../components";
import { CategoryGroup, Page, Tree } from "../types";
import { removeBrackets, render, safeQuery, toArray } from "../utils";

export function ThreadBoardPage(
  categoryGroups: CategoryGroup[],
  title: string
): Tree {
  const threads = safeQuery(() =>
    toArray(
      document.querySelectorAll("table:not([summary]) tbody tr td > b > a")
    ).map((a: HTMLElement) => ({
      title: a.innerText,
      link: (a as HTMLAnchorElement).href,
    }))
  );

  const pagination: Page[] = safeQuery(() => {
    const p = document.querySelector("table:not([summary]) + p")!;
    return [
      {
        page: +removeBrackets(p.querySelector("b")?.innerText!),
        link: window.location.href,
        current: "current",
      },
    ]
      .concat(
        toArray(p.querySelectorAll("a")!)
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
    ThreadBoard(threads, categoryGroups, pagination, title)
  );
}

export function renderBoard(categoryGroups: CategoryGroup[], title: string) {
  render(document.body, ThreadBoardPage(categoryGroups, title));
}
