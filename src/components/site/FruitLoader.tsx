export function FruitLoader({ label = "Picking the freshest bites…" }: { label?: string }) {
  const fruits = ["🥭", "🫐", "🌰", "🥜", "🍇"];
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <div className="fruit-loader" aria-hidden>
        <div className="fruit-loader-ring">
          {fruits.map((f, i) => (
            <span key={i} className="fruit-loader-item" style={{ ["--i" as string]: i, ["--n" as string]: fruits.length } as React.CSSProperties}>
              {f}
            </span>
          ))}
        </div>
        <div className="fruit-loader-core" />
      </div>
      <p className="text-sm text-forest-deep/70 italic" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18 }}>
        {label}
      </p>
    </div>
  );
}
