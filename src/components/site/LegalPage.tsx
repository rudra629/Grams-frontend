type Section = { h: string; body: string[] };

export function LegalPage({
  eyebrow,
  title,
  italic,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  intro: string;
  updated: string;
  sections: Section[];
}) {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10" style={{ background: "linear-gradient(180deg, #0a0a0c 0%, #131114 100%)" }}>
        <div className="absolute -top-24 -left-16 w-[360px] h-[360px] rounded-full bg-gold/10 blur-[130px] pointer-events-none" />
        <div className="container-x relative py-20 md:py-28 text-cream">
          <p className="text-xs tracking-[0.3em] uppercase text-gold">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.92] max-w-3xl">
            {title} <span className="italic text-gold">{italic}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/75 leading-relaxed">{intro}</p>
          <p className="mt-6 text-xs tracking-[0.25em] uppercase text-cream/40">Last updated · {updated}</p>
        </div>
      </section>

      <section className="container-x py-14 md:py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((s, i) => (
            <div key={s.h} className="rounded-2xl border border-white/[0.08] p-6 md:p-8" style={{ background: "linear-gradient(145deg, rgba(26,23,25,0.65) 0%, rgba(19,17,20,0.65) 100%)" }}>
              <p className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-2xl md:text-3xl text-cream">{s.h}</h2>
              <div className="mt-3 space-y-3 text-cream/70 leading-relaxed">
                {s.body.map((p, j) => <p key={j}>{p}</p>)}
              </div>
            </div>
          ))}
          <p className="text-sm text-cream/50">
            Questions about this policy? Write to us at hello@grams.in and we'll get back within 24 hours.
          </p>
        </div>
      </section>
    </div>
  );
}
