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
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    cursorDot &&
    cursorCircle &&
    finePointer &&
    !reducedMotion
  ) {
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

    const cursorTargets = $$(
      "a, button, .project, .hero-image-frame, .circle-link"
    );

    cursorTargets.forEach((element) => {
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
  const mobileMenu = $(".mobile-menu");
  const mobileLinks = $$(".mobile-link");

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");

    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.add("active");
    mobileMenu.classList.add("active");

    document.body.classList.add("menu-open");
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });
  }


  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });


  /* =========================================================
     HEADER HIDE / SHOW
  ========================================================= */

  const nav = $(".nav");

  if (nav) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 80) {
        nav.classList.remove("hidden");
      } else if (currentScrollY > lastScrollY) {
        nav.classList.add("hidden");
      } else {
        nav.classList.remove("hidden");
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  }


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -70px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* =========================================================
     SMOOTH ANCHOR LINKS
  ========================================================= */

  const anchorLinks = $$('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetID = link.getAttribute("href");

      if (!targetID || targetID === "#") return;

      const target = $(targetID);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      closeMenu();
    });
  });


  /* =========================================================
     HERO IMAGE PARALLAX
  ========================================================= */

  const heroImage = $(".hero-image");

  if (heroImage && !reducedMotion) {
    let heroTicking = false;

    const updateHeroImage = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      if (scrollY <= heroHeight) {
        const movement = scrollY * 0.045;

        heroImage.style.transform =
          `scale(1.06) translate3d(0, ${movement}px, 0)`;
      }

      heroTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!heroTicking) {
          requestAnimationFrame(updateHeroImage);
          heroTicking = true;
        }
      },
      { passive: true }
    );
  }


  /* =========================================================
     HERO MOUSE MOVEMENT
  ========================================================= */

  const hero = $(".hero");

  if (
    hero &&
    finePointer &&
    !reducedMotion
  ) {
    const orbitElements = [
      {
        selector: ".hero::before",
        x: 0,
        y: 0
      }
    ];

    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      const imageFrame = $(".hero-image-frame");

      if (imageFrame) {
        imageFrame.style.transform =
          `translate3d(${x * 8}px, ${y * 8}px, 0)`;
      }
    });

    hero.addEventListener("mouseleave", () => {
      const imageFrame = $(".hero-image-frame");

      if (imageFrame) {
        imageFrame.style.transform =
          "translate3d(0, 0, 0)";
      }
    });
  }


  /* =========================================================
     PROJECT HOVER
  ========================================================= */

  const projects = $$(".project");

  projects.forEach((project) => {
    project.addEventListener("mouseenter", () => {
      project.classList.add("hovered");
    });

    project.addEventListener("mouseleave", () => {
      project.classList.remove("hovered");
    });
  });


  /* =========================================================
     CONTACT LINKS
  ========================================================= */

  const contactLinks = $$(".contact-link");

  contactLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.classList.add("active");
    });

    link.addEventListener("mouseleave", () => {
      link.classList.remove("active");
    });
  });


  /* =========================================================
     EXTERNAL LINKS
  ========================================================= */

  const externalLinks = $$(
    'a[href^="http://"], a[href^="https://"]'
  );

  externalLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });


  /* =========================================================
     RESIZE SAFETY
  ========================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });


  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });


  /* =========================================================
     IMAGE LOAD
  ========================================================= */

  $$("img").forEach((image) => {
    if (image.complete) {
      image.classList.add("loaded");
    } else {
      image.addEventListener("load", () => {
        image.classList.add("loaded");
      });
    }
  });


  /* =========================================================
     PAGE READY
  ========================================================= */

  document.documentElement.classList.add("js-ready");

});
