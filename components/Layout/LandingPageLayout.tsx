import React from "react";
import LandingTopbar from './LandingTopbar';
import LandingFooter from './LandingFooter';

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

export default function LandingPageLayout({ children }: LandingPageLayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navigation */}
      <LandingTopbar />

      {/* Hero / Banner */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="fw-bold mb-3">Build Your Future With Us</h1>
          <p className="lead mb-4">
            Find talent, get hired, and manage work efficiently in one platform.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <a href="/register" className="btn btn-light btn-lg">
              Get Started
            </a>
            <a href="/login" className="btn btn-outline-light btn-lg">
              Login
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow-1 py-5">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
