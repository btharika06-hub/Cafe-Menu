import { CSSProperties, ChangeEvent, DragEvent, ReactNode, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeIndianRupee,
  Bean,
  ChefHat,
  Copy,
  Download,
  ImagePlus,
  Leaf,
  Moon,
  Plus,
  Printer,
  Search,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import {
  bindLuxuryHoverEffects,
  cleanupAnime,
  runCinematicLoader,
  runCoffeeShopEntrance,
  runFloatingBeans,
  runMenuItemEntrance,
  runMenuItemExit,
  runMenuPreviewEntrance,
  runSteamAnimation,
  runThemeTransition,
  runTitleLetters,
} from "./animations/animeCafe";
import LuxuryCafeShowcase from "./components/LuxuryCafeShowcase";

type Badge = "featured" | "bestseller" | "new" | "vegetarian" | "vegan" | "spicy";

type CafeInfo = {
  name: string;
  tagline: string;
  address: string;
  contact: string;
  social: string;
  logo?: string;
};

type Category = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  badges: Record<Badge, boolean>;
};

type Theme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  paper: string;
  ink: string;
  texture: string;
  heading: string;
  body: string;
  radius: string;
  border: string;
};

const uid = () => globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);

const defaultCategories = [
  "Coffee",
  "Tea",
  "Breakfast",
  "Sandwiches",
  "Main Course",
  "Desserts",
  "Bakery",
  "Beverages",
  "Signature Specials",
  "Seasonal Menu",
].map((name) => ({ id: uid(), name }));

const makeBadges = (partial: Partial<Record<Badge, boolean>> = {}) => ({
  featured: false,
  bestseller: false,
  new: false,
  vegetarian: false,
  vegan: false,
  spicy: false,
  ...partial,
});

const starterItems = (categories: Category[]): MenuItem[] => {
  const byName = Object.fromEntries(categories.map((category) => [category.name, category.id]));
  const categoryId = (name: string) => byName[name] || categories[0]?.id || uid();
  return [
    {
      id: uid(),
      name: "Espresso",
      description: "Rich single-origin shot with a deep cocoa finish",
      price: 90,
      categoryId: categoryId("Coffee"),
      badges: makeBadges({ bestseller: true }),
    },
    {
      id: uid(),
      name: "Caramel Cloud Latte",
      description: "Velvety espresso, steamed milk, salted caramel foam",
      price: 180,
      categoryId: categoryId("Coffee"),
      badges: makeBadges({ featured: true, new: true }),
    },
    {
      id: uid(),
      name: "Blueberry Cheesecake",
      description: "Creamy baked cheesecake with a berry compote glaze",
      price: 220,
      categoryId: categoryId("Desserts"),
      badges: makeBadges({ vegetarian: true }),
    },
    {
      id: uid(),
      name: "Avocado Garden Toast",
      description: "Sourdough, avocado cream, pickled onions, microgreens",
      price: 240,
      categoryId: categoryId("Breakfast"),
      badges: makeBadges({ vegan: true, featured: true }),
    },
    {
      id: uid(),
      name: "Gochujang Paneer Melt",
      description: "Toasted brioche, paneer, mild gochujang glaze, cheddar",
      price: 280,
      categoryId: categoryId("Sandwiches"),
      badges: makeBadges({ spicy: true, new: true }),
    },
  ];
};

