import { useEffect, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Zap, Coffee, ArrowRight } from "lucide-react";

export function ModeToggle() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCrunch = pathname.startsWith("/crunch");
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onChat = (e: Event) => setChatOpen(Boolean((e as CustomEvent).detail?.open));
    window.addEventListener("grams:chat-toggle", onChat as EventListener);
    return () => window.removeEventListener("grams:chat-toggle", onChat as EventListener);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("crunch-mode", isCrunch);
    return () => document.documentElement.classList.remove("crunch-mode");
  }, [isCrunch]);


  const handleClick = async () => {
    if (phase === "playing") return;
    if (!isCrunch && pathname !== "/") {
      await router.navigate({ to: "/" });
      await new Promise((r) => setTimeout(r, 300));
    }
    setPhase("playing");
    window.setTimeout(() => {
      router.navigate({ to: isCrunch ? "/" : "/crunch" });
    }, 800);
    window.setTimeout(() => setPhase("idle"), 1750);
  };

  const targetLabel = isCrunch ? "COZY" : "CRUNCH";
  const targetSub = isCrunch ? "Welcome home" : "Turn it up";

  const surfaceClass = isCrunch
    ? "bg-white/15 hover:bg-white/25 text-cream"
    : "bg-gray-900/70 hover:bg-gray-900/85 text-white/95";

  return (
    <>
      <div
        className={`group fixed z-[60] right-[clamp(14px,3vw,28px)] bottom-[clamp(14px,3vw,28px)] inline-flex rounded-full transition-all duration-300 ease-out group-hover:scale-[1.02] ${chatOpen ? "opacity-0 translate-y-6 pointer-events-none" : "opacity-100 translate-y-0"}`}
      >
        {/* Blurred glow layer — static, subtle at rest, brighter on hover */}
        <div
          aria-hidden
          className="absolute -inset-1 rounded-full opacity-40 group-hover:opacity-75 transition-opacity duration-500 blur-md pointer-events-none bg-[conic-gradient(from_0deg,#4285F4_0%,#EA4335_25%,#FBBC05_50%,#34A853_75%,#4285F4_100%)]"
        />
        {/* Crisp border layer (ring only via mask) — always visible and static */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none bg-[conic-gradient(from_0deg,#4285F4_0%,#EA4335_25%,#FBBC05_50%,#34A853_75%,#4285F4_100%)]"
          style={{
            padding: "2px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />

        {/* Inner glass button */}
        <button
          onClick={handleClick}
          aria-label={isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
          className={[
            "relative rounded-full backdrop-blur-md",
            "inline-flex items-center justify-center gap-2",
            "px-5 py-3 sm:px-6 sm:py-3.5",
            "text-[11px] sm:text-xs font-semibold uppercase tracking-widest",
            "shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)]",
            "transition-all duration-300 ease-out",
            "hover:scale-[1.02] active:scale-95",
            "focus-visible:outline-none",
            surfaceClass,
          ].join(" ")}
        >
          {isCrunch ? (
            <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-[-12deg]" />
          ) : (
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12" />
          )}
          <span>{isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 -ml-0.5 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
        </button>
      </div>

      {phase === "playing" && (
        <div className={`curtain-stage ${isCrunch ? "to-cozy" : "to-crunch"}`} aria-hidden>
          <div className="curtain curtain-top">
            <div className="curtain-grain" />
          </div>
          <div className="curtain-bottom-wrap">
            <div className="curtain curtain-bottom">
              <div className="curtain-grain" />
            </div>
          </div>
          <div className="curtain-center">
            <div className="curtain-eyebrow">
              <span>✦</span>
              <span>Entering</span>
              <span>✦</span>
            </div>
            <div className="curtain-word" data-text={targetLabel}>
              {targetLabel.split("").map((c, i) => (
                <span key={i} style={{ animationDelay: `${0.55 + i * 0.05}s` }}>{c}</span>
              ))}
            </div>
            <div className="curtain-sub">{targetSub}</div>
          </div>
        </div>
      )}
    </>
  );
}
