/* =========================================================
   MOBILE SCROLL EXPERIENCE — TOUCH DEVICES
   ========================================================= */

const mobileExperience =
  window.matchMedia("(max-width: 700px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (mobileExperience) {

  const mobileRevealTargets = $$(
    ".reveal, .venture-card, .journey-card, .achievement, .certificate, .skill, .project, .project-visual, .section-introduction, .intro-heading, .intro-copy, .skills-heading, .profile-layout, .contact-inner"
  );

  /*
     Mark elements for mobile animation
  */
  mobileRevealTargets.forEach((element, index) => {
    if (!element.classList.contains("mobile-motion")) {
      element.classList.add("mobile-motion");
    }

    element.style.setProperty(
      "--mobile-delay",
      `${Math.min(index * 45, 300)}ms`
    );
  });


  /*
     MOBILE INTERSECTION OBSERVER

     More aggressive than the normal reveal observer.
     Elements animate as soon as they meaningfully
     enter the viewport.
  */

  const mobileObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("mobile-visible");

      });

    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -8% 0px"
    }
  );


  mobileRevealTargets.forEach((element) => {
    mobileObserver.observe(element);
  });


  /*
     MOBILE SCROLL PARALLAX

     This gives the phone version movement while
     scrolling instead of depending on mouse events.
  */

  const mobileParallaxTargets = $$(
    ".hero-glow-one, .hero-glow-two, .hero-grid, .portrait-frame img, .venture-visual, .sukoon-visual"
  );

  let mobileParallaxTicking = false;

  const updateMobileParallax = () => {

    mobileParallaxTargets.forEach((element) => {

      const rect = element.getBoundingClientRect();

      const viewportCenter =
        window.innerHeight / 2;

      const elementCenter =
        rect.top + rect.height / 2;

      const distance =
        elementCenter - viewportCenter;

      const normalized =
        Math.max(
          -1,
          Math.min(
            1,
            distance / window.innerHeight
          )
        );


      if (element.classList.contains("hero-glow-one")) {

        element.style.transform =
          `translate3d(0, ${normalized * -28}px, 0)`;

      }


      else if (
        element.classList.contains("hero-glow-two")
      ) {

        element.style.transform =
          `translate3d(0, ${normalized * 22}px, 0)`;

      }


      else if (
        element.classList.contains("hero-grid")
      ) {

        element.style.transform =
          `translate3d(0, ${normalized * 12}px, 0)`;

      }


      else if (
        element.classList.contains("portrait-frame")
          ||
        element.tagName === "IMG"
      ) {

        if (
          element.closest(".portrait-frame")
        ) {

          element.style.transform =
            `scale(1.06) translate3d(0, ${normalized * -18}px, 0)`;

        }

      }


      else if (
        element.classList.contains("venture-visual") ||
        element.classList.contains("sukoon-visual")
      ) {

        element.style.transform =
          `translate3d(0, ${normalized * -12}px, 0)`;

      }

    });

    mobileParallaxTicking = false;
  };


  window.addEventListener(
    "scroll",
    () => {

      if (mobileParallaxTicking) return;

      mobileParallaxTicking = true;

      requestAnimationFrame(
        updateMobileParallax
      );

    },
    {
      passive: true
    }
  );


  updateMobileParallax();


  /*
     SCROLL VELOCITY CLASS

     Adds a little extra movement when the user
     scrolls faster.
  */

  let mobileLastScroll =
    window.scrollY;

  let mobileVelocityTicking = false;

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
      Math.min(velocity, 30).toFixed(2)
    );

    mobileLastScroll =
      currentScroll;

    mobileVelocityTicking = false;
  };


  window.addEventListener(
    "scroll",
    () => {

      if (mobileVelocityTicking) return;

      mobileVelocityTicking = true;

      requestAnimationFrame(
        updateMobileVelocity
      );

    },
    {
      passive: true
    }
  );


  /*
     TOUCH FEEDBACK

     Cards slightly react when touched.
  */

  const touchCards = $$(
    ".venture-card, .journey-card, .achievement, .certificate, .skill"
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


  /*
     MOBILE MARQUEE

     Keeps the marquee moving even when
     desktop mouse/hover interactions are absent.
  */

  const mobileMarquee =
    $(".marquee-track");

  if (mobileMarquee) {

    let offset = 0;

    let lastTime =
      performance.now();

    const animateMobileMarquee = (
      currentTime
    ) => {

      const delta =
        Math.min(
          40,
          currentTime - lastTime
        );

      lastTime =
        currentTime;

      offset -=
        delta * 0.018;

      const halfWidth =
        mobileMarquee.scrollWidth / 2;

      if (
        Math.abs(offset) >=
        halfWidth
      ) {
        offset = 0;
      }

      mobileMarquee.style.transform =
        `translate3d(${offset}px, 0, 0)`;

      requestAnimationFrame(
        animateMobileMarquee
      );

    };

    requestAnimationFrame(
      animateMobileMarquee
    );

  }


  /*
     INITIAL UPDATE
  */

  requestAnimationFrame(() => {

    updateMobileParallax();

  });

}
