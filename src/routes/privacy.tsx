import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Grams" },
      { name: "description", content: "What data Grams collects, why we collect it, and the control you have over it." },
      { property: "og:title", content: "Privacy Policy | Grams" },
      { property: "og:description", content: "Your data, handled with the same care as our produce." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LegalPage
      eyebrow="Legal"
      title="Privacy"
      italic="policy."
      intro="We handle your data with the same care we handle our produce — minimally processed, never resold, always traceable."
      updated="July 2026"
      sections={[
        {
          h: "Policy summary",
          body: [
            "Grams respects your privacy and collects only necessary information—such as your name, delivery address, phone number, email, and payment details—strictly to process orders, fulfill shipments, and provide customer support. We do not sell your data, and share it only with trusted logistics partners required to deliver your packages.",
          ],
        },
        {
          h: "What we collect",
          body: [
            "Account details you give us: name, email, phone number and delivery addresses.",
            "Order details: what you bought, when, and how you paid (we never store full card numbers — payments are handled by our PCI-compliant payment partners).",
            "Usage data: pages viewed, device type and approximate location, used to improve the store experience.",
          ],
        },
        {
          h: "Why we use it",
          body: [
            "To process and deliver your orders, send order updates, handle support requests, and prevent fraud.",
            "To personalise product recommendations and, if you opt in, send occasional offers. You can unsubscribe from any marketing email in one click.",
          ],
        },
        {
          h: "Who we share it with",
          body: [
            "Only with the partners needed to run the store: courier and logistics providers, payment gateways, and email/SMS delivery services.",
            "We never sell, rent or trade your personal data to third parties for their own marketing.",
          ],
        },
        {
          h: "Cookies",
          body: [
            "We use essential cookies to keep your cart and session working, and analytics cookies to understand how the store is used. You can block non-essential cookies in your browser without breaking checkout.",
          ],
        },
        {
          h: "Data retention & security",
          body: [
            "Order records are retained as long as required for tax and accounting compliance. Marketing preferences are kept until you withdraw consent.",
            "All data is transmitted over encrypted connections and stored with access limited to staff who need it.",
          ],
        },
        {
          h: "Your rights",
          body: [
            "You can request a copy of your data, ask for corrections, or ask us to delete your account entirely. Write to privacy@grams.in and we'll action verified requests within 30 days.",
          ],
        },
      ]}
    />
  ),
});
