"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, MapPin, Menu, Phone, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import LarGallery from "@/components/LarGallery";
import SiteMotion, { scrollToSection } from "@/components/SiteMotion";
import LarHeroBackground from "@/components/LarHeroBackground";
import EventCarousel from "@/components/EventCarousel";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { lar } from "@/lib/lar";

const nav = [
  ["Nossa história", "sobre"], ["Galeria", "galeria"], ["Como ajudar", "doar"],
  ["Empresas", "empresas"], ["Eventos", "eventos"], ["Transparência", "transparencia"], ["Contato", "contato"],
];
const milestones = [
  { year: "1960", title: "A história começa", text: "Fundação do Lar da Criança Fermino Magnani." },
  { year: "1963", title: "Portas abertas", text: "Início das atividades junto às crianças e suas famílias." },
  { year: "Hoje", title: "O cuidado continua", text: "Educação, alimentação e convivência, com o apoio da comunidade." },
];
const partnerships = [
  ["Apoio financeiro", "Contribua para o cuidado diário."],
  ["Produtos e serviços", "Compartilhe o que sua empresa faz."],
  ["Projetos e eventos", "Participe das iniciativas do Lar."],
];
const documents = [
  ["parcerias", "Parcerias e planos de trabalho", "Termos de colaboração e planos de trabalho da instituição."],
  ["contas", "Prestação de contas", "Demonstrativos de receitas, despesas e prestações de contas."],
  ["monitoramento", "Monitoramento e relatórios", "Documentos de acompanhamento das parcerias."],
];
function External({ href, children, className = "text-link" }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span>
  </a>;
}
function Brand() {
  return <a href="#inicio" className="brand" aria-label="Lar da Criança Fermino Magnani — início">
    <img src="/images/logo-lar.jpg" alt="" width="56" height="56" />
    <span>Lar da Criança<strong>Fermino Magnani</strong></span>
  </a>;
}

