import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import lifestyle from "@/assets/lifestyle-1.jpg";
import { useAuth, takePendingAction } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { isPasswordValid } from "@/lib/password";
import { PasswordChecklist } from "@/components/site/PasswordChecklist";


export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in — Grams" }, { name: "description", content: "Sign in or create your Grams account." }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const { addDirect: addCart } = useCart();
  const { addDirect } = useWishlist();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const finish = () => {
    const pending = takePendingAction();
    if (pending?.type === "cart") {
      addCart(pending.item);
      toast.success(`${pending.item.name} added to your cart`);
    } else if (pending?.type === "wishlist") {
      addDirect(pending.slug);
      toast.success("Saved to your wishlist");
    }
    const to = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/profile";
    navigate({ to, replace: true });
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return toast.error("Enter a valid email address");
    if (mode === "signup" && !isPasswordValid(password))
      return toast.error("Password needs 6+ characters, a number and a special character");
    if (mode === "signin" && password.length < 6) return toast.error("Password must be at least 6 characters");
    if (mode === "signup" && name.trim().length < 2) return toast.error("Enter your full name");
    if (mode === "signup") signUp(name, mail, password);
    else signIn(mail, password);
    toast.success(mode === "signin" ? "Welcome back!" : "Account created");
    setTimeout(finish, 0);
  };


  const handleGoogle = () => {
    signInWithGoogle();
    toast.success("Signed in with Google");
    setTimeout(finish, 0);
  };

  return (
    <div className="min-h-[80vh] container-x py-12 grid lg:grid-cols-2 gap-10 items-center">
      <div className="hidden lg:block relative rounded-3xl overflow-hidden">
        <img src={lifestyle} alt="" className="w-full aspect-[4/5] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 to-forest-deep/20" />
        <div className="absolute bottom-8 left-8 right-8 text-cream">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">Welcome back</p>
          <h2 className="mt-3 font-display text-5xl leading-none">Snacks<br /><span className="italic">await.</span></h2>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
        {user ? (
          <div className="text-center py-6">
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Signed in</p>
            <h1 className="mt-3 font-display italic text-4xl text-cream">Hey, {user.name.split(" ")[0]}.</h1>
            <p className="text-cream/60 mt-2 text-sm">{user.email}</p>
            <div className="mt-8 space-y-2.5">
              <Link to="/profile" className="block w-full rounded-full bg-gold text-forest-deep py-3.5 text-sm font-semibold hover:bg-gold-soft transition">
                Go to my account
              </Link>
              <button
                onClick={() => { signOut(); toast("Signed out"); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/15 py-3.5 text-sm font-semibold text-cream hover:bg-white/[0.08] transition"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 p-1 rounded-full bg-white/[0.05] mb-6">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${mode === m ? "bg-gold text-forest-deep" : "text-cream/70 hover:text-cream"}`}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <h1 className="font-display italic text-4xl text-cream">
              {mode === "signin" ? "Welcome back." : "Join the pantry."}
            </h1>
            <p className="text-cream/60 mt-1 text-sm">
              {mode === "signin" ? "Pick up where you left off." : "10% off your first order, always."}
            </p>

            <div className="mt-6">
              <button
                onClick={handleGoogle}
                className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-cream text-forest-deep py-3.5 text-sm font-semibold hover:bg-white transition"
              >
                <GoogleIcon /> Continue with Google
              </button>
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-cream/40">Or with email</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            <form className="space-y-3" onSubmit={handleEmail}>
              {mode === "signup" && (
                <IconField icon={User} placeholder="Full name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
              )}
              <IconField icon={Mail} placeholder="Email address" type="email" value={email} maxLength={120} onChange={(e) => setEmail(e.target.value)} />
              <IconField icon={Lock} placeholder="Password" type="password" value={password} maxLength={64} onChange={(e) => setPassword(e.target.value)} />
              {mode === "signup" && <PasswordChecklist value={password} />}
              {mode === "signin" && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs text-cream/60 hover:text-gold transition">
                    Forgot password?
                  </Link>
                </div>
              )}
              <button type="submit" className="w-full rounded-full bg-gold text-forest-deep py-3.5 text-sm font-semibold hover:bg-gold-soft transition">
                {mode === "signin" ? "Sign in" : "Register"}
              </button>

            </form>

            <p className="mt-6 text-center text-xs text-cream/50">
              By continuing, you agree to our <Link to="/terms" className="underline hover:text-gold">Terms</Link> and <Link to="/privacy" className="underline hover:text-gold">Privacy</Link>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function IconField({ icon: Icon, ...rest }: { icon: React.ComponentType<{ className?: string }> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5">
      <Icon className="w-4 h-4 text-cream/50" />
      <input {...rest} className="flex-1 bg-transparent outline-none py-3.5 text-sm text-cream placeholder:text-cream/40" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-4 h-4" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.2 0 6 .9 8.3 2.6l6.2-6.2C34.4 2.3 29.6 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.2 5.6C11.5 13.1 17.3 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.6c0-1.5-.1-2.9-.4-4.3H24v8.2h12.7c-.6 3-2.3 5.5-4.9 7.2l7.5 5.8c4.4-4 7.2-10 7.2-16.9z"/>
      <path fill="#FBBC05" d="M9.8 28.6c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.2-5.6C1 16.8 0 20.3 0 24s1 7.2 2.6 10.4l7.2-5.8z"/>
      <path fill="#34A853" d="M24 48c6.5 0 12-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.7 0-12.5-3.6-14.6-9.4l-7.2 5.6C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
