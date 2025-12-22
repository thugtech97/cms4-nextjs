
import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

function CreateAlbum() {
  const [duration, setDuration] = useState(2);

  return (
    <div className="container">
      <h3 className="mb-4">Create an Album</h3>

      <div className="row mb-3">
        <label htmlFor="albumName" className="col-sm-2 col-form-label">
          Album Name <span className="text-danger">*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id="albumName"
            placeholder="Enter album name"
          />
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="transitionIn" className="col-sm-2 col-form-label">
          Transition In <span className="text-danger">*</span>
        </label>
        <div className="col-sm-10">
          <select id="transitionIn" className="form-control">
            <option>Select transition</option>
            <option>Fade In</option>
            <option>Slide In</option>
            <option>Zoom In</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="transitionOut" className="col-sm-2 col-form-label">
          Transition Out <span className="text-danger">*</span>
        </label>
        <div className="col-sm-10">
          <select id="transitionOut" className="form-control">
            <option>Select transition</option>
            <option>Fade Out</option>
            <option>Slide Out</option>
            <option>Zoom Out</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="transitionDuration" className="col-sm-2 col-form-label">
          Transition Duration (seconds) <span className="text-danger">*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="range"
            className="form-control-range"
            id="transitionDuration"
            min="2"
            max="10"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
          <span>{duration}s</span>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-sm-2">
          <button
            className="btn btn-outline-secondary btn-block"
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            Upload Banner
          </button>
          <input
            type="file"
            id="imageUpload"
            className="d-none"
            accept="image/*"
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10">
          <small>
            <strong>Required image dimension:</strong> 2000px by 600px
            <br />
            <strong>Maximum file size:</strong> 1MB
            <br />
            <strong>Required file type:</strong> jpeg, png
          </small>
        </div>
      </div>

        <div className="btn-group mt-3">
          <button className="btn btn-primary">Save Album</button>
          <button className="btn btn-outline-secondary">Cancel</button>
        </div>
    </div>
  );
}

CreateAlbum.Layout = AdminLayout;

export async function getServerSideProps() {
  return { props: {} };
}

export default CreateAlbum;
