"use strict";

var slides = Array.from(document.querySelectorAll(".sliderSlide"));
function moveSlide() {
  slides.map(function (e) {
    e.classList.contains("currSlide") ? (e.classList.add("prevSlide"), e.classList.remove("currSlide"), e.firstElementChild.classList.add("hideContent")) : e.classList.contains("prevSlide") ? (e.classList.add("nextSlide"), e.classList.remove("prevSlide")) : e.classList.contains("nextSlide") && (e.classList.add("currSlide"), e.classList.remove("nextSlide"), e.firstElementChild.classList.remove("hideContent"));
  });
}
setInterval(moveSlide, 5e3);
var LOGO_FULL = document.querySelector("#logo_full"),
  LOGO_SMALL = document.querySelector(".logo_small");
window.addEventListener("scroll", function () {
  window.scrollY <= 90 ? (LOGO_FULL.classList.remove("hideLogo"), LOGO_SMALL.classList.add("hideLogo")) : (LOGO_FULL.classList.add("hideLogo"), LOGO_SMALL.classList.remove("hideLogo"));
});