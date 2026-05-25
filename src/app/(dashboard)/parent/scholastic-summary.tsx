import type { ScholasticSummary } from "./types";

type ScholasticSummaryProps = {
  summary: ScholasticSummary;
  learnerName: string;
};

function SummaryTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "indigo" | "emerald" | "amber" | "rose";
}) {
  const accentRing: Record<typeof accent, string> = {
    indigo: "ring-indigo-200/80",
    emerald: "ring-emerald-200/80",
    amber: "ring-amber-200/80",
    rose: "ring-rose-200/80",
  };

  const accentValue: Record<typeof accent, string> = {
    indigo: "text-indigo-700",
    emerald: "text-emerald-700",
    amber: "text-amber-800",
    rose: "text-rose-700",
  };

  return (
    <div
      className={`rounded-2xl border border-slate-900/10 bg-white p-5 shadow-sm ring-2 ring-inset ${accentRing[accent]}`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-extrabold tabular-nums tracking-tight ${accentValue[accent]}`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{hint}</p>
    </div>
  );
}

export function ScholasticSummaryPanel({ summary, learnerName }: ScholasticSummaryProps) {
  const averageDisplay =
    summary.averageGrade != null ? `${summary.averageGrade}%` : "—";

  return (
    <section aria-labelledby="scholastic-summary-heading">
      <h2
        id="scholastic-summary-heading"
        className="text-sm font-bold uppercase tracking-widest text-slate-500"
      >
        Scholastic summary · {learnerName}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          label="Course completion"
          value={`${summary.completionPercent}%`}
          hint="Average lesson progress across active enrollments"
          accent="indigo"
        />
        <SummaryTile
          label="Assignments submitted"
          value={String(summary.assignmentsSubmitted)}
          hint="Homework handed in (excluding drafts)"
          accent="amber"
        />
        <SummaryTile
          label="Average numeric grade"
          value={averageDisplay}
          hint="Mean score across graded submissions (0–100)"
          accent="emerald"
        />
        <SummaryTile
          label="Pending revisions"
          value={String(summary.pendingRevisions)}
          hint="Teacher returned work awaiting student resubmission"
          accent="rose"
        />
      </div>
    </section>
  );
}
