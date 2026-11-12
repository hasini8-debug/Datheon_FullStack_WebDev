
/* =====================================
   1. MOBILE NAVIGATION
===================================== */
document.documentElement.classList.add("js-enabled");
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

        const triggerPosition = window.innerHeight * 0.75;

        const progress = Math.max(
            0,
            Math.min(
                100,
                ((triggerPosition - rect.top) / rect.height) * 100
            )
        );

        // Update progress line
        timeline.style.setProperty(
            "--timeline-progress",
            progress + "%"
        );

        // Show and hide timeline items repeatedly
        timelineItems.forEach((item) => {

            const dot = item.querySelector(".timeline-dot");

            if (!dot) return;

            const dotRect = dot.getBoundingClientRect();

            const dotPosition =
                dotRect.top + dotRect.height / 2;

            if (triggerPosition >= dotPosition) {
                item.classList.add("visible");
            } else {
                item.classList.remove("visible");
            }

        });
    }

    window.addEventListener("scroll", updateTimelineProgress, {
        passive: true
    });

    window.addEventListener("resize", updateTimelineProgress);

    window.addEventListener("load", updateTimelineProgress);

    updateTimelineProgress();
}



/* =====================================
   5. CONTACT FORM
   WEB3FORMS INTEGRATION
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

       if (!name || !email || !message) {
    if (formStatus) {
        formStatus.textContent = "Please complete all the fields.";
    }
    return;
}
        if (name.length > 100) {
            formStatus.textContent = "Name must be under 100 characters.";
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.length > 150 || !emailPattern.test(email)) {
            formStatus.textContent = "Please enter a valid email address.";
            return;
        }

        if (message.length > 5000) {
            formStatus.textContent = "Message must be under 5000 characters.";
            return;
        }

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        formStatus.textContent = "";

        try {

            const formData = new FormData(contactForm);

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {

                formStatus.textContent =
                    "Thank you! Your message has been sent successfully.";

                contactForm.reset();

            } else {

                formStatus.textContent =
                    result.message || "Unable to send your message. Please try again.";

            }

        } catch (error) {

            formStatus.textContent =
                "Something went wrong. Please try again later.";

            console.error("Contact form error:", error);

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit ↗";
            }

        }

    });
}

/* =========================================
   BUTTERFLY SCROLL ANIMATION
   Six-stage journey
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* 1. GET ELEMENTS */

    const profilePhoto = document.querySelector(".profile-photo");
    const creativityTarget = document.querySelector("#butterfly-target");

    const cIcon = document.querySelector(
        '.skill-icon img[alt="C logo"]'
    );

    const craveImage = document.querySelector(
        ".project-visual-two img"
    );

    const craveCard = craveImage
        ? craveImage.closest(".project-card")
        : null;

    const journeyHeading = document.getElementById("journey-heading");

    const resumeButton = document.querySelector(".resume-link");
    const submitButton = document.querySelector(".submit-button");

    const butterfly = document.getElementById("magic-butterfly");

    if (
        !profilePhoto ||
        !creativityTarget ||
        !cIcon ||
        !craveCard ||
        !journeyHeading ||
        !resumeButton ||
        !submitButton ||
        !butterfly ||
        !butterfly.querySelector("svg")
    ) {
        console.warn("Butterfly animation: A required element is missing.");
        return;
    }

    // Keep the original SVG, but move it to body so document
    // coordinates work consistently.
    document.body.appendChild(butterfly);

    /* 2. HELPER FUNCTIONS */

    function getDocumentPosition(element) {
        const rect = element.getBoundingClientRect();

        return {
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            centerX: rect.left + rect.width / 2 + window.scrollX,
            centerY: rect.top + rect.height / 2 + window.scrollY
        };
    }

    function getPosition(element, side, offset = 20) {
        const rect = getDocumentPosition(element);

        switch (side) {
            case "right":
                return {
                    x: rect.right + offset,
                    y: rect.centerY
                };

            case "left":
                return {
                    x: rect.left - offset,
                    y: rect.centerY
                };

            case "above":
                return {
                    x: rect.centerX,
                    y: rect.top - offset
                };

            case "below":
                return {
                    x: rect.centerX,
                    y: rect.bottom + offset
                };

            default:
                return {
                    x: rect.centerX,
                    y: rect.centerY
                };
        }
    }

    function getAmpersandPosition() {
        const walker = document.createTreeWalker(
            journeyHeading,
            NodeFilter.SHOW_TEXT
        );

        let textNode;

        while ((textNode = walker.nextNode())) {
            const index = textNode.textContent.indexOf("&");

            if (index !== -1) {
                const range = document.createRange();

                range.setStart(textNode, index);
                range.setEnd(textNode, index + 1);

                const rect = range.getBoundingClientRect();

                return {
                    x: rect.right + window.scrollX + 18,
                    y: rect.top + rect.height / 2 + window.scrollY
                };
            }
        }

        return null;
    }

    function setButterflyPosition(x, y) {
        butterfly.style.left = `${x}px`;
        butterfly.style.top = `${y}px`;
        butterfly.style.opacity = "1";
        butterfly.style.visibility = "visible";
    }

    function cubicBezier(start, control1, control2, end, progress) {
        const t = progress;
        const inverse = 1 - t;

        return {
            x:
                inverse ** 3 * start.x +
                3 * inverse ** 2 * t * control1.x +
                3 * inverse * t ** 2 * control2.x +
                t ** 3 * end.x,

            y:
                inverse ** 3 * start.y +
                3 * inverse ** 2 * t * control1.y +
                3 * inverse * t ** 2 * control2.y +
                t ** 3 * end.y
        };
    }

    function getProgress(start, end, scroll) {
        if (end <= start) return 1;

        return Math.max(
            0,
            Math.min(1, (scroll - start) / (end - start))
        );
    }

    /* 3. CALCULATE LANDING POINTS */

    /* 3. CALCULATE LANDING POINTS */

    let stages = [];

    function calculatePositions() {

        const photo = getDocumentPosition(profilePhoto);
        const creativity = getDocumentPosition(creativityTarget);

        const start = {
            x: photo.right + 20,
            y: photo.centerY
        };

        const creativityLanding = {
            x: creativity.right + 15,
            y: creativity.bottom + 12
        };

        const cLanding = getPosition(cIcon, "right", 22);
        const craveLanding = getPosition(craveCard, "above", 22);
        const journeyLanding = getAmpersandPosition();

        if (!journeyLanding) {
            console.warn("Could not locate the Journey heading & symbol.");
            stages = [];
            return;
        }

        const resumeLanding = getPosition(resumeButton, "below", 22);
        const submitLanding = getPosition(submitButton, "left", 22);

        const destinations = [
            { point: creativityLanding, target: creativityTarget },
            { point: cLanding, target: cIcon },
            { point: craveLanding, target: craveCard },
            { point: journeyLanding, target: journeyHeading },
            { point: resumeLanding, target: resumeButton },
            { point: submitLanding, target: submitButton }
        ];

        let previousScroll = 0;

        stages = destinations.map((item, index) => {

            const targetScroll = item.point.y - window.innerHeight * 0.55;

            // Prevent collapse: Ensure arrivalScroll is always slightly ahead of previousScroll
            const arrivalScroll = Math.max(
                previousScroll + 20, 
                targetScroll
            );

            const stage = {
                startScroll: previousScroll,
                endScroll: arrivalScroll,
                destination: item.point,
                index
            };

            previousScroll = arrivalScroll;

            return stage;
        });

        // Preserve original starting position.
        stages[0].start = start;

        // Preserve original Stage 1 path.
        stages[0].down = {
            x: start.x + 15,
            y: start.y + 290
        };

        stages[0].left = {
            x: start.x - 190,
            y: start.y + 290
        };

        stages[0].end = creativityLanding;
    }

    /* 4. STAGE 1: DOWN → LEFT → UP */

    function animateStageOne(progress) {

        const stage = stages[0];
        let position;

        if (progress <= 0.35) {

            const localProgress = progress / 0.35;

            position = cubicBezier(
                stage.start,
                {
                    x: stage.start.x + 10,
                    y: stage.start.y + 100
                },
                {
                    x: stage.down.x,
                    y: stage.down.y - 50
                },
                stage.down,
                localProgress
            );

        } else if (progress <= 0.68) {

            const localProgress = (progress - 0.35) / 0.33;

            position = cubicBezier(
                stage.down,
                {
                    x: stage.down.x - 60,
                    y: stage.down.y
                },
                {
                    x: stage.left.x + 60,
                    y: stage.left.y
                },
                stage.left,
                localProgress
            );

        } else {

            const localProgress = (progress - 0.68) / 0.32;

            position = cubicBezier(
                stage.left,
                {
                    x: stage.left.x,
                    y: stage.left.y - 90
                },
                {
                    x: stage.end.x - 40,
                    y: stage.end.y + 60
                },
                stage.end,
                localProgress
            );
        }

        setButterflyPosition(position.x, position.y);
    }

   /* =========================================
   5. STAGES 2–6: DOWNWARD CURVED FLIGHT
========================================= */

