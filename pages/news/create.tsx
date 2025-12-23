import AdminLayout from "@/components/Layout/AdminLayout";
import { useState } from "react";
import TinyEditor from "@/components/UI/Editor";

export default function CreateNews() {
  const [visibility, setVisibility] = useState(true); // Public by default
   const [content, setContent] = useState("");
  return (
    <div className="container">
      <h3 className="mb-4">Create a News</h3>

      {/* Page Details */}
      <div className="card mb-4">
        <div className="card-header fw-bold">News Details</div>
        <div className="card-body">

          <div className="mb-3">
            <label htmlFor="pageTitle" className="form-label">Page Title</label>
            <input type="text" className="form-control" id="pageTitle" />
          </div>

          <div className="mb-3">
            <label htmlFor="pageLabel" className="form-label">Page Label</label>
            <input type="text" className="form-control" id="pageLabel" />
          </div>

          <div className="mb-3">
            <label htmlFor="parentPage" className="form-label">Parent Page</label>
            <select id="parentPage" className="form-select">
              <option value="">-- Select Parent Page --</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="pageBanner" className="form-label">Page Banner</label>
            <select id="pageBanner" className="form-select">
              <option value="">-- Select Banner Type --</option>
              <option value="slider">Slider</option>
              <option value="image">Image</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="pageContent" className="form-label">Page Content</label>
            <TinyEditor
                value={content}
                onChange={setContent}
              />

            {/* <textarea id="pageContent" rows={6} className="form-control"></textarea> */}
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="pageVisibility"
              checked={visibility}
              onChange={() => setVisibility(!visibility)}
            />
            <label className="form-check-label" htmlFor="pageVisibility">
              {visibility ? "Public" : "Private"}
            </label>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header fw-bold">News SEO</div>
        <div className="card-body">
          {/* SEO Title */}
          <div className="mb-3">
            <label htmlFor="seoTitle" className="form-label">SEO Title</label>
            <input type="text" className="form-control" id="seoTitle" />
          </div>

          <div className="mb-3">
            <label htmlFor="seoDescription" className="form-label">SEO Description</label>
            <textarea id="seoDescription" rows={4} className="form-control"></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="seoKeywords" className="form-label">SEO Keywords</label>
            <input type="text" className="form-control" id="seoKeywords" />
          </div>
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary">Save Page</button>
        <button className="btn btn-outline-secondary">Cancel</button>
      </div>
    </div>
  );
}

CreateNews.Layout = AdminLayout;
