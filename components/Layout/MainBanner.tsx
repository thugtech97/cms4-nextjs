import { useEffect, useState } from "react";
import { PublicAlbum } from "@/services/publicPageService";

interface MainBannerProps {
  album: PublicAlbum;
}

export default function MainBanner({ album }: MainBannerProps) {
  const banners = album.banners || [];
  const [current, setCurrent] = useState(0);

  const interval =
    typeof album.transition === "number"
      ? album.transition * 1000
      : 5000;

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % banners.length),
      interval
    );
    return () => clearInterval(timer);
  }, [banners.length, interval]);

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <section className="main-banner">
      {/* SLIDES */}
      {banners.map((b, i) => (
        <div
          key={i}
          className={`banner-slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${b.image_url})` }}
        />
      ))}

      {/* OVERLAY */}
      <div className="banner-overlay" />

      {/* CONTENT */}
      <div className="banner-content container">
        <div className="banner-card">
          {banner.title && <h1>{banner.title}</h1>}
          {banner.description && <p>{banner.description}</p>}
          {banner.button_text && banner.url && (
            <a href={banner.url} target="_blank" className="btn btn-primary btn-lg">
              {banner.button_text}
            </a>
          )}
        </div>
      </div>

      {/* DOTS */}
      <div className="banner-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={i === current ? "active" : ""}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}
