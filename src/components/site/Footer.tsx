import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";
import gramsLogo from "@/assets/Grams-logo.png";

export function Footer() {
  return (
    <footer className="mt-24 bg-forest-deep text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="container-x pt-20 pb-8 relative">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src={gramsLogo} alt="Grams" className="h-20 md:h-24 w-auto object-contain" />
            </Link>

            <p className="mt-5 max-w-sm text-cream/70 leading-relaxed">
              Beyond snack, it's a lifestyle. Small-batch dry fruits, seeds & nuts sourced from farms that give a damn.
            </p>
            <form className="mt-6 flex gap-2 max-w-sm">
              <div className="flex-1 flex items-center gap-2 bg-cream/10 border border-cream/20 rounded-full px-4">
                <Mail className="w-4 h-4 text-gold" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-transparent outline-none py-3 w-full text-sm placeholder:text-cream/50"
                />
              </div>
              <button className="rounded-full bg-gold text-forest-deep px-5 text-sm font-semibold hover:bg-gold-soft transition">
                Join
              </button>
            </form>
          </div>

          <FooterCol title="Shop" links={[
            { to: "/shop", label: "All Products" },
            { to: "/shop?cat=Nuts", label: "Nuts" },
            { to: "/shop?cat=Seeds", label: "Seeds" },
            { to: "/shop?cat=Dried+Fruits", label: "Dried Fruits" },
          ]} />
          <FooterCol title="Company" links={[
            { to: "/story", label: "Our Story" },
            { to: "/gifting", label: "Gifting" },
            { to: "/contact", label: "Contact" },
            { to: "/careers", label: "Work with us" },
            { to: "/profile", label: "My Account" },
            { to: "/admin", label: "Admin" },
          ]} />

          <FooterCol title="Support" links={[
            { to: "/contact", label: "Help Center" },
            { to: "/contact", label: "Shipping" },
            { to: "/refund-policy", label: "Refund Policy" },
            { to: "/contact", label: "FAQ" },
          ]} />
        </div>

        <div className="mt-14 pt-6 border-t border-cream/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Grams Foods Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold transition"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-gold transition"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-gold transition"><Youtube className="w-4 h-4" /></a>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="hover:text-gold transition">Privacy</Link>
            <Link to="/terms" className="hover:text-gold transition">Terms</Link>
            <Link to="/refund-policy" className="hover:text-gold transition">Refund Policy</Link>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-cream/10 text-center text-[11px] tracking-[0.2em] uppercase text-cream/45">
          Designed and developed by <span className="text-gold">Kelvora Infotech</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-lg text-gold mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm text-cream/75">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="hover:text-gold transition">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
