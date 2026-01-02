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

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [banners.length, interval]);

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <section
      style={{
        backgroundImage: `url(${banner.image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.10)",
        }}
      />

      <div
        className="container text-center text-white"
        style={{ position: "relative", zIndex: 2 }}
      >
        {banner.title && <h1 className="fw-bold mb-3">{banner.title}</h1>}
        {banner.description && (
          <p className="lead mb-4">{banner.description}</p>
        )}

        {banner.button_text && banner.url && (
          <a href={banner.url} className="btn btn-primary">
            {banner.button_text}
          </a>
        )}

        {/* dots */}
        <div className="mt-4 d-flex justify-content-center gap-2">
          {banners.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrent(index)}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor:
                  index === current
                    ? "#fff"
                    : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
