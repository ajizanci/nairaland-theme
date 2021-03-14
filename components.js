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

const QuoteIcon = () => {
  const el = document.createElement("span")
  el.innerHTML = `<svg class="reaction" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>`
  return [el]
}

const HeartIcon = () => {
  const el = document.createElement("span")
  el.innerHTML = `<svg class="reaction" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>`
  return [el]
}

const ShareIcon = () => {
  const el = document.createElement("span")
  el.innerHTML = `<svg class="reaction" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>`
  return [el]
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
      el("a", { class: `link page ${page.current}`, href: page.link },
        t(page.page))))

const GoToTop = () => 
  el("div", { class: "gototop" },
    t("Go to the top")
  )

const Disclaimer = () =>
  el("p", { class: "disclaimer" },
    t("Every member of Nairaland is solely responsible for what he or she posts on Nairaland.")
  );

const CategoryNav = (categoryGroups) =>  
  el("aside", { class: "category-nav" },
  ...categoryGroups.map((group) => ThreadCategories(group)),
  );

const ThreadCategories = (categoryGroup) =>
  el("div", { class: "categories" },
    el("h2", { class: "heading" },
      t(categoryGroup.heading.title)
    ),
    ...categoryGroup.categories.map((category) =>
      el("a", { class: `link category ${category.current}`, href: category.link },
        t(category.title)
      )
    )
  );

const HowToPlaceAds = () => 
  el("a", { href: "#", class: "link how" },
   t("How to PLACE TARGETED ADS on Nairaland") 
  );
