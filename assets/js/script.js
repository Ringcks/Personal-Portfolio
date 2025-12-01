'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

        modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
        modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
        modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

        testimonialsModalFunc();

    });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

    for (let i = 0; i < filterItems.length; i++) {

        if (selectedValue === "all") {
            filterItems[i].classList.add("active");
        } else if (selectedValue === filterItems[i].dataset.category) {
            filterItems[i].classList.add("active");
        } else {
            filterItems[i].classList.remove("active");
        }

    }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;

    });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

        // check form validation
        if (form.checkValidity()) {
            formBtn.removeAttribute("disabled");
        } else {
            formBtn.setAttribute("disabled", "");
        }

    });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {

        for (let i = 0; i < pages.length; i++) {
            if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
                pages[i].classList.add("active");
                navigationLinks[i].classList.add("active");
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove("active");
                navigationLinks[i].classList.remove("active");
            }
        }

    });
}




/* -------------------------------------------------------------------------- */
/*                      PROJECT PREVIEW POPUP (INSIDE PANEL)                  */
/* -------------------------------------------------------------------------- */

const projectPreview = document.getElementById("project-preview");
const previewTitle = document.getElementById("preview-title");
const previewDesc = document.getElementById("preview-desc");
const mediaWrapper = document.getElementById("media-wrapper");
const previewClose = document.querySelector(".project-preview-close");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

let currentIndex = 0;
let mediaItems = [];

// ====== OPEN PROJECT PREVIEW ======
document.querySelectorAll(".project-item a").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();

        const parent = item.closest(".project-item");
        const title = parent.querySelector(".project-title").textContent.trim();
        const desc = item.dataset.desc || "This is a preview of the project.";

        // Parse media list (array of images/videos)
        let mediaList;
        try {
            mediaList = JSON.parse(item.dataset.media || "[]");
        } catch (err) {
            console.error("Invalid data-media JSON", err);
            mediaList = [];
        }

        // Update content
        previewTitle.textContent = title;
        previewDesc.textContent = desc;
        mediaWrapper.innerHTML = "";

        // Build slides
        // Build slides (image, video, audio)
        mediaList.forEach((src) => {

            let el;

            // AUDIO SUPPORT
            if (src.match(/\.(mp3|wav|ogg)$/i)) {
                el = Object.assign(document.createElement("audio"), {
                    src,
                    controls: true,
                    preload: "auto"
                });

                // autoplay audio when preview opens
                el.addEventListener("canplay", () => el.play());
            }

            // VIDEO SUPPORT
            else if (src.match(/\.(mp4|webm|mov|m4v)$/i)) {
                el = Object.assign(document.createElement("video"), {
                    src,
                    controls: true,
                    preload: "metadata"
                });
            }

            // IMAGE SUPPORT
            else {
                el = Object.assign(document.createElement("img"), {
                    src,
                    loading: "lazy"
                });
            }

            el.classList.add("media-item");
            mediaWrapper.appendChild(el);
        });

        mediaItems = [...mediaWrapper.children];
        currentIndex = 0;

        // Hide nav if only 1 item
        const showNav = mediaItems.length > 1;
        nextBtn.style.display = prevBtn.style.display = showNav ? "block" : "none";

        updateSlider(true);

        projectPreview.classList.add("active");
        projectPreview.scrollIntoView({ behavior: "smooth" });
    });
});

// ====== SLIDER CONTROLS ======
nextBtn.addEventListener("click", nextMedia);
prevBtn.addEventListener("click", prevMedia);

function nextMedia() {
    if (!mediaItems.length) return;
    currentIndex = (currentIndex + 1) % mediaItems.length;
    updateSlider();
}

function prevMedia() {
    if (!mediaItems.length) return;
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    updateSlider();
}

function updateSlider(initial = false) {
    mediaItems.forEach((item, i) => {
        item.style.transition = initial ? "none" : "opacity 0.4s ease";
        item.style.opacity = i === currentIndex ? "1" : "0";
        item.style.position = i === currentIndex ? "relative" : "absolute";
        item.style.left = "0";
        item.style.right = "0";
    });

    // Pause all videos except current
    mediaItems.forEach((m, i) => {

        if (m.tagName === "VIDEO" || m.tagName === "AUDIO") {
            if (i === currentIndex) m.play();
            else m.pause();
        }

    });
}

// ====== CLOSE PREVIEW ======
previewClose.addEventListener("click", () => {
    projectPreview.classList.remove("active");
    // Pause any playing video
    mediaItems.forEach((m) => {
        if (m.tagName === "VIDEO" || m.tagName === "AUDIO") {
            m.pause();
        }
    });
});

// ====== SWIPE (MOBILE) ======
let touchStartX = 0;
mediaWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

mediaWrapper.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
        diff > 0 ? prevMedia() : nextMedia();
    }
});

// ====== KEYBOARD NAVIGATION ======
window.addEventListener("keydown", (e) => {
    if (!projectPreview.classList.contains("active")) return;

    switch (e.key) {
        case "ArrowRight":
            nextMedia();
            break;
        case "ArrowLeft":
            prevMedia();
            break;
        case "Escape":
            projectPreview.classList.remove("active");
            break;
    }
});
