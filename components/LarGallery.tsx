"use client";

import { useEffect, useRef, useState } from "react";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const editedPhotos = [
  ["desenho", "Criança desenhando e colorindo em uma folha de papel"],
  ["argila", "Criança modelando argila em uma atividade na sala"],
  ["flores-e-argila", "Criança colocando flores em uma peça de argila"],
  ["leitura", "Duas crianças folheando livros no espaço de leitura"],
  ["exploracao-de-objetos", "Bebê explorando objetos sobre um tapete azul"],
  ["brinquedos", "Criança organizando brinquedos coloridos sobre a mesa"],
  ["atividade-com-arvore", "Grupo de crianças reunido ao redor de uma árvore no pátio"],
  ["pintura-coletiva", "Crianças em uma atividade de pintura coletiva ao ar livre"],
  ["leitura-em-grupo", "Educadora lendo para crianças sentadas em roda"],
  ["materiais-no-tapete", "Tubos e outros materiais organizados em um tapete colorido"],
  ["mesa-de-piquenique", "Crianças reunidas em torno de uma toalha de piquenique com alimentos"],
  ["evento", "Equipe preparando alimentos em um evento ao ar livre"],
].map(([name, alt]) => ({
  imgUrl: `/images/gallery/${name}.webp`,
  thumbnailUrl: `/images/gallery/${name}-mini.webp`,
  alt,
}));

const photos: CardItem[] = [
  ...editedPhotos.slice(0, 3),
  { imgUrl: "/images/lar-fachada.png", alt: "Fachada do Lar da Criança Fermino Magnani" },
  ...editedPhotos.slice(3),
];

export default function LarGallery({ motionEnabled }: { motionEnabled: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    if (!section.current) return;
    if (!window.IntersectionObserver) { setReady(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: "100px" });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return <section className="lar-gallery" id="galeria" ref={section} aria-labelledby="gallery-title">
    <div className="wrap gallery-heading"><p className="eyebrow">Galeria</p><h2 id="gallery-title">Um pouco do nosso dia a dia.</h2></div>
    <div className="gallery-stage">{ready ? <SocialCards cards={photos} motionEnabled={motionEnabled} onSelect={setSelected} /> : <img className="gallery-placeholder" src="/images/lar-fachada.png" alt="Fachada do Lar" loading="lazy" />}</div>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="gallery-dialog" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{selected !== null ? photos[selected].alt : "Foto do Lar"}</DialogTitle>
        {selected !== null && <img src={photos[selected].imgUrl} alt={photos[selected].alt} />}
      </DialogContent>
    </Dialog>
  </section>;
}
