import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

function CreateMenu() {
  const [menuName, setMenuName] = useState("");
  const [isInactive, setIsInactive] = useState(false);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const pages = [
    "Home",
    "Contact Us",
    "Footer",
    "News and Updates",
    "Member",
    "Availment Process",
    "Benefits And Coverage",
    "Basic Dental Services",
    "Additional Dental Services",
    "Special Dental Services",
    "Exclusions",
    "Careers",
    "About",
    "Company Profile",
  ];

  const handleSelectPage = (page: string) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  return (
    <div className="">
      <h3 className="mb-4">Create a Menu</h3>

      <div className="row mb-3">
        <div className="col-lg-6">
          <div className="row mb-3">
            <label htmlFor="menuName" className="col-sm-2 col-form-label">
              Menu Name <span className="text-danger">*</span>
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="menuName"
                placeholder="Enter menu name"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">Pages</label>
            <div className="col-sm-10">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search pages"
                />
              </div>
              <div className="list-group mb-3">
                {pages.map((page) => (
                  <div
                    key={page}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <input
                        type="checkbox"
                        id={page}
                        checked={selectedPages.includes(page)}
                        onChange={() => handleSelectPage(page)}
                      />
                      <label htmlFor={page} className="ml-2">
                        {page}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-success">+ Add</button>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">Structure</label>
            <div className="col-sm-10">
              <div
                className="border p-3 bg-light"
                style={{ minHeight: "200px" }}
              >
                <p>Drag each item into the order you prefer.</p>
                {/* Drag-and-drop feature can be added here */}
                <ul className="list-unstyled">
                  {selectedPages.map((page, index) => (
                    <li key={index} className="p-2 mb-2 border bg-white">
                      {page}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-2">Inactive</div>
            <div className="col-sm-10">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={isInactive}
                  onChange={() => setIsInactive(!isInactive)}
                />
              </div>
            </div>
          </div>

            <div className="btn-group">
                <button className="btn btn-primary">Save Menu</button>
                <button className="btn btn-outline-secondary">Cancel</button>
            </div>
        </div>
      </div>
    </div>
  );
}

CreateMenu.Layout = AdminLayout;

export default CreateMenu;
