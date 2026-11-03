
/* =====================================
   1. MOBILE NAVIGATION
===================================== */

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("primary-navigation");
const navLinks = document.querySelectorAll(".nav-links a");

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navbar.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });
}


/* =====================================
   2. LIGHT / DARK THEME
===================================== */

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("portfolio-theme") || "light";

document.documentElement.dataset.theme =
    savedTheme === "dark" ? "dark" : "light";

function updateThemeButton() {
    if (!themeToggle) return;

    const isDark = document.documentElement.dataset.theme === "dark";

    themeToggle.textContent = isDark ? "☀" : "☾";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
    );
}

updateThemeButton();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.dataset.theme;
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = newTheme;

        localStorage.setItem("portfolio-theme", newTheme);

        updateThemeButton();
    });
}


/* =====================================
   3. PROJECT DETAILS MODAL
===================================== */

const projectDialog = document.getElementById("project-dialog");
const dialogClose = document.getElementById("dialog-close");
const detailButtons = document.querySelectorAll(".details-button");

if (projectDialog) {

    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {

            if (
                button.dataset.project === "gptrack" &&
                typeof projectDialog.showModal === "function"
            ) {
                projectDialog.showModal();
            }

        });
    });

    if (dialogClose) {
        dialogClose.addEventListener("click", () => {
            projectDialog.close();
        });
    }

    // Close modal when clicking outside its content
    projectDialog.addEventListener("click", (event) => {
        if (event.target === projectDialog) {
            projectDialog.close();
        }
    });
}


/* =====================================
   4. JOURNEY TIMELINE
   PROGRESSIVE SCROLL REVEAL
===================================== */

const timeline = document.querySelector(".timeline");
const timelineItems = document.querySelectorAll(".timeline-item");

if (timeline && timelineItems.length) {

    function updateTimelineProgress() {

        const rect = timeline.getBoundingClientRect();

        if (rect.height === 0) return;

        // Calculate how far the progress line has travelled
        const progress = Math.max(
            0,
            Math.min(
                100,
                (
                    (window.innerHeight * 0.75 - rect.top) /
                    rect.height
                ) * 100
            )
        );

        // Update the animated timeline line
        timeline.style.setProperty(
            "--timeline-progress",
            progress + "%"
        );

        // Get the current position of the progress line
        const linePosition =
            rect.top + (rect.height * progress / 100);

        // Reveal milestones only when the line reaches their dots
        timelineItems.forEach((item) => {

            const dot = item.querySelector(".timeline-dot");

            if (!dot) return;

            const dotRect = dot.getBoundingClientRect();

            const dotPosition =
                dotRect.top + dotRect.height / 2;

            if (linePosition >= dotPosition) {
                item.classList.add("visible");
            }

        });
    }

    // Update while scrolling
    window.addEventListener("scroll", updateTimelineProgress, {
        passive: true
    });

    // Recalculate when the screen is resized
    window.addEventListener("resize", updateTimelineProgress);

    // Initial calculation
    updateTimelineProgress();
}


/* =====================================
   5. CONTACT FORM VALIDATION
===================================== */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Check required fields
        if (!name || !email || !message) {
            formStatus.textContent = "Please complete all the fields.";
            return;
        }

        // Validate name
        if (name.length > 100) {
            formStatus.textContent =
                "Name must be under 100 characters.";
            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.length > 150 || !emailPattern.test(email)) {
            formStatus.textContent =
                "Please enter a valid email address.";
            return;
        }

        // Validate message
        if (message.length > 5000) {
            formStatus.textContent =
                "Message must be under 5000 characters.";
            return;
        }

        formStatus.textContent = "Sending your message...";

        try {
            const response = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong.");
            }

            formStatus.textContent =
                "Thank you! Your message has been sent successfully.";

            contactForm.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            formStatus.textContent =
                error.message || "Unable to send your message. Please try again.";
        }
    });
}


/* =====================================
   6. AUTOMATIC FOOTER YEAR
===================================== */

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
