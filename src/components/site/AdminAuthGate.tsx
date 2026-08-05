import { useEffect, useState } from "react";
import { Lock, LogOut, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const KEY = "grams-admin-auth";
// Demo credentials (placeholder auth — replace with real auth later)
const DEMO_USER = "admin";
const DEMO_PASS = "grams2025";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try { setAuthed(sessionStorage.getItem(KEY) === "1"); } catch { /* ignore */ }
    setReady(true);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (userId.trim() === DEMO_USER && password === DEMO_PASS) {
      try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
      setAuthed(true);
      setError("");
      toast.success("Welcome back, admin");
    } else {
      setError("Invalid user ID or password");
    }
  }

  function logout() {
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
    setAuthed(false);
    setUserId(""); setPassword("");
  }

  if (!ready) return <div className="min-h-screen bg-muted/40" />;

  if (authed) {
    return (
      <div className="relative">
        {children}
        <button
          onClick={logout}
          className="fixed bottom-24 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2 text-sm font-medium hover:bg-muted transition"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
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
        <p className="text-sm text-muted-foreground mt-2">Restricted area. Enter your credentials to open the command center.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">User ID</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              placeholder="admin"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold transition"
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
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-terracotta">{error}</p>}

          <button type="submit" className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-forest-deep hover:bg-gold-soft transition">
            Enter dashboard
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
          <span>Demo credentials — user ID <b className="text-foreground">admin</b>, password <b className="text-foreground">grams2025</b>. Placeholder only; wire real auth before launch.</span>
        </div>
      </div>
    </div>
  );
}
