document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const prefersReducedMotion = window.matchMedia(
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
    }, 650);
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
  let ticking = false;

  const updateHeader = () => {
    if (!header) return;

    const currentScroll = window.scrollY;

    if (currentScroll > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (currentScroll > 120 && currentScroll > lastScroll) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
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

  const toggleMenu = () => {
    if (!menuButton || !mobileMenu) return;

    const open = mobileMenu.classList.toggle("open");

    menuButton.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", toggleMenu);

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
     SMOOTH ANCHOR SCROLL
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") return;

      const target = document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion
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
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
    const revealObserver =
      new IntersectionObserver(
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
     CUSTOM CURSOR
  ========================================================= */

  const cursor = $(".cursor");

  if (cursor && finePointer && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    const renderCursor = () => {
      cursorX +=
        (mouseX - cursorX) * 0.18;

      cursorY +=
        (mouseY - cursorY) * 0.18;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(renderCursor);
    };

    renderCursor();

    const interactive = $$(
      "a, button, .venture-card, .skill-item, .journey-card, .achievement, .certification, .portrait-frame"
    );

    interactive.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
      });
    });
  }


  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */

  if (finePointer && !prefersReducedMotion) {
    const magneticElements = $$(
      ".primary-button, .header-cta, .light-button, .text-button"
    );

    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        element.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });
    });
  }


  /* =========================================================
     HERO PARALLAX
  ========================================================= */

  const hero = $(".hero");
  const portrait = $(".portrait");
  const heroCircle = $(".hero-circle-one");

  if (
    hero &&
    !prefersReducedMotion &&
    finePointer
  ) {
    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
        rect.height -
        0.5;

      if (portrait) {
        portrait.style.transform =
          `scale(1.05)
           translate3d(${x * 8}px, ${y * 8}px, 0)`;
      }

      if (heroCircle) {
        heroCircle.style.transform =
          `translate3d(${x * -20}px, ${y * -20}px, 0)
           rotate(-10deg)`;
      }
    });

    hero.addEventListener("mouseleave", () => {
      if (portrait) {
        portrait.style.transform =
          "scale(1.05) translate3d(0,0,0)";
      }

      if (heroCircle) {
        heroCircle.style.transform =
          "translate3d(0,0,0) rotate(-10deg)";
      }
    });
  }


  /* =========================================================
     SCROLL PARALLAX
  ========================================================= */

  const orbitElements = $$(".hero-leaf, .hero-circle-two");

  if (
    orbitElements.length &&
    !prefersReducedMotion
  ) {
    let parallaxTicking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      orbitElements.forEach((element, index) => {
        const speed =
          index % 2 === 0
            ? 0.035
            : -0.025;

        element.style.translate =
          `0 ${scrollY * speed}px`;
      });

      parallaxTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!parallaxTicking) {
          requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      },
      { passive: true }
    );
  }


  /* =========================================================
     IMAGE TILT
  ========================================================= */

  if (finePointer && !prefersReducedMotion) {
    const cards = $$(
      ".venture-card, .journey-card, .achievement"
    );

    cards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
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
          `perspective(900px)
           rotateX(${y * -2.5}deg)
           rotateY(${x * 2.5}deg)
           translateY(-7px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }


  /* =========================================================
     NUMBER COUNTER
  ========================================================= */

  const counters = $$("[data-count]");

  if (
    counters.length &&
    "IntersectionObserver" in window
  ) {
    const counterObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target;

            const target =
              Number(element.dataset.count);

            if (!Number.isFinite(target)) {
              observer.unobserve(element);
              return;
            }

            const duration =
              prefersReducedMotion
                ? 0
                : 1300;

            const startTime =
              performance.now();

            const animate = (currentTime) => {
              const progress =
                duration === 0
                  ? 1
                  : Math.min(
                      (currentTime -
                        startTime) /
                        duration,
                      1
                    );

              const eased =
                1 -
                Math.pow(
                  1 - progress,
                  3
                );

              element.textContent =
                Math.round(
                  target * eased
                );

              if (progress < 1) {
                requestAnimationFrame(
                  animate
                );
              }
            };

            requestAnimationFrame(animate);

            observer.unobserve(element);
          });
        },
        {
          threshold: 0.7
        }
      );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const sections = $$(
    "section[id]"
  );

  const navLinks = $$(
    '.desktop-nav a[href^="#"]'
  );

  if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
  ) {
    const sectionObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const id =
              entry.target.getAttribute("id");

            navLinks.forEach((link) => {
              const matches =
                link.getAttribute("href") ===
                `#${id}`;

              link.classList.toggle(
                "active",
                matches
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
      sectionObserver.observe(section);
    });
  }


  /* =========================================================
     HOVER IMAGE / CARD GLOW
  ========================================================= */

  if (finePointer) {
    $$(".venture-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect =
          card.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        card.style.setProperty(
          "--mouse-x",
          `${x}px`
        );

        card.style.setProperty(
          "--mouse-y",
          `${y}px`
        );
      });
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

  $$("[data-year]").forEach((element) => {
    element.textContent =
      new Date().getFullYear();
  });


  /* =========================================================
     RESIZE
  ========================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });


  /* =========================================================
     PAGE READY
  ========================================================= */

  document.documentElement.classList.add(
    "js-ready"
  );

});
