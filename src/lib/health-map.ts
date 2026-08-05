// Rule-based mapping from health issue → recommendation
// Slugs must exist in src/lib/products.ts

export type HealthIssue = {
  id: string;
  label: string;
  emoji: string;
  explanation: string;
  recommendedSlugs: string[];
};

export const HEALTH_ISSUES: HealthIssue[] = [
  {
    id: "memory",
    label: "Memory & focus",
    emoji: "🧠",
    explanation:
      "Walnuts are packed with omega-3 ALA that supports brain cell membranes, and hazelnuts add vitamin E — a combo shown to help sharpen recall and focus during long work days.",
    recommendedSlugs: ["walnut-whole-california", "hazelnuts-premium", "pecan-nuts"],
  },
  {
    id: "digestion",
    label: "Poor digestion",
    emoji: "🌿",
    explanation:
      "Dried pineapple carries bromelain, an enzyme that helps break down proteins, while cranberries add fibre and prebiotic polyphenols that keep your gut microbes happy.",
    recommendedSlugs: ["dried-pineapple", "dried-cranberries", "dried-kiwi-slice"],
  },
  {
    id: "skin",
    label: "Skin & glow",
    emoji: "✨",
    explanation:
      "Sunflower seeds are one of the richest natural sources of vitamin E, which protects skin cells from oxidative stress. Macadamias add palmitoleic acid — great for skin barrier lipids.",
    recommendedSlugs: ["sunflower-seeds", "macadamia-nuts", "dried-mango-slice"],
  },
  {
    id: "energy",
    label: "Low energy",
    emoji: "⚡",
    explanation:
      "Dried mango and cranberries deliver clean, quick natural sugars with fibre so the release is steady — no 3pm crash. Perfect fuel between meals.",
    recommendedSlugs: ["dried-mango-slice", "dried-cranberries", "dried-pineapple"],
  },
  {
    id: "recovery",
    label: "Workout recovery",
    emoji: "🏋️",
    explanation:
      "Pumpkin seeds are loaded with magnesium (helps muscle relaxation) and zinc (protein synthesis). Pecans add antioxidants that ease post-workout inflammation.",
    recommendedSlugs: ["pumpkin-seeds", "pecan-nuts", "walnut-whole-california"],
  },
  {
    id: "sleep",
    label: "Better sleep",
    emoji: "🌙",
    explanation:
      "Walnuts naturally contain melatonin, and pumpkin seeds are a top source of magnesium — both nudge your body toward deeper, calmer sleep cycles.",
    recommendedSlugs: ["walnut-whole-california", "pumpkin-seeds"],
  },
  {
    id: "immunity",
    label: "Immunity",
    emoji: "🛡️",
    explanation:
      "Dried kiwi is bursting with vitamin C, cranberries bring polyphenol antioxidants, and hazelnuts round it out with immune-supporting vitamin E.",
    recommendedSlugs: ["dried-kiwi-slice", "dried-cranberries", "hazelnuts-premium"],
  },
  {
    id: "heart",
    label: "Heart health",
    emoji: "❤️",
    explanation:
      "Macadamias and walnuts are rich in monounsaturated and omega-3 fats that support healthy cholesterol. A small handful daily is a cardiologist's favourite habit.",
    recommendedSlugs: ["macadamia-nuts", "walnut-whole-california", "hazelnuts-premium"],
  },
];

// Simple keyword matcher for free-text answers
export function matchIssue(text: string): HealthIssue | null {
  const t = text.toLowerCase();
  const rules: { keys: string[]; id: string }[] = [
    { keys: ["memory", "focus", "brain", "concentrat", "study"], id: "memory" },
    { keys: ["digest", "gut", "stomach", "bloat", "constipa", "acidity"], id: "digestion" },
    { keys: ["skin", "glow", "acne", "hair", "beauty"], id: "skin" },
    { keys: ["energy", "tired", "fatigue", "slump", "lazy", "weak"], id: "energy" },
    { keys: ["workout", "gym", "muscle", "recover", "protein", "cramp"], id: "recovery" },
    { keys: ["sleep", "insomnia", "rest", "melatonin"], id: "sleep" },
    { keys: ["immun", "cold", "flu", "sick", "vitamin c"], id: "immunity" },
    { keys: ["heart", "cholesterol", "bp", "blood pressure", "cardio"], id: "heart" },
  ];
  for (const r of rules) if (r.keys.some((k) => t.includes(k))) return HEALTH_ISSUES.find((i) => i.id === r.id) ?? null;
  return null;
}