export default function Home() {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [interest, setInterest] = useState("");
  const menuDestination = useRef<string | null>(null);

  return <>
    <SiteMotion enabled={motionEnabled} />
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <div className="header-actions">
          <InteractiveHoverButton className="header-donate" href="#doar">Quero ajudar</InteractiveHoverButton>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild><button className="menu-toggle" aria-label="Abrir menu de navegação"><span>Menu</span><Menu size={21} aria-hidden="true" /></button></SheetTrigger>
            <SheetContent className="lar-sheet" showCloseButton={false} aria-describedby={undefined}
              onCloseAutoFocus={event => {
                const destination = menuDestination.current;
                if (!destination) return;
                event.preventDefault();
                menuDestination.current = null;
                requestAnimationFrame(() => scrollToSection(destination, motionEnabled));
              }}>
              <SheetClose asChild><button className="close-button" aria-label="Fechar menu"><X size={22} /></button></SheetClose>
              <SheetHeader><p className="eyebrow">Lar da Criança</p><SheetTitle>Conheça o Lar.</SheetTitle></SheetHeader>
              <nav aria-label="Navegação principal">
                {nav.map(([label, id], index) => <a key={id} href={`#${id}`} onClick={event => {
                  event.preventDefault(); menuDestination.current = id; setMenuOpen(false);
                }}><span className="menu-number">{String(index + 1).padStart(2, "0")}</span>{label}</a>)}
              </nav>
              <div className="menu-theme"><span>Tema escuro</span><CinematicThemeSwitcher motionEnabled={motionEnabled} /></div>
              <a className="menu-phone" href="tel:+551433721836"><Phone size={17} aria-hidden="true" />{lar.fixedPhone}</a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>

    <main id="conteudo" tabIndex={-1}>
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <LarHeroBackground enabled={motionEnabled} /><div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy wrap">
          <p className="eyebrow">Santa Cruz do Rio Pardo · Desde 1960</p>
          <h1 id="hero-title">Cuidar da infância.<br /><span>Construir o amanhã.</span></h1>
          <p className="lead">Cuidado e educação, junto às crianças e suas famílias.</p>
          <div className="actions"><a href="#doar" className="button hero-primary">Quero fazer parte</a><a href="#sobre" className="button hero-secondary">Conheça o Lar<ChevronDown size={18} aria-hidden="true" /></a></div>
        </div>
      </section>

      <section className="section wrap history-section" id="sobre" aria-labelledby="sobre-title">
        <div className="section-heading"><div><p className="eyebrow">Nossa história</p><h2 id="sobre-title">Uma vida de cuidado.</h2></div><p>Parte da história de Santa Cruz do Rio Pardo e das famílias que vivem aqui.</p></div>
        <ol className="history-timeline">
          {milestones.map(milestone => <li key={milestone.year}>
            <span className="timeline-year">{milestone.year}</span>
            <span className="timeline-marker" aria-hidden="true" />
            <h3>{milestone.title}</h3><p>{milestone.text}</p>
          </li>)}
        </ol>
      </section>

      <LarGallery motionEnabled={motionEnabled} />

      <section className="section donation-section" id="doar" aria-labelledby="doar-title">
        <div className="wrap donation-grid">
          <div className="donation-copy"><p className="eyebrow">Como ajudar</p><h2 id="doar-title">Seu apoio faz parte<br />dessa história.</h2><p>Ajude a manter o cuidado diário e os espaços do Lar.</p><a href="#transparencia" className="text-link">Conheça nossa transparência<ChevronDown size={16} aria-hidden="true" /></a></div>
          <div className="donation-card"><h3>Contribua com o Lar</h3><p className="field-label" id="pix-label">Chave Pix</p><div className="pix-value" aria-labelledby="pix-label">{lar.pix}</div><button className="button button-green full" disabled>Copiar chave Pix</button><div className="donation-other"><span>Outras formas de ajudar</span><a href="tel:+551433721836"><Phone size={17} aria-hidden="true" />{lar.fixedPhone}</a></div></div>
        </div>
      </section>

      <section className="section wrap partners-section" id="empresas" aria-labelledby="empresas-title">
        <div className="partners-intro"><p className="eyebrow">Empresas e parceiros</p><h2 id="empresas-title">Vamos somar?</h2><p>Encontre uma forma de contribuir com o Lar.</p><button className="button button-green" onClick={() => setPartnerOpen(true)}>Quero ser parceiro</button></div>
        <div className="partner-options">{partnerships.map(([title, body], i) => <article key={title} className="partner-row"><span className="option-number">0{i + 1}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
      </section>

      <EventCarousel />

      <section className="section wrap transparency-grid" id="transparencia" aria-labelledby="transparencia-title">
        <div><p className="eyebrow">Transparência</p><h2 id="transparencia-title">Confiança se constrói.</h2><p>Consulte os documentos do Lar no portal da Prefeitura.</p><External href={lar.transparency}>Acessar portal</External></div>
        <Accordion type="single" collapsible className="documents">{documents.map(([id, title, description]) => <AccordionItem key={id} value={id}><AccordionTrigger className="doc-trigger">{title}</AccordionTrigger><AccordionContent className="doc-content"><p>{description}</p><External href={lar.transparency}>Consultar documentos</External></AccordionContent></AccordionItem>)}</Accordion>
      </section>

      <section className="section contact-section" id="contato" aria-labelledby="contato-title">
        <div className="wrap contact-grid">
          <div><p className="eyebrow">Contato</p><h2 id="contato-title">Perto de você.</h2><a className="button button-green contact-phone" href="tel:+551433721836"><Phone size={18} aria-hidden="true" />{lar.fixedPhone}</a></div>
          <address><div className="contact-address"><MapPin size={21} aria-hidden="true" /><p>Rua Albino Trevisan, 115 · Vila Oitenta<br /><span>Santa Cruz do Rio Pardo · SP</span></p></div><div className="contact-channels"><div><span className="field-label">WhatsApp</span><p>{lar.mobilePhone}</p><button className="contact-whatsapp" disabled>Conversar pelo WhatsApp</button></div><div><span className="field-label">E-mail</span><p>{lar.email}</p></div></div></address>
        </div>
      </section>
    </main>

    <footer><div className="wrap footer-main"><Brand /><div className="social-links"><External href={lar.instagram}>Instagram</External><External href={lar.facebook}>Facebook</External></div></div>
      <div className="wrap footer-bottom"><span>CNPJ {lar.cnpj}</span><div className="footer-tools"><button className="motion-toggle" onClick={() => setMotionEnabled(value => !value)} aria-pressed={motionEnabled}>{motionEnabled ? "Pausar animações" : "Ativar animações"}</button><details className="image-credits"><summary>Créditos de imagem</summary><p>Retrato de Mário Sérgio Cortella: <External href="https://commons.wikimedia.org/wiki/File:Mario_Sergio_Cortella.jpg">Multishow</External> · <External href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</External>.</p></details></div></div>
    </footer>

    <Dialog open={partnerOpen} onOpenChange={setPartnerOpen}>
      <DialogContent className="partner-dialog" showCloseButton={false}>
        <DialogClose asChild><button className="close-button" aria-label="Fechar formulário"><X size={20} /></button></DialogClose>
        <DialogHeader><DialogTitle className="form-title">Vamos conversar sobre parceria.</DialogTitle><DialogDescription>Conte como sua empresa gostaria de apoiar o Lar.</DialogDescription></DialogHeader>
        <form onSubmit={event => event.preventDefault()} className="partner-form">
          <div className="form-grid"><label>Nome<input name="name" autoComplete="name" required maxLength={120} /></label><label>Empresa<input name="company" autoComplete="organization" required maxLength={160} /></label><label>Cargo<input name="role" autoComplete="organization-title" maxLength={100} /></label><label>E-mail<input type="email" name="email" autoComplete="email" required maxLength={180} /></label><label>Telefone<input type="tel" name="phone" autoComplete="tel" required maxLength={30} /></label><div className="field"><label htmlFor="interesse">Interesse na parceria</label><Select value={interest} onValueChange={setInterest}><SelectTrigger id="interesse" className="interest-select"><SelectValue placeholder="Selecione uma opção" /></SelectTrigger><SelectContent><SelectItem value="financeiro">Apoio financeiro</SelectItem><SelectItem value="produtos">Produtos ou serviços</SelectItem><SelectItem value="eventos">Projetos ou eventos</SelectItem><SelectItem value="outro">Outra possibilidade</SelectItem></SelectContent></Select></div></div>
          <label>Mensagem<textarea name="message" rows={3} maxLength={3000} /></label><button className="button button-green full" type="submit" disabled>Enviar interesse</button>
        </form>
      </DialogContent>
    </Dialog>
  </>;
}
