
import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

function HomeBanner() {
  const [images, setImages] = useState<any[]>([]);
  const [transitionIn, setTransitionIn] = useState("Fade In");
  const [transitionOut, setTransitionOut] = useState("Fade Out");
  const [duration, setDuration] = useState(5);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h3 className="mb-4">Edit Home Banner</h3>

      <div className="row mb-3">
        <label htmlFor="albumName" className="col-sm-2 col-form-label">
          Album Name
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id="albumName"
            placeholder="Home Banner"
          />
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="transitionIn" className="col-sm-2 col-form-label">
          Transition In
        </label>
        <div className="col-sm-10">
          <select
            id="transitionIn"
            className="form-control"
            value={transitionIn}
            onChange={(e) => setTransitionIn(e.target.value)}
          >
            <option>Fade In</option>
            <option>Slide In</option>
            <option>Zoom In</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="transitionOut" className="col-sm-2 col-form-label">
          Transition Out
        </label>
        <div className="col-sm-10">
          <select
            id="transitionOut"
            className="form-control"
            value={transitionOut}
            onChange={(e) => setTransitionOut(e.target.value)}
          >
            <option>Fade Out</option>
            <option>Slide Out</option>
            <option>Zoom Out</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="transitionDuration" className="col-sm-2 col-form-label">
          Transition Duration (seconds)
        </label>
        <div className="col-sm-10">
          <input
            type="range"
            className="form-control-range"
            id="transitionDuration"
            min="1"
            max="10"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
          <span>{duration}s</span>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">Banner Type</label>
        <div className="col-sm-10">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="imageBanner"
              name="bannerType"
              value="image"
              checked
            />
            <label className="form-check-label" htmlFor="imageBanner">
              Image
            </label>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-sm-2">
          <button
            className="btn btn-outline-secondary btn-block"
            onClick={() => document.getElementById("imageUpload")?.click()}
          >
            Upload Images
          </button>
          <input
            type="file"
            id="imageUpload"
            className="d-none"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-sm-12">
          {images.length > 0 && (
            <div className="row">
              {images.map((image, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card">
                    <img
                      src={image}
                      className="card-img-top"
                      alt="Uploaded"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Title"
                      />
                      <textarea className="form-control mb-2" placeholder="Description"></textarea>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Button Text"
                      />
                      <input
                        type="url"
                        className="form-control mb-2"
                        placeholder="URL"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Alt Text"
                      />
                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => handleRemoveImage(index)}
                      ><i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        <div className="btn-group">
            <button className="btn btn-primary">Update Album</button>
            <button className="btn btn-outline-secondary">Cancel</button>
        </div>
    </div>
  );
}

HomeBanner.Layout = AdminLayout;

export default HomeBanner;
