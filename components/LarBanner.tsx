const banners = {
  institucional: {
    href: "#sobre",
    description: "Cuidar, educar e acolher. Um lugar de descobertas, carinho e novas possibilidades.",
    action: "Conheça o Lar",
  },
  campanha: {
    href: "#doar",
    description: "Juntos pelo Lar da Criança.",
    action: "Faça parte",
  },
  servico: {
    href: "#contato",
    description: "Voluntariado no Lar!",
    action: "Quero ser voluntário",
  },
};

export default function LarBanner({ variant }: { variant: keyof typeof banners }) {
  const { href, description, action } = banners[variant];
  const image = `/images/banners/${variant}`;

  return (
    <a href={href} className={`wrap lar-banner lar-banner-${variant}`}>
      <img
        src={`${image}-1600.webp`}
        srcSet={`${image}-768.webp 768w, ${image}-1600.webp 1600w`}
        sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1184px) calc(100vw - 64px), 1120px"
        width={1600}
        height={800}
        alt={`${description} ${action}.`}
        loading="lazy"
        decoding="async"
      />
      <span className="lar-banner-action" aria-hidden="true">{action}</span>
    </a>
  );
}
