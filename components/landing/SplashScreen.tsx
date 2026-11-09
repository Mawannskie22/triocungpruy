"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MapGlyph } from "@/components/map/map-icons";
import type { ReportCategory } from "@/types/report";

const SESSION_KEY = "lapor-balik-splash-seen-v1";
const DRIVE_DURATION = 2600;
const ARRIVAL_HOLD = 300;
const EXIT_DURATION = 750;

const roadsideSigns: { category: ReportCategory; label: string; side: "left" | "right" }[] = [
  { category: "jalan-rusak", label: "Jalan rusak", side: "left" },
  { category: "genangan", label: "Genangan", side: "right" },
  { category: "lampu-mati", label: "Lampu mati", side: "left" },
  { category: "sampah", label: "Sampah", side: "right" },
];

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);
  const frame = useRef<number | null>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressTextRef = useRef<HTMLElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      const replay = new URLSearchParams(window.location.search).get("intro") === "1";
      if (replay) delete document.documentElement.dataset.splashSeen;
      if (!replay && sessionStorage.getItem(SESSION_KEY) === "1") {
        document.documentElement.dataset.splashSeen = "1";
        setVisible(false);
        return;
      }
    } catch {
      // The intro can still run when browser storage is unavailable.
    }

    skipRef.current?.focus();
    const startedAt = performance.now();
    let lastPercent = -1;

    const drive = (now: number) => {
      const progress = Math.min((now - startedAt) / DRIVE_DURATION, 1);
      const percent = Math.floor(progress * 100);
      const viewportHeight = window.innerHeight;
      const isMobile = window.innerWidth <= 700;
      const startY = viewportHeight * (isMobile ? 0.88 : 0.86);
      const endY = viewportHeight * (isMobile ? 0.52 : 0.47);
      const y = startY + (endY - startY) * progress;
      const scale = 1.05 - 0.91 * progress;

      if (carRef.current) {
        carRef.current.style.transform = `translate(-50%, -50%) translateY(${y - viewportHeight / 2}px) scale(${scale})`;
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${progress * 100}%`;
      }
      if (percent !== lastPercent) {
        progressTextRef.current!.textContent = `${percent}%`;
        progressRef.current?.setAttribute("aria-valuenow", String(percent));
        lastPercent = percent;
      }

      if (progress < 1) {
        frame.current = window.requestAnimationFrame(drive);
      } else {
        progressLabelRef.current!.textContent = "TIBA DI MONAS";
        timers.current = [
          window.setTimeout(() => setLeaving(true), ARRIVAL_HOLD),
          window.setTimeout(() => {
            try {
              sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
              // The intro can finish when browser storage is unavailable.
            }
            document.documentElement.dataset.splashSeen = "1";
            setVisible(false);
          }, ARRIVAL_HOLD + EXIT_DURATION),
        ];
      }
    };

    frame.current = window.requestAnimationFrame(drive);
    return () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  function skip() {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    timers.current.forEach(window.clearTimeout);
    setLeaving(true);
    timers.current = [
      window.setTimeout(() => {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // The intro can finish when browser storage is unavailable.
        }
        document.documentElement.dataset.splashSeen = "1";
        setVisible(false);
      }, EXIT_DURATION),
    ];
  }

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`splash-screen ${leaving ? "splash-screen--leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Animasi pembuka Lapor Balik"
    >
      <div className="splash-scene" aria-hidden="true">
        <div className="splash-scene-shade" />
        <div className="splash-road-glow" />
        {roadsideSigns.map((sign, index) => (
          <div
            className={`splash-sign splash-sign--${sign.side}`}
            key={sign.category}
            style={{ animationDelay: `${0.15 + index * 0.45}s` }}
          >
            <div className="splash-sign-face">
              <MapGlyph category={sign.category} />
              <strong>{sign.label}</strong>
            </div>
            <span className="splash-sign-pole" />
          </div>
        ))}
        <div className="splash-car-shadow" />
        <Image
          ref={carRef}
          className="splash-car"
          src="/images/splash/car-rear.webp"
          alt=""
          width={994}
          height={848}
          priority
        />
      </div>
      <div className="splash-topline">
        <span className="splash-brand">
          LAPOR<span>BALIK</span>
        </span>
        <button ref={skipRef} type="button" onClick={skip}>
          Lewati intro <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="splash-caption">
        <span>JAKARTA, DARI DEKAT</span>
        <strong>Setiap titik punya cerita.</strong>
      </div>
      <div className="splash-loading">
        <div className="splash-loading-meta">
          <span ref={progressLabelRef}>MENUJU MONAS</span>
          <strong ref={progressTextRef}>0%</strong>
        </div>
        <div
          ref={progressRef}
          className="splash-progress"
          role="progressbar"
          aria-label="Perjalanan menuju Monas"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        >
          <span ref={progressFillRef} />
        </div>
      </div>
    </div>
  );
}
