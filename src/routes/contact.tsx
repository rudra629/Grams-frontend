import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, MessageCircle, Send, Clock } from "lucide-react";
import { useState } from "react";
import { useSite } from "@/lib/site-store";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Grams" },
      { name: "description", content: "Get in touch with the Grams team. We reply within 24 hours." },
      { property: "og:title", content: "Contact — Grams" },
      { property: "og:description", content: "Questions, bulk orders, collabs. We're here." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const { contact, t } = useSite();
  return (
    <div>
      <section className="bg-forest-deep text-cream py-16 md:py-24">
        <div className="container-x">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">{t("contact.eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">{t("contact.title")} <span className="italic">{t("contact.titleItalic")}</span></h1>
          <p className="mt-4 max-w-xl text-cream/70">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="container-x py-16 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-4">
          <Card icon={<Mail />} title="Email" lines={contact.emails} />
          <Card icon={<Phone />} title="Phone" lines={contact.phones} />
          <Card icon={<MapPin />} title="HQ" lines={contact.address} />
          <Card icon={<Clock />} title="Response Time" lines={contact.hours} />

          <div className="rounded-2xl bg-forest-deep text-cream p-6">
            <p className="font-display text-2xl">Follow along</p>
            <div className="mt-4 flex gap-2">
              <a href="#" className="flex-1 rounded-full bg-cream/10 hover:bg-cream/20 p-4 grid place-items-center"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="flex-1 rounded-full bg-cream/10 hover:bg-cream/20 p-4 grid place-items-center"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="flex-1 rounded-full bg-cream/10 hover:bg-cream/20 p-4 grid place-items-center"><Send className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-3xl bg-card border border-border p-8 md:p-10"
        >
          <h2 className="font-display text-3xl text-forest-deep">Drop us a line</h2>
          <p className="text-sm text-muted-foreground mt-1">We read every message. Really.</p>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Field label="First name" placeholder="Riya" />
            <Field label="Last name" placeholder="Sharma" />
            <Field label="Email" type="email" placeholder="you@grams.snack" wide />
            <Field label="Subject" placeholder="Bulk order for office" wide />
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea rows={6} placeholder="Tell us everything…" className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-forest-deep resize-none" />
          </div>

          <button type="submit" className="mt-6 w-full rounded-full bg-forest-deep text-cream py-4 text-sm font-semibold hover:bg-forest transition inline-flex items-center justify-center gap-2">
            {sent ? "✓ Message sent" : (<>Send message <Send className="w-4 h-4" /></>)}
          </button>
        </form>
      </section>

      {/* FAQ */}
      <section className="container-x py-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">FAQ</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl text-forest-deep">The quick answers.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            { q: "How fresh is the product?", a: "Every pouch is packed within 14 days of harvest/roast, nitrogen-flushed and vacuum-sealed." },
            { q: "Do you ship pan-India?", a: "Yes — free shipping over ₹899, otherwise ₹49 flat. 2-5 business days depending on your city." },
            { q: "Is there a return policy?", a: "If your product arrives damaged or stale, we refund or replace within 7 days. No questions." },
            { q: "Do you do bulk / gifting orders?", a: "Absolutely. Email wholesale@grams.snack — we do corporate hampers, weddings, and Diwali drops." },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card p-6 open:shadow-card">
              <summary className="cursor-pointer font-display text-xl text-forest-deep flex justify-between items-center list-none">
                {f.q}
                <span className="text-gold text-2xl group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="w-11 h-11 rounded-full bg-forest-deep text-gold grid place-items-center shrink-0">{icon}</div>
      <div>
        <p className="font-display text-xl text-forest-deep">{title}</p>
        {lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
      </div>
    </div>
  );
}

function Field({ label, wide, ...rest }: { label: string; wide?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input {...rest} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-forest-deep" />
    </div>
  );
}
