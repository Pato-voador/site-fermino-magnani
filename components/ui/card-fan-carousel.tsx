"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
  motionEnabled?: boolean;
  onSelect?: (index: number) => void;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -15, scale: 0.86, x: -30, y: 3.4, zIndex: 1 },
  { rot: -10, scale: 0.92, x: -22, y: 1.9, zIndex: 2 },
  { rot: -5, scale: 0.97, x: -11, y: 0.65, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 5, scale: 0.97, x: 11, y: 0.65, zIndex: 3 },
  { rot: 10, scale: 0.92, x: 22, y: 1.9, zIndex: 2 },
  { rot: 15, scale: 0.86, x: 30, y: 3.4, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/**
 * Returns a multiplier (0..1] that scales y-offsets and entry animation
 * distances when the viewport is too short for the ideal layout height.
 */
function getHeightMultiplier(width: number) {
  // Ideal layout heights (in px at 16px root) matching the CSS breakpoints
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;       // 352px
  else if (width < 640) idealPx = 26 * 16;  // 416px
  else if (width < 768) idealPx = 28 * 16;  // 448px
  else if (width < 1024) idealPx = 34 * 16; // 544px
  else idealPx = 38 * 16;                    // 608px

  const available = window.innerHeight * 0.7; // 70vh budget
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 15,
    scale: 1.0 - 0.14 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 3.4,
    zIndex: 10 - Math.abs(slot - center),
  };
}


export default function SocialCards({ cards, motionEnabled = true, onSelect }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  const goTo = (index: number) => {
    if (isAnimating.current || !needsPagination || index === centerIndex) return;
    isAnimating.current = true;
    directionRef.current = index > centerIndex ? "right" : "left";
    setCenterIndex(index);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: motionEnabled ? 1.2 : 0, ease: "elastic.out(1.05,.78)", delay: motionEnabled ? 0.2 + slot * 0.06 : 0, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: motionEnabled ? 0.6 : 0, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: motionEnabled ? 0.5 : 0, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: motionEnabled ? 0.4 : 0, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover interactions
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: NodeJS.Timeout | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: motionEnabled ? 0.5 : 0, delay: motionEnabled ? delay : 0, ease: "elastic.out(1,.75)", overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      el.addEventListener("focus", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.killTweensOf(cardElements);
      isAnimating.current = false;
      enterHandlers.forEach(({ el, handler }) => { el.removeEventListener("mouseenter", handler); el.removeEventListener("focus", handler); });
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, motionEnabled]);

  if (!totalCards) return null;

  return (
    <div className="fan-carousel" role="region" aria-roledescription="carrossel" aria-label="Fotos do Lar" onKeyDown={event => {
      if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && needsPagination) {
        event.preventDefault();
        if (event.target instanceof Element && event.target.closest(".fan-card")) {
          const arrows = event.currentTarget.querySelectorAll<HTMLButtonElement>(".fan-arrow");
          arrows[event.key === "ArrowLeft" ? 0 : 1]?.focus({ preventScroll: true });
        }
        cycle(event.key === "ArrowLeft" ? "left" : "right");
      }
    }}>
      <div className="fan-track">
        <div ref={containerRef} className="fan-layout">
          {cards.map((card, index) => {
            const image = (
              <div className="relative w-full h-full overflow-hidden">
                <img src={card.imgUrl} loading="lazy" alt={card.alt || `Card ${index}`} className="absolute inset-0 w-full h-full object-cover z-10" />
              </div>
            );
            return card.linkUrl ? (
              <a key={index} href={card.linkUrl} target={card.linkUrl.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" className="fan-card block cursor-pointer">{image}</a>
            ) : (
              <button type="button" key={index} className="fan-card" aria-label={`Ampliar: ${card.alt || "foto do Lar"}`} tabIndex={getVisibleMap(centerIndex).has(index) ? 0 : -1} aria-hidden={!getVisibleMap(centerIndex).has(index)} onClick={() => onSelect?.(index)}>{image}</button>
            );
          })}
        </div>
      </div>

      {needsPagination && <>
        <div className="fan-controls">
          <button type="button" className="fan-arrow" onClick={() => cycle("left")} aria-label="Foto anterior"><ChevronLeft aria-hidden="true" /></button>
          <div className="fan-dots" role="group" aria-label="Escolher foto">
            {cards.map((card, index) => <button type="button" key={index} className="fan-dot"
              aria-label={`Mostrar foto ${index + 1}: ${card.alt || "foto do Lar"}`}
              aria-current={index === centerIndex ? "true" : undefined}
              onClick={() => goTo(index)} />)}
          </div>
          <button type="button" className="fan-arrow" onClick={() => cycle("right")} aria-label="Próxima foto"><ChevronRight aria-hidden="true" /></button>
        </div>
        <p className="fan-counter" aria-live="polite" aria-atomic="true">Foto {centerIndex + 1} de {totalCards}</p>
      </>}
    </div>
  );
}
