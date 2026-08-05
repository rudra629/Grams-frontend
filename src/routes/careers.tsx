import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Upload, Briefcase, Sparkles, Heart, Coffee, CheckCircle2, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { useSite } from "@/lib/site-store";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Work with us — Grams" },
      { name: "description", content: "Join the Grams crew. We're building a snack brand people actually care about." },
      { property: "og:title", content: "Work with us — Grams" },
      { property: "og:description", content: "Join the Grams crew. We're building a snack brand people actually care about." },
    ],
  }),
  component: Careers,
});

function Careers() {
  const { addApplication } = useSite();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<{ name: string; dataUrl: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setResume({ name: f.name, dataUrl: String(reader.result) });
    reader.readAsDataURL(f);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !resume) {
      toast.error("Fill all fields and attach your resume");
      return;
    }
    addApplication({
      name: name.trim(),
      email: email.trim(),
      resumeName: resume.name,
      resumeDataUrl: resume.dataUrl,
      message: message.trim() || undefined,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container-x py-20 md:py-32">
        <div className="max-w-xl mx-auto text-center rounded-3xl bg-card border border-border p-10 md:p-14">
          <div className="w-16 h-16 rounded-full bg-forest-deep/10 grid place-items-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-forest-deep" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-forest-deep">Application in!</h1>
          <p className="mt-4 text-muted-foreground">Thanks {name.split(" ")[0]} — we'll comb through your resume and email you within a week.</p>
          <button
            onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); setResume(null); }}
            className="mt-8 rounded-full bg-forest-deep text-cream px-6 py-3 text-sm font-semibold hover:bg-forest transition"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-14 md:py-20">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Careers · Grams</p>
          <h1 className="font-display text-5xl md:text-7xl text-forest-deep leading-[0.95]">
            Work with <em className="italic text-gold">us</em>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            We're a small crew obsessed with sourcing, design, and stories that make snacks feel less like snacks and more like a lifestyle.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Briefcase, title: "Real ownership", desc: "Ship things end-to-end. No committees." },
              { icon: Sparkles, title: "Craft-first culture", desc: "Design and taste beat busywork." },
              { icon: Heart, title: "People we like", desc: "Kind, curious, allergic to ego." },
              { icon: Coffee, title: "Endless snacks", desc: "Obviously." },
            ].map((p) => (
              <div key={p.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-forest-deep/10 grid place-items-center shrink-0">
                  <p.icon className="w-5 h-5 text-forest-deep" />
                </div>
                <div>
                  <p className="font-semibold text-forest-deep">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl bg-card border border-border p-6 md:p-10 space-y-5">
          <div>
            <p className="font-display text-2xl md:text-3xl text-forest-deep">Drop your details</p>
            <p className="text-sm text-muted-foreground mt-1">One form. We read every single one.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-forest-deep uppercase tracking-wider">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="mt-2 w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm outline-none focus:border-forest-deep transition"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-forest-deep uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              className="mt-2 w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm outline-none focus:border-forest-deep transition"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-forest-deep uppercase tracking-wider">Tell us anything (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={800}
              rows={4}
              className="mt-2 w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm outline-none focus:border-forest-deep transition resize-none"
              placeholder="Role you're eyeing, a link, a hot take…"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-forest-deep uppercase tracking-wider">Resume (PDF)</label>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            {!resume ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 w-full rounded-xl border-2 border-dashed border-border hover:border-forest-deep hover:bg-muted/50 transition px-4 py-8 flex flex-col items-center gap-2 text-muted-foreground"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">Click to attach PDF</span>
                <span className="text-xs">Max 5MB</span>
              </button>
            ) : (
              <div className="mt-2 rounded-xl bg-forest-deep/5 border border-forest-deep/20 px-4 py-3 flex items-center gap-3">
                <FileText className="w-5 h-5 text-forest-deep shrink-0" />
                <span className="text-sm text-forest-deep font-medium truncate flex-1">{resume.name}</span>
                <button
                  type="button"
                  onClick={() => { setResume(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="w-7 h-7 rounded-full hover:bg-forest-deep/10 grid place-items-center transition"
                >
                  <X className="w-4 h-4 text-forest-deep" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-forest-deep text-cream px-6 py-4 text-sm font-semibold hover:bg-forest active:scale-[0.98] transition"
          >
            Send application
          </button>
        </form>
      </div>
    </div>
  );
}
