import AudioPlayer from "@/components/ui/audio-player";

const episode = { src: "/audio/podcast/episodio-completo.mp3", title: "Episódio completo", durationSeconds: 291 };

const clips = [
  { src: "/audio/podcast/acolhimento-na-creche.mp3", title: "Acolhimento na creche", durationSeconds: 51 },
  { src: "/audio/podcast/comida-com-carinho.mp3", title: "Comida com carinho", durationSeconds: 37 },
  { src: "/audio/podcast/recado-a-comunidade.mp3", title: "Recado à comunidade", durationSeconds: 39 },
];

export default function LarPodcast() {
  return (
    <section className="section wrap lar-podcast" id="podcast" aria-labelledby="podcast-title">
      <div className="section-heading">
        <h2 id="podcast-title">Podcast do Lar</h2>
        <p>Uma conversa sobre acolhimento na creche, alimentação e o papel da comunidade.</p>
      </div>
      <AudioPlayer
        episode={episode}
        clips={clips}
        cover="/images/podcast/capa.webp"
        coverAlt="Capa do Podcast do Lar da Criança Fermino Magnani"
      />
    </section>
  );
}
