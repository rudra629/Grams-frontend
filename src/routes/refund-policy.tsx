import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Return Policy | Grams" },
      { name: "description", content: "How refunds, replacements and returns work on Grams dry fruit, nut and seed orders." },
      { property: "og:title", content: "Refund & Return Policy | Grams" },
      { property: "og:description", content: "Freshness guaranteed — here's how we handle refunds and replacements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LegalPage
      eyebrow="Legal"
      title="Refund &"
      italic="return policy."
      intro="Food is personal. If a pouch doesn't land right, we'd rather fix it than argue about it. Here's exactly how our refunds and replacements work."
      updated="July 2026"
      sections={[
        {
          h: "Policy summary",
          body: [
            "At Grams, due to the perishable nature of our dry fruits, all sales are strictly non-refundable and non-returnable once dispatched. Orders cannot be cancelled or refunded for change of mind. We only offer replacements if an item arrives severely damaged or incorrect, provided you notify us within 24–48 hours of delivery with an unboxing video and clear photos. Unopened original packaging is required.",
          ],
        },
        {
          h: "Freshness guarantee",
          body: [
            "Every Grams pouch is nitrogen-flushed and packed in small batches. If your product arrives stale, rancid, damaged or past its best-before date, we will replace it or refund you in full — no shipping the product back required.",
            "Just email a photo of the pouch and batch code within 7 days of delivery.",
          ],
        },
        {
          h: "Eligibility window",
          body: [
            "Refund and replacement requests must be raised within 7 days of the delivery date recorded by our courier partner.",
            "Sealed, unopened pouches in original condition are eligible for return. Opened food products can only be refunded under the freshness guarantee for quality reasons.",
          ],
        },
        {
          h: "Non-returnable items",
          body: [
            "Custom-curated corporate and festive gift hampers, personalised packaging, and items purchased under clearance or final-sale offers are not eligible for return unless they arrive damaged or incorrect.",
          ],
        },
        {
          h: "How to raise a request",
          body: [
            "Write to support@grams.in with your order ID, the item concerned, and photos of the product and packaging. Our team responds within 24 hours on working days.",
            "Approved requests are processed immediately — you can choose a free replacement shipment or a refund to the original payment method.",
          ],
        },
        {
          h: "Refund timelines",
          body: [
            "Prepaid orders are refunded to the original payment method within 5–7 business days of approval. UPI and wallet refunds usually reflect faster.",
            "Cash-on-delivery orders are refunded via bank transfer once you share your account details, typically within 7 business days.",
            "Shipping fees are refunded only when the return is caused by an error on our side.",
          ],
        },
        {
          h: "Cancellations",
          body: [
            "Orders can be cancelled free of charge any time before they are handed to the courier — usually within 12 hours of placing the order.",
            "Once shipped, an order cannot be cancelled, but you can refuse delivery and we'll process a refund minus actual shipping cost.",
          ],
        },
      ]}
    />
  ),
});
