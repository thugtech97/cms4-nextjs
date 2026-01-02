import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { BannerForm } from "@/schemas/banner";
import { OptionItem, getOptions } from "@/services/optionService";
import { toast } from "@/lib/toast";
import {
  getAlbum,
  createAlbum,
  updateAlbum,
} from "@/services/albumService";

const HOME_ALBUM_ID = 1;

function HomeBanner() {
  const [albumExists, setAlbumExists] = useState(true);

  const [transitionIn, setTransitionIn] = useState("Fade In");
  const [transitionOut, setTransitionOut] = useState("Fade Out");
  const [duration, setDuration] = useState(5);
  const [banners, setBanners] = useState<BannerForm[]>([]);

  const [entranceOptions, setEntranceOptions] = useState<OptionItem[]>([]);
  const [exitOptions, setExitOptions] = useState<OptionItem[]>([]);


  useEffect(() => {
    loadAlbum();
  }, []);

  useEffect(() => {
    getOptions({ type: "animation", field_type: "entrance" })
      .then((res: any) => setEntranceOptions(res.data.data));

    getOptions({ type: "animation", field_type: "exit" })
      .then((res: any) => setExitOptions(res.data.data));
  }, []);


  const loadAlbum = async () => {
    try {
      const res = await getAlbum(HOME_ALBUM_ID);
      const album = res.data;

      setTransitionIn(album.transition_in);
      setTransitionOut(album.transition_out);
      setDuration(album.transition);

      setBanners(
        album.banners.map((b: any) => ({
          id: b.id,
          preview: `${process.env.NEXT_PUBLIC_API_URL}/storage/${b.image_path}`,
          title: b.title,
          description: b.description,
          button_text: b.button_text,
          url: b.url,
          alt: b.alt,
        }))
      );

      setAlbumExists(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setAlbumExists(false);
      }
    } finally {

    }
  };

  /* ======================
   * Image Upload
   * ====================== */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newBanners: BannerForm[] = Array.from(files).map((file) => ({
      image: file,
      preview: URL.createObjectURL(file),
    }));

    setBanners((prev) => [...prev, ...newBanners]);

    e.target.value = "";
  };

  const handleRemoveBanner = (index: number) => {
    setBanners((prev) => prev.filter((_, i) => i !== index));
  };

  const updateBanner = (
    index: number,
    field: keyof BannerForm,
    value: any
  ) => {
    setBanners((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  /* ======================
   * Save
   * ====================== */
  const handleSave = async () => {
    const payload: any = {
      name: "Home Banner",
      transition_in: transitionIn,
      transition_out: transitionOut,
      transition: duration,
      banner_type: "image",
      banners: banners.map((b, i) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        button_text: b.button_text,
        url: b.url,
        alt: b.alt,
        order: i,
        image: b.image,
      })),
    };

    if (albumExists) {
      await updateAlbum(HOME_ALBUM_ID, payload);
    } else {
      await createAlbum(payload);
    }

    await loadAlbum();
    toast.success("Home banner updated successfully");
  };

  /* ======================
   * UI
   * ====================== */
  return (
    <div className="container">
      <h3 className="mb-4">Edit Home Banner</h3>

      <div className="mb-3">
        <label className="form-label">Album Name</label>
        <input className="form-control" value="Home Banner" readOnly />
      </div>

      <div className="mb-3">
        <label className="form-label">Transition In</label>
        <select
          className="form-control"
          value={transitionIn}
          onChange={(e) => setTransitionIn(e.target.value)}
        >
          {entranceOptions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Transition Out</label>
        <select
          className="form-control"
          value={transitionOut}
          onChange={(e) => setTransitionOut(e.target.value)}
        >
          {exitOptions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Transition Duration (seconds)</label>
        <input
          type="range"
          className="form-range"
          min={1}
          max={10}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <small className="text-muted">{duration}s</small>
      </div>

      {/* Banner Type */}
      <div className="mb-3">
        <label className="form-label">Banner Type</label>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="imageBanner"
            checked
            readOnly
          />
          <label className="form-check-label" htmlFor="imageBanner">
            Image
          </label>
        </div>
      </div>

      {/* Upload Images */}
      <div className="mb-4">
        <label className="form-label">Banner Images</label>
        <button
          type="button"
          className="btn btn-outline-secondary d-block"
          onClick={() => document.getElementById("imageUpload")?.click()}
        >
          Upload Images
        </button>

        <input
          id="imageUpload"
          type="file"
          className="d-none"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {/* Banners */}
      <div className="row mb-4">
        {banners.map((banner, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={banner.preview}
                className="card-img-top"
                alt="Banner"
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body">
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={banner.title || ""}
                    onChange={(e) =>
                      updateBanner(index, "title", e.target.value)
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={banner.description || ""}
                    onChange={(e) =>
                      updateBanner(index, "description", e.target.value)
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Button Text</label>
                  <input
                    className="form-control"
                    value={banner.button_text || ""}
                    onChange={(e) =>
                      updateBanner(index, "button_text", e.target.value)
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={banner.url || ""}
                    onChange={(e) =>
                      updateBanner(index, "url", e.target.value)
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Alt Text</label>
                  <input
                    className="form-control"
                    value={banner.alt || ""}
                    onChange={(e) =>
                      updateBanner(index, "alt", e.target.value)
                    }
                  />
                </div>

                <button
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={() => handleRemoveBanner(index)}
                >
                  <i className="fa fa-trash"></i> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSave}>
          Update Album
        </button>
      </div>
    </div>
  );
}

HomeBanner.Layout = AdminLayout;
export default HomeBanner;
