import { Container, Header, Hero, ThreadBoard } from "../components";
import {
  safeQuery,
  toArray,
  removeBrackets,
  getCategoryGroups,
} from "../utils";

export function IndexPage() {
  const threads = safeQuery(() =>
    toArray(
      document.querySelectorAll("table.boards tbody tr td.featured.w a")
    ).map((a) => ({ title: a.innerText, link: (a as HTMLAnchorElement).href }))
  );

  const pagination = safeQuery(() => {
    const pagesTd = document.querySelector(
      "table.boards:nth-child(6) tbody tr:last-child td"
    )!;
    return [
      {
        page: +removeBrackets(pagesTd.querySelector("b")?.innerText!),
        link: window.location.href,
        current: "current",
      },
    ].concat(
      toArray(pagesTd.querySelectorAll("a"))
        .filter((a) => +removeBrackets(a.innerText))
        .map((a) => ({
          page: +removeBrackets(a.innerText),
          link: (a as HTMLAnchorElement).href,
          current: "",
        }))
    );
  });

  return Container(
    {},
    Header(),
    Hero(),
    ThreadBoard(threads, getCategoryGroups(), pagination)
  );
}
