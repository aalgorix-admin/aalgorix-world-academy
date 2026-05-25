import Link from "next/link";

type RevisionAlertRibbonProps = {
  count: number;
};

function assignmentLabel(count: number): string {
  return count === 1 ? "assignment" : "assignments";
}

export function RevisionAlertRibbon({ count }: RevisionAlertRibbonProps) {
  if (count <= 0) return null;

  return (
    <Link
      href="/student/notifications"
      className="group mt-5 block rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 shadow-sm transition-all duration-200 hover:border-rose-300 hover:bg-rose-100/80 active:scale-[0.995] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:px-5"
      aria-label={`Action required: ${count} ${assignmentLabel(count)} waiting for revision. Open notification feed.`}
    >
      <div className="flex items-start gap-3 sm:items-center">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200 transition-colors group-hover:bg-rose-200/80"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-rose-950 sm:text-base">
            Action Required: You have {count} {assignmentLabel(count)} waiting for
            revision
          </span>
          <span className="mt-0.5 block text-xs font-medium text-rose-800/90 sm:text-sm">
            Review instructor feedback and open your revision desk from the
            notification feed.
          </span>
        </span>

        <span
          className="hidden shrink-0 text-sm font-bold text-rose-800 transition-transform group-hover:translate-x-0.5 sm:inline"
          aria-hidden
        >
          View alerts →
        </span>
      </div>
    </Link>
  );
}
