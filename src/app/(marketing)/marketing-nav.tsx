"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRef } from "react";

type NavLink = Readonly<{
  href: string;
  label: string;
}>;

type NavNode =
  | Readonly<{
      type: "dropdown";
      id: string;
      label: string;
      items: ReadonlyArray<NavLink>;
    }>
  | Readonly<{
      type: "link";
      id: string;
      label: string;
      href: string;
    }>;

const NAV_NODES: ReadonlyArray<NavNode> = [
  {
    type: "dropdown",
    id: "academics",
    label: "Academics",
    items: [
      { href: "#curricula-pathways", label: "Curricula Pathways" },
      { href: "#how-it-works", label: "Learning Model" },
      { href: "#published-courses", label: "Global Showroom" },
    ],
  },
  {
    type: "dropdown",
    id: "extracurricular",
    label: "Extracurricular",
    items: [
      { href: "#academy-benefits", label: "AI Cognitive Tutor" },
      { href: "#how-it-works", label: "The Aalgorix Edge" },
      { href: "#curricula-pathways", label: "Talent & Athlete Support" },
    ],
  },
  {
    type: "link",
    id: "ai-tutor",
    label: "AI Tutor",
    href: "#ai-tutor",
  },
  {
    type: "dropdown",
    id: "parent-portal",
    label: "Parent Portal",
    items: [
      { href: "#parent-faq-vault", label: "Parent FAQ Vault" },
      { href: "#global-family-community", label: "Global Family Community" },
      { href: "#accountability-handbook", label: "Accountability Handbook" },
    ],
  },
  {
    type: "dropdown",
    id: "about-us",
    label: "About Us",
    items: [
      { href: "#our-story", label: "Our Story & Philosophy" },
      { href: "#admission-enquiries", label: "Admission Enquiries" },
      { href: "#careers", label: "Careers" },
      { href: "#blog", label: "Blog" },
      { href: "#contact-support", label: "Contact Support" },
    ],
  },
] as const;

type DropdownId = Extract<NavNode, { type: "dropdown" }>["id"];

const DRAWER_TRANSITION_MS = 300;

const linkClassName =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]";

const dropdownTriggerClassName =
  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 ease-out hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]";

const dropdownPanelWrapperClassName = "absolute top-full left-0 pt-2";

const dropdownPanelCardClassName =
  "w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl transition-all duration-200 ease-out";

const dropdownItemClassName =
  "block rounded-lg px-3 py-2 text-sm text-slate-600 transition-all duration-200 ease-out hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]";

const ctaClassName =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";

const mobileNavLinkClassName =
  "block w-full border-b border-slate-100 pb-4 text-base font-bold tracking-tight text-slate-800 transition-colors duration-200 hover:text-indigo-600 active:scale-[0.98]";

const mobileNavGroupClassName = "border-b border-slate-100 pb-4";

const mobileNavGroupLabelClassName = "text-xs font-bold uppercase tracking-widest text-slate-400";

const mobileNavSubLinkClassName =
  "block w-full py-2.5 pl-4 text-sm font-semibold text-slate-600 transition-all duration-200 ease-out hover:text-indigo-600 active:scale-[0.98]";

const menuButtonClassName =
  "relative z-50 inline-flex h-11 min-h-11 w-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] pointer-events-auto touch-manipulation select-none";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

function BrandMark() {
  return (
    <Image
      src="/brand/awa-logo.svg"
      alt="Aalgorix World Academy Logo"
      width={150}
      height={40}
      className="h-8 w-auto sm:h-10"
      priority
    />
  );
}

function normalizeMenuTap(
  event: React.MouseEvent<HTMLButtonElement> | React.PointerEvent<HTMLButtonElement>,
) {
  event.preventDefault();
  event.stopPropagation();
}

