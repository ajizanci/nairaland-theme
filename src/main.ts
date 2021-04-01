import { IndexPage } from "./pages";
import { NewsPage } from "./pages/news";
import { renderThread, } from "./pages/thread";
import { renderBoard, } from "./pages/threadBoard";
// import "./styles.css";
import { CategoryGroup, } from "./types";
import { getCategoryGroups, render } from "./utils";

(async function () {
  if (!localStorage.getItem("categoryGroups")) {
    const body = await window
      .fetch("https://www.nairaland.com")
      .then((r) => r.text());
    const contents = body.match(/<body>([\w\W\s]*?)<\/body>/)![1];
    const div = document.createElement("div");
    div.innerHTML = contents;
    getCategoryGroups(div);
  }

  const preconnect = document.createElement("link");
  const font = document.createElement("link");
  const boldFont = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = "https://fonts.gstatic.com";
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
  boldFont.rel = "stylesheet";
  boldFont.href =
    "https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap";
  const defaultStyles = document.head.querySelector('link[type="text/css"]');
  defaultStyles?.remove();
  document.head.append(preconnect, font, boldFont);
  document.querySelector(".body")?.classList.add("hidden");

  const path = new URL(window.location.href).pathname;
  const categoryGroups: CategoryGroup[] = JSON.parse(
    localStorage.getItem("categoryGroups") || "[]"
  );
  const categoryRoutes = categoryGroups
    .map((g) => g.categories)
    .reduce((a, b) => a.concat(b), []);
  const categoryGroup = categoryRoutes.find((cr) =>
    path.startsWith(new URL(cr.link).pathname)
  );

  if (categoryGroup) {
    categoryGroup.current = "current";
    renderBoard(categoryGroups, categoryGroup.title);
  } else if (/^\/(\d+)\/.*/.test(path)) {
    renderThread(path.match(/^\/(\d+)\/.*/)![1]);
  } else {
    switch (true) {
      case path == "/":
        render(document.body, IndexPage());
        break;
      case path.startsWith("/news"):
        render(document.body, NewsPage());
        break;

      default:
        document.querySelector(".body")!.classList.remove("hidden");
        document.head.append(defaultStyles!);
        break;
    }
  }
})();
