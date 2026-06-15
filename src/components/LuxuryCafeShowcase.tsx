import { useEffect, useRef, useState } from "react";
import { Bean, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  bindLuxuryHoverEffects,
  bindShowcaseScrollAnimations,
  cleanupAnime,
  runHeroCoffeeSequence,
  runPriceCountUp,
  runProductSlideTransition,
  runTitleLetters,
} from "../animations/animeCafe";

type Product = {
  name: string;
  description: string;
  price: number;
  tone: string;
  type: "coffee" | "dessert" | "sandwich" | "breakfast" | "beverage" | "signature";
};

const coffeeProducts: Product[] = [
  { name: "Espresso", description: "Single-origin intensity with a polished cocoa finish.", price: 90, tone: "espresso", type: "coffee" },
  { name: "Cappuccino", description: "Velvet foam, dark crema, and toasted hazelnut warmth.", price: 140, tone: "cappuccino", type: "coffee" },
  { name: "Latte", description: "Slow-poured milk, soft caramel notes, quiet morning luxury.", price: 170, tone: "latte", type: "coffee" },
  { name: "Mocha", description: "Bittersweet chocolate folded through a deep espresso base.", price: 190, tone: "mocha", type: "coffee" },
  { name: "Caramel Macchiato", description: "Cloud milk, espresso ribbons, and amber caramel.", price: 210, tone: "caramel", type: "coffee" },
];

const dessertProducts: Product[] = [
  { name: "Chocolate Brownie", description: "Warm Belgian chocolate, glossy crumb, sea-salt finish.", price: 150, tone: "brownie", type: "dessert" },
  { name: "Blueberry Cheesecake", description: "Cream cheese silk with a slow-cooked berry crown.", price: 220, tone: "berry", type: "dessert" },
  { name: "Red Velvet Cake", description: "Cocoa sponge, cream layers, and a velvet-red reveal.", price: 240, tone: "velvet", type: "dessert" },
  { name: "Tiramisu", description: "Espresso-soaked layers with mascarpone and cocoa snow.", price: 260, tone: "tiramisu", type: "dessert" },
  { name: "Ice Cream Sundae", description: "Vanilla bean, dark fudge, brittle almond crunch.", price: 190, tone: "sundae", type: "dessert" },
];

const sandwichProducts: Product[] = [
  { name: "Veg Sandwich", description: "Garden vegetables, herb butter, toasted milk bread.", price: 180, tone: "garden", type: "sandwich" },
  { name: "Club Sandwich", description: "Triple-stacked comfort with house sauce and crisp leaves.", price: 260, tone: "club", type: "sandwich" },
  { name: "Paneer Wrap", description: "Charred paneer, pickled onions, saffron yogurt.", price: 240, tone: "paneer", type: "sandwich" },
  { name: "Grilled Cheese", description: "Golden sourdough and molten aged cheddar.", price: 210, tone: "cheese", type: "sandwich" },
  { name: "Garlic Toast", description: "Brioche toast, roasted garlic, parsley oil.", price: 130, tone: "garlic", type: "sandwich" },
];

const breakfastProducts: Product[] = [
  { name: "Pancakes", description: "Brown-butter stack with maple gloss and berries.", price: 260, tone: "pancake", type: "breakfast" },
  { name: "Croissants", description: "Laminated butter pastry with a honeyed crackle.", price: 160, tone: "croissant", type: "breakfast" },
  { name: "Waffles", description: "Crisp Belgian pockets, cream, and caramelized banana.", price: 240, tone: "waffle", type: "breakfast" },
  { name: "English Breakfast", description: "A composed morning plate with cafe-style restraint.", price: 340, tone: "english", type: "breakfast" },
  { name: "Avocado Toast", description: "Sourdough, avocado cream, herbs, and citrus oil.", price: 250, tone: "avocado", type: "breakfast" },
];

const slides: Product[] = [
  coffeeProducts[4],
  dessertProducts[1],
  sandwichProducts[2],
  breakfastProducts[0],
  { name: "Rose Cold Brew", description: "Slow-steeped coffee lifted with rose and vanilla air.", price: 230, tone: "rose", type: "beverage" },
  { name: "Midnight Affogato", description: "Vanilla bean gelato drowned in ceremonial espresso.", price: 290, tone: "affogato", type: "signature" },
];

const dust = Array.from({ length: 28 }, (_, index) => index);

