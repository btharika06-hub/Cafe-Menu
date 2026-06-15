import { animate, createTimeline, random, stagger } from "animejs";

type AnimeInstance = ReturnType<typeof animate>;
type AnimationCleanup = {
  revert: () => unknown;
};
type ThemeTokens = {
  primary: string;
  secondary: string;
  accent: string;
  paper: string;
  ink: string;
};

const luxuryEase = "out(3)";

const elements = <T extends Element>(root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll<T>(selector));

export const cleanupAnime = (animations: Array<AnimationCleanup | null | undefined>) => {
  animations.forEach((animation) => animation?.revert());
};

// Anime.js: staggered coffee-shop entrance for the three main work areas.
export const runCoffeeShopEntrance = (root: HTMLElement) => {
  const sidebar = root.querySelector<HTMLElement>(".sidebar");
  const editor = root.querySelector<HTMLElement>(".editor");
  const preview = root.querySelector<HTMLElement>(".preview-column");

  return [
    sidebar &&
      animate(sidebar, {
        opacity: [0, 1],
        translateX: [-54, 0],
        duration: 920,
        delay: 90,
        ease: luxuryEase,
      }),
    editor &&
      animate(editor, {
        opacity: [0, 1],
        translateY: [38, 0],
        duration: 920,
        delay: 230,
        ease: luxuryEase,
      }),
    preview &&
      animate(preview, {
        opacity: [0, 1],
        translateX: [54, 0],
        duration: 920,
        delay: 370,
        ease: luxuryEase,
      }),
  ];
};

// Anime.js: menu cards re-enter whenever items, filters, or categories change.
export const runMenuItemEntrance = (root: HTMLElement) => {
  const cards = elements<HTMLElement>(root, ".item-card");
  if (!cards.length) return null;

  return animate(cards, {
    opacity: [0, 1],
    translateY: [40, 0],
    duration: 760,
    delay: stagger(100),
    ease: luxuryEase,
  });
};

// Anime.js: compact exit used before switching visible categories.
export const runMenuItemExit = (root: HTMLElement): AnimeInstance | null => {
  const cards = elements<HTMLElement>(root, ".item-card");
  if (!cards.length) return null;

  return animate(cards, {
    opacity: [1, 0],
    translateY: [0, -14],
    duration: 230,
    delay: stagger(24),
    ease: "inOutSine",
  });
};

// Anime.js: print preview appears like a premium paper proof settling into place.
export const runMenuPreviewEntrance = (target: HTMLElement) =>
  animate(target, {
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 1050,
    delay: 460,
    ease: luxuryEase,
  });

// Anime.js: looping steam wisps above the cafe logo.
export const runSteamAnimation = (root: HTMLElement) => {
  const steam = elements<HTMLElement>(root, ".steam-wisp");
  if (!steam.length) return null;

  return animate(steam, {
    keyframes: [
      { opacity: 0, translateY: 8, scale: 0.72, duration: 0 },
      { opacity: 0.58, translateY: -12, scale: 1, duration: 1100 },
      { opacity: 0, translateY: -38, scale: 1.24, duration: 1700 },
    ],
    delay: stagger(560),
    loop: true,
    ease: "inOutSine",
  });
};

// Anime.js: decorative beans drift subtly with individual timing.
export const runFloatingBeans = (root: HTMLElement) =>
  elements<HTMLElement>(root, ".floating-bean").map((bean) =>
    animate(bean, {
      translateX: [random(-8, 8), random(-18, 18)],
      translateY: [random(-8, 8), random(-24, 18)],
      rotate: [random(-8, 8), random(-22, 22)],
      duration: random(3800, 6400),
      delay: random(0, 900),
      loop: true,
      alternate: true,
      ease: "inOutSine",
    })
  );

