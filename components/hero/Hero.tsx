"use client";

import Link from "next/link";
import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cities } from "@/data/cities";

export function Hero() {
  const [slide, setSlide] = useState({ active: 0, previous: null as number | null, zoomIn: true });
  const active = slide.active;
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setSlide((current) => ({
        active: (current.active + 1) % cities.length,
        previous: current.active,
        zoomIn: !current.zoomIn,
      }));
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [slide.active, slide.zoomIn]);

  function showCity(index: number) {
    const next = (index + cities.length) % cities.length;
    setSlide((current) =>
      current.active === next
        ? current
        : {
            active: next,
            previous: current.active,
            zoomIn: !current.zoomIn,
          },
    );
  }

  return (
    <section
      className="hero hero--daylight"
      id="beranda"
      aria-labelledby="hero-title"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 55) showCity(active + (distance < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      <div className="hero-slides">
        {cities.map((city, index) => {
          const {
            props: { srcSet: desktopSrcSet },
          } = getImageProps({
            src: city.image,
            alt: city.alt,
            fill: true,
            sizes: "100vw",
            quality: 85,
          });

          return (
            <picture
              key={city.name}
              className={`hero-image ${index === active ? `active ${slide.zoomIn ? "zoom-in" : "zoom-out"}` : index === slide.previous ? `is-exiting ${slide.zoomIn ? "exit-normal" : "exit-zoomed"}` : ""}`}
            >
              <source media="(min-width: 701px)" srcSet={desktopSrcSet} sizes="100vw" />
              <Image
                src={city.mobileImage}
                alt={city.alt}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="100vw"
                quality={85}
                aria-hidden={index !== active}
              />
            </picture>
          );
        })}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="container hero-content">
        <span className="hero-kicker">
          <span className="kicker-dot" /> PLATFORM ASPIRASI WARGA JAKARTA
        </span>
        <h1 id="hero-title">
          <span className="hero-title-line">Kotamu punya cerita.</span>
          <em>Suaramu punya arti.</em>
        </h1>
        <p>
          Laporkan jalan rusak, lampu mati, sampah, dan masalah di sekitarmu. Pantau perkembangannya
          sampai selesai.
        </p>
        <div className="hero-actions">
          <Link href="/lapor" className="button button-primary">
            Lapor Sekarang <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/status" className="button button-outline">
            Cek Status Laporan
          </Link>
        </div>
      </div>
      <div className="hero-city-control">
        <div className="hero-caption">
          <span className="caption-line" /> {cities[active].name.toUpperCase()}, JAKARTA
        </div>
        <div className="hero-dots" role="group" aria-label="Pilih visual kota">
          {cities.map((city, index) => (
            <button
              key={city.name}
              type="button"
              className={index === active ? "active" : ""}
              aria-label={`Tampilkan ${city.name}`}
              aria-pressed={index === active}
              onClick={() => showCity(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="hero-scroll">
        GULIR UNTUK JELAJAH <span aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
