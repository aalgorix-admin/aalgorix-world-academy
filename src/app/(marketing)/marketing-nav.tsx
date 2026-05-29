"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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

const POPOVER_TRANSITION_MS = 300;

const mobilePopoverShellClassName =
  "absolute top-18 right-4 z-50 w-72 origin-top-right md:w-80 lg:hidden";

const mobilePopoverCardClassName =
  "overflow-hidden rounded-2xl border border-slate-200/20 bg-white/90 shadow-2xl backdrop-blur-xl";

const mobileAccordionTriggerClassName =
  "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-800 transition-all duration-300 hover:bg-slate-100/80 active:scale-[0.98]";

const mobileSubLinkClassName =
  "block w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-100/80 hover:text-indigo-600 active:scale-[0.98]";

const mobileDirectLinkClassName =
  "flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition-all duration-300 hover:bg-slate-100/80 active:scale-[0.98]";

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

const menuButtonClassName =
  "relative z-50 inline-flex h-11 min-h-11 w-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] pointer-events-auto touch-manipulation select-none";

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

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "rotate-180" : ""}`}
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

function normalizeMenuTap(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  event.stopPropagation();
}

function MobileAccordionSection({
  id,
  label,
  items,
  isExpanded,
  onToggle,
  onNavigate,
}: {
  id: string;
  label: string;
  items: ReadonlyArray<NavLink>;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        className={mobileAccordionTriggerClassName}
        aria-expanded={isExpanded}
        aria-controls={`mobile-accordion-${id}`}
        onClick={() => onToggle(id)}
      >
        <span>{label}</span>
        <ChevronDownIcon open={isExpanded} />
      </button>

      <div
        id={`mobile-accordion-${id}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-0.5 px-1 pb-2 pt-1">
            {items.map((item) => (
              <li key={item.href + item.label}>
                <a href={item.href} className={mobileSubLinkClassName} onClick={onNavigate}>
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

function MobileNavPopover({
  visible,
  expandedAccordion,
  onToggleAccordion,
  onClose,
}: {
  visible: boolean;
  expandedAccordion: string | null;
  onToggleAccordion: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      id="marketing-mobile-menu"
      role="dialog"
      aria-modal="false"
      aria-label="Mobile navigation"
      className={`${mobilePopoverShellClassName} transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        visible
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
    >
      <div className={mobilePopoverCardClassName}>
        <nav
          className="max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain px-2 py-2"
          aria-label="Mobile"
        >
          {NAV_NODES.map((node) => {
            if (node.type === "dropdown") {
              return (
                <MobileAccordionSection
                  key={node.id}
                  id={node.id}
                  label={node.label}
                  items={node.items}
                  isExpanded={expandedAccordion === node.id}
                  onToggle={onToggleAccordion}
                  onNavigate={onClose}
                />
              );
            }

            return (
              <div key={node.id} className="border-b border-slate-100 last:border-b-0">
                <a href={node.href} className={mobileDirectLinkClassName} onClick={onClose}>
                  {node.label}
                </a>
              </div>
            );
          })}
        </nav>

        <div className="space-y-1.5 border-t border-slate-100 px-2 py-2">
          <Link
            href="/login"
            className="block w-full rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-slate-800 transition-all duration-200 hover:bg-slate-50 hover:text-indigo-600 active:scale-[0.98]"
            onClick={onClose}
          >
            Sign In
          </Link>
          <Link href="/signup" className={`${ctaClassName} w-full py-2.5 text-sm`} onClick={onClose}>
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [popoverMounted, setPopoverMounted] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setExpandedAccordion(null);
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

  const toggleMobile = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    normalizeMenuTap(event);
    setMobileOpen((current) => !current);
  }, []);

  const toggleAccordion = useCallback((id: string) => {
    setExpandedAccordion((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      setPopoverVisible(false);
      const timeout = window.setTimeout(() => {
        setPopoverMounted(false);
      }, POPOVER_TRANSITION_MS);
      return () => window.clearTimeout(timeout);
    }

    setPopoverMounted(true);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPopoverVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (headerRef.current?.contains(target)) return;
      closeMobile();
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        if (popoverMounted) closeMobile();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [popoverMounted, closeMobile]);

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

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 isolate border-b border-slate-200/80 bg-white/95 backdrop-blur-md"
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
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

        <div className="relative z-50 ml-auto shrink-0 pointer-events-auto lg:hidden">
          <button
            type="button"
            className={menuButtonClassName}
            aria-expanded={mobileOpen}
            aria-controls="marketing-mobile-menu"
            aria-haspopup="true"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobile}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {popoverMounted ? (
          <MobileNavPopover
            visible={popoverVisible}
            expandedAccordion={expandedAccordion}
            onToggleAccordion={toggleAccordion}
            onClose={closeMobile}
          />
        ) : null}
      </div>
    </header>
  );
}
