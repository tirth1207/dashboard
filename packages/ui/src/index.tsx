import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur", className)} {...props} />;
}

export function MetricCard({ label, value, detail, tone = "violet" }: { label: string; value: string; detail: string; tone?: "violet" | "emerald" | "sky" | "amber" | "rose" }) {
  const tones = { violet: "from-violet-400 to-fuchsia-400", emerald: "from-emerald-300 to-teal-400", sky: "from-sky-300 to-blue-400", amber: "from-amber-300 to-orange-400", rose: "from-rose-300 to-pink-400" };
  return (
    <Card>
      <p className="text-sm text-white/55">{label}</p>
      <div className={cn("mt-4 bg-gradient-to-r bg-clip-text text-4xl font-semibold tracking-tight text-transparent", tones[tone])}>{value}</div>
      <p className="mt-3 text-sm text-white/50">{detail}</p>
    </Card>
  );
}

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white/90", className)} {...props} />;
}
