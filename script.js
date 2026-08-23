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
     EXPERIENCE LAYER — ADVANCED INTERACTIONS
  ========================================================= */

  const root = document.documentElement;
  const hero = $(".hero");

  /* Scroll progress bar */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);


  /* =========================================================
     CINEMATIC PAGE ENTRANCE
  ========================================================= */

  window.addEventListener("load", () => {

    setTimeout(() => {

      hero?.classList.add("page-entered");

    }, 80);

  });


  /* =========================================================
     SCROLL PROGRESS + VELOCITY
  ========================================================= */

  let scrollTick = false;
  let previousScroll = window.scrollY;

  const updateScrollExperience = () => {

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const ratio =
      maxScroll > 0
        ? window.scrollY / maxScroll
        : 0;

    progress.style.transform =
      `scaleX(${Math.min(1, Math.max(0, ratio))})`;

    const velocity =
      Math.min(
        2,
        Math.abs(window.scrollY - previousScroll)
      );

    document.body.style.setProperty(
      "--scroll-velocity",
      velocity.toFixed(2)
    );

    previousScroll = window.scrollY;

    scrollTick = false;
  };


  window.addEventListener(
    "scroll",
    () => {

      if (!scrollTick) {

        requestAnimationFrame(
          updateScrollExperience
        );

        scrollTick = true;
      }

    },
    { passive: true }
  );


  updateScrollExperience();


  /* =========================================================
     MOUSE-DRIVEN ATMOSPHERE
  ========================================================= */

  if (finePointer && !reducedMotion) {

    document.addEventListener(
      "mousemove",
      (event) => {

        const x =
          (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
          (event.clientY / window.innerHeight - 0.5) * 2;

        root.style.setProperty(
          "--mouse-x",
          x.toFixed(3)
        );

        root.style.setProperty(
          "--mouse-y",
          y.toFixed(3)
        );

        if (hero) {

          hero.style.setProperty(
            "--hero-mx",
            `${x * 12}px`
          );

          hero.style.setProperty(
            "--hero-my",
            `${y * 12}px`
          );

        }

      },
      { passive: true }
    );
  }


  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */

  const magneticElements = $$(
    ".button, .header-social, .footer-logo, .contact-links a, .project-link"
  );

  if (finePointer && !reducedMotion) {

    magneticElements.forEach((element) => {

      element.classList.add("magnetic");

      element.addEventListener(
        "mousemove",
        (event) => {

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

          const strength =
            element.classList.contains("button")
              ? 0.14
              : 0.08;

          element.style.transform =
            `translate(
              ${x * strength}px,
              ${y * strength}px
            )`;
        }
      );

      element.addEventListener(
        "mouseleave",
        () => {

          element.style.transform = "";

        }
      );

    });

  }


  /* =========================================================
     3D CARDS
  ========================================================= */

  const tiltCards = $$(
    '[data-tilt], .achievement, .certificate'
  );

  if (finePointer && !reducedMotion) {

    tiltCards.forEach((card) => {

      card.addEventListener(
        "mousemove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          const px =
            (event.clientX - rect.left) /
            rect.width;

          const py =
            (event.clientY - rect.top) /
            rect.height;

          const rotateY =
            (px - 0.5) * 5;

          const rotateX =
            (py - 0.5) * -5;

          card.style.setProperty(
            "--tilt-x",
            `${rotateX}deg`
          );

          card.style.setProperty(
            "--tilt-y",
            `${rotateY}deg`
          );

          card.style.transform =
            `perspective(1100px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
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
     SPOTLIGHT EFFECT
  ========================================================= */

  const spotlightCards = $$(
    ".skill, .journey-card, .achievement, .certificate, .venture-card"
  );

  if (finePointer && !reducedMotion) {

    spotlightCards.forEach((card) => {

      card.addEventListener(
        "mousemove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          card.style.setProperty(
            "--spot-x",
            `${event.clientX - rect.left}px`
          );

          card.style.setProperty(
            "--spot-y",
            `${event.clientY - rect.top}px`
          );

        },
        { passive: true }
      );

    });

  }


  /* =========================================================
     SPOTLIGHT ACTIVE STATE
  ========================================================= */

  if (finePointer && !reducedMotion) {

    spotlightCards.forEach((card) => {

      card.addEventListener(
        "mouseenter",
        () => {

          card.classList.add(
            "spotlight-active"
          );

        }
      );

      card.addEventListener(
        "mouseleave",
        () => {

          card.classList.remove(
            "spotlight-active"
          );

        }
      );

    });

  }


  /* =========================================================
     ACTIVE SECTION NAVIGATION
  ========================================================= */

  const navTargets = [
    "about",
    "work",
    "skills",
    "journey",
    "achievements",
    "certifications",
    "contact"
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean);


  const navLinks = $$(
    'nav a[href^="#"], .mobile-navigation a[href^="#"]'
  );


  if (
    "IntersectionObserver" in window &&
    navTargets.length
  ) {

    const navObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const id =
              `#${entry.target.id}`;

            navLinks.forEach((link) => {

              link.classList.toggle(
                "current",
                link.getAttribute("href") === id
              );

            });

          });

        },
        {
          rootMargin:
            "-35% 0px -55% 0px",
          threshold: 0
        }
      );


    navTargets.forEach((section) => {

      navObserver.observe(section);

    });

  }


  /* =========================================================
     DYNAMIC MARQUEE
  ========================================================= */

  const marqueeTrack =
    $(".marquee-track");

  let marqueeOffset = 0;
  let marqueeLast = performance.now();


  if (
    marqueeTrack &&
    !reducedMotion
  ) {

    const animateMarquee = (now) => {

      const dt =
        Math.min(
          40,
          now - marqueeLast
        );

      marqueeLast = now;


      const velocity =
        Number(
          document.body.style
            .getPropertyValue(
              "--scroll-velocity"
            )
        ) || 0;


      marqueeOffset -=
        dt *
        (
          0.012 +
          velocity * 0.003
        );


      if (
        Math.abs(marqueeOffset) >
        marqueeTrack.scrollWidth / 2
      ) {

        marqueeOffset = 0;

      }


      marqueeTrack.style.transform =
        `translate3d(
          ${marqueeOffset}px,
          0,
          0
        )`;


      requestAnimationFrame(
        animateMarquee
      );

    };


    requestAnimationFrame(
      animateMarquee
    );

  }


  /* =========================================================
     PAGE READY
  ========================================================= */

  document.documentElement.classList.add(
    "js-ready"
  );

});
