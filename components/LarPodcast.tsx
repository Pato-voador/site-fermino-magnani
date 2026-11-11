"use client";

import { useRef } from "react";
import { Headphones } from "lucide-react";

const clips = [
  { id: "acolhimento-na-creche", title: "Acolhimento na creche" },
  { id: "comida-com-carinho", title: "Comida com carinho" },
  { id: "recado-a-comunidade", title: "Recado à comunidade" },
];

export default function LarPodcast() {
  const playing = useRef<HTMLAudioElement | null>(null);

  function playTrack(track: HTMLAudioElement) {
    if (playing.current !== track) playing.current?.pause();
    playing.current = track;
  }

  return (
    <section className="section wrap lar-podcast" id="podcast" aria-labelledby="podcast-title">
      <div className="section-heading">
        <h2 id="podcast-title">Podcast do Lar</h2>
        <p>Uma conversa sobre acolhimento na creche, alimentação e o papel da comunidade.</p>
      </div>
      <div className="lar-podcast-grid">
        <div className="lar-podcast-episode">
          <Headphones size={28} aria-hidden="true" />
          <h3 id="podcast-episode">Episódio completo</h3>
          <audio
            controls
            preload="none"
            src="/audio/podcast/episodio-completo.mp3"
            aria-labelledby="podcast-episode"
            onPlay={event => playTrack(event.currentTarget)}
          />
        </div>
        <div className="lar-podcast-clips">
          <h3>Cortes do episódio</h3>
          <ul>
            {clips.map(({ id, title }) => (
              <li key={id}>
                <h4 id={`podcast-${id}`}>{title}</h4>
                <audio
                  controls
                  preload="none"
                  src={`/audio/podcast/${id}.mp3`}
                  aria-labelledby={`podcast-${id}`}
                  onPlay={event => playTrack(event.currentTarget)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
