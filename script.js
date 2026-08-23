document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;


  /* =========================================================
     PAGE LOADER
  ========================================================= */

  const loader = $(".page-loader");

  const hideLoader = () => {
    if (!loader) return;

    setTimeout(() => {
      loader.classList.add("loaded");
    }, 700);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, {
      once: true
    });
  }


  /* =========================================================
     HEADER
  ========================================================= */

  const header = $(".site-header");

  let lastScroll = window.scrollY;

  const updateHeader = () => {
    if (!header) return;

    const currentScroll = window.scrollY;

    if (currentScroll > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (
      currentScroll > 120 &&
      currentScroll > lastScroll
    ) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    lastScroll = currentScroll;
  };

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuButton = $(".mobile-menu-button");
  const mobileMenu = $(".mobile-menu");
  const mobileLinks = $$(".mobile-menu a");

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;

    menuButton.classList.remove("open");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen =
        mobileMenu.classList.toggle("open");

      menuButton.classList.toggle(
        "open",
        isOpen
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });


  /* =========================================================
     SMOOTH SCROLL
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const id =
        link.getAttribute("href");

      if (!id || id === "#") return;

      const target =
        document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      const headerHeight =
        header ? header.offsetHeight : 0;

      const position =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: position,
        behavior: reduceMotion
          ? "auto"
          : "smooth"
      });

    });

  });


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = $$(".reveal");

  if (
    revealElements.length &&
    !reduceMotion &&
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -80px 0px"
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
     HERO INTRO ANIMATION
  ========================================================= */

  document.documentElement.classList.add(
    "js-ready"
  );


  /* =========================================================
     HERO PHOTO
  ========================================================= */

  const hero = $(".hero");
  const portrait = $(".portrait");
  const heroCircle = $(".hero-circle-one");

  if (
    hero &&
    portrait &&
    finePointer &&
    !reduceMotion
  ) {

    hero.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;

        portrait.style.transform =
          `scale(1.05)
           translate3d(
             ${x * 8}px,
             ${y * 8}px,
             0
           )`;

        if (heroCircle) {
          heroCircle.style.transform =
            `translate3d(
              ${x * -20}px,
              ${y * -20}px,
              0
            ) rotate(-10deg)`;
        }

      }
    );

    hero.addEventListener(
      "mouseleave",
      () => {

        portrait.style.transform =
          "scale(1.05) translate3d(0,0,0)";

        if (heroCircle) {
          heroCircle.style.transform =
            "translate3d(0,0,0) rotate(-10deg)";
        }

      }
    );

  }


  /* =========================================================
     PARALLAX
  ========================================================= */

  const parallaxElements =
    $$(".hero-leaf, .hero-circle-two");

  if (
    parallaxElements.length &&
    !reduceMotion
  ) {

    let ticking = false;

    const updateParallax = () => {

      const scrollY =
        window.scrollY;

      parallaxElements.forEach(
        (element, index) => {

          const speed =
            index % 2 === 0
              ? 0.035
              : -0.025;

          element.style.transform =
            `translate3d(
              0,
              ${scrollY * speed}px,
              0
            )`;

        }
      );

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {

        if (ticking) return;

        requestAnimationFrame(
          updateParallax
        );

        ticking = true;

      },
      { passive: true }
    );

  }


  /* =========================================================
     CARD TILT
  ========================================================= */

  if (
    finePointer &&
    !reduceMotion
  ) {

    const cards = $$(
      ".venture-card, .journey-card, .achievement, .certification"
    );

    cards.forEach((card) => {

      card.addEventListener(
        "mousemove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
            rect.height -
            0.5;

          card.style.transform =
            `perspective(1000px)
             rotateX(${y * -2}deg)
             rotateY(${x * 2}deg)
             translateY(-6px)`;

        }
      );

      card.addEventListener(
        "mouseleave",
        () => {
          card.style.transform = "";
        }
      );

    });

  }


  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */

  if (
    finePointer &&
    !reduceMotion
  ) {

    const buttons = $$(
      ".primary-button, .header-cta, .text-button"
    );

    buttons.forEach((button) => {

      button.addEventListener(
        "mousemove",
        (event) => {

          const rect =
            button.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          button.style.transform =
            `translate(
              ${x * 0.10}px,
              ${y * 0.10}px
            )`;

        }
      );

      button.addEventListener(
        "mouseleave",
        () => {
          button.style.transform = "";
        }
      );

    });

  }


  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */

  const cursor = $(".cursor");

  if (
    cursor &&
    finePointer &&
    !reduceMotion
  ) {

    let mouseX =
      window.innerWidth / 2;

    let mouseY =
      window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener(
      "mousemove",
      (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

      }
    );

    const renderCursor = () => {

      cursorX +=
        (mouseX - cursorX) * 0.18;

      cursorY +=
        (mouseY - cursorY) * 0.18;

      cursor.style.left =
        `${cursorX}px`;

      cursor.style.top =
        `${cursorY}px`;

      requestAnimationFrame(
        renderCursor
      );

    };

    renderCursor();

    const interactive =
      $$(
        "a, button, .venture-card, .skill-item, .journey-card, .achievement, .certification, .portrait-frame"
      );

    interactive.forEach((element) => {

      element.addEventListener(
        "mouseenter",
        () => {
          cursor.classList.add(
            "active"
          );
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          cursor.classList.remove(
            "active"
          );
        }
      );

    });

  }


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const sections =
    $$("section[id]");

  const navLinks =
    $$('.desktop-nav a[href^="#"]');

  if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
  ) {

    const navObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            const id =
              entry.target.id;

            navLinks.forEach((link) => {

              link.classList.toggle(
                "active",
                link.getAttribute("href") ===
                  `#${id}`
              );

            });

          });

        },
        {
          rootMargin:
            "-35% 0px -55% 0px"
        }
      );

    sections.forEach((section) => {
      navObserver.observe(section);
    });

  }


  /* =========================================================
     EXTERNAL LINKS
  ========================================================= */

  $$(
    'a[href^="http://"], a[href^="https://"]'
  ).forEach((link) => {

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
     CURRENT YEAR
  ========================================================= */

  $$("[data-year]").forEach(
    (element) => {
      element.textContent =
        new Date().getFullYear();
    }
  );


  /* =========================================================
     RESIZE
  ========================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 760) {
        closeMenu();
      }

    }
  );

});
