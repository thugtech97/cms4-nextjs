// pages/dashboard/createNewsCategory.tsx
import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

function CreateNewsCategory() {
  const [categoryName, setCategoryName] = useState("");

  return (
    <div className="container">
      <h3 className="mb-4">Create News Category</h3>

      <div className="form-group mb-3">
        <label htmlFor="categoryName" className="col-form-label">
          Category Name <span className="text-danger">*</span>
        </label>
        <div className="col-sm-6">
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
      </div>
        <div className="btn-group">
          <button className="btn btn-primary">Save Category</button>
          <button className="btn btn-outline-secondary">Cancel</button>
        </div>
    </div>
  );
}

CreateNewsCategory.Layout = AdminLayout;

export default CreateNewsCategory;
