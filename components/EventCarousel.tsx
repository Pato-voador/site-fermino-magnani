"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventDateLabel, eventsByPeriod, type LarEvent } from "@/lib/events";

type Period = "upcoming" | "past";

function EventCard({ event, period }: { event: LarEvent; period: Period }) {
  const photo = <img src={event.image.src} alt={event.image.alt} loading="lazy" decoding="async" style={event.image.position ? { objectPosition: event.image.position } : undefined} />;
  const isUpcoming = period === "upcoming";
  const description = event.description ?? (isUpcoming ? event.upcomingNotice : undefined);

  return <>
    <figure className="event-photo">
      {event.historicalAnnouncement && event.link ? (
        <a className="event-art" href={event.link.href} target="_blank" rel="noopener noreferrer" aria-label="Ver detalhes da palestra (abre em nova aba)">
          {photo}
        </a>
      ) : (
        <div className="event-art">{photo}</div>
      )}
      {event.image.illustrative && <figcaption className="event-caption">Foto ilustrativa</figcaption>}
    </figure>
    <div className="event-summary">
      <span className="event-status" data-period={period}>
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
  </>;
}

function EventTrack({ events, period }: { events: LarEvent[]; period: Period }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const multiple = events.length > 1;

  function goTo(index: number) {
    const scroller = track.current;
    const slide = scroller?.children[index];
    if (!scroller || !(slide instanceof HTMLElement)) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({
      left: slide.offsetLeft,
      behavior: reducedMotion || document.documentElement.dataset.motion === "off" ? "instant" : "smooth",
    });
  }

  if (events.length === 0) {
    return <p className="event-empty">{period === "upcoming" ? "Nenhum evento anunciado para as próximas datas." : "Nenhum evento anterior na agenda."}</p>;
  }

  return (
    <div className="event-carousel" role={multiple ? "region" : undefined} aria-roledescription={multiple ? "carrossel" : undefined} aria-label={multiple ? "Agenda do Lar" : undefined}>
      <div className="event-slides" ref={track} tabIndex={multiple ? 0 : undefined}
        onKeyDown={event => {
          if (!multiple || event.target !== event.currentTarget) return;
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          goTo(active + (event.key === "ArrowRight" ? 1 : -1));
        }}
        onScroll={event => {
          const scroller = event.currentTarget;
          if (scroller.clientWidth > 0) setActive(Math.round(scroller.scrollLeft / scroller.clientWidth));
        }}
      >
        {events.map((event, index) => (
          <article key={event.id} className="event-slide" inert={index !== active} aria-label={event.title}>
            <EventCard event={event} period={period} />
          </article>
        ))}
      </div>
      {multiple && (
        <div className="event-carousel-controls">
          <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Evento anterior">
            <ChevronLeft size={21} aria-hidden="true" />
          </button>
          <span aria-live="polite">{active + 1} de {events.length}</span>
          <button type="button" onClick={() => goTo(active + 1)} disabled={active >= events.length - 1} aria-label="Próximo evento">
            <ChevronRight size={21} aria-hidden="true" />
          </button>
        </div>
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
