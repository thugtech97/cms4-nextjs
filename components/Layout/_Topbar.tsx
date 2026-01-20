import React from "react";
import Link from "next/link";
import Menu from "./_Menu";

export default function LandingTopbar() {
  return (
    <nav className="navbar navbar-expand-lg landing-topbar">
      <div className="container">
        <Link href="/public/home" className="navbar-brand landing-brand">
          Cms<span>5</span>
        </Link>

        <button
          className="navbar-toggler landing-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#landingNavbar"
          aria-controls="landingNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="collapse navbar-collapse" id="landingNavbar">
          <Menu />
        </div>
      </div>
    </nav>
  );
}
