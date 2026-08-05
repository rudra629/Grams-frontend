import walnut from "@/assets/products/Walnut Whole Chile F.png";
import sunflower from "@/assets/products/Sunflower F.png";
import kiwi from "@/assets/products/Dried Kiwi F.png";
import mango from "@/assets/products/Dreid Mango F.png";
import hazelnut from "@/assets/products/Hazelnuts F.png";
import pecan from "@/assets/products/Pecan F.png";
import macadamia from "@/assets/products/Macademia F.png";
import cranberry from "@/assets/products/Dried Cranberry F.png";
import pumpkin from "@/assets/products/Pumpkin Seeds F.png";
import pineapple from "@/assets/products/Dried Pineapple F.png";

export type ProductSlide = {
  image: string;
  title: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: "Nuts" | "Seeds" | "Dried Fruits";
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  badges: string[];
  description: string;
  origin: string;
  nutrition: { label: string; value: string }[];
  weights: { label: string; value: string; price: number }[];
  bestseller?: boolean;
  newArrival?: boolean;
  slides?: ProductSlide[];
};


export const products: Product[] = [
  {
    slug: "walnut-whole-california",
    name: "Walnut Whole",
    tagline: "California-grown, brain-boosting kernels in shell",
    category: "Nuts",
    price: 549,
    compareAt: 699,
    rating: 4.8,
    reviews: 1243,
    image: walnut,
    badges: ["Protein Rich", "Omega-3", "Antioxidants"],
    description:
      "Sun-cured Californian walnuts, hand-selected for size and crunch. Buttery, mildly sweet kernels packed with omega-3s — perfect for baking, snacking or a serious brain-day fuel.",
    origin: "California, USA",
    nutrition: [
      { label: "Protein", value: "15g / 100g" },
      { label: "Fibre", value: "6.7g" },
      { label: "Omega-3", value: "9g" },
      { label: "Energy", value: "654 kcal" },
    ],
    weights: [
      { label: "250g", value: "250", price: 549 },
      { label: "500g", value: "500", price: 999 },
      { label: "1kg", value: "1000", price: 1849 },
    ],
    bestseller: true,
  },
  {
    slug: "hazelnuts-premium",
    name: "Hazelnuts",
    tagline: "Roasted Turkish hazelnuts, chocolatey and crisp",
    category: "Nuts",
    price: 649,
    compareAt: 799,
    rating: 4.7,
    reviews: 812,
    image: hazelnut,
    badges: ["Protein Rich", "Vitamin E", "Heart Healthy"],
    description:
      "Slow-roasted hazelnuts with a deep, cocoa-like aroma. Great in trail mixes, granola, or the base of your next homemade praline.",
    origin: "Giresun, Türkiye",
    nutrition: [
      { label: "Protein", value: "14g / 100g" },
      { label: "Fibre", value: "9.7g" },
      { label: "Vitamin E", value: "15mg" },
      { label: "Energy", value: "628 kcal" },
    ],
    weights: [
      { label: "250g", value: "250", price: 649 },
      { label: "500g", value: "500", price: 1199 },
      { label: "1kg", value: "1000", price: 2199 },
    ],
    bestseller: true,
  },
  {
    slug: "pecan-nuts",
    name: "Pecan Nuts",
    tagline: "Buttery pecan halves — the pie-worthy premium",
    category: "Nuts",
    price: 899,
    rating: 4.9,
    reviews: 421,
    image: pecan,
    badges: ["Antioxidants", "Zinc Rich", "Gluten Free"],
    description:
      "Silky, sweet pecan halves from Georgia. Toast them, glaze them, or drop them on your morning yogurt for instant luxury.",
    origin: "Georgia, USA",
    nutrition: [
      { label: "Protein", value: "9g / 100g" },
      { label: "Fibre", value: "9.6g" },
      { label: "Zinc", value: "4.5mg" },
      { label: "Energy", value: "691 kcal" },
    ],
    weights: [
      { label: "250g", value: "250", price: 899 },
      { label: "500g", value: "500", price: 1699 },
    ],
    newArrival: true,
  },
  {
    slug: "macadamia-nuts",
    name: "Macadamia Nuts",
    tagline: "The world's most luxurious nut, in-shell",
    category: "Nuts",
    price: 1249,
    compareAt: 1499,
    rating: 4.9,
    reviews: 302,
    image: macadamia,
    badges: ["Premium", "Heart Healthy", "Keto Friendly"],
    description:
      "Rich, creamy macadamias with a naturally sweet finish. A tiny handful is all you need — indulgence engineered by nature.",
    origin: "Queensland, Australia",
    nutrition: [
      { label: "Protein", value: "7.9g / 100g" },
      { label: "Fibre", value: "8.6g" },
      { label: "Good Fats", value: "76g" },
      { label: "Energy", value: "718 kcal" },
    ],
    weights: [
      { label: "250g", value: "250", price: 1249 },
      { label: "500g", value: "500", price: 2399 },
    ],
    bestseller: true,
  },
  {
    slug: "sunflower-seeds",
    name: "Sunflower Seeds",
    tagline: "Crunchy sunflower kernels — the everyday superhero",
    category: "Seeds",
    price: 199,
    compareAt: 249,
    rating: 4.6,
    reviews: 1587,
    image: sunflower,
    badges: ["Protein Rich", "Antioxidants", "Vitamin E"],
    description:
      "Nutty, buttery sunflower kernels. Roast, salt, or scatter into salads — protein delivered by the fistful.",
    origin: "Rajasthan, India",
    nutrition: [
      { label: "Protein", value: "21g / 100g" },
      { label: "Fibre", value: "8.6g" },
      { label: "Vitamin E", value: "35mg" },
      { label: "Energy", value: "584 kcal" },
    ],
    weights: [
      { label: "250g", value: "250", price: 199 },
      { label: "500g", value: "500", price: 349 },
      { label: "1kg", value: "1000", price: 599 },
    ],
  },
  {
    slug: "pumpkin-seeds",
    name: "Pumpkin Seeds",
    tagline: "Emerald-green pepitas, magnesium-loaded",
    category: "Seeds",
    price: 349,
    rating: 4.7,
    reviews: 923,
    image: pumpkin,
    badges: ["Protein Rich", "Magnesium", "Iron"],
    description:
      "Naturally-shelled pumpkin seeds with a snap of crunch and a mineral punch. Better sleep starts here.",
    origin: "Styria, Austria",
    nutrition: [
      { label: "Protein", value: "30g / 100g" },
      { label: "Magnesium", value: "592mg" },
      { label: "Iron", value: "8.8mg" },
      { label: "Energy", value: "559 kcal" },
    ],
    weights: [
      { label: "250g", value: "250", price: 349 },
      { label: "500g", value: "500", price: 649 },
    ],
    bestseller: true,
  },
  {
    slug: "dried-mango-slice",
    name: "Dried Mango Slices",
    tagline: "Sun-kissed Alphonso — chewy, glossy, obsessive",
    category: "Dried Fruits",
    price: 399,
    compareAt: 499,
    rating: 4.9,
    reviews: 2104,
    image: mango,
    badges: ["No Added Sugar", "Vitamin A", "Fibre Rich"],
    description:
      "Slow-dried Alphonso mango slices. Bright, tangy, unapologetically fruity. The kind of snack that gets rationed.",
    origin: "Ratnagiri, India",
    nutrition: [
      { label: "Fibre", value: "5g / 100g" },
      { label: "Vitamin A", value: "112 μg" },
      { label: "Vitamin C", value: "36mg" },
      { label: "Energy", value: "319 kcal" },
    ],
    weights: [
      { label: "150g", value: "150", price: 399 },
      { label: "300g", value: "300", price: 749 },
      { label: "500g", value: "500", price: 1199 },
    ],
    bestseller: true,
  },
  {
    slug: "dried-kiwi-slice",
    name: "Dried Kiwi Slices",
    tagline: "Tangy neon-green rounds, chewy and bright",
    category: "Dried Fruits",
    price: 449,
    rating: 4.8,
    reviews: 611,
    image: kiwi,
    badges: ["Vitamin C", "Antioxidants", "Fibre Rich"],
    description:
      "Kiwi slices dried at low temperature to preserve that iconic tartness. Snack, top a cheese board, or steep in tea.",
    origin: "Bay of Plenty, New Zealand",
    nutrition: [
      { label: "Vitamin C", value: "92mg / 100g" },
      { label: "Fibre", value: "6.7g" },
      { label: "Potassium", value: "312mg" },
      { label: "Energy", value: "285 kcal" },
    ],
    weights: [
      { label: "150g", value: "150", price: 449 },
      { label: "300g", value: "300", price: 849 },
    ],
    newArrival: true,
  },
  {
    slug: "dried-cranberries",
    name: "Dried Cranberries",
    tagline: "Ruby-red tart bursts, salad + granola gold",
    category: "Dried Fruits",
    price: 299,
    compareAt: 379,
    rating: 4.7,
    reviews: 1489,
    image: cranberry,
    badges: ["Antioxidants", "Vitamin C", "Immunity"],
    description:
      "Whole plump cranberries, lightly sweetened. Sharp, chewy, and impossible not to keep sprinkling into everything.",
    origin: "Wisconsin, USA",
    nutrition: [
      { label: "Vitamin C", value: "0.2mg / 100g" },
      { label: "Fibre", value: "5.7g" },
      { label: "Antioxidants", value: "High" },
      { label: "Energy", value: "308 kcal" },
    ],
    weights: [
      { label: "200g", value: "200", price: 299 },
      { label: "500g", value: "500", price: 649 },
    ],
  },
  {
    slug: "dried-pineapple",
    name: "Dried Pineapple",
    tagline: "Tropical sunshine, sliced and preserved",
    category: "Dried Fruits",
    price: 379,
    rating: 4.6,
    reviews: 528,
    image: pineapple,
    badges: ["Vitamin C", "Bromelain", "Fibre Rich"],
    description:
      "Sweet, chewy pineapple rings — a mid-afternoon holiday for your desk drawer.",
    origin: "Costa Rica",
    nutrition: [
      { label: "Vitamin C", value: "48mg / 100g" },
      { label: "Fibre", value: "4.1g" },
      { label: "Manganese", value: "0.9mg" },
      { label: "Energy", value: "347 kcal" },
    ],
    weights: [
      { label: "200g", value: "200", price: 379 },
      { label: "400g", value: "400", price: 699 },
    ],
    newArrival: true,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (cat: Product["category"]) =>
  products.filter((p) => p.category === cat);
