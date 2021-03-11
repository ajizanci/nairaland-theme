(function() {
  const head = document.querySelector("head");
  const preconnect = document.createElement('link');
  const font = document.createElement("link");
  preconnect.rel = "preconnect"
  preconnect.href = "https://fonts.gstatic.com";
  font.rel = "stylesheet"
  font.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
  head.querySelector('link[type="text/css"]').remove();
  head.append(preconnect, font);
  document.querySelector(".body").classList.add("hidden")
}());
