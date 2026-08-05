import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Grams" },
      { name: "description", content: "The terms that govern your use of the Grams store, orders, pricing and deliveries." },
      { property: "og:title", content: "Terms & Conditions | Grams" },
      { property: "og:description", content: "Straightforward terms for buying dry fruits, nuts and seeds from Grams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LegalPage
      eyebrow="Legal"
      title="Terms &"
      italic="conditions."
      intro="Plain-language terms for shopping with Grams. By placing an order you agree to everything below."
      updated="July 2026"
      sections={[
        {
          h: "Policy summary",
          body: [
            "Welcome to Grams. By using our website and purchasing our dry fruit products, you agree to these terms. Because our products are natural agricultural goods, minor batch-to-batch variations in size, color, or taste may occur. All prices include applicable taxes where required and are subject to change without notice. Grams is not liable for delivery delays caused by third-party courier partners or improper customer storage post-delivery.",
          ],
        },
        {
          h: "Using this store",
          body: [
            "You must be at least 18 years old, or shopping with the consent of a parent or guardian, to place an order.",
            "You agree to provide accurate delivery and contact information. We are not responsible for failed deliveries caused by incorrect addresses.",
          ],
        },
        {
          h: "Products & descriptions",
          body: [
            "Dry fruits and nuts are natural products — colour, size and texture vary batch to batch. Product photos are indicative.",
            "Nutritional values are typical averages. Our facility handles tree nuts, peanuts and seeds; if you have a severe allergy, please exercise caution.",
          ],
        },
        {
          h: "Pricing & payment",
          body: [
            "All prices are listed in Indian Rupees and are inclusive of applicable taxes unless stated otherwise.",
            "We reserve the right to correct pricing errors and to cancel any order placed at an incorrectly listed price, with a full refund.",
          ],
        },
        {
          h: "Coupons & offers",
          body: [
            "Discount codes are single-use per customer unless stated otherwise, cannot be combined, and may be withdrawn at any time.",
            "Offers are void where abused, resold, or applied through automated means.",
          ],
        },
        {
          h: "Shipping & delivery",
          body: [
            "Orders are typically dispatched within 24–48 hours on working days. Delivery estimates are indicative and depend on courier partners.",
            "Risk in the goods passes to you on delivery. Please inspect packaging at the time of receipt.",
          ],
        },
        {
          h: "Intellectual property",
          body: [
            "All content on this site — photography, copy, logos and design — belongs to Grams and may not be reproduced without written permission.",
          ],
        },
        {
          h: "Liability & governing law",
          body: [
            "Our liability for any order is limited to the value of that order. We are not liable for indirect or consequential losses.",
            "These terms are governed by the laws of India, with exclusive jurisdiction in the courts of Mumbai, Maharashtra.",
          ],
        },
      ]}
    />
  ),
});
