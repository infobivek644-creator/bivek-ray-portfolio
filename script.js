/* =========================================================
   BIVEK RAY — PREMIUM PORTFOLIO
   FINAL JAVASCRIPT
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
      link.addEventListener("click", closeMenu);
    });
  }


  /* =========================================================
     HEADER SHOW / HIDE
  ========================================================= */

  const header = $(".header");

  if (header) {
    let lastScroll = window.scrollY;
    let headerTicking = false;

    const updateHeader = () => {
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
      headerTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (headerTicking) return;

        headerTicking = true;

        requestAnimationFrame(updateHeader);
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
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          observerInstance.unobserve(entry.target);
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
    [...group.children].forEach((child, index) => {
      child.style.transitionDelay =
        `${Math.min(index * 80, 500)}ms`;
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
     REDUCED MOTION
  ========================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =========================================================
     HERO IMAGE PARALLAX
  ========================================================= */

  const portrait =
    $(".portrait-frame img");

  if (portrait && !reducedMotion) {
    let ticking = false;

    const updatePortrait = () => {
      const scrollY = window.scrollY;

      if (scrollY < window.innerHeight) {
        const movement =
          scrollY * 0.035;

        portrait.style.transform =
          `scale(1.04) translate3d(0, ${movement}px, 0)`;
      }

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;

        ticking = true;

        requestAnimationFrame(
          updatePortrait
        );
      },
      { passive: true }
    );
  }


  /* =========================================================
     HERO BACKGROUND PARALLAX
  ========================================================= */

  const glowOne =
    $(".hero-glow-one");

  const glowTwo =
    $(".hero-glow-two");

  if (
    !reducedMotion &&
    (glowOne || glowTwo)
  ) {
    let ticking = false;

    const updateHeroBackground = () => {
      const scrollY = window.scrollY;

      if (glowOne) {
        glowOne.style.transform =
          `translate3d(0, ${scrollY * 0.08}px, 0)`;
      }

      if (glowTwo) {
        glowTwo.style.transform =
          `translate3d(0, ${scrollY * -0.04}px, 0)`;
      }

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;

        ticking = true;

        requestAnimationFrame(
          updateHeroBackground
        );
      },
      { passive: true }
    );
  }


  /* =========================================================
     SKILL HOVER
  ========================================================= */

  const skills = $$(".skill");

  if (window.matchMedia("(hover: hover)").matches) {
    skills.forEach((skill) => {
      skill.addEventListener("mouseenter", () => {
        skill.classList.add("is-hovered");
      });

      skill.addEventListener("mouseleave", () => {
        skill.classList.remove("is-hovered");
      });
    });
  }


  /* =========================================================
     EXTERNAL LINKS
  ========================================================= */

  const externalLinks = $$(
    'a[href^="http://"], a[href^="https://"]'
  );

  externalLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
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
    },
    { passive: true }
  );


  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  const yearElements =
    $$("[data-year]");

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
     EXPERIENCE LAYER
  ========================================================= */

  const hero = $(".hero");

  /* ---------------------------------------------------------
     SCROLL PROGRESS
  --------------------------------------------------------- */

  const progress =
    document.createElement("div");

  progress.className =
    "scroll-progress";

  document.body.appendChild(progress);


  /* ---------------------------------------------------------
     PAGE ENTRANCE
  --------------------------------------------------------- */

  window.addEventListener("load", () => {
    setTimeout(() => {
      hero?.classList.add(
        "page-entered"
      );
    }, 80);
  });


  /* ---------------------------------------------------------
     SCROLL PROGRESS + VELOCITY
  --------------------------------------------------------- */

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
      `scaleX(${Math.min(
        1,
        Math.max(0, ratio)
      )})`;

    const velocity =
      Math.min(
        2,
        Math.abs(
          window.scrollY -
          previousScroll
        )
      );

    document.body.style.setProperty(
      "--scroll-velocity",
      velocity.toFixed(2)
    );

    previousScroll =
      window.scrollY;

    scrollTick = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTick) return;

      scrollTick = true;

      requestAnimationFrame(
        updateScrollExperience
      );
    },
    { passive: true }
  );

  updateScrollExperience();


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
    .map((id) =>
      document.getElementById(id)
    )
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
                link.getAttribute(
                  "href"
                ) === id
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

  if (
    marqueeTrack &&
    !reducedMotion
  ) {
    let marqueeOffset = 0;
    let marqueeLast =
      performance.now();

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


/* =========================================================
   MOBILE SCROLL EXPERIENCE
   ========================================================= */

const mobileExperience =
  window.matchMedia(
    "(max-width: 700px)"
  ).matches &&
  !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


if (mobileExperience) {

  /* =======================================================
     MOBILE REVEAL TARGETS
  ======================================================= */

  const mobileRevealTargets = $$(
    ".reveal, " +
    ".venture-card, " +
    ".journey-card, " +
    ".achievement, " +
    ".certificate, " +
    ".skill, " +
    ".project, " +
    ".project-visual, " +
    ".section-introduction, " +
    ".intro-heading, " +
    ".intro-copy, " +
    ".skills-heading, " +
    ".profile-layout, " +
    ".contact-inner"
  );


  mobileRevealTargets.forEach(
    (element, index) => {

      element.classList.add(
        "mobile-motion"
      );

      element.style.setProperty(
        "--mobile-delay",
        `${Math.min(
          index * 45,
          300
        )}ms`
      );

    }
  );


  /* =======================================================
     MOBILE INTERSECTION OBSERVER
  ======================================================= */

  const mobileObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "mobile-visible"
          );

          mobileObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.08,
        rootMargin:
          "0px 0px -8% 0px"
      }
    );


  mobileRevealTargets.forEach(
    (element) => {
      mobileObserver.observe(element);
    }
  );


  /* =======================================================
     MOBILE SCROLL PARALLAX
  ======================================================= */

  const mobileParallaxTargets = $$(
    ".hero-glow-one, " +
    ".hero-glow-two, " +
    ".hero-grid, " +
    ".portrait-frame img, " +
    ".venture-visual, " +
    ".sukoon-visual"
  );


  let mobileParallaxTicking =
    false;


  const updateMobileParallax = () => {

    mobileParallaxTargets.forEach(
      (element) => {

        const rect =
          element.getBoundingClientRect();

        const viewportCenter =
          window.innerHeight / 2;

        const elementCenter =
          rect.top +
          rect.height / 2;

        const distance =
          elementCenter -
          viewportCenter;

        const normalized =
          Math.max(
            -1,
            Math.min(
              1,
              distance /
                window.innerHeight
            )
          );


        if (
          element.classList.contains(
            "hero-glow-one"
          )
        ) {

          element.style.transform =
            `translate3d(
              0,
              ${normalized * -28}px,
              0
            )`;

        }


        else if (
          element.classList.contains(
            "hero-glow-two"
          )
        ) {

          element.style.transform =
            `translate3d(
              0,
              ${normalized * 22}px,
              0
            )`;

        }


        else if (
          element.classList.contains(
            "hero-grid"
          )
        ) {

          element.style.transform =
            `translate3d(
              0,
              ${normalized * 12}px,
              0
            )`;

        }


        else if (
          element.tagName === "IMG" &&
          element.closest(
            ".portrait-frame"
          )
        ) {

          element.style.transform =
            `scale(1.06)
             translate3d(
               0,
               ${normalized * -18}px,
               0
             )`;

        }


        else if (
          element.classList.contains(
            "venture-visual"
          ) ||
          element.classList.contains(
            "sukoon-visual"
          )
        ) {

          element.style.transform =
            `translate3d(
              0,
              ${normalized * -12}px,
              0
            )`;

        }

      }
    );

    mobileParallaxTicking =
      false;
  };


  window.addEventListener(
    "scroll",
    () => {

      if (
        mobileParallaxTicking
      ) {
        return;
      }

      mobileParallaxTicking =
        true;

      requestAnimationFrame(
        updateMobileParallax
      );

    },
    {
      passive: true
    }
  );


  updateMobileParallax();


  /* =======================================================
     MOBILE SCROLL VELOCITY
  ======================================================= */

  let mobileLastScroll =
    window.scrollY;

  let mobileVelocityTicking =
    false;


  const updateMobileVelocity = () => {

    const currentScroll =
      window.scrollY;

    const velocity =
      Math.abs(
        currentScroll -
        mobileLastScroll
      );

    document.body.style.setProperty(
      "--mobile-scroll-speed",
      Math.min(
        velocity,
        30
      ).toFixed(2)
    );

    mobileLastScroll =
      currentScroll;

    mobileVelocityTicking =
      false;
  };


  window.addEventListener(
    "scroll",
    () => {

      if (
        mobileVelocityTicking
      ) {
        return;
      }

      mobileVelocityTicking =
        true;

      requestAnimationFrame(
        updateMobileVelocity
      );

    },
    {
      passive: true
    }
  );


  /* =======================================================
     TOUCH FEEDBACK
  ======================================================= */

  const touchCards = $$(
    ".venture-card, " +
    ".journey-card, " +
    ".achievement, " +
    ".certificate, " +
    ".skill"
  );


  touchCards.forEach((card) => {

    card.addEventListener(
      "touchstart",
      () => {

        card.classList.add(
          "mobile-touch-active"
        );

      },
      {
        passive: true
      }
    );


    card.addEventListener(
      "touchend",
      () => {

        setTimeout(() => {

          card.classList.remove(
            "mobile-touch-active"
          );

        }, 180);

      },
      {
        passive: true
      }
    );

  });


  /* =======================================================
     MOBILE MARQUEE
  ======================================================= */

  const mobileMarquee =
    $(".marquee-track");


  if (mobileMarquee) {

    let offset = 0;

    let lastTime =
      performance.now();


    const animateMobileMarquee =
      (currentTime) => {

        const delta =
          Math.min(
            40,
            currentTime -
              lastTime
          );

        lastTime =
          currentTime;

        offset -=
          delta * 0.018;

        const halfWidth =
          mobileMarquee.scrollWidth /
          2;

        if (
          Math.abs(offset) >=
          halfWidth
        ) {
          offset = 0;
        }

        mobileMarquee.style.transform =
          `translate3d(
            ${offset}px,
            0,
            0
          )`;

        requestAnimationFrame(
          animateMobileMarquee
        );

      };


    requestAnimationFrame(
      animateMobileMarquee
    );

  }


  /* =======================================================
     INITIAL MOBILE UPDATE
  ======================================================= */

  requestAnimationFrame(() => {
    updateMobileParallax();
  });

}
