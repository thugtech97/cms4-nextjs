// pages/dashboard/createUser.tsx
import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

function CreateUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="container">
      <h3 className="mb-4">Create a User</h3>

      <div className="form-group mb-3">
        <label htmlFor="firstName" className="col-form-label">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="lastName" className="col-form-label">
          Last Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="email" className="col-form-label">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="role" className="col-form-label">
          Role <span className="text-danger">*</span>
        </label>
        <select
          id="role"
          className="form-control"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

        <div className="btn-group mt-3">
          <button className="btn btn-primary">Create User</button>
          <button className="btn btn-outline-secondary">Cancel</button>
        </div>
    </div>
  );
}

CreateUser.Layout = AdminLayout;

export default CreateUser;
