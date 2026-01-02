interface PageBannerProps {
  title?: string;
  subtitle?: string;
}

export default function PageBanner({
  title = "Build Your Future With Us",
  subtitle = "Cms5.",
}: PageBannerProps) {
  return (
    <section className="bg-primary text-white py-5">
      <div className="container text-center">
        <h1 className="fw-bold mb-3">{title}</h1>
        <p className="lead mb-5">{subtitle}</p>
      </div>
    </section>
  );
}
