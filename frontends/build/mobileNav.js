const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

function mobileNavToggle() {
document.querySelector("body").classList.toggle("mobile-nav-active");
mobileNavToggleBtn.classList.toggle("bi-list");
mobileNavToggleBtn.classList.toggle("bi-x");
}

if (mobileNavToggleBtn) {
mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
}

/**
 * Hide mobile nav on same-page/hash links
 */
document.querySelectorAll("#navmenu a").forEach((navmenu) => {
navmenu.addEventListener("click", () => {
    if (document.querySelector(".mobile-nav-active")) {
    mobileNavToggle();
    }
});
});
