import AudioPlayer from "@/components/ui/audio-player";

const tracks = [
  { src: "/audio/podcast/episodio-completo.mp3", title: "Episódio completo" },
  { src: "/audio/podcast/acolhimento-na-creche.mp3", title: "Acolhimento na creche" },
  { src: "/audio/podcast/comida-com-carinho.mp3", title: "Comida com carinho" },
  { src: "/audio/podcast/recado-a-comunidade.mp3", title: "Recado à comunidade" },
] as const;

export default function LarPodcast() {
  return (
    <section className="section wrap lar-podcast" id="podcast" aria-labelledby="podcast-title">
      <div className="section-heading">
        <h2 id="podcast-title">Podcast do Lar</h2>
        <p>Uma conversa sobre acolhimento na creche, alimentação e o papel da comunidade.</p>
      </div>
      <AudioPlayer tracks={tracks} cover="/images/podcast/capa.webp" coverAlt="Capa do Podcast do Lar da Criança Fermino Magnani" />
    </section>
  );
}
