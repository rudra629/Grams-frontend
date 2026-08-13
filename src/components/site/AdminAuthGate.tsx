import { useState } from "react";
import { Lock, LogOut, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useAuthStore } from "@/lib/auth-store";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, ready, loginWithEmail, logout, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    // Connect to Django securely via your store
    const success = await loginWithEmail(email, password);
    
    if (success) {
      toast.success("Welcome to the command center");
    } else {
      // Pull the exact error message from Django
      const errorMessage = useAuthStore.getState().error;
      toast.error(errorMessage || "Invalid admin credentials");
    }
  }

  // Prevent flash of login screen if the app is still loading the token from memory
  if (!ready) return <div className="min-h-screen bg-muted/40" />;

  // If already logged in (via the main site or previous session), show the dashboard
  if (isAuthenticated) {
    return (
      <div className="relative">
        {children}
        {/* <button
          onClick={() => { logout(); toast("Signed out of admin"); }}
          className="fixed bottom-8 right-8 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card/90 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-terracotta hover:bg-terracotta/10 hover:border-terracotta transition-all shadow-lg"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 grid place-items-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 md:p-9 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-forest-deep text-gold grid place-items-center mb-5">
          <Lock className="w-5 h-5" />
        </div>
        <p className="text-xs tracking-[0.3em] uppercase text-gold">Grams · Admin</p>
        <h1 className="font-display text-3xl md:text-4xl text-forest-deep mt-1">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-2">Restricted area. Enter your administrator credentials.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="admin@grams.snack"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold transition"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="mt-1.5 relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm outline-none focus:border-gold transition"
                required
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-forest-deep hover:bg-gold-soft transition active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Enter dashboard"}
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-forest-deep" />
          <span>Secured by Django JWT Authentication. This gate is connected to the live database.</span>
        </div>
      </div>
    </div>
  );
}