function NavDropdown({
  id,
  label,
  items,
  openDropdown,
  onToggle,
  onSelect,
}: {
  id: DropdownId;
  label: string;
  items: ReadonlyArray<NavLink>;
  openDropdown: DropdownId | null;
  onToggle: (id: DropdownId) => void;
  onSelect: () => void;
}) {
  const isOpen = openDropdown === id;

  const visibleClassName = isOpen
    ? "opacity-100 pointer-events-auto translate-y-0"
    : "opacity-0 pointer-events-none -translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0";

  return (
    <div className="relative group">
      <button
        type="button"
        className={dropdownTriggerClassName}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => onToggle(id)}
      >
        {label}
        <ChevronDownIcon open={isOpen} />
      </button>

      <div
        className={`${dropdownPanelWrapperClassName} ${visibleClassName} transition-all duration-200 ease-out`}
        role="menu"
        aria-hidden={!isOpen}
      >
        <div className={dropdownPanelCardClassName}>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href + item.label} role="none">
                <a
                  href={item.href}
                  className={dropdownItemClassName}
                  role="menuitem"
                  onClick={onSelect}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MarketingNav() {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    setPortalTarget(document.body);
  }, [isMounted]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleLogoClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleDropdownMenu = useCallback((id: DropdownId) => {
    setOpenDropdown((current) => (current === id ? null : id));
  }, []);

  const closeDropdownMenu = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const openMobile = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | React.PointerEvent<HTMLButtonElement>) => {
      normalizeMenuTap(event);
      setMobileOpen(true);
    },
    [],
  );

  const handleBackdropClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      closeMobile();
    },
    [closeMobile],
  );

  const handleDrawerClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      normalizeMenuTap(event);
      closeMobile();
    },
    [closeMobile],
  );

  useEffect(() => {
    if (!mobileOpen) {
      setDrawerVisible(false);
      const timeout = window.setTimeout(() => {
        setDrawerMounted(false);
      }, DRAWER_TRANSITION_MS);
      return () => window.clearTimeout(timeout);
    }

    setDrawerMounted(true);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setDrawerVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [mobileOpen]);

  useEffect(() => {
    if (!isMounted || !drawerMounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMounted, drawerMounted]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        if (drawerMounted) closeMobile();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerMounted, closeMobile]);

  useEffect(() => {
    if (!openDropdown) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (desktopNavRef.current?.contains(target)) return;
      setOpenDropdown(null);
    }
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => document.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
  }, [openDropdown]);

  const mobileDrawer =
    isMounted && drawerMounted && portalTarget
      ? createPortal(
          <div className="fixed inset-0 z-40 h-dvh w-full lg:hidden" id="marketing-mobile-menu">
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={drawerVisible ? 0 : -1}
              className={`fixed inset-0 z-40 h-dvh w-full bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out touch-manipulation ${
                drawerVisible
                  ? "pointer-events-auto cursor-pointer opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
              onClick={handleBackdropClose}
            />

            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className={`fixed top-0 right-0 z-50 flex h-dvh w-full max-w-sm flex-col overflow-hidden bg-white p-6 shadow-xl transition-transform duration-300 ease-out ${
                drawerVisible ? "translate-x-0" : "translate-x-full pointer-events-none"
              }`}
            >
              <div className="mb-8 flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <Link
                  href="/"
                  className="min-w-0 transition-all duration-200 active:scale-[0.98]"
                  onClick={(event) => {
                    handleLogoClick(event);
                    closeMobile();
                  }}
                >
                  <BrandMark />
                </Link>
                <button
                  type="button"
                  className={menuButtonClassName}
                  aria-label="Close menu"
                  onClick={handleDrawerClose}
                >
                  <CloseIcon />
                </button>
              </div>

              <nav
                className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain"
                aria-label="Mobile"
              >
                {NAV_NODES.map((node) =>
                  node.type === "dropdown" ? (
                    <div key={node.id} className={mobileNavGroupClassName}>
                      <p className={mobileNavGroupLabelClassName}>{node.label}</p>
                      <ul className="mt-3 space-y-1 border-l-2 border-indigo-100 pl-3">
                        {node.items.map((item) => (
                          <li key={item.href + item.label}>
                            <a
                              href={item.href}
                              className={mobileNavSubLinkClassName}
                              onClick={closeMobile}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a
                      key={node.id}
                      href={node.href}
                      className={mobileNavLinkClassName}
                      onClick={closeMobile}
                    >
                      {node.label}
                    </a>
                  ),
                )}
              </nav>

              <div className="mt-6 flex shrink-0 flex-col gap-3 border-t border-slate-100 pt-6">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-3.5 text-center text-base font-bold tracking-tight text-slate-800 transition-all duration-200 hover:bg-slate-50 hover:text-indigo-600 active:scale-[0.98]"
                  onClick={closeMobile}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className={ctaClassName + " w-full py-3.5 text-base"}
                  onClick={closeMobile}
                >
                  Get Started
                </Link>
              </div>
            </aside>
          </div>,
          portalTarget,
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-30 isolate border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="relative z-10 shrink-0 transition-all duration-200 active:scale-[0.98] pointer-events-auto"
            onClick={handleLogoClick}
          >
            <BrandMark />
          </Link>

          <div
            ref={desktopNavRef}
            className="hidden flex-1 justify-center gap-x-2 lg:flex lg:gap-x-2"
            aria-label="Primary"
          >
            {NAV_NODES.map((node) =>
              node.type === "dropdown" ? (
                <NavDropdown
                  key={node.id}
                  id={node.id}
                  label={node.label}
                  items={node.items}
                  openDropdown={openDropdown}
                  onToggle={toggleDropdownMenu}
                  onSelect={closeDropdownMenu}
                />
              ) : (
                <a key={node.id} href={node.href} className={linkClassName} onClick={closeDropdownMenu}>
                  {node.label}
                </a>
              ),
            )}
          </div>

          <div className="hidden shrink-0 items-center justify-end gap-x-4 lg:flex">
            <Link href="/login" className={linkClassName}>
              Sign In
            </Link>
            <Link href="/signup" className={ctaClassName}>
              Get Started
            </Link>
          </div>

          <div className="relative z-50 shrink-0 pointer-events-auto lg:hidden">
            <button
              type="button"
              className={menuButtonClassName}
              aria-expanded={mobileOpen}
              aria-controls="marketing-mobile-menu"
              aria-haspopup="dialog"
              aria-label="Open menu"
              onClick={openMobile}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {mobileDrawer}
    </>
  );
}
