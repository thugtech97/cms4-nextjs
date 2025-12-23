import AdminLayout from "@/components/Layout/AdminLayout";
import { useState } from "react";
import TinyEditor from "@/components/UI/Editor";
import { createPage } from "@/services/pageService";
import { useRouter } from "next/router";

const DEFAULT_CONTENT = ``;

export default function CreatePage() {
  // Page state
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [visibility, setVisibility] = useState(true);

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // UI
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Page title is required");
      return;
    }

    try {
      setLoading(true);

      await createPage({
        name: title,
        label: label || undefined,
        contents: content,
        status: visibility ? "public" : "private",
        meta_title: seoTitle || undefined,
        meta_description: seoDescription || undefined,
        meta_keyword: seoKeywords || undefined,
      });

      alert("Page created successfully");

      // ✅ Redirect to pages list
      router.push("/pages");

    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Create a Page</h3>

      <div className="card mb-4">
        <div className="card-header fw-bold">Page Details</div>
        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">Page Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Page Label</label>
            <input
              type="text"
              className="form-control"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Page Content</label>
            <TinyEditor
              value={content}
              onChange={setContent}
            />
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={visibility}
              onChange={() => setVisibility(!visibility)}
            />
            <label className="form-check-label">
              {visibility ? "Public" : "Private"}
            </label>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header fw-bold">Manage SEO</div>
        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">SEO Title</label>
            <input
              type="text"
              className="form-control"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">SEO Description</label>
            <textarea
              rows={4}
              className="form-control"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">SEO Keywords</label>
            <input
              type="text"
              className="form-control"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Page"}
        </button>

        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

CreatePage.Layout = AdminLayout;
