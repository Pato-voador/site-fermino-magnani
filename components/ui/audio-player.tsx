"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

type Track = { src: string; title: string };

type AudioPlayerProps = {
  tracks: readonly [Track, ...Track[]];
  cover: string;
  coverAlt: string;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export default function AudioPlayer({ tracks, cover, coverAlt }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);
  const [repeat, setRepeat] = useState(false);
  const [error, setError] = useState(false);
  const track = tracks[trackIndex];
  const trackOrder = tracks.map((_, index) => index);
  const elapsed = Math.min(currentTime, duration);
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;

  const attachAudio = useCallback((audio: HTMLAudioElement | null) => {
    audioRef.current = audio;
    if (audio && Number.isFinite(audio.duration)) setDuration(audio.duration);
  }, []);

  function play(audio: HTMLAudioElement) {
    setError(false);
    if (audio.error) audio.load();
    void audio.play().catch((reason: DOMException) => {
      if (reason.name !== "AbortError") setError(true);
    });
  }

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play(audio);
    else audio.pause();
  }

  function selectTrack(index: number, startPlayback: boolean) {
    const audio = audioRef.current;
    if (!audio) return;

    setTrackIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setError(false);
    // Set the source before calling play in the same user gesture, including on iOS.
    audio.src = tracks[index].src;
    if (startPlayback) play(audio);
  }

  function stepTrack(direction: -1 | 1) {
    const order = shuffledOrder ?? trackOrder;
    const position = order.indexOf(trackIndex);
    const index = order[(position + direction + order.length) % order.length];
    selectTrack(index, audioRef.current?.paused === false);
  }

  function toggleShuffle() {
    if (shuffledOrder) {
      setShuffledOrder(null);
      return;
    }

    const remaining = trackOrder.filter(index => index !== trackIndex);
    for (let index = remaining.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [remaining[index], remaining[other]] = [remaining[other], remaining[index]];
    }
    setShuffledOrder([trackIndex, ...remaining]);
  }

  function seek(time: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <div className="lar-podcast-grid">
      <div className="audio-player">
        <audio
          ref={attachAudio}
          src={tracks[0].src}
          preload="metadata"
          loop={repeat}
          hidden
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => { setIsPlaying(false); setError(true); }}
          onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
          onDurationChange={event => {
            const time = event.currentTarget.duration;
            setDuration(Number.isFinite(time) ? time : 0);
          }}
        />

        <img className="audio-player-cover" src={cover} alt={coverAlt} width={900} height={900} loading="lazy" />

        <h3 className="audio-player-title" aria-live="polite">{track.title}</h3>
        <div className="audio-player-timeline">
          <input
            className="audio-player-progress"
            type="range"
            min={0}
            max={duration || 1}
            step="any"
            value={elapsed}
            disabled={duration === 0}
            style={{ "--audio-progress": `${progress}%` } as CSSProperties}
            aria-label="Posição no áudio"
            aria-valuetext={duration > 0 ? `${formatTime(elapsed)} de ${formatTime(duration)}` : "Duração indisponível"}
            onChange={event => seek(event.currentTarget.valueAsNumber)}
          />
          <div className="audio-player-times" aria-hidden="true">
            <span>{formatTime(elapsed)}</span>
            <span>{duration > 0 ? formatTime(duration) : "–:–"}</span>
          </div>
        </div>

        <div className="audio-player-controls" role="group" aria-label="Controles do podcast">
          <Button type="button" variant="ghost" size="icon" className="audio-control" aria-label="Ordem aleatória" aria-pressed={shuffledOrder !== null} disabled={tracks.length < 2} onClick={toggleShuffle}>
            <Shuffle className="size-5" aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="audio-control" aria-label="Faixa anterior" disabled={tracks.length < 2} onClick={() => stepTrack(-1)}>
            <SkipBack className="size-5" aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="audio-control audio-control-play" aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"} onClick={togglePlayback}>
            {isPlaying ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
          </Button>
          <Button type="button" variant="ghost" size="icon" className="audio-control" aria-label="Próxima faixa" disabled={tracks.length < 2} onClick={() => stepTrack(1)}>
            <SkipForward className="size-5" aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="audio-control" aria-label="Repetir faixa" aria-pressed={repeat} onClick={() => setRepeat(value => !value)}>
            <Repeat className="size-5" aria-hidden="true" />
          </Button>
        </div>
        {error && <p className="audio-player-error" role="status">Não foi possível reproduzir o áudio. Tente novamente.</p>}
      </div>

      <div className="audio-player-playlist">
        <h3>Episódio e cortes</h3>
        <ul>
          {tracks.map((item, index) => {
            const active = index === trackIndex;
            const playing = active && isPlaying;

            return (
              <li key={item.src}>
                <button
                  type="button"
                  className="audio-player-track"
                  aria-current={active ? "true" : undefined}
                  aria-label={`${playing ? "Pausar" : "Reproduzir"} ${item.title}`}
                  onClick={() => active ? togglePlayback() : selectTrack(index, true)}
                >
                  {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                  <span>{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
