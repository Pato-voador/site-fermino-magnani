"use client";

import { useRef, useState } from "react";
import { eventIsPast, lar } from "@/lib/lar";

const events = [{
  id: "cortella", title: "Uma noite com Cortella",
  image: "/images/cortella-retrato.jpg",
  alt: "Mário Sérgio Cortella durante entrevista",
  date: "11 set 2026", dateTime: "2026-09-11T20:00:00-03:00",
  location: "Palácio da Cultura", time: "20h", href: lar.cortellaPost,
}];

export default function EventCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const multiple = events.length > 1;
  const goTo = (index: number) => {
    const target = track.current?.children[index] as HTMLElement | undefined;
    if (!target || !track.current) return;
    track.current.scrollTo({ left: target.offsetLeft - track.current.offsetLeft,
      behavior: document.documentElement.dataset.motion === "off" ? "instant" : "smooth" });
  };
  return <section className="events-section events-minimal" id="eventos" aria-labelledby="eventos-title">
    <div className="wrap">
      <div className="section-heading events-heading"><div><p className="eyebrow">Eventos</p><h2 id="eventos-title">Encontros que ajudam.</h2></div></div>
      <div className="event-carousel" role="region" aria-roledescription={multiple ? "carrossel" : undefined} aria-label="Eventos do Lar">
        <div className="event-slides" ref={track} tabIndex={multiple ? 0 : undefined}
          onKeyDown={event => {
            if (!multiple || event.target !== event.currentTarget) return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              goTo(Math.max(0, Math.min(events.length - 1, active + (event.key === "ArrowRight" ? 1 : -1))));
            }
          }}
          onScroll={() => {
            const el = track.current;
            if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}>
          {events.map((event, index) => <article key={event.id} className="event-slide" role="group" aria-label={multiple ? `${index + 1} de ${events.length}` : undefined}>
            <figure className="event-photo"><a className="event-art" href={event.href} target="_blank" rel="noopener noreferrer" aria-label="Ver detalhes da palestra (abre em nova aba)">
              <img src={event.image} alt={event.alt} width={1532} height={1080} loading="lazy" />
            </a>
            </figure>
            <div className="event-summary">
              <span className="eyebrow">{eventIsPast(new Date()) ? "Anúncio histórico" : "Em breve"}</span>
              <h3>{event.title}</h3>
              <p>Educação e família em uma conversa em benefício do Lar.</p>
              <div className="event-essentials"><time dateTime={event.dateTime}>{event.date} · {event.time}</time><span>{event.location}</span></div>
              <a className="button button-green" href={event.href} target="_blank" rel="noopener noreferrer">Ver detalhes do evento<span className="sr-only"> (abre em nova aba)</span></a>
            </div>
          </article>)}
        </div>
        {multiple && <div className="event-carousel-controls"><button onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Evento anterior">←</button><span aria-live="polite">{active + 1} / {events.length}</span><button onClick={() => goTo(active + 1)} disabled={active === events.length - 1} aria-label="Próximo evento">→</button></div>}
      </div>
    </div>
  </section>;
}
