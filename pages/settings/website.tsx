import { useState, ChangeEvent } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

type TabKey = "website" | "contact" | "social" | "privacy";

function WebsiteSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("website");

  /* =======================
     Website tab state
  ======================= */
  const [companyName, setCompanyName] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [copyright, setCopyright] = useState("");
  const [logoName, setLogoName] = useState("");
  const [faviconName, setFaviconName] = useState("");
  const [analytics, setAnalytics] = useState("");
  const [googleMap, setGoogleMap] = useState("");
  const [recaptcha, setRecaptcha] = useState("");

  /* =======================
     Contact tab state
  ======================= */
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [fax, setFax] = useState("");
  const [telephone, setTelephone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  /* =======================
     Handlers
  ======================= */
  const handleFileName = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    if (e.target.files?.[0]) {
      setter(e.target.files[0].name);
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Website Settings</h3>

      <div className="card">
        {/* Tabs */}
        <div className="card-header bg-white border-0 pb-0">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "website" ? "active" : ""}`}
                onClick={() => setActiveTab("website")}
              >
                Website
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
                onClick={() => setActiveTab("contact")}
              >
                Contact
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "social" ? "active" : ""}`}
                onClick={() => setActiveTab("social")}
              >
                Social Media
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "privacy" ? "active" : ""}`}
                onClick={() => setActiveTab("privacy")}
              >
                Data Privacy
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {/* =======================
             WEBSITE TAB
          ======================= */}
          {activeTab === "website" && (
            <div style={{ maxWidth: 600 }}>
              <div className="mb-3">
                <label className="form-label">Company Name *</label>
                <input
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Website Name *</label>
                <input
                  className="form-control"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Copyright Year *</label>
                <input
                  className="form-control"
                  value={copyright}
                  onChange={(e) => setCopyright(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Logo</label>
                <div className="input-group">
                  <input className="form-control" value={logoName} readOnly />
                  <label className="input-group-text">
                    Browse
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileName(e, setLogoName)}
                    />
                  </label>
                </div>
                <small className="text-muted">
                  PNG, JPG, SVG • Max 1MB
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Favicon</label>
                <div className="input-group">
                  <input className="form-control" value={faviconName} readOnly />
                  <label className="input-group-text">
                    Browse
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileName(e, setFaviconName)}
                    />
                  </label>
                </div>
                <small className="text-muted">
                  128×128 ICO • Max 100KB
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Google Analytics Code</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={analytics}
                  onChange={(e) => setAnalytics(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Google Map</label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={googleMap}
                  onChange={(e) => setGoogleMap(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Google reCaptcha Site Key *</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={recaptcha}
                  onChange={(e) => setRecaptcha(e.target.value)}
                />
              </div>

              <button className="btn btn-primary">Save Settings</button>
            </div>
          )}

          {/* =======================
             CONTACT TAB
          ======================= */}
          {activeTab === "contact" && (
            <div style={{ maxWidth: 600 }}>
              <div className="mb-3">
                <label className="form-label">Company Address *</label>
                <textarea
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile Number *</label>
                <input
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fax Number</label>
                <input
                  className="form-control"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Telephone Number *</label>
                <input
                  className="form-control"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <button className="btn btn-primary">Save Settings</button>
            </div>
          )}

          {/* =======================
             SOCIAL MEDIA TAB
          ======================= */}
          {activeTab === "social" && (
            <div style={{ maxWidth: 600 }}>
              <p className="text-muted mb-3">
                Add your social media links
              </p>

              <div className="d-flex gap-2 mb-2">
                <select className="form-control">
                  <option>Facebook</option>
                  <option>Twitter</option>
                  <option>Instagram</option>
                  <option>Youtube</option>
                  <option>LinkedIn</option>
                </select>
                <input className="form-control" placeholder="URL" />
                <button className="btn btn-outline-danger">×</button>
              </div>

              <button className="btn btn-outline-primary mb-3">+ Add</button>

              <br />
              <button className="btn btn-primary">Save Settings</button>
            </div>
          )}

          {/* =======================
             DATA PRIVACY TAB
          ======================= */}
          {activeTab === "privacy" && (
            <div style={{ maxWidth: 800 }}>
              <div className="mb-3">
                <label className="form-label">Page Title *</label>
                <input className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Pop-up Content *</label>
                <textarea rows={3} className="form-control" />
              </div>

              <div className="mb-4">
                <label className="form-label">Content *</label>
                <textarea
                  rows={8}
                  className="form-control"
                  placeholder="Rich text editor goes here"
                />
              </div>

              <button className="btn btn-primary">Save Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

WebsiteSettingsPage.Layout = AdminLayout;
export default WebsiteSettingsPage;
