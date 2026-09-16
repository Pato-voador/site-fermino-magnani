"use client";

import { useEffect } from "react";

let activeScrollFrame: number | null = null;

/** Scroll interno com animação própria para não depender do smooth scroll do navegador. */
export function scrollToSection(id: string, enabled: boolean) {
  const section = document.getElementById(id);
  if (!section) return;

  const focusTarget = section.querySelector<HTMLElement>("h1, h2") ?? section;
  if (!focusTarget.hasAttribute("tabindex")) {
    focusTarget.setAttribute("tabindex", "-1");
    focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
  }

  if (activeScrollFrame !== null) {
    cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = null;
  }

  const header = document.querySelector<HTMLElement>(".site-header");
  const headerOffset = header?.getBoundingClientRect().height ?? 0;
  const startY = window.scrollY;
  const targetY = Math.max(0, startY + section.getBoundingClientRect().top - headerOffset);

  const finish = () => {
    focusTarget.focus({ preventScroll: true });
    if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
  };

  if (!enabled) {
    window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
    finish();
    return;
  }

  const distance = targetY - startY;
  if (Math.abs(distance) < 2) {
    finish();
    return;
  }

  const duration = Math.min(1100, Math.max(650, Math.abs(distance) * 0.38));
  const startedAt = performance.now();
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));

    if (progress < 1) {
      activeScrollFrame = requestAnimationFrame(step);
      return;
    }

    activeScrollFrame = null;
    finish();
  };

  activeScrollFrame = requestAnimationFrame(step);
}

export default function SiteMotion({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const hash = anchor.getAttribute("href")?.slice(1);
      if (!hash) return;
      let id: string;
      try { id = decodeURIComponent(hash); } catch { return; }
      if (!document.getElementById(id)) return;
      event.preventDefault();
      scrollToSection(id, anchor.classList.contains("skip-link") ? false : enabled);
    };
    document.addEventListener("click", onAnchorClick);
    return () => document.removeEventListener("click", onAnchorClick);
  }, [enabled]);

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    if (!enabled || !window.IntersectionObserver) return;
    const running = new Map<Element, Animation>();
    const animate = (el: Element, delay: number) => {
      if (el.contains(document.activeElement)) return;
      const animation = el.animate([
        { opacity: 0.55, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 600, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      running.set(el, animation);
      animation.onfinish = () => running.delete(el);
    };
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        animate(entry.target, Math.min(index, 2) * 80);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    document.querySelectorAll(".section-heading, .history-timeline li, .donation-grid > *, .partners-intro, .partner-row, .event-carousel, .transparency-grid > *, .contact-grid > *").forEach(el => observer.observe(el));
    document.querySelectorAll(".hero-copy > *").forEach((el, i) => animate(el, i * 85));
    const revealFocused = (event: FocusEvent) => {
      running.forEach((animation, el) => {
        if (event.target instanceof Node && el.contains(event.target)) { animation.cancel(); running.delete(el); }
      });
    };
    document.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect(); running.forEach(animation => animation.cancel());
      document.removeEventListener("focusin", revealFocused);
    };
  }, [enabled]);
  return null;
}
