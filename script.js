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
     PAGE TRANSITION
  ========================================================= */

  const pageTransition = $("#pageTransition");

  if (pageTransition) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        pageTransition.classList.add("loaded");
      }, 650);
    });
  }


  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */

  const cursor = $("#cursor");

  if (cursor && finePointer && !reduceMotion) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;
    let currentY = mouseY;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    const moveCursor = () => {

      currentX += (mouseX - currentX) * 0.14;
      currentY += (mouseY - currentY) * 0.14;

      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;

      requestAnimationFrame(moveCursor);
    };

    moveCursor();


    const interactiveElements = $$(
      "a, button, .work-item, .hero-portrait, .portrait-frame"
    );

    interactiveElements.forEach((element) => {

      element.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
      });

    });
  }


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const mobileTrigger = $("#mobileTrigger");
  const mobileNavigation = $("#mobileNavigation");

  const mobileLinks = $$(
    ".mobile-navigation nav a"
  );


  const closeMenu = () => {

    if (!mobileTrigger || !mobileNavigation) {
      return;
    }

    mobileTrigger.classList.remove("active");
    mobileNavigation.classList.remove("active");

    document.body.classList.remove("menu-open");
  };


  const openMenu = () => {

    if (!mobileTrigger || !mobileNavigation) {
      return;
    }

    mobileTrigger.classList.add("active");
    mobileNavigation.classList.add("active");

    document.body.classList.add("menu-open");
  };


  if (mobileTrigger && mobileNavigation) {

    mobileTrigger.addEventListener("click", () => {

      const isOpen =
        mobileNavigation.classList.contains("active");

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

  const header = $("#header");

  if (header) {

    let previousScroll = window.scrollY;
    let ticking = false;


    const updateHeader = () => {

      const currentScroll = window.scrollY;


      if (currentScroll < 80) {

        header.classList.remove("hidden");

      } else if (currentScroll > previousScroll) {

        header.classList.add("hidden");

      } else {

        header.classList.remove("hidden");

      }


      previousScroll = currentScroll;

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
      {
        passive: true
      }
    );
  }


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = $$(".reveal");


  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          });

        },
        {
          threshold: 0.12,

          rootMargin:
            "0px 0px -60px 0px"
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
     SMOOTH ANCHOR SCROLL
  ========================================================= */

  const anchorLinks = $$(
    'a[href^="#"]'
  );


  anchorLinks.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          $(targetId);


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior:
            reduceMotion
              ? "auto"
              : "smooth",

          block: "start"
        });


        closeMenu();

      }
    );

  });


  /* =========================================================
     HERO IMAGE PARALLAX
  ========================================================= */

  const heroPortrait =
    $(".hero-portrait");

  const heroImage =
    $(".portrait-frame img");


  if (
    heroPortrait &&
    heroImage &&
    !reduceMotion
  ) {

    let heroTicking = false;


    const updateHeroImage = () => {

      const scrollY =
        window.scrollY;

      const heroHeight =
        window.innerHeight;


      if (scrollY <= heroHeight) {

        const movement =
          scrollY * 0.035;


        heroImage.style.transform =
          `scale(1.04) translate3d(0, ${movement}px, 0)`;

      }


      heroTicking = false;
    };


    window.addEventListener(
      "scroll",
      () => {

        if (!heroTicking) {

          requestAnimationFrame(
            updateHeroImage
          );

          heroTicking = true;
        }

      },
      {
        passive: true
      }
    );
  }


  /* =========================================================
     HERO MOUSE PARALLAX
  ========================================================= */

  const hero =
    $(".hero");


  if (
    hero &&
    heroPortrait &&
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


        heroPortrait.style.transform =
          `translate3d(${x * 7}px, ${y * 7}px, 0)`;

      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        heroPortrait.style.transform =
          "translate3d(0, 0, 0)";

      }
    );
  }


  /* =========================================================
     WORK IMAGE HOVER
  ========================================================= */

  const workItems =
    $$(".work-item");


  workItems.forEach((item) => {

    const image =
      $(".work-image-placeholder", item);


    if (!image) {
      return;
    }


    item.addEventListener(
      "mousemove",
      (event) => {

        if (!finePointer || reduceMotion) {
          return;
        }


        const rect =
          item.getBoundingClientRect();


        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;


        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;


        image.style.transform =
          `scale(1.025) translate3d(${x * 7}px, ${y * 7}px, 0)`;

      }
    );


    item.addEventListener(
      "mouseleave",
      () => {

        image.style.transform =
          "scale(1) translate3d(0, 0, 0)";

      }
    );

  });


  /* =========================================================
     CONTACT ROWS
  ========================================================= */

  const contactRows =
    $$(".contact-row");


  contactRows.forEach((row) => {

    const arrow =
      $("b", row);


    row.addEventListener(
      "mousemove",
      (event) => {

        if (
          !arrow ||
          !finePointer ||
          reduceMotion
        ) {
          return;
        }


        const rect =
          row.getBoundingClientRect();


        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;


        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;


        arrow.style.transform =
          `translate(${x * 8}px, ${y * 8}px)`;

      }
    );


    row.addEventListener(
      "mouseleave",
      () => {

        if (!arrow) {
          return;
        }


        arrow.style.transform =
          "translate(0, 0)";

      }
    );

  });


  /* =========================================================
     MAGNETIC PROFILE BUTTON
  ========================================================= */

  const profileButton =
    $(".profile-button");


  if (
    profileButton &&
    finePointer &&
    !reduceMotion
  ) {

    profileButton.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          profileButton.getBoundingClientRect();


        const x =
          event.clientX -
          rect.left -
          rect.width / 2;


        const y =
          event.clientY -
          rect.top -
          rect.height / 2;


        profileButton.style.transform =
          `translate(${x * 0.08}px, ${y * 0.08}px)`;

      }
    );


    profileButton.addEventListener(
      "mouseleave",
      () => {

        profileButton.style.transform =
          "translate(0, 0)";

      }
    );

  }


  /* =========================================================
     EXTERNAL LINKS
  ========================================================= */

  const externalLinks =
    $$(
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
     RESIZE SAFETY
  ========================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 700) {
        closeMenu();
      }

    }
  );


  /* =========================================================
     IMAGE LOAD STATE
  ========================================================= */

  const images =
    $$("img");


  images.forEach((image) => {

    if (image.complete) {

      image.classList.add(
        "loaded"
      );

    } else {

      image.addEventListener(
        "load",
        () => {

          image.classList.add(
            "loaded"
          );

        }
      );

    }

  });


  /* =========================================================
     PAGE READY
  ========================================================= */

  document.documentElement.classList.add(
    "js-ready"
  );

});