// Anime.js: hover polish for cards and buttons without replacing click behavior.
export const bindLuxuryHoverEffects = (root: HTMLElement) => {
  const hoverTargets = elements<HTMLElement>(
    root,
    ".item-card, .showcase-card, .slider-control, .magnetic-button, .primary-button, .text-button, .export-grid button, .card-actions button, .icon-button, .ghost-icon"
  );

  const cleanups = hoverTargets.map((target) => {
    const isCard = target.classList.contains("item-card");
    let current: AnimeInstance | null = null;

    const enter = () => {
      current?.revert();
      current = animate(target, {
        translateY: isCard ? -8 : -2,
        rotateX: isCard ? -2 : 0,
        rotateY: isCard ? 2 : 0,
        scale: isCard ? 1.018 : 1.05,
        boxShadow: isCard
          ? "0 30px 70px rgba(47, 28, 16, 0.24)"
          : "0 18px 38px rgba(72, 43, 23, 0.22)",
        duration: 260,
        ease: luxuryEase,
      });
    };

    const leave = () => {
      current?.revert();
      current = animate(target, {
        translateY: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "",
        duration: 320,
        ease: luxuryEase,
      });
    };

    target.addEventListener("mouseenter", enter);
    target.addEventListener("mouseleave", leave);

    return () => {
      current?.revert();
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
};

// Anime.js: cinematic loading timeline with bean, mug, coffee fill, steam, and brand reveal.
export const runCinematicLoader = (root: HTMLElement) => {
  const timeline = createTimeline({ defaults: { ease: luxuryEase } });

  timeline
    .add(elements(root, ".loader-bean"), {
      opacity: [0, 1],
      scale: [0.3, 1],
      rotate: [0, 360],
      duration: 720,
    })
    .add(elements(root, ".loader-bean"), {
      opacity: [1, 0],
      scale: [1, 0.72],
      duration: 360,
    }, "-=120")
    .add(elements(root, ".loader-cup"), {
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.84, 1],
      duration: 700,
    }, "-=260")
    .add(elements(root, ".loader-coffee"), {
      scaleY: [0, 1],
      opacity: [0, 1],
      duration: 680,
      ease: "inOutSine",
    }, "-=180")
    .add(elements(root, ".loader-steam span"), {
      opacity: [0, 0.68, 0],
      translateY: [12, -22, -48],
      scale: [0.7, 1.05, 1.28],
      duration: 1100,
      delay: stagger(180),
      ease: "inOutSine",
    }, "-=260")
    .add(elements(root, ".loader-brand"), {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 620,
    }, "-=520");

  const steamLoop = animate(elements(root, ".loader-steam span"), {
    opacity: [0, 0.62, 0],
    translateY: [10, -18, -46],
    scale: [0.78, 1, 1.22],
    delay: stagger(220),
    duration: 1800,
    loop: true,
    ease: "inOutSine",
  });

  return [timeline, steamLoop];
};

// Anime.js: scroll storytelling reveals for product sections and atmospheric layers.
export const bindShowcaseScrollAnimations = (root: HTMLElement) => {
  const animations: Array<AnimationCleanup | null> = [];
  const sections = elements<HTMLElement>(root, ".story-section, .cinematic-slider");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target as HTMLElement;
        if (section.dataset.animated === "true") return;
        section.dataset.animated = "true";

        animations.push(
          animate(section.querySelectorAll(".reveal-copy, .showcase-card, .product-visual, .slide-copy > *"), {
            opacity: [0, 1],
            translateY: [42, 0],
            scale: [0.96, 1],
            delay: stagger(90),
            duration: 840,
            ease: luxuryEase,
          })
        );

        animations.push(
          animate(section.querySelectorAll(".section-title .title-letter"), {
            opacity: [0, 1],
            translateY: [20, 0],
            delay: stagger(24),
            duration: 560,
            ease: luxuryEase,
          })
        );
      });
    },
    { threshold: 0.32 }
  );

  sections.forEach((section) => observer.observe(section));

  const ambient = [
    animate(elements(root, ".dust-particle"), {
      translateY: [random(-8, 8), random(-44, 28)],
      translateX: [random(-8, 8), random(-28, 28)],
      opacity: [0.12, 0.44],
      duration: random(3600, 7200),
      delay: stagger(80, { from: "random" }),
      loop: true,
      alternate: true,
      ease: "inOutSine",
    }),
    animate(elements(root, ".light-ray"), {
      opacity: [0.16, 0.34],
      translateX: [-18, 18],
      duration: 5200,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    }),
    ...runFloatingBeans(root),
    runSteamAnimation(root),
  ];

  return () => {
    observer.disconnect();
    cleanupAnime([...animations, ...ambient]);
  };
};

