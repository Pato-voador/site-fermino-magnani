"use client";

import { useEffect, useRef, useState } from "react";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const photos: CardItem[] = [
  { imgUrl: "/images/gallery/lar-001.jpg", alt: "Mesa preparada com utensílios e materiais para brincar" },
  { imgUrl: "/images/gallery/lar-015.jpg", alt: "Grupo de adultos reunido na cozinha do Lar" },
  { imgUrl: "/images/gallery/lar-061.jpg", alt: "Materiais de exploração organizados em um tapete colorido" },
  { imgUrl: "/images/lar-fachada.png", alt: "Fachada do Lar da Criança Fermino Magnani" },
  { imgUrl: "/images/gallery/lar-071.jpg", alt: "Materiais naturais e utensílios preparados no jardim" },
  { imgUrl: "/images/gallery/lar-024.jpg", alt: "Adultos preparando pizzas na cozinha" },
  { imgUrl: "/images/gallery/lar-070.jpg", alt: "Grupo de adultas junto a uma mesa de alimentos" },
  { imgUrl: "/images/lar-ambiente.jpg", alt: "Sala do Lar com materiais e espaços para brincar" },
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
    <div className="wrap gallery-heading"><p className="eyebrow">Nosso Lar em imagens</p><h2 id="gallery-title">Um pouco de perto.</h2><p>Espaços, descobertas e gente que faz parte dessa história.</p></div>
    <div className="gallery-stage">{ready ? <SocialCards cards={photos} motionEnabled={motionEnabled} onSelect={setSelected} /> : <img className="gallery-placeholder" src="/images/lar-fachada.png" alt="Fachada do Lar" loading="lazy" />}</div>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="gallery-dialog" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{selected !== null ? photos[selected].alt : "Foto do Lar"}</DialogTitle>
        {selected !== null && <img src={photos[selected].imgUrl} alt={photos[selected].alt} />}
      </DialogContent>
    </Dialog>
  </section>;
}
