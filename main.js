let defaultStyles;

(function () {
  const head = document.querySelector("head");
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
  defaultStyles = head.querySelector('link[type="text/css"]');
  defaultStyles.remove();
  head.append(preconnect, font, boldFont);
  document.querySelector(".body").classList.add("hidden");
})();
