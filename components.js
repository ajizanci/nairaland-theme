(function() {
  const preconnect = document.createElement('link');
  const font = document.createElement("link");
  preconnect.rel = "preconnect"
  preconnect.href = "https://fonts.gstatic.com";
  font.rel = "stylesheet"
  font.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
  document.querySelector("head").append(preconnect, font);
}())

const el = (tag, attrs, ...children) => [tag, attrs, children];

const t = (text) => [text];

const Container = (attrs = {}, ...children) =>
  el("div", { class: `th-container ${attrs.class || ''}`, ...attrs },
    ...children)

const Header = () => 
  el("header", {},
    Logo(),
    el("nav", {},
      el("ul", {},
        ...["Home", "New", "Recent"].map(li =>
          el("li", {},
            t(li)
          )
        )
      )
    )
  )

const Logo = (e = "h1") => {
  const el = document.createElement(e)
  el.classList.add("logo")
  el.innerHTML = "&#8358;airaland Forum";
  return [el];
}

const ThreadBoard = (threads, categoryGroups, pagination) =>
  el("main", {},
    Threads(threads, pagination),
    CategoryNav(categoryGroups)
  )

const Threads = (threads, pagination) => 
  el("section", { class: "threads" },
    el("h2", { class: "heading" },
      t("Latest News")
    ),
    el("div", { class: "posts" },
      ...threads.map(thread =>
        el("a", { class: "link post", href: thread.link },
          t(thread.title)
        )
      )
    ),
    Pagination(pagination),
    GoToTop(),
    Disclaimer()
  )

const Pagination = (pages) => 
  el("div", { class: "pagination" },
    ...pages.map(page =>
      el("a", { class: "link page" + (page.current ? " current" : ""), href: page.link },
        t(page.page))))

const GoToTop = () => 
  el("div", { class: "gototop" },
    t("Go to the top")
  )

const Disclaimer = () =>
  el("p", { class: "disclaimer" },
    t("Every member of Nairaland is solely responsible for what he or she posts on Nairaland.")
  );

const CategoryNav = (categoryGroups) => el(
  "aside", { class: "category-nav" },
  ...categoryGroups.map((group) => ThreadCategories(group)),
);

const ThreadCategories = (categoryGroup) =>
  el("div", { class: "categories" },
    el("h2", { class: "heading" },
      el("a", { class: "link", href: categoryGroup.heading.link },
        t(categoryGroup.heading.title),
      )
      
    ),
    ...categoryGroup.categories.map((category) =>
      el("a", { class: "link category", href: category.link },
        t(category.title)
      )
    )
  );

const HowToPlaceAds = () => 
  el("a", { href: "#", class: "link how" },
   t("How to PLACE TARGETED ADS on Nairaland") 
  );

const body = document.querySelector("body"); 
render(body,
  Container({},
    Header(),
    ThreadBoard(threads, categoryGroups, pagination)
  )
);
