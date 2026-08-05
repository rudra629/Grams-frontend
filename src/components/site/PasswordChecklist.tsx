import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/password";

export function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="space-y-1.5 pt-1">
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(value);
        return (
          <li
            key={r.label}
            className={`flex items-center gap-2 text-xs transition-colors ${ok ? "text-gold" : "text-cream/45"}`}
          >
            <span
              className={`grid place-items-center w-4 h-4 rounded-full border transition-colors ${
                ok ? "border-gold bg-gold/15" : "border-white/20"
              }`}
            >
              {ok ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
            </span>
            {r.label}
          </li>
        );
      })}
    </ul>
  );
}
