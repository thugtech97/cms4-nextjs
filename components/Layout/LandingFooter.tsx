import React from "react";

export default function LandingFooter() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="fw-bold">MyPlatform</h5>
            <p className="small text-muted">
              © {new Date().getFullYear()} MyPlatform. All rights reserved.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <a href="/privacy" className="text-white text-decoration-none me-3">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white text-decoration-none">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