const themes: Theme[] = [
  {
    id: "classic",
    name: "Classic Coffee House",
    primary: "#5b3824",
    secondary: "#d7b88f",
    accent: "#9f6a3d",
    paper: "#fbf1df",
    ink: "#2d2018",
    texture: "parchment",
    heading: "Playfair Display",
    body: "Poppins",
    radius: "22px",
    border: "1px solid rgba(91,56,36,.22)",
  },
  {
    id: "korean",
    name: "Korean Cafe",
    primary: "#43352d",
    secondary: "#f0dacd",
    accent: "#b98675",
    paper: "#fff8ef",
    ink: "#2a2522",
    texture: "linen",
    heading: "Cormorant Garamond",
    body: "Nunito",
    radius: "24px",
    border: "1px solid rgba(185,134,117,.3)",
  },
  {
    id: "rustic",
    name: "Rustic Bakery",
    primary: "#68441f",
    secondary: "#e0c18f",
    accent: "#7f8a5f",
    paper: "#f9eccf",
    ink: "#2e2117",
    texture: "wood",
    heading: "Libre Baskerville",
    body: "Inter",
    radius: "18px",
    border: "1px dashed rgba(104,68,31,.35)",
  },
  {
    id: "minimal",
    name: "Modern Minimal Cafe",
    primary: "#3d342d",
    secondary: "#e8dfd4",
    accent: "#8f9c87",
    paper: "#fffaf2",
    ink: "#24201c",
    texture: "grain",
    heading: "Playfair Display",
    body: "Inter",
    radius: "16px",
    border: "1px solid rgba(36,32,28,.14)",
  },
  {
    id: "luxury",
    name: "Luxury Cafe",
    primary: "#2f211a",
    secondary: "#d0ad72",
    accent: "#8b2432",
    paper: "#fff6e7",
    ink: "#241814",
    texture: "parchment",
    heading: "Cormorant Garamond",
    body: "Poppins",
    radius: "24px",
    border: "1px solid rgba(208,173,114,.48)",
  },
];

const storageKey = "premium-cafe-menu-designer";

const initialCafe: CafeInfo = {
  name: "Cafe Aroma",
  tagline: "Fresh Brews & Cozy Moments",
  address: "12 Cinnamon Lane, Bengaluru",
  contact: "+91 98765 43210",
  social: "@cafearoma",
};

const readFile = (file: File, callback: (data: string) => void) => {
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result));
  reader.readAsDataURL(file);
};

