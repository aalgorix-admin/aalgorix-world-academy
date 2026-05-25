"use client";

type PrintTranscriptButtonProps = {
  className?: string;
};

export function PrintTranscriptButton({ className = "" }: PrintTranscriptButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold tracking-tight text-white shadow-lg shadow-indigo-600/25 transition-transform duration-200 hover:scale-[1.03] hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.98] ${className}`}
    >
      Print or Export Transcript to PDF
    </button>
  );
}
