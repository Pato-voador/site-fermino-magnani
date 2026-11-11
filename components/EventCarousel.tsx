"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventDateLabel, eventsByPeriod, type LarEvent } from "@/lib/events";

type Period = "upcoming" | "past";

function EventCard({ event, period }: { event: LarEvent; period: Period }) {
  const photo = <img src={event.image.src} alt={event.image.alt} loading="lazy" decoding="async" style={event.image.position ? { objectPosition: event.image.position } : undefined} />;
  const isUpcoming = period === "upcoming";
  const description = event.description ?? (isUpcoming ? event.upcomingNotice : undefined);

  return <div className="event-card">
    <figure className="event-photo">
      {event.historicalAnnouncement && event.link ? (
        <a className="event-art" href={event.link.href} target="_blank" rel="noopener noreferrer" aria-label="Ver detalhes da palestra (abre em nova aba)">
          {photo}
        </a>
      ) : (
        <div className="event-art">{photo}</div>
      )}
      {event.image.illustrative && <figcaption className="sr-only">Foto ilustrativa</figcaption>}
    </figure>
    <div className="event-summary">
      <span className="event-status">
        {isUpcoming ? "Em destaque" : event.historicalAnnouncement ? "Anúncio histórico" : "Evento passado"}
      </span>
      <h3>{event.title}</h3>
      {description && <p>{description}</p>}
      <div className="event-essentials">
        <time dateTime={event.date}>{eventDateLabel(event.date)}{event.time && ` · ${event.time}`}</time>
        {event.details && <span>{event.details}</span>}
      </div>
      {event.link && (isUpcoming || event.historicalAnnouncement) && (
        <a className="button button-green" href={event.link.href} target="_blank" rel="noopener noreferrer">
          {event.link.label}<span className="sr-only"> (abre em nova aba)</span>
        </a>
      )}
    </div>
  </div>;
}

function EventTrack({ events, period }: { events: LarEvent[]; period: Period }) {
  const track = useRef<HTMLDivElement>(null);
  const scrollTween = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  const multiple = events.length > 1;

  useEffect(() => () => { scrollTween.current?.kill(); }, []);

  function goTo(index: number) {
    const scroller = track.current;
    const slide = scroller?.children[index];
    if (!scroller || !(slide instanceof HTMLElement)) return;

    scrollTween.current?.kill();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || document.documentElement.dataset.motion === "off") {
      scroller.scrollTo({ left: slide.offsetLeft, behavior: "instant" });
      return;
    }

    // Let the arrow transition drive the scroll, then restore touch snapping.
    scroller.style.scrollSnapType = "none";
    const restoreSnap = () => {
      scroller.style.removeProperty("scroll-snap-type");
      scrollTween.current = null;
    };

    scrollTween.current = gsap.to(scroller, {
      scrollLeft: slide.offsetLeft,
      duration: 0.55,
      ease: "power3.out",
      onComplete: restoreSnap,
      onInterrupt: restoreSnap,
    });
  }

  function syncPosition(scroller: HTMLDivElement) {
    const { clientWidth, scrollLeft } = scroller;
    if (clientWidth === 0 || !multiple) return;

    const position = Math.max(0, Math.min(events.length - 1, scrollLeft / clientWidth));
    setActive(Math.round(position));

    Array.from(scroller.children).forEach((slide, index) => {
      const card = slide.firstElementChild;
      if (!(card instanceof HTMLElement)) return;
      const offset = Math.max(-1, Math.min(1, index - position));
      card.style.setProperty("--event-card-angle", `${offset * 3}deg`);
      card.style.setProperty("--event-card-scale", `${1 - Math.abs(offset) * 0.06}`);
    });
  }

  if (events.length === 0) {
    return <p className="event-empty">{period === "upcoming" ? "Nenhum evento anunciado para as próximas datas." : "Nenhum evento anterior na agenda."}</p>;
  }

  return (
    <div className="event-carousel-shell" role={multiple ? "region" : undefined} aria-roledescription={multiple ? "carrossel" : undefined} aria-label={multiple ? "Agenda do Lar" : undefined}>
      <div className="event-carousel">
        <div className="event-slides" ref={track} tabIndex={multiple ? 0 : undefined}
          onPointerDown={() => scrollTween.current?.kill()}
          onWheel={() => scrollTween.current?.kill()}
          onKeyDown={event => {
            if (!multiple || event.target !== event.currentTarget) return;
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            goTo(active + (event.key === "ArrowRight" ? 1 : -1));
          }}
          onScroll={event => syncPosition(event.currentTarget)}
        >
          {events.map((event, index) => (
            <article key={event.id} className="event-slide" inert={index !== active} aria-label={event.title}>
              <EventCard event={event} period={period} />
            </article>
          ))}
        </div>
      </div>
      {multiple && (
        <>
          <button className="event-arrow event-arrow-previous" type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Evento anterior">
            <ChevronLeft size={21} aria-hidden="true" />
          </button>
          <span className="sr-only" aria-live="polite">{active + 1} de {events.length}</span>
          <button className="event-arrow event-arrow-next" type="button" onClick={() => goTo(active + 1)} disabled={active >= events.length - 1} aria-label="Próximo evento">
            <ChevronRight size={21} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

export default function EventCarousel() {
  const [now, setNow] = useState(() => Date.now());
  const [selected, setSelected] = useState<Period | null>(null);
  const grouped = eventsByPeriod(now);
  const period = selected ?? (grouped.upcoming.length ? "upcoming" : "past");

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <section className="events-section" id="eventos" aria-labelledby="eventos-title">
      <div className="wrap">
        <div className="section-heading events-heading"><h2 id="eventos-title">Encontros que ajudam.</h2></div>
        <Tabs value={period} onValueChange={value => setSelected(value === "past" ? "past" : "upcoming")} className="event-tabs">
          <TabsList className="event-filters" aria-label="Período dos eventos">
            <TabsTrigger value="upcoming">Próximos eventos</TabsTrigger>
            <TabsTrigger value="past">Eventos passados</TabsTrigger>
          </TabsList>
          {(["upcoming", "past"] as const).map(value => (
            <TabsContent key={value} value={value}>
              <EventTrack key={grouped[value].map(event => event.id).join(",")} events={grouped[value]} period={value} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
