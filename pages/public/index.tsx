import LandingPageLayout from "@/components/Layout/GuestLayout";

export default function HomePage() {
  return (
    <div>
      <section id="features" className="mb-5">
        <h2 className="fw-bold mb-3">Features</h2>
        <p>Post jobs, manage contracts, and pay securely.</p>
      </section>

      <section id="how-it-works" className="mb-5">
        <h2 className="fw-bold mb-3">How It Works</h2>
        <p>Sign up, connect, and start working.</p>
      </section>
    </div>
  );
}

HomePage.Layout = LandingPageLayout;
