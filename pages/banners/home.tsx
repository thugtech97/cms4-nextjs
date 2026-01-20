import React, { useEffect, useState, useRef } from "react";
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
  const [resizeIndex, setResizeIndex] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<number, string>>({});

  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropRect, setCropRect] = useState<{x:number,y:number,w:number,h:number}>({x:0,y:0,w:0,h:0});
  const cropStartRef = useRef<{x:number,y:number} | null>(null);

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
        album.banners.map((b: any) => {
          const serverPreview = `${process.env.NEXT_PUBLIC_API_URL}/storage/${b.image_path}`;
          return {
            id: b.id,
            preview: (b.id && localPreviews[b.id]) ? localPreviews[b.id] : serverPreview,
            title: b.title,
            description: b.description,
            button_text: b.button_text,
            url: b.url,
            alt: b.alt,
          };
        })
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
    setBanners((prev) => {
      const next = prev.map((b, i) => (i === index ? { ...b, [field]: value } : b));
      const updated = next[index];
      if (field === "preview" && updated?.id) {
        setLocalPreviews((mp) => {
          const prevUrl = mp[updated.id as number];
          if (prevUrl && prevUrl !== value) URL.revokeObjectURL(prevUrl);
          return { ...mp, [updated.id as number]: value };
        });
      }
      return next;
    });
  };

  const openResizeModal = (index: number) => {
    setResizeIndex(index);
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });
    setResizedPreview(null);
    cropStartRef.current = null;
    setIsDraggingCrop(false);
    // if this banner already has a preview (blob or server) show it as the preview
    const existing = banners[index];
    if (existing?.preview) {
      setResizedPreview(existing.preview as string);
    }
  };

  const closeResizeModal = () => {
    setResizeIndex(null);
    setCropRect({x:0,y:0,w:0,h:0});
    setIsResizing(false);
  };



  useEffect(() => {
    // generate a live preview of the resized image (client-side)
    if (resizeIndex === null) {
      setResizedPreview(null);
      return;
    }

    const banner = banners[resizeIndex];
    const src = banner?.preview;
    if (!src) {
      setResizedPreview(null);
      return;
    }

    const img = new Image();
    // only set crossOrigin for remote images (not blob URLs)
    if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//'))) {
      img.crossOrigin = 'anonymous';
    }
    img.src = src;

    let cancelled = false;

    img.onload = () => {
      if (cancelled) return;

      // If a crop rect exists, generate crop preview
      if (cropRect.w > 0 && cropRect.h > 0) {
        const displayed = imageRef.current;
        if (!displayed) {
          setResizedPreview(null);
          return;
        }

        const dispW = displayed.clientWidth;
        const dispH = displayed.clientHeight;
        const ratioX = img.naturalWidth / dispW;
        const ratioY = img.naturalHeight / dispH;

        const sx = Math.round(cropRect.x * ratioX);
        const sy = Math.round(cropRect.y * ratioY);
        const sw = Math.round(cropRect.w * ratioX);
        const sh = Math.round(cropRect.h * ratioY);

        const canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setResizedPreview(null);
          return;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        try {
          const dataUrl = canvas.toDataURL("image/png");
          setResizedPreview(dataUrl);
        } catch (err) {
          setResizedPreview(null);
        }
        return;
      }

      // no default resize preview in crop-only mode
      setResizedPreview(null);
    };

    img.onerror = () => setResizedPreview(null);

    return () => {
      cancelled = true;
    };
  }, [resizeIndex, banners, cropRect]);



  // crop mouse handlers (draw selection on displayed image)
  const onCropMouseDown = (e: React.MouseEvent) => {
    const imgEl = imageRef.current;
    if (!imgEl) return;
    const rect = imgEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cropStartRef.current = { x, y };
    setIsDraggingCrop(true);
    setCropRect({ x, y, w: 0, h: 0 });
  };

  const onCropMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCrop || cropStartRef.current === null) return;
    const imgEl = imageRef.current;
    if (!imgEl) return;
    const rect = imgEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sx = Math.min(cropStartRef.current.x, x);
    const sy = Math.min(cropStartRef.current.y, y);
    const sw = Math.abs(x - cropStartRef.current.x);
    const sh = Math.abs(y - cropStartRef.current.y);
    setCropRect({ x: Math.max(0, sx), y: Math.max(0, sy), w: Math.max(0, sw), h: Math.max(0, sh) });
  };

  const onCropMouseUp = () => {
    if (!isDraggingCrop) return;
    setIsDraggingCrop(false);
    cropStartRef.current = null;
  };

  const performCrop = async () => {
    if (resizeIndex === null) return;
    const banner = banners[resizeIndex];
    const src = banner.preview;
    if (!src) return;
    setIsResizing(true);

    if (cropRect.w <= 0 || cropRect.h <= 0) {
      toast.error("Please select a crop area");
      setIsResizing(false);
      return;
    }

    const displayed = imageRef.current;
    if (!displayed || !displayed.complete) {
      toast.error("Image not loaded yet");
      setIsResizing(false);
      return;
    }

    const imgNaturalW = displayed.naturalWidth;
    const imgNaturalH = displayed.naturalHeight;
    const dispW = displayed.clientWidth;
    const dispH = displayed.clientHeight;
    const ratioX = imgNaturalW / dispW;
    const ratioY = imgNaturalH / dispH;

    let sx = Math.round(cropRect.x * ratioX);
    let sy = Math.round(cropRect.y * ratioY);
    let sw = Math.round(cropRect.w * ratioX);
    let sh = Math.round(cropRect.h * ratioY);

    // clamp values to natural image bounds
    sx = Math.max(0, Math.min(sx, imgNaturalW - 1));
    sy = Math.max(0, Math.min(sy, imgNaturalH - 1));
    sw = Math.max(1, Math.min(sw, imgNaturalW - sx));
    sh = Math.max(1, Math.min(sh, imgNaturalH - sy));

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsResizing(false);
      return;
    }

    try {
      try {
        ctx.drawImage(displayed as CanvasImageSource, sx, sy, sw, sh, 0, 0, sw, sh);
      } catch (drawErr) {
        // Drawing from the displayed image failed (likely cross-origin). Attempt to fetch the source
        // and draw from a fetched blob image as a fallback.
        try {
          const srcUrl = typeof src === 'string' ? src : null;
          if (srcUrl) {
            const response = await fetch(srcUrl, { mode: 'cors' });
            const fetchedBlob = await response.blob();
            const fetchedUrl = URL.createObjectURL(fetchedBlob);
            const fetchedImg = new Image();
            fetchedImg.src = fetchedUrl;
            await new Promise<void>((resolve, reject) => {
              fetchedImg.onload = () => resolve();
              fetchedImg.onerror = () => reject(new Error('Failed to load fetched image'));
            });

            // draw using fetched image
            ctx.drawImage(fetchedImg as CanvasImageSource, sx, sy, sw, sh, 0, 0, sw, sh);
            URL.revokeObjectURL(fetchedUrl);
          } else {
            throw drawErr;
          }
        } catch (fallbackErr) {
          throw drawErr;
        }
      }
    } catch (err) {
      setIsResizing(false);
      toast.error("Failed to draw image. Cross-origin image may block cropping.");
      return;
    }

    try {
      let blob: Blob | null = null;

      if (canvas.toBlob) {
        blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png")
        );
      } else {
        // fallback: use dataURL -> fetch -> blob
        const dataUrl = canvas.toDataURL("image/png");
        const res = await fetch(dataUrl);
        blob = await res.blob();
      }

      if (!blob) {
        setIsResizing(false);
        toast.error("Failed to produce image blob for crop");
        return;
      }

      const file = new File([blob], `cropped-${Date.now()}.png`, { type: blob.type });
      updateBanner(resizeIndex, "image", file);
      updateBanner(resizeIndex, "preview", URL.createObjectURL(file));
      setIsResizing(false);
      closeResizeModal();
    } catch (err) {
      setIsResizing(false);
      toast.error("Failed to generate cropped image");
    }
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
  const selectedBanner = resizeIndex !== null && banners[resizeIndex] ? banners[resizeIndex] : null;

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
                <button
                  className="btn btn-outline-secondary btn-sm mt-2 ms-2"
                  onClick={() => openResizeModal(index)}
                >
                  <i className="fa fa-edit"></i> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resize Modal */}
      {selectedBanner && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{background: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="card" style={{width: 560}}>
              <div className="card-body">
                <h5 className="card-title">Resize Banner Image</h5>

                <div className="mb-3">
                  <label className="form-label">Crop Area (drag to select)</label>
                  <div style={{position: 'relative', border: '1px solid #ddd', display: 'inline-block', maxWidth: '100%'}}
                    onMouseDown={onCropMouseDown}
                    onMouseMove={onCropMouseMove}
                    onMouseUp={onCropMouseUp}
                    onMouseLeave={onCropMouseUp}
                  >
                        <img ref={imageRef} src={selectedBanner.preview as string} alt="to-crop" style={{display:'block', maxWidth: 560, maxHeight: 420, width: '100%', height: 'auto'}} />
                    {cropRect.w > 0 && cropRect.h > 0 && (
                      <div style={{position: 'absolute', left: cropRect.x, top: cropRect.y, width: cropRect.w, height: cropRect.h, border: '2px dashed #fff', boxShadow: '0 0 0 10000px rgba(0,0,0,0.4) inset'}} />
                    )}
                  </div>
                  <div className="mt-2"><small className="text-muted">Crop: {cropRect.w} x {cropRect.h} px</small></div>
                </div>

                {resizedPreview && (
                  <div className="mb-3">
                    <label className="form-label">Cropped Preview</label>
                    <div>
                      <img src={resizedPreview} alt="crop-preview" style={{maxWidth: '100%', maxHeight: 220, objectFit: 'contain', border: '1px solid #ddd'}} />
                    </div>
                  </div>
                )}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={performCrop}
                    disabled={isResizing || (cropRect.w <= 0 && cropRect.h <= 0)}
                  >
                    {isResizing ? 'Processing...' : 'Apply Crop'}
                  </button>
                  <button className="btn btn-secondary" onClick={closeResizeModal} disabled={isResizing}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
