"use client";
import { useEffect, useRef } from "react";
/** React Bits FadeContent adaptation: https://reactbits.dev/animations/fade-content
 * A brief native fade replaces GSAP and blur; server content always stays visible.
 */
export default function FadeContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || preference.matches || !window.IntersectionObserver) return;
    let animation: Animation | undefined;
    const cancel = () => animation?.cancel();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (!preference.matches) animation = el.animate([{ opacity: 0.7 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
      observer.disconnect();
    }, { threshold: 0.1 });
    observer.observe(el);
    el.addEventListener("focusin", cancel);
    preference.addEventListener("change", cancel);
    return () => { observer.disconnect(); cancel(); el.removeEventListener("focusin", cancel); preference.removeEventListener("change", cancel); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
