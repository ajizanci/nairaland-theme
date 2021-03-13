const el = (tag, attrs, ...children) => [tag, attrs, children];

const t = (text) => [text];

const Container = (attrs = {}, ...children) =>
  el("div", { class: `th-container ${attrs.class || ''}`, ...attrs },
    ...children)

const AuthHeader = () => [];

const Header = () => {
  const navlinks = {
    home: "/", 
    new: "/new",
    recent: "/recent", 
    trending: "/trending", 
    login: "/login", 
    "sign up": "/register"
  }
  return el("header", {},
          Logo(),
          el("nav", {},
            el("ul", {},
              ...Object.keys(navlinks).map(l =>
                el("li", {},
                  el("a", { href: navlinks[l], class: `btn ${l == 'login' ? 'primary': ''}` },
                    t(l)
                  )
                )
              )
            )
          )
  )
}

const Hero = () => 
  el("div", { class: "hero" },
    Logo("h2", "big"),
    el("form", { action: "/search", class: "search" },
      el("input", { name: "query", placeholder: "Topic, Thread, Phrase, News, Information..." }),
      el("button", { type: "submit" },
        t("Submit")
      )
    )
  )

const Logo = (e = "h1", classes= '') => {
  const el = document.createElement(e)
  el.classList.add("logo")
  classes.split(" ").filter(c => c).forEach(c => el.classList.add(c))
  el.innerHTML = "&#8358;airaland Forum";
  return [el];
}

const ThreadBoard = (threads, categoryGroups, pagination, heading = "Latest News") =>
  el("main", {},
    Threads(threads, pagination, heading),
    CategoryNav(categoryGroups)
  )

const Threads = (threads, pagination, heading) => 
  el("section", { class: "threads" },
    el("h2", { class: "heading" },
      t(heading)
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
      t(categoryGroup.heading.title)
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