export const runHeroCoffeeSequence = (root: HTMLElement) => {
  const coffee = root.querySelector<HTMLElement>(".hero-coffee-fill");
  const pour = root.querySelector<HTMLElement>(".coffee-pour");
  const ripples = elements<HTMLElement>(root, ".coffee-ripple");

  return [
    animate(elements(root, ".hero-mug"), {
      opacity: [0, 1],
      translateY: [46, 0],
      scale: [0.88, 1],
      duration: 1000,
      ease: luxuryEase,
    }),
    pour &&
      animate(pour, {
        opacity: [0, 1, 0.72],
        scaleY: [0, 1],
        duration: 1100,
        delay: 520,
        ease: "inOutSine",
      }),
    coffee &&
      animate(coffee, {
        scaleY: [0, 1],
        duration: 1300,
        delay: 860,
        ease: "inOutSine",
      }),
    animate(ripples, {
      opacity: [0, 0.58, 0],
      scale: [0.7, 1.18, 1.42],
      duration: 2200,
      delay: stagger(360),
      loop: true,
      ease: "inOutSine",
    }),
    runSteamAnimation(root),
  ];
};

export const runProductSlideTransition = (root: HTMLElement) =>
  animate(root.querySelectorAll(".active-slide .product-visual, .active-slide .slide-copy > *"), {
    opacity: [0, 1],
    translateX: [62, 0],
    scale: [0.9, 1],
    filter: ["blur(10px)", "blur(0px)"],
    delay: stagger(100),
    duration: 780,
    ease: luxuryEase,
  });

export const runPriceCountUp = (target: HTMLElement, value: number) => {
  const counter = { value: 0 };
  return animate(counter, {
    value,
    duration: 900,
    ease: "out(2)",
    onRender: () => {
      target.textContent = `₹${Math.round(counter.value)}`;
    },
  });
};

// Anime.js: letter-by-letter title reveal for the editor and preview cafe branding.
export const runTitleLetters = (root: HTMLElement) => {
  const letters = elements<HTMLElement>(root, ".title-letter");
  if (!letters.length) return null;

  return animate(letters, {
    opacity: [0, 1],
    translateY: [18, 0],
    rotateX: [-28, 0],
    duration: 680,
    delay: stagger(32),
    ease: luxuryEase,
  });
};

// Anime.js: smoothly tween theme CSS variables instead of hard color jumps.
export const runThemeTransition = (
  root: HTMLElement,
  from: ThemeTokens,
  to: ThemeTokens
) =>
  animate(root, {
    "--primary": [from.primary, to.primary],
    "--secondary": [from.secondary, to.secondary],
    "--accent": [from.accent, to.accent],
    "--paper": [from.paper, to.paper],
    "--ink": [from.ink, to.ink],
    duration: 620,
    ease: "inOutSine",
  });

// Anime.js: warm coffee-cup loading sequence before the designer enters.
export const runCoffeeLoader = (root: HTMLElement) => {
  const cup = root.querySelector<HTMLElement>(".loader-cup");
  const saucer = root.querySelector<HTMLElement>(".loader-saucer");
  const steam = elements<HTMLElement>(root, ".loader-steam span");

  return [
    cup &&
      animate(cup, {
        opacity: [0, 1],
        translateY: [22, 0],
        scale: [0.92, 1],
        duration: 760,
        ease: luxuryEase,
      }),
    saucer &&
      animate(saucer, {
        opacity: [0, 1],
        scaleX: [0.72, 1],
        duration: 760,
        delay: 120,
        ease: luxuryEase,
      }),
    steam.length
      ? animate(steam, {
          keyframes: [
            { opacity: 0, translateY: 10, scale: 0.76, duration: 0 },
            { opacity: 0.66, translateY: -12, scale: 1, duration: 760 },
            { opacity: 0, translateY: -36, scale: 1.22, duration: 1040 },
          ],
          delay: stagger(220),
          loop: true,
          ease: "inOutSine",
        })
      : null,
  ];
};
