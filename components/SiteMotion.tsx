"use client";

import { useEffect } from "react";

// Progressive enhancement: content is visible before hydration and without JS.
export default function SiteMotion({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    if (!enabled || !window.IntersectionObserver) return;
    const running = new Map<Element, Animation>();
    const animate = (el: Element, delay: number, distance = 24) => {
      if (el.contains(document.activeElement)) return;
      const animation = el.animate([
        { opacity: 0.25, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 680, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      running.set(el, animation);
      animation.onfinish = () => running.delete(el);
    };
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        animate(entry.target, Math.min(index, 3) * 90);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    const selector = [
      ".section-heading > *", ".history-card", ".care-list article",
      ".donation-grid > *", ".partner-card", ".partner-cta",
      ".featured-event", ".history-heading", ".event-history article",
      ".transparency-grid > *", ".contact-grid > *", ".promise-strip span",
    ].join(",");
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    document.querySelectorAll(".hero-copy > *").forEach((el, i) => animate(el, 90 + i * 85, 16));
    const revealFocused = (event: FocusEvent) => {
      running.forEach((animation, el) => {
        if (event.target instanceof Node && el.contains(event.target)) {
          animation.cancel();
          running.delete(el);
        }
      });
    };
    document.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect();
      running.forEach(animation => animation.cancel());
      document.removeEventListener("focusin", revealFocused);
    };
  }, [enabled]);
  return null;
}
