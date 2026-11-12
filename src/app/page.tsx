"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Building2,
  Menu,
  X,
} from "lucide-react";

export default function MarketingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      hamburgerRef.current?.focus();
      wasOpen.current = false;
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--surface)", color: "var(--on-surface)" }}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* ==================================================================== */}
      {/* TOP NAVIGATION BAR                                                   */}
      {/* ==================================================================== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--surface) 80%, transparent) 0%, color-mix(in srgb, var(--surface-container-low) 80%, transparent) 100%)",
          padding: "0 var(--page-margin)",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            height: "var(--target-min)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo & Nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-800)",
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "var(--on-surface)",
                fontSize: "var(--font-size-title-large)",
                lineHeight: "var(--line-height-title-large)",
                fontWeight: "var(--font-weight-title-large)",
                letterSpacing: "var(--letter-spacing-title-large)",
              }}
            >
              Kujera
            </Link>

            <nav className="header-nav" aria-label="Main">
              <a
                href="#features"
                className="nav-link"
                style={{
                  fontSize: "var(--font-size-label-large)",
                  lineHeight: "var(--line-height-label-large)",
                  fontWeight: "var(--font-weight-label-large)",
                  letterSpacing: "var(--letter-spacing-label-large)",
                }}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="nav-link"
                style={{
                  fontSize: "var(--font-size-label-large)",
                  lineHeight: "var(--line-height-label-large)",
                  fontWeight: "var(--font-weight-label-large)",
                  letterSpacing: "var(--letter-spacing-label-large)",
                }}
              >
                Pricing
              </a>
            </nav>
          </div>

          {/* CTA buttons */}
          <div className="header-cta">
            <Link
              href="/login"
              className="btn-login"
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-medium)",
                textDecoration: "none",
                fontSize: "var(--font-size-label-large)",
                lineHeight: "var(--line-height-label-large)",
                fontWeight: "var(--font-weight-label-large)",
                letterSpacing: "var(--letter-spacing-label-large)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Log In
            </Link>

            <Link
              href="/signup"
              className="btn-filled"
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-medium)",
                textDecoration: "none",
                fontSize: "var(--font-size-label-large)",
                lineHeight: "var(--line-height-label-large)",
                fontWeight: "var(--font-weight-label-large)",
                letterSpacing: "var(--letter-spacing-label-large)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Hamburger menu (mobile) */}
          <button
            type="button"
            ref={hamburgerRef}
            className="header-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--on-surface)",
              width: "var(--target-min)",
              height: "var(--target-min)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        onKeyDown={handleDrawerKeyDown}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "var(--surface)",
          visibility: menuOpen ? "visible" : "hidden",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition:
            "transform var(--duration-long) var(--easing-standard), visibility 0s linear " +
            (menuOpen ? "0s" : "var(--duration-long)"),
          pointerEvents: menuOpen ? "auto" : "none",
          zIndex: 100,
        }}
      >
        <button
          type="button"
          ref={closeButtonRef}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: "var(--spacing-200)",
            right: "var(--spacing-200)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--on-surface)",
            width: "var(--target-min)",
            height: "var(--target-min)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={24} aria-hidden="true" />
        </button>

        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <nav
            aria-label="Menu"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-300)",
              marginBottom: "var(--spacing-400)",
            }}
          >
            <a
              href="#features"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "var(--font-size-headline-small)",
                lineHeight: "var(--line-height-headline-small)",
                fontWeight: "var(--font-weight-headline-small)",
                letterSpacing: "var(--letter-spacing-headline-small)",
              }}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "var(--font-size-headline-small)",
                lineHeight: "var(--line-height-headline-small)",
                fontWeight: "var(--font-weight-headline-small)",
                letterSpacing: "var(--letter-spacing-headline-small)",
              }}
            >
              Pricing
            </a>
          </nav>

          <Link
            href="/login"
            className="btn-login"
            onClick={() => setMenuOpen(false)}
            style={{
              alignSelf: "stretch",
              margin: "0 var(--spacing-200) var(--spacing-250)",
              height: "var(--control-height-expanded)",
              borderRadius: "var(--radius-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: "var(--font-size-label-large)",
              lineHeight: "var(--line-height-label-large)",
              fontWeight: "var(--font-weight-label-large)",
              letterSpacing: "var(--letter-spacing-label-large)",
            }}
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="btn-filled"
            onClick={() => setMenuOpen(false)}
            style={{
              alignSelf: "stretch",
              margin: "0 var(--spacing-200) var(--spacing-250)",
              height: "var(--control-height-expanded)",
              borderRadius: "var(--radius-medium)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: "var(--font-size-label-large)",
              lineHeight: "var(--line-height-label-large)",
              fontWeight: "var(--font-weight-label-large)",
              letterSpacing: "var(--letter-spacing-label-large)",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>

      <main id="main-content" tabIndex={-1}>
      {/* ==================================================================== */}
      {/* HERO SECTION (100vh on desktop)                                      */}
      {/* ==================================================================== */}
      <section
        style={{
          minHeight: "calc(100vh - var(--target-min))",
          display: "flex",
          alignItems: "center",
          padding: "var(--section-gap) var(--page-margin)",
          borderBottom: "var(--border-hairline) solid var(--outline-variant)",
          background: "linear-gradient(180deg, var(--surface) 0%, var(--surface-container-low) 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--section-gap)",
            alignItems: "center",
          }}
        >
          {/* Left Column: Value Proposition */}
          <div style={{ textAlign: "center" }}>
            {/* Main Headline */}
            <h1
              style={{
                fontSize:
                  "clamp(var(--font-size-display-large-compact), 5vw, var(--font-size-display-large))",
                lineHeight: "var(--line-height-display-large)",
                fontWeight: "var(--font-weight-display-large)",
                letterSpacing: "var(--letter-spacing-display-large)",
                color: "var(--on-surface)",
                marginBottom: "var(--spacing-200)",
              }}
            >
              Nobody walks in unpaid.
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "var(--font-size-body-large)",
                lineHeight: "var(--line-height-body-large)",
                color: "var(--on-surface-variant)",
                maxWidth: 520,
                margin: "0 auto var(--spacing-300)",
              }}
            >
              The calm, exact management app for Nigerian coworking spaces.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--spacing-200)" }}>
              <Link
                href="/signup"
                className="btn-filled"
                style={{
                  height: "var(--control-height-expanded)",
                  padding: "0 var(--spacing-300)",
                  borderRadius: "var(--radius-medium)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  fontSize: "var(--font-size-label-large)",
                  lineHeight: "var(--line-height-label-large)",
                  fontWeight: "var(--font-weight-label-large)",
                  letterSpacing: "var(--letter-spacing-label-large)",
                }}
              >
                Get Started
              </Link>

              <Link
                href="/contact"
                className="btn-outlined"
                style={{
                  height: "var(--control-height-expanded)",
                  padding: "0 var(--spacing-300)",
                  borderRadius: "var(--radius-medium)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  fontSize: "var(--font-size-label-large)",
                  lineHeight: "var(--line-height-label-large)",
                  fontWeight: "var(--font-weight-label-large)",
                  letterSpacing: "var(--letter-spacing-label-large)",
                }}
              >
                Book a Demo
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* FEATURES / VALUE PILLARS (FR-01, FR-04, FR-06, FR-11, FR-12)         */}
      {/* ==================================================================== */}
      <section
        id="features"
        style={{
          padding: "var(--marketing-section-gap) var(--page-margin)",
          maxWidth: "1024px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-500)" }}>
          <span
            style={{
              color: "var(--primary)",
              fontSize: "var(--font-size-label-large)",
              lineHeight: "var(--line-height-label-large)",
              fontWeight: "var(--font-weight-label-large)",
              letterSpacing: "var(--letter-spacing-label-large)",
            }}
          >
            Built for Nigerian Spaces
          </span>
          <h2
            style={{
              fontSize: "var(--font-size-display-medium)",
              lineHeight: "var(--line-height-display-medium)",
              fontWeight: 600,
              color: "var(--on-surface)",
              marginTop: 8,
            }}
          >
            Designed to stop the 5 silent leaks
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--on-surface-variant)",
              maxWidth: 600,
              margin: "8px auto 0",
            }}
          >
            No member record is ever leaked. No booked hour slips through unnoticed.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--card-gap)",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: "var(--surface-container-lowest)",
              border: "var(--border-hairline) solid var(--outline-variant)",
              borderRadius: "var(--radius-large)",
              padding: "var(--card-padding-expanded)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-medium)",
                backgroundColor: "var(--success-container)",
                color: "var(--on-success-container)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "var(--spacing-200)",
              }}
            >
              <CheckCircle2 size={24} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--on-surface)" }}>
              Door Check-In Pass
            </h3>
            <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
              Members show an offline TOTP pass that rotates every 30 seconds. The desk gets a clear
              Allowed or Denied banner in under 1 second. No shared screenshots, no unauthorized walk-ins.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: "var(--surface-container-lowest)",
              border: "var(--border-hairline) solid var(--outline-variant)",
              borderRadius: "var(--radius-large)",
              padding: "var(--card-padding-expanded)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-medium)",
                backgroundColor: "var(--primary-container)",
                color: "var(--on-primary-container)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "var(--spacing-200)",
              }}
            >
              <Calendar size={24} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--on-surface)" }}>
              Meeting Room Ledger
            </h3>
            <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
              Room hours are ledger-tracked against plan credits. Walk-ins pay before use, and any
              unbilled overrun time generates an automatic overrun invoice at the room&apos;s hourly rate.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: "var(--surface-container-lowest)",
              border: "var(--border-hairline) solid var(--outline-variant)",
              borderRadius: "var(--radius-large)",
              padding: "var(--card-padding-expanded)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-medium)",
                backgroundColor: "var(--secondary-container)",
                color: "var(--on-secondary-container)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "var(--spacing-200)",
              }}
            >
              <Building2 size={24} aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--on-surface)" }}>
              Money View &amp; Ask
            </h3>
            <p style={{ fontSize: 14, color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
              See takings, cash counts and bank transfer decisions in one screen. Ask questions like
              &quot;How many members paid this month?&quot; to get figures computed directly from your records.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* PRICING TIERS SECTION (FR-15)                                        */}
      {/* ==================================================================== */}
      <section
        id="pricing"
        style={{
          backgroundColor: "var(--surface-container-low)",
          padding: "var(--marketing-section-gap) var(--page-margin)",
          borderTop: "var(--border-hairline) solid var(--outline-variant)",
          borderBottom: "var(--border-hairline) solid var(--outline-variant)",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--spacing-500)" }}>
            <h2
              style={{
                fontSize: "var(--font-size-display-medium)",
                lineHeight: "var(--line-height-display-medium)",
                fontWeight: 600,
                color: "var(--on-surface)",
              }}
            >
              Simple monthly fee per location
            </h2>
            <p style={{ fontSize: 16, color: "var(--on-surface-variant)", marginTop: 8 }}>
              Kujera charges a fixed software fee based on your active members. 30 days completely free.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--card-gap)",
              alignItems: "stretch",
            }}
          >
            {/* Starter */}
            <div
              style={{
                backgroundColor: "var(--surface-container-lowest)",
                border: "var(--border-hairline) solid var(--outline-variant)",
                borderRadius: "var(--radius-large)",
                padding: "var(--card-padding-expanded)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-title-small)",
                    lineHeight: "var(--line-height-title-small)",
                    fontWeight: "var(--font-weight-title-small)",
                    letterSpacing: "var(--letter-spacing-title-small)",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  Starter Tier
                </h3>
                <div style={{ fontSize: 36, fontWeight: 700, margin: "12px 0 6px", color: "var(--on-surface)" }}>
                  <span className="tabular-nums">₦15,000</span>
                  <span style={{ fontSize: 14, fontWeight: 400, color: "var(--on-surface-variant)" }}>/month</span>
                </div>
                <p style={{ fontSize: "var(--font-size-body-medium)", lineHeight: "var(--line-height-body-medium)", color: "var(--on-surface-variant)", marginBottom: 20 }}>
                  For spaces with up to 30 active members.
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Door pass &amp; roster sync
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Meeting room credit ledger
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Cash &amp; transfer tracking
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="btn-outlined"
                style={{
                  marginTop: 24,
                  height: 40,
                  borderRadius: "var(--radius-medium)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Choose Starter
              </Link>
            </div>

            {/* Growth (Featured) */}
            <div
              style={{
                backgroundColor: "var(--surface-container-lowest)",
                border: "2px solid var(--primary)",
                borderRadius: "var(--radius-large)",
                padding: "var(--card-padding-expanded)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "var(--elevation-2)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  right: 20,
                  backgroundColor: "var(--primary)",
                  color: "var(--on-primary)",
                  fontSize: "var(--font-size-label-medium)",
                  lineHeight: "var(--line-height-label-medium)",
                  fontWeight: "var(--font-weight-label-medium)",
                  letterSpacing: "var(--letter-spacing-label-medium)",
                  padding: "2px 10px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                Most Popular
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-title-small)",
                    lineHeight: "var(--line-height-title-small)",
                    fontWeight: "var(--font-weight-title-small)",
                    letterSpacing: "var(--letter-spacing-title-small)",
                    color: "var(--primary)",
                  }}
                >
                  Growth Tier
                </h3>
                <div style={{ fontSize: 36, fontWeight: 700, margin: "12px 0 6px", color: "var(--on-surface)" }}>
                  <span className="tabular-nums">₦30,000</span>
                  <span style={{ fontSize: 14, fontWeight: 400, color: "var(--on-surface-variant)" }}>/month</span>
                </div>
                <p style={{ fontSize: "var(--font-size-body-medium)", lineHeight: "var(--line-height-body-medium)", color: "var(--on-surface-variant)", marginBottom: 20 }}>
                  For growing spaces with up to 100 active members.
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Everything in Starter
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Unlimited desk helper logins
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Ask owner AI business answers
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Audit log &amp; decision trails
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="btn-filled"
                style={{
                  marginTop: 24,
                  height: 40,
                  borderRadius: "var(--radius-medium)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Start Growth Trial
              </Link>
            </div>

            {/* Large */}
            <div
              style={{
                backgroundColor: "var(--surface-container-lowest)",
                border: "var(--border-hairline) solid var(--outline-variant)",
                borderRadius: "var(--radius-large)",
                padding: "var(--card-padding-expanded)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-title-small)",
                    lineHeight: "var(--line-height-title-small)",
                    fontWeight: "var(--font-weight-title-small)",
                    letterSpacing: "var(--letter-spacing-title-small)",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  Large Tier
                </h3>
                <div style={{ fontSize: 36, fontWeight: 700, margin: "12px 0 6px", color: "var(--on-surface)" }}>
                  <span className="tabular-nums">₦50,000</span>
                  <span style={{ fontSize: 14, fontWeight: 400, color: "var(--on-surface-variant)" }}>/month</span>
                </div>
                <p style={{ fontSize: "var(--font-size-body-medium)", lineHeight: "var(--line-height-body-medium)", color: "var(--on-surface-variant)", marginBottom: 20 }}>
                  For established spaces with 100+ active members.
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Everything in Growth
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Multiple meeting rooms
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" /> Opening position migration support
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="btn-outlined"
                style={{
                  marginTop: 24,
                  height: 40,
                  borderRadius: "var(--radius-medium)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Choose Large
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* ==================================================================== */}
      {/* FOOTER                                                               */}
      {/* ==================================================================== */}
      <footer
        style={{
          padding: "var(--spacing-400) var(--page-margin)",
          borderTop: "var(--border-hairline) solid var(--outline-variant)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--spacing-200)",
            fontSize: "var(--font-size-body-medium)",
            lineHeight: "var(--line-height-body-medium)",
            color: "var(--on-surface-variant)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, color: "var(--primary)" }}>Kujera</span>
            <span>· Management for Nigerian Coworking Spaces</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Times: Africa/Lagos</span>
            <span>·</span>
            <span>NDPA 2023 Compliant</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} Kujera</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
