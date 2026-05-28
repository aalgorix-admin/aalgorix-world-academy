"use client";

import { useCallback, useMemo, useState } from "react";

type BrochureModalCtaProps = {
  className: string;
};

export function BrochureModalCta({ className }: BrochureModalCtaProps) {
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (!name.trim()) return false;
    if (!email.trim()) return false;
    if (!phone.trim()) return false;
    return true;
  }, [email, isSubmitting, name, phone]);

  const closeModal = useCallback(() => {
    setBrochureOpen(false);
    setIsSubmitting(false);
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
  }, []);

  const openModal = useCallback(() => {
    setBrochureOpen(true);
    setSubmitted(false);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!canSubmit) return;

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/brochure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send brochure email.");
        }

        setSubmitted(true);
      } catch {
        // Keep UI minimal and premium: treat failure as non-blocking and allow retry.
      } finally {
        setIsSubmitting(false);
      }
    },
    [canSubmit, email, name, phone],
  );

  return (
    <>
      <a
        href="#how-it-works"
        className={className}
        onClick={(event) => {
          event.preventDefault();
          openModal();
        }}
      >
        Get the Brochure →
      </a>

      {brochureOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Request brochure"
          onClick={closeModal}
        >
          <div
            className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 backdrop-blur-xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close modal"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.98]"
              onClick={closeModal}
            >
              ✕
            </button>

            {submitted ? (
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Brochure Dispatched
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
                  Check Your Inbox
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Your digital academy brochure has been dispatched safely.
                </p>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Request the Brochure
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
                  Get the Aalgorix World Academy Prospectus
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Enter your details and we’ll email the brochure immediately.
                </p>

                <div className="mt-7 space-y-4">
                  <label className="block">
                    <span className="text-xs font-semibold text-white/80">Full Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-indigo-300/60 focus:ring-2 focus:ring-indigo-300/30"
                      placeholder="Name"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-white/80">Email Address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-indigo-300/60 focus:ring-2 focus:ring-indigo-300/30"
                      placeholder="name@domain.com"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-white/80">Contact Number</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-indigo-300/60 focus:ring-2 focus:ring-indigo-300/30"
                      placeholder="+91 9876543210"
                      required
                    />
                  </label>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] ${
                      !canSubmit ? "opacity-60 pointer-events-none" : ""
                    }`}
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Sending…" : "Send Brochure"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

