/* =========================================================
   BIVEK RAY — PREMIUM PORTFOLIO
   MASTER JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";


  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =========================================================
     PAGE LOADER
  ========================================================= */

  const loader = $(".loader");

  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("loaded");
      }, 500);
    });
  }


  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */

  const cursorDot = $(".cursor-dot");
  const cursorCircle = $(".cursor-circle");

  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursorDot && cursorCircle && finePointer) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let circleX = mouseX;
    let circleY = mouseY;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      circleX += (mouseX - circleX) * 0.13;
      circleY += (mouseY - circleY) * 0.13;

      cursorCircle.style.left = `${circleX}px`;
      cursorCircle.style.top = `${circleY}px`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    const interactiveElements = $$(
      "a, button, .project, .skill, .portrait-frame"
    );

    interactiveElements.forEach((element) => {

      element.addEventListener("mouseenter", () => {
        cursorCircle.classList.add("active");
      });

      element.addEventListener("mouseleave", () => {
        cursorCircle.classList.remove("active");
      });

    });
  }


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuToggle = $(".menu-toggle");
  const mobileNavigation = $(".mobile-navigation");
  const mobileLinks = $$(".mobile-navigation a");

  const closeMenu = () => {

    if (!menuToggle || !mobileNavigation) return;

    menuToggle.classList.remove("open");
    mobileNavigation.classList.remove("open");

    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mobileNavigation) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        mobileNavigation.classList.contains("open");

      if (isOpen) {

        closeMenu();

      } else {

        menuToggle.classList.add("open");
        mobileNavigation.classList.add("open");

        document.body.classList.add("menu-open");

      }

    });

    mobileLinks.forEach((link) => {

      link.addEventListener("click", () => {
        closeMenu();
      });

    });
  }


  /* =========================================================
     HEADER SHOW / HIDE
  ========================================================= */

  const header = $(".header");

  if (header) {

    let lastScroll = window.scrollY;

    window.addEventListener(
      "scroll",
      () => {

        const currentScroll = window.scrollY;

        if (
          currentScroll > 120 &&
          currentScroll > lastScroll
        ) {

          header.classList.add("hidden");

        } else {

          header.classList.remove("hidden");

        }

        lastScroll = currentScroll;

      },
      { passive: true }
    );
  }


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observerInstance.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =========================================================
     STAGGERED REVEALS
  ========================================================= */

  const staggerGroups = $$(".stagger");

  staggerGroups.forEach((group) => {

    const children = [...group.children];

    children.forEach((child, index) => {

      child.style.transitionDelay =
        `${index * 80}ms`;

    });

  });


  /* =========================================================
     SMOOTH ANCHOR SCROLL
  ========================================================= */

  const anchorLinks = $$('a[href^="#"]');

  anchorLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = $(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================================================
     HERO IMAGE PARALLAX
  ========================================================= */

  const portrait = $(".portrait-frame img");

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (portrait && !reducedMotion) {

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {

          const scrollY = window.scrollY;

          if (scrollY < window.innerHeight) {

            const movement = scrollY * 0.035;

            portrait.style.transform =
              `scale(1.04) translate3d(0, ${movement}px, 0)`;

          }

          ticking = false;

        });

      },
      { passive: true }
    );
  }


  /* =========================================================
     HERO BACKGROUND PARALLAX
  ========================================================= */

  const glowOne = $(".hero-glow-one");
  const glowTwo = $(".hero-glow-two");

  if (
    !reducedMotion &&
    (glowOne || glowTwo)
  ) {

    window.addEventListener(
      "scroll",
      () => {

        const scrollY = window.scrollY;

        if (glowOne) {

          glowOne.style.transform =
            `translate3d(0, ${scrollY * 0.08}px, 0)`;

        }

        if (glowTwo) {

          glowTwo.style.transform =
            `translate3d(0, ${scrollY * -0.04}px, 0)`;

        }

      },
      { passive: true }
    );
  }


  /* =========================================================
     PROJECT VISUAL TILT
  ========================================================= */

  const projectVisuals = $$(".project-visual");

  if (!reducedMotion && finePointer) {

    projectVisuals.forEach((visual) => {

      visual.addEventListener("mousemove", (event) => {

        const rect =
          visual.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const rotateX =
          ((y / rect.height) - 0.5) * -3;

        const rotateY =
          ((x / rect.width) - 0.5) * 3;

        visual.style.transform =
          `perspective(1000px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)`;
      });

      visual.addEventListener("mouseleave", () => {

        visual.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0)";

      });

    });
  }


  /* =========================================================
     SKILL HOVER
  ========================================================= */

  const skills = $$(".skill");

  skills.forEach((skill) => {

    skill.addEventListener("mouseenter", () => {
      skill.classList.add("is-hovered");
    });

    skill.addEventListener("mouseleave", () => {
      skill.classList.remove("is-hovered");
    });

  });


  /* =========================================================
     EXTERNAL LINKS
  ========================================================= */

  const externalLinks = $$(
    'a[href^="http://"], a[href^="https://"]'
  );

  externalLinks.forEach((link) => {

    link.setAttribute(
      "target",
      "_blank"
    );

    link.setAttribute(
      "rel",
      "noopener noreferrer"
    );

  });


  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    }
  );


  /* =========================================================
     RESIZE SAFETY
  ========================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 1000) {
        closeMenu();
      }

    }
  );


  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  const yearElements = $$("[data-year]");

  yearElements.forEach((element) => {

    element.textContent =
      new Date().getFullYear();

  });


  /* =========================================================
     IMAGE FALLBACK
  ========================================================= */

  const images = $$("img");

  images.forEach((image) => {

    image.addEventListener("error", () => {

      image.style.opacity = "0";

    });

  });


  /* =========================================================
     PAGE READY
  ========================================================= */

  document.documentElement.classList.add(
    "js-ready"
  );

});
