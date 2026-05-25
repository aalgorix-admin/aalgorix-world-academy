type UploadProgressBarProps = {
  percent: number;
  label: string;
};

export function UploadProgressBar({ percent, label }: UploadProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(clamped)}%</span>
      </div>
      <div
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-[width] duration-150"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