function animateFlight(start, end, progress, scroll) {

    const dx = end.x - start.x;

    // Keep the butterfly visible while the page scrolls.
    const baseY = scroll + window.innerHeight * 0.55;

    // Horizontal curved movement.
    const position = cubicBezier(
        { x: start.x, y: baseY },
        { x: start.x + dx * 0.25, y: baseY + 35 },
        { x: start.x + dx * 0.75, y: baseY + 35 },
        { x: end.x, y: baseY },
        progress
    );

    setButterflyPosition(position.x, position.y);
}
    /* 6. UPDATE ON SCROLL */

    function updateButterfly() {

        if (!stages.length) return;

        const scroll = window.scrollY;

        let activeStage = stages.findIndex(stage =>
            scroll >= stage.startScroll &&
            scroll < stage.endScroll
        );

        // Before the first flight
        if (scroll < stages[0].startScroll) {
            butterfly.classList.add("perched");

            setButterflyPosition(
                stages[0].start.x,
                stages[0].start.y
            );

            return;
        }

        // After the final flight
        if (activeStage === -1) {

            const lastStage = stages[stages.length - 1];

            butterfly.classList.add("perched");

            setButterflyPosition(
                lastStage.destination.x,
                lastStage.destination.y
            );

            return;
        }

        butterfly.classList.remove("perched");

        const stage = stages[activeStage];

        const progress = getProgress(
            stage.startScroll,
            stage.endScroll,
            scroll
        );

        if (activeStage === 0) {
            animateStageOne(progress);
            return;
        }

        const previousPosition =
    stages[activeStage - 1].destination;

animateFlight(
    previousPosition,
    stage.destination,
    progress,
    scroll
);

        if (progress >= 1) {
            butterfly.classList.add("perched");
        }
    }

    /* 7. INITIALIZE */

    function initializeButterfly() {
        calculatePositions();
        updateButterfly();
    }

    let ticking = false;

    window.addEventListener("scroll", () => {

        if (!ticking) {
            requestAnimationFrame(() => {
                updateButterfly();
                ticking = false;
            });

            ticking = true;
        }

    }, { passive: true });

    window.addEventListener("resize", initializeButterfly);

    // Wait for images before calculating target positions
    const images = Array.from(document.images);
    const pendingImages = images.filter(image => !image.complete).length;

    if (pendingImages > 0) {

        let loadedImages = 0;

        function checkImagesLoaded() {
            loadedImages++;

            if (loadedImages >= pendingImages) {
                initializeButterfly();
            }
        }

        images.forEach(image => {
            if (!image.complete) {
                image.addEventListener("load", checkImagesLoaded, { once: true });
                image.addEventListener("error", checkImagesLoaded, { once: true });
            }
        });

    } else {
        initializeButterfly();
    }

});

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}