export default function LuxuryCafeShowcase() {
  const rootRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const priceRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const cleanupScroll = bindShowcaseScrollAnimations(root);
    const cleanupHover = bindLuxuryHoverEffects(root);
    const animations = [...runHeroCoffeeSequence(root), runTitleLetters(root)];

    return () => {
      cleanupScroll();
      cleanupHover();
      cleanupAnime(animations);
    };
  }, []);

  useEffect(() => {
    if (!sliderRef.current) return;
    const transition = runProductSlideTransition(sliderRef.current);
    const priceNode = priceRefs.current[activeSlide];
    const count = priceNode ? runPriceCountUp(priceNode, slides[activeSlide].price) : null;

    return () => {
      transition.revert();
      count?.revert();
    };
  }, [activeSlide]);

  const moveSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section ref={rootRef} className="luxury-showcase">
      <Atmosphere />
      <Hero />
      <ProductStory title="Coffee Collection" eyebrow="Roasted like a ritual" products={coffeeProducts} variant="split" />
      <ProductStory title="Dessert Showcase" eyebrow="Bakery theatre" products={dessertProducts} variant="cards" />
      <ProductStory title="Sandwich Collection" eyebrow="Golden, layered, composed" products={sandwichProducts} variant="alternating" />
      <ProductStory title="Breakfast Menu" eyebrow="A softer kind of morning" products={breakfastProducts} variant="parallax" />
      <section ref={sliderRef} className="cinematic-slider">
        <div className="slider-bg" />
        <div className="slide-stage">
          {slides.map((slide, index) => (
            <article className={`premium-slide ${index === activeSlide ? "active-slide" : ""}`} key={slide.name}>
              <ProductVisual product={slide} large />
              <div className="slide-copy">
                <p className="showcase-eyebrow">Category {String(index + 1).padStart(2, "0")}</p>
                <h2 className="section-title"><AnimatedLetters text={slide.name} /></h2>
                <p>{slide.description}</p>
                <span ref={(node) => { priceRefs.current[index] = node; }} className="showcase-price">₹{slide.price}</span>
                <button className="magnetic-button">Explore tasting notes</button>
              </div>
            </article>
          ))}
        </div>
        <div className="slider-controls" aria-label="Product slider controls">
          <button className="slider-control" onClick={() => moveSlide(-1)} aria-label="Previous slide"><ChevronLeft size={18} /></button>
          <span>{activeSlide + 1} / {slides.length}</span>
          <button className="slider-control" onClick={() => moveSlide(1)} aria-label="Next slide"><ChevronRight size={18} /></button>
        </div>
      </section>
    </section>
  );
}

function Atmosphere() {
  return (
    <div className="showcase-atmosphere" aria-hidden="true">
      <div className="light-ray ray-one" />
      <div className="light-ray ray-two" />
      {dust.map((particle) => <span className="dust-particle" key={particle} />)}
      {[1, 2, 3, 4, 5, 6].map((bean) => (
        <span className={`floating-bean showcase-bean bean-${bean}`} key={bean}><Bean size={18} /></span>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="showcase-hero">
      <div className="hero-table" />
      <div className="coffee-pour" aria-hidden="true" />
      <div className="hero-mug" aria-hidden="true">
        <div className="hero-coffee-fill">
          <span className="coffee-ripple" />
          <span className="coffee-ripple" />
          <span className="coffee-ripple" />
        </div>
        <div className="logo-steam hero-steam">
          <span className="steam-wisp" />
          <span className="steam-wisp" />
          <span className="steam-wisp" />
        </div>
      </div>
      <div className="hero-copy">
        <p className="showcase-eyebrow">Cinematic artisan cafe experience</p>
        <h1 className="section-title"><AnimatedLetters text="Cafe Aroma Atelier" /></h1>
        <p className="reveal-copy">Design menus, reveal products, and present your cafe like a luxury coffee house launch.</p>
        <a className="magnetic-button" href="#designer-studio"><Sparkles size={17} /> Open menu studio</a>
      </div>
    </section>
  );
}

function ProductStory({ title, eyebrow, products, variant }: {
  title: string;
  eyebrow: string;
  products: Product[];
  variant: "split" | "cards" | "alternating" | "parallax";
}) {
  const hero = products[0];
  return (
    <section className={`story-section story-${variant}`}>
      <div className="story-copy">
        <p className="showcase-eyebrow">{eyebrow}</p>
        <h2 className="section-title"><AnimatedLetters text={title} /></h2>
        <p className="reveal-copy">{hero.description}</p>
        <span className="showcase-price">₹{hero.price}</span>
        <button className="magnetic-button">Reserve this moment</button>
      </div>
      <div className="story-products">
        {products.map((product, index) => (
          <article className="showcase-card" key={product.name}>
            <ProductVisual product={product} />
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>₹{product.price}</strong>
            </div>
            <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductVisual({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`product-visual visual-${product.type} tone-${product.tone} ${large ? "large-visual" : ""}`}>
      <span className="visual-shadow" />
      <span className="visual-body" />
      <span className="visual-detail one" />
      <span className="visual-detail two" />
      <span className="visual-detail three" />
    </div>
  );
}

function AnimatedLetters({ text }: { text: string }) {
  return (
    <span aria-label={text} className="animated-title-text">
      {Array.from(text).map((letter, index) => (
        <span aria-hidden="true" className="title-letter" key={`${letter}-${index}`}>
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}
