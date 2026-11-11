import { lar } from "./lar";

type EventImage = {
  src: string;
  alt: string;
  illustrative?: boolean;
  position?: string;
};

export type LarEvent = {
  id: string;
  title: string;
  description?: string;
  upcomingNotice?: string;
  date: string;
  time?: string;
  endsAt?: string;
  details?: string;
  image: EventImage;
  link?: { href: string; label: string };
  historicalAnnouncement?: boolean;
};

const events: LarEvent[] = [
  {
    id: "cortella",
    title: "Uma noite com Cortella",
    description: "Educação e família em uma conversa em benefício do Lar.",
    date: "2026-09-11",
    time: "20h",
    details: "Palácio da Cultura",
    image: { src: "/images/cortella-retrato.jpg", alt: "Mário Sérgio Cortella durante entrevista" },
    link: { href: lar.cortellaPost, label: "Ver detalhes do evento" },
    historicalAnnouncement: true,
  },
  {
    id: "festa-da-primavera",
    title: "Festa da Primavera",
    description: "Apresentações temáticas.",
    date: "2026-12-09",
    time: "7h às 10h",
    endsAt: "10:00",
    details: "Evento fechado para familiares",
    image: { src: "/images/gallery/flores-e-argila-mini.webp", alt: "Atividade com flores e argila", illustrative: true, position: "center 72%" },
  },
  {
    id: "amostra-de-artes",
    title: "Amostra de Projeto de Artes",
    description: "Brincar, Ler e Aprender.",
    date: "2026-12-09",
    time: "7h às 10h",
    endsAt: "10:00",
    details: "Evento fechado para familiares",
    image: { src: "/images/gallery/pintura-coletiva-mini.webp", alt: "Atividade de pintura coletiva no Lar", illustrative: true },
  },
  {
    id: "feijoada",
    title: "Feijoada",
    upcomingNotice: "Prepare-se, está chegando! Mais informações em breve.",
    date: "2027-05-16",
    details: "Apenas delivery",
    image: { src: "/images/events/feijoada.webp", alt: "Feijoada brasileira com acompanhamentos", illustrative: true },
    link: { href: lar.instagram, label: "Acompanhar no Instagram" },
  },
  {
    id: "pizza",
    title: "Pizza",
    upcomingNotice: "Prepare-se, está chegando! Mais informações em breve.",
    date: "2027-09-25",
    image: { src: "/images/events/pizza.webp", alt: "Pizza assada vista de cima", illustrative: true },
    link: { href: lar.instagram, label: "Acompanhar no Instagram" },
  },
];

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function eventDateLabel(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}

function archiveTime(event: LarEvent) {
  const localTime = Date.parse(`${event.date}T${event.endsAt ?? "00:00"}:00-03:00`);
  return event.endsAt ? localTime : localTime + 24 * 60 * 60 * 1000;
}

export function eventsByPeriod(now: number) {
  return {
    upcoming: events.filter(event => now < archiveTime(event)).sort((a, b) => a.date.localeCompare(b.date)),
    past: events.filter(event => now >= archiveTime(event)).sort((a, b) => b.date.localeCompare(a.date)),
  };
}
