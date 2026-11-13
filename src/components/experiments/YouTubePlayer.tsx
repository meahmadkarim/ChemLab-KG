"use client";
import { useEffect, useRef, useState } from "react";

interface Player { getCurrentTime(): number; destroy(): void }
interface PlayerAPI { Player: new (element: HTMLElement, options: object) => Player }
declare global { interface Window { YT?: PlayerAPI; onYouTubeIframeAPIReady?: () => void } }
let loading: Promise<PlayerAPI> | undefined;
function loadPlayerAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return loading ??= new Promise<PlayerAPI>((resolve, reject) => {
    const timeout = setTimeout(() => { loading = undefined; reject(new Error("Video player timed out.")); }, 15000);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); previous?.(); if (window.YT) resolve(window.YT); };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => { clearTimeout(timeout); loading = undefined; reject(new Error("Video player unavailable.")); };
    document.head.append(script);
  });
}

export function YouTubePlayer({ videoId, startSeconds, autoplay, title, onTime }: { videoId: string; startSeconds: number; autoplay: boolean; title: string; onTime: (seconds: number) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const onTimeRef = useRef(onTime);
  const [failed, setFailed] = useState(false);
  useEffect(() => { onTimeRef.current = onTime; }, [onTime]);
  useEffect(() => {
    let active = true;
    let player: Player | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    const host = container.current;
    void loadPlayerAPI().then(api => {
      if (!active || !host) return;
      const element = document.createElement("div");
      host.replaceChildren(element);
      player = new api.Player(element, {
        host: "https://www.youtube-nocookie.com", width: "100%", height: "100%", videoId,
        playerVars: { origin: window.location.origin, start: startSeconds, autoplay: autoplay ? 1 : 0, cc_load_policy: 1, rel: 0 },
        events: {
          onReady() { host.querySelector("iframe")?.setAttribute("title", title); timer = setInterval(() => { const time = player?.getCurrentTime(); if (typeof time === "number" && Number.isFinite(time)) onTimeRef.current(Math.floor(time)); }, 1000); },
          onError() { if (active) setFailed(true); },
        },
      });
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; if (timer) clearInterval(timer); player?.destroy(); };
  }, [videoId, startSeconds, autoplay, title]);
  return <div className="h-full w-full relative"><div ref={container} className="h-full w-full"><a className="grid h-full place-content-center p-6 text-center text-white underline" href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">Loading video… Open on YouTube</a></div>{failed && <a className="absolute inset-0 grid place-content-center bg-slate-900 p-6 text-white underline" href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">Open video on YouTube</a>}</div>;
}