function App() {
  const saved = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  }, []);

  const [cafe, setCafe] = useState<CafeInfo>(saved?.cafe || initialCafe);
  const [categories, setCategories] = useState<Category[]>(saved?.categories || defaultCategories);
  const [items, setItems] = useState<MenuItem[]>(saved?.items || starterItems(saved?.categories || defaultCategories));
  const [theme, setTheme] = useState<Theme>(saved?.theme || themes[0]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [editingCategory, setEditingCategory] = useState(categories[0]?.id || "");
  const [darkMode, setDarkMode] = useState(Boolean(saved?.darkMode));
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const appRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previousThemeRef = useRef(theme);
  const categoryExitRef = useRef<ReturnType<typeof runMenuItemExit>>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ cafe, categories, items, theme, darkMode }));
  }, [cafe, categories, items, theme, darkMode]);

  // Anime.js added: coffee-cup loader before the main UI enters.
  useEffect(() => {
    if (!loaderRef.current) return;

    const animations = runCinematicLoader(loaderRef.current);
    const timer = window.setTimeout(() => setIsLoading(false), 2450);

    return () => {
      window.clearTimeout(timer);
      cleanupAnime(animations);
    };
  }, []);

  // Anime.js added: staggered app entrance, live preview reveal, steam, beans, and hover polish.
  useEffect(() => {
    if (isLoading || !appRef.current) return;

    const animations = [
      ...runCoffeeShopEntrance(appRef.current),
      previewRef.current ? runMenuPreviewEntrance(previewRef.current) : null,
      runSteamAnimation(appRef.current),
      runTitleLetters(appRef.current),
      ...runFloatingBeans(appRef.current),
    ];

    return () => {
      cleanupAnime(animations);
    };
  }, [isLoading]);

  // Anime.js added: bind hover effects again when interactive cards/buttons change.
  useEffect(() => {
    if (isLoading || !appRef.current) return;

    return bindLuxuryHoverEffects(appRef.current);
  }, [activeCategory, categories.length, isLoading, items.length, search]);

  // Anime.js added: re-run premium card entrance when menu cards are added or filtered.
  useEffect(() => {
    if (isLoading || !appRef.current) return;

    let animation: ReturnType<typeof runMenuItemEntrance> = null;
    const frame = window.requestAnimationFrame(() => {
      if (appRef.current) animation = runMenuItemEntrance(appRef.current);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      animation?.revert();
    };
  }, [activeCategory, categories.length, isLoading, items.length, search]);

  // Anime.js added: letter-by-letter cafe branding refresh when the cafe name changes.
  useEffect(() => {
    if (isLoading || !appRef.current) return;

    let animation: ReturnType<typeof runTitleLetters> = null;
    const frame = window.requestAnimationFrame(() => {
      if (appRef.current) animation = runTitleLetters(appRef.current);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      animation?.revert();
    };
  }, [cafe.name, isLoading]);

  // Anime.js added: tween theme CSS variables so palette changes feel handcrafted.
  useEffect(() => {
    if (isLoading || !appRef.current) {
      previousThemeRef.current = theme;
      return;
    }

    const animation = runThemeTransition(appRef.current, previousThemeRef.current, theme);
    previousThemeRef.current = theme;

    return () => {
      animation.cancel();
    };
  }, [isLoading, theme]);

  useEffect(
    () => () => {
      categoryExitRef.current?.revert();
    },
    []
  );

  const visibleCategories = categories.filter((category) => activeCategory === "all" || category.id === activeCategory);
  const filteredItems = items.filter((item) => {
    const matchesSearch = [item.name, item.description].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const featuredItems = items.filter((item) => item.badges.featured);

  const addCategory = () => {
    const category = { id: uid(), name: "New Category" };
    setCategories((current) => [...current, category]);
    setEditingCategory(category.id);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories((current) => current.map((category) => (category.id === id ? { ...category, name } : category)));
  };

  const removeCategory = (id: string) => {
    const fallback = categories.find((category) => category.id !== id)?.id;
    if (!fallback) return;
    setCategories((current) => current.filter((category) => category.id !== id));
    setItems((current) => current.map((item) => (item.categoryId === id ? { ...item, categoryId: fallback } : item)));
  };

  const addItem = (categoryId = categories[0].id) => {
    setItems((current) => [
      {
        id: uid(),
        name: "New Menu Item",
        description: "A handcrafted cafe favorite with a warm finish",
        price: 180,
        categoryId,
        badges: makeBadges(),
      },
      ...current,
    ]);
  };

  const updateItem = (id: string, patch: Partial<MenuItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const duplicateItem = (item: MenuItem) => {
    setItems((current) => [{ ...item, id: uid(), name: `${item.name} Copy` }, ...current]);
  };

  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  const handleCategoryChange = (nextCategory: string) => {
    if (nextCategory === activeCategory) return;
    categoryExitRef.current?.revert();

    if (!appRef.current) {
      setActiveCategory(nextCategory);
      return;
    }

    const exitAnimation = runMenuItemExit(appRef.current);
    categoryExitRef.current = exitAnimation;

    if (!exitAnimation) {
      setActiveCategory(nextCategory);
      return;
    }

    exitAnimation.then(() => {
      setActiveCategory(nextCategory);
      categoryExitRef.current = null;
    });
  };

  const handleItemDrop = (event: DragEvent, targetCategoryId: string, targetItemId?: string) => {
    event.preventDefault();
    if (!draggedItem) return;
    setItems((current) => {
      const moving = current.find((item) => item.id === draggedItem);
      if (!moving) return current;
      const remaining = current.filter((item) => item.id !== draggedItem);
      const updated = { ...moving, categoryId: targetCategoryId };
      if (!targetItemId) return [updated, ...remaining];
      const index = remaining.findIndex((item) => item.id === targetItemId);
      const next = [...remaining];
      next.splice(Math.max(index, 0), 0, updated);
      return next;
    });
    setDraggedItem(null);
  };

  const handleCategoryDrop = (targetId: string) => {
    if (!draggedCategory || draggedCategory === targetId) return;
    setCategories((current) => {
      const moving = current.find((category) => category.id === draggedCategory);
      const targetIndex = current.findIndex((category) => category.id === targetId);
      if (!moving || targetIndex < 0) return current;
      const next = current.filter((category) => category.id !== draggedCategory);
      next.splice(targetIndex, 0, moving);
      return next;
    });
    setDraggedCategory(null);
  };

  const exportImage = async () => {
    const html2canvas = (await import("html2canvas")).default;
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { backgroundColor: null, scale: 2 });
    const link = document.createElement("a");
    link.download = `${cafe.name.replace(/\s+/g, "-").toLowerCase()}-menu.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportPdf = async () => {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { backgroundColor: null, scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const image = canvas.toDataURL("image/png");
    pdf.addImage(image, "PNG", 8, 8, 194, 0);
    pdf.save(`${cafe.name.replace(/\s+/g, "-").toLowerCase()}-menu.pdf`);
  };

  const themeStyle = {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--accent": theme.accent,
    "--paper": theme.paper,
    "--ink": theme.ink,
    "--radius": theme.radius,
    "--theme-border": theme.border,
    "--heading-font": theme.heading,
    "--body-font": theme.body,
  } as CSSProperties;

  if (isLoading) {
    return <CoffeeLoader ref={loaderRef} />;
  }

  return (
    <>
    <LuxuryCafeShowcase />
    <main id="designer-studio" ref={appRef} className={`app-shell ${theme.texture} ${darkMode ? "dark" : ""}`} style={themeStyle}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="floating-beans" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((bean) => (
          <span key={bean} className={`floating-bean bean-${bean + 1}`}>
            <Bean size={22} />
          </span>
        ))}
      </div>
      <aside className="panel sidebar">
        <BrandEditor cafe={cafe} setCafe={setCafe} />
        <section className="control-block">
          <PanelTitle icon={<ChefHat size={18} />} title="Categories" action={<button className="icon-button" onClick={addCategory} aria-label="Add category"><Plus size={16} /></button>} />
          <div className="category-list">
            {categories.map((category) => (
              <motion.div
                layout
                key={category.id}
                draggable
                onDragStart={() => setDraggedCategory(category.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleCategoryDrop(category.id)}
                className={`category-pill ${editingCategory === category.id ? "active" : ""}`}
              >
                <input value={category.name} onFocus={() => setEditingCategory(category.id)} onChange={(event) => updateCategory(category.id, event.target.value)} />
                <button className="ghost-icon" onClick={() => removeCategory(category.id)} aria-label="Delete category"><Trash2 size={14} /></button>
              </motion.div>
            ))}
          </div>
        </section>
        <ThemeControls theme={theme} setTheme={setTheme} darkMode={darkMode} setDarkMode={setDarkMode} />
        <section className="control-block">
          <PanelTitle icon={<Download size={18} />} title="Export" />
          <div className="export-grid">
            <button onClick={exportPdf}><Download size={16} /> PDF</button>
            <button onClick={exportImage}><ImagePlus size={16} /> PNG</button>
            <button onClick={() => window.print()}><Printer size={16} /> Print</button>
          </div>
        </section>
      </aside>

      <section className="panel editor">
        <div className="editor-top">
          <div>
            <p className="eyebrow">Boutique menu studio</p>
            <h1 className="hero-title"><AnimatedLetters text="Cafe Menu Designer" /></h1>
          </div>
          <button className="primary-button" onClick={() => addItem(activeCategory === "all" ? categories[0].id : activeCategory)}>
            <Plus size={18} /> Add item
          </button>
        </div>
        <div className="toolbar">
          <label className="search-box">
            <Search size={17} />
            <input placeholder="Search menu items" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <select value={activeCategory} onChange={(event) => handleCategoryChange(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <AnimatePresence>
          {visibleCategories.map((category) => {
            const categoryItems = filteredItems.filter((item) => item.categoryId === category.id);
            return (
              <motion.section
                key={category.id}
                layout
                className="category-editor"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleItemDrop(event, category.id)}
              >
                <div className="category-heading">
                  <h2>{category.name}</h2>
                  <button className="text-button" onClick={() => addItem(category.id)}><Plus size={15} /> Item</button>
                </div>
                <div className="item-grid">
                  {categoryItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      categories={categories}
                      updateItem={updateItem}
                      removeItem={removeItem}
                      duplicateItem={duplicateItem}
                      setDraggedItem={setDraggedItem}
                      onDrop={(event) => handleItemDrop(event, category.id, item.id)}
                    />
                  ))}
                </div>
              </motion.section>
            );
          })}
        </AnimatePresence>
      </section>

      <aside className="preview-column">
        <MenuPreview ref={previewRef} cafe={cafe} categories={categories} items={items} featuredItems={featuredItems} theme={theme} />
      </aside>
    </main>
    </>
  );
}

function PanelTitle({ icon, title, action }: { icon: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="panel-title">
      <span>{icon}{title}</span>
      {action}
    </div>
  );
}

function BrandEditor({ cafe, setCafe }: { cafe: CafeInfo; setCafe: (value: CafeInfo) => void }) {
  const update = (patch: Partial<CafeInfo>) => setCafe({ ...cafe, ...patch });
  const logoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) readFile(file, (logo) => update({ logo }));
  };

  return (
    <section className="brand-card control-block">
      <div className="logo-uploader">
        {cafe.logo ? <img src={cafe.logo} alt="" /> : <Bean size={30} />}
        <label><Upload size={14} /> Logo<input type="file" accept="image/*" onChange={logoChange} /></label>
      </div>
      <div className="stack">
        <input value={cafe.name} onChange={(event) => update({ name: event.target.value })} aria-label="Cafe name" />
        <input value={cafe.tagline} onChange={(event) => update({ tagline: event.target.value })} aria-label="Tagline" />
        <input value={cafe.address} onChange={(event) => update({ address: event.target.value })} aria-label="Address" />
        <input value={cafe.contact} onChange={(event) => update({ contact: event.target.value })} aria-label="Contact" />
        <input value={cafe.social} onChange={(event) => update({ social: event.target.value })} aria-label="Social media" />
      </div>
    </section>
  );
}

function ThemeControls({ theme, setTheme, darkMode, setDarkMode }: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  const patchTheme = (patch: Partial<Theme>) => setTheme({ ...theme, ...patch });
  return (
    <section className="control-block">
      <PanelTitle icon={<Sparkles size={18} />} title="Theme" action={<button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>} />
      <select value={theme.id} onChange={(event) => setTheme(themes.find((item) => item.id === event.target.value) || themes[0])}>
        {themes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <div className="swatch-grid">
        {(["primary", "secondary", "accent"] as const).map((key) => (
          <label key={key}>
            <span>{key}</span>
            <input type="color" value={theme[key]} onChange={(event) => patchTheme({ [key]: event.target.value })} />
          </label>
        ))}
      </div>
      <div className="two-col">
        <select value={theme.texture} onChange={(event) => patchTheme({ texture: event.target.value })}>
          <option value="parchment">Parchment</option>
          <option value="linen">Linen</option>
          <option value="wood">Wood</option>
          <option value="grain">Fine grain</option>
        </select>
        <select value={theme.heading} onChange={(event) => patchTheme({ heading: event.target.value })}>
          <option>Playfair Display</option>
          <option>Cormorant Garamond</option>
          <option>Libre Baskerville</option>
        </select>
      </div>
    </section>
  );
}

function ItemCard({ item, categories, updateItem, removeItem, duplicateItem, setDraggedItem, onDrop }: {
  item: MenuItem;
  categories: Category[];
  updateItem: (id: string, patch: Partial<MenuItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (item: MenuItem) => void;
  setDraggedItem: (id: string | null) => void;
  onDrop: (event: DragEvent) => void;
}) {
  const imageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) readFile(file, (image) => updateItem(item.id, { image }));
  };
  const badgeLabels: [Badge, string][] = [
    ["featured", "Featured"],
    ["bestseller", "Bestseller"],
    ["new", "New"],
    ["vegetarian", "Veg"],
    ["vegan", "Vegan"],
    ["spicy", "Spicy"],
  ];

  return (
    <motion.article
      layout
      className="item-card"
      draggable
      onDragStart={() => setDraggedItem(item.id)}
      onDragEnd={() => setDraggedItem(null)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <div className="item-media">
        {item.image ? <img src={item.image} alt="" /> : <Bean size={24} />}
        <label aria-label="Upload item image"><ImagePlus size={16} /><input type="file" accept="image/*" onChange={imageChange} /></label>
      </div>
      <div className="item-fields">
        <input value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} aria-label="Item name" />
        <textarea value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} aria-label="Description" />
        <div className="row">
          <label className="price-field"><BadgeIndianRupee size={16} /><input type="number" value={item.price} onChange={(event) => updateItem(item.id, { price: Number(event.target.value) })} /></label>
          <select value={item.categoryId} onChange={(event) => updateItem(item.id, { categoryId: event.target.value })}>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
      </div>
      <div className="badge-row">
        {badgeLabels.map(([key, label]) => (
          <label className={item.badges[key] ? "badge-toggle active" : "badge-toggle"} key={key}>
            <input type="checkbox" checked={item.badges[key]} onChange={(event) => updateItem(item.id, { badges: { ...item.badges, [key]: event.target.checked } })} />
            {label}
          </label>
        ))}
      </div>
      <div className="card-actions">
        <button onClick={() => duplicateItem(item)}><Copy size={15} /> Duplicate</button>
        <button onClick={() => removeItem(item.id)}><Trash2 size={15} /> Delete</button>
      </div>
    </motion.article>
  );
}

const MenuPreview = forwardRef<HTMLDivElement, {
  cafe: CafeInfo;
  categories: Category[];
  items: MenuItem[];
  featuredItems: MenuItem[];
  theme: Theme;
}>(({ cafe, categories, items, featuredItems, theme }, ref) => (
  <motion.div className="preview-wrap" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
    <div className="preview-toolbar">
      <span>Live print preview</span>
      <span>A4 ready</span>
    </div>
    <div ref={ref} className={`menu-preview ${theme.texture}`}>
      <div className="coffee-mark mark-one" />
      <div className="coffee-mark mark-two" />
      <header className="menu-header">
        <div className="preview-logo-wrap">
          <div className="logo-steam" aria-hidden="true">
            <span className="steam-wisp" />
            <span className="steam-wisp" />
            <span className="steam-wisp" />
          </div>
          {cafe.logo ? <img src={cafe.logo} alt="" /> : <Bean size={34} />}
        </div>
        <h2 className="cafe-title"><AnimatedLetters text={cafe.name} /></h2>
        <p>{cafe.tagline}</p>
        <div className="ornament"><span /><Bean size={16} /><span /></div>
      </header>
      {featuredItems.length > 0 && (
        <section className="preview-section featured-section">
          <h3><Star size={16} /> Signature Picks</h3>
          {featuredItems.slice(0, 3).map((item) => <PreviewLine key={item.id} item={item} />)}
        </section>
      )}
      {categories.map((category) => {
        const categoryItems = items.filter((item) => item.categoryId === category.id);
        if (!categoryItems.length) return null;
        return (
          <section className="preview-section" key={category.id}>
            <h3>{category.name}</h3>
            {categoryItems.map((item) => <PreviewLine key={item.id} item={item} />)}
          </section>
        );
      })}
      <footer>
        <p>{cafe.address}</p>
        <p>{cafe.contact} · {cafe.social}</p>
      </footer>
    </div>
  </motion.div>
));

function PreviewLine({ item }: { item: MenuItem }) {
  return (
    <div className="preview-item">
      <div className="preview-name-row">
        <span>{item.name}</span>
        <i />
        <strong>₹{item.price}</strong>
      </div>
      <p>{item.description}</p>
      <div className="preview-badges">
        {item.badges.bestseller && <em>Bestseller</em>}
        {item.badges.new && <em>New</em>}
        {item.badges.vegetarian && <em><Leaf size={11} /> Veg</em>}
        {item.badges.vegan && <em>Vegan</em>}
        {item.badges.spicy && <em>Spicy</em>}
      </div>
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

const CoffeeLoader = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="coffee-loader" role="status" aria-label="Loading cafe menu designer">
    <Bean className="loader-bean" size={58} aria-hidden="true" />
    <div className="loader-steam" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <div className="loader-cup" aria-hidden="true">
      <div className="loader-coffee" />
    </div>
    <div className="loader-saucer" aria-hidden="true" />
    <p className="loader-brand">Cafe Aroma Atelier</p>
  </div>
));

export default App;
