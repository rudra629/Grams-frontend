import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import lifestyle from "@/assets/lifestyle-1.jpg";
import { useAuth } from "@/lib/auth-store";
import { isPasswordValid } from "@/lib/password";
import { PasswordChecklist } from "@/components/site/PasswordChecklist";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Grams" },
      { name: "description", content: "Reset your Grams account password with a one-time code sent to your email." },
      { property: "og:title", content: "Reset your password — Grams" },
      { property: "og:description", content: "Verify with a one-time code and set a new password for your Grams account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPassword,
});

const OTP_TTL = 10 * 60 * 1000;

function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [code, setCode] = useState<{ value: string; at: number } | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const issue = (mail: string) => {
    const value = String(Math.floor(100000 + Math.random() * 900000));
    setCode({ value, at: Date.now() });
    toast.success(`Demo OTP for ${mail}: ${value}`, { duration: 12000 });
  };

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return toast.error("Enter a valid email address");
    issue(mail);
    setOtp("");
    setStep("otp");
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return toast.error("Request a new code");
    if (Date.now() - code.at > OTP_TTL) return toast.error("That code expired — request a new one");
    if (otp.trim() !== code.value) return toast.error("Incorrect code. Try again.");
    setStep("reset");
  };

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(password))
      return toast.error("Password needs 6+ characters, a number and a special character");
    if (password !== confirm) return toast.error("Passwords don't match");
    signIn(email.trim(), password);
    toast.success("Password updated — you're signed in");
    navigate({ to: "/profile", replace: true });
  };

  return (
    <div className="min-h-[80vh] container-x py-12 grid lg:grid-cols-2 gap-10 items-center">
      <div className="hidden lg:block relative rounded-3xl overflow-hidden">
        <img src={lifestyle} alt="" className="w-full aspect-[4/5] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 to-forest-deep/20" />
        <div className="absolute bottom-8 left-8 right-8 text-cream">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">Locked out?</p>
          <h2 className="mt-3 font-display text-5xl leading-none">
            Back to
            <br />
            <span className="italic">your pantry.</span>
          </h2>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
        <Link to="/auth" className="inline-flex items-center gap-2 text-xs text-cream/60 hover:text-gold transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>

        <h1 className="mt-4 font-display italic text-4xl text-cream">
          {step === "email" ? "Forgot password." : step === "otp" ? "Check your inbox." : "New password."}
        </h1>
        <p className="text-cream/60 mt-1 text-sm">
          {step === "email"
            ? "Enter your email and we'll send a one-time code."
            : step === "otp"
              ? `We sent a 6-digit code to ${email}.`
              : "Choose a strong password you'll remember."}
        </p>

        {step === "email" && (
          <form className="mt-6 space-y-3" onSubmit={sendOtp}>
            <IconField
              icon={Mail}
              placeholder="Email address"
              type="email"
              value={email}
              maxLength={120}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="w-full rounded-full bg-gold text-forest-deep py-3.5 text-sm font-semibold hover:bg-gold-soft transition">
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form className="mt-6 space-y-3" onSubmit={verifyOtp}>
            <IconField
              icon={KeyRound}
              placeholder="6-digit code"
              inputMode="numeric"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            <button type="submit" className="w-full rounded-full bg-gold text-forest-deep py-3.5 text-sm font-semibold hover:bg-gold-soft transition">
              Verify code
            </button>
            <div className="flex items-center justify-between text-xs text-cream/55 pt-1">
              <button type="button" onClick={() => setStep("email")} className="hover:text-gold transition">
                Change email
              </button>
              <button type="button" onClick={() => issue(email.trim())} className="hover:text-gold transition">
                Resend code
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form className="mt-6 space-y-3" onSubmit={resetPassword}>
            <IconField
              icon={Lock}
              placeholder="New password"
              type="password"
              value={password}
              maxLength={64}
              onChange={(e) => setPassword(e.target.value)}
            />
            <IconField
              icon={Lock}
              placeholder="Confirm new password"
              type="password"
              value={confirm}
              maxLength={64}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <PasswordChecklist value={password} />
            <button type="submit" className="w-full rounded-full bg-gold text-forest-deep py-3.5 text-sm font-semibold hover:bg-gold-soft transition">
              Set new password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function IconField({
  icon: Icon,
  ...rest
}: { icon: React.ComponentType<{ className?: string }> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5">
      <Icon className="w-4 h-4 text-cream/50" />
      <input {...rest} className="flex-1 bg-transparent outline-none py-3.5 text-sm text-cream placeholder:text-cream/40" />
    </div>
  );
}
