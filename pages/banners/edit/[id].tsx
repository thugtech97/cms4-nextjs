import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/Layout/AdminLayout";
import { BannerForm } from "@/schemas/banner";
import { OptionItem, getOptions } from "@/services/optionService";
import { getAlbum, updateAlbum } from "@/services/albumService";
import { toast } from "@/lib/toast";

function EditAlbum() {
  const router = useRouter();
  const { id } = router.query;

  /* ======================
   * State
   * ====================== */

  const [name, setName] = useState("");
  const [transitionIn, setTransitionIn] = useState("");
  const [transitionOut, setTransitionOut] = useState("");
  const [duration, setDuration] = useState(2);

  const [banners, setBanners] = useState<BannerForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropRect, setCropRect] = useState<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });
  const cropStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);
  const [cropPreview, setCropPreview] = useState<string | null>(null);

  const [entranceOptions, setEntranceOptions] = useState<OptionItem[]>([]);
  const [exitOptions, setExitOptions] = useState<OptionItem[]>([]);

  /* ======================
   * Load options
   * ====================== */
  useEffect(() => {
    getOptions({ type: "animation", field_type: "entrance" })
      .then((res: any) => setEntranceOptions(res.data.data));

    getOptions({ type: "animation", field_type: "exit" })
      .then((res: any) => setExitOptions(res.data.data));
  }, []);

  /* ======================
   * Load album
   * ====================== */
  useEffect(() => {
    if (!id) return;
    loadAlbum(Number(id));
  }, [id]);

  const loadAlbum = async (albumId: number) => {
    try {
      const res = await getAlbum(albumId);
      const album = res.data;

      setName(album.name);
      setTransitionIn(String(album.transition_in));
      setTransitionOut(String(album.transition_out));
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
    } catch (err) {
      toast.error("Album not found");
      router.push("/banners");
    } finally {
    }
  };

  /* ======================
   * Image upload
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
    setBanners((prev) => {
      const banner = prev[index];
      if (banner.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(banner.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const openEditModal = (index: number) => {
    setEditIndex(index);
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });
    setCropPreview(banners[index]?.preview || null);
    cropStartRef.current = null;
    setIsDraggingCrop(false);
  };

  const closeEditModal = () => {
    setEditIndex(null);
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });
    setIsProcessingCrop(false);
    setCropPreview(null);
  };

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
    if (editIndex === null) return;
    const banner = banners[editIndex];
    const src = banner.preview;
    if (!src) return;

    if (cropRect.w <= 0 || cropRect.h <= 0) {
      toast.error("Please select a crop area");
      return;
    }

    const displayed = imageRef.current;
    if (!displayed || !displayed.complete) {
      toast.error("Image not loaded yet");
      return;
    }

    setIsProcessingCrop(true);

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

    sx = Math.max(0, Math.min(sx, imgNaturalW - 1));
    sy = Math.max(0, Math.min(sy, imgNaturalH - 1));
    sw = Math.max(1, Math.min(sw, imgNaturalW - sx));
    sh = Math.max(1, Math.min(sh, imgNaturalH - sy));

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessingCrop(false);
      toast.error("Canvas not supported");
      return;
    }

    try {
      ctx.drawImage(displayed as CanvasImageSource, sx, sy, sw, sh, 0, 0, sw, sh);
    } catch (err) {
      setIsProcessingCrop(false);
      toast.error("Failed to draw image. Cross-origin image may block cropping.");
      return;
    }

    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
      if (!blob) throw new Error("no blob");
      const file = new File([blob], `cropped-${Date.now()}.png`, { type: blob.type });
      updateBanner(editIndex, "image", file);
      updateBanner(editIndex, "preview", URL.createObjectURL(file));
      setIsProcessingCrop(false);
      closeEditModal();
    } catch (err) {
      setIsProcessingCrop(false);
      toast.error("Failed to generate cropped image");
    }
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
    if (!name || !transitionIn || !transitionOut) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload : any = {
      name,
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
        ...(b.image instanceof File ? { image: b.image } : {}),
      })),
    };

    try {
      await updateAlbum(Number(id), payload);
      toast.success("Album updated successfully!");
      router.push("/banners");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update album");
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Edit Album</h3>

      {/* Album Name */}
      <div className="mb-3">
        <label className="form-label">
          Album Name <span className="text-danger">*</span>
        </label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Transition In */}
      <div className="mb-3">
        <label className="form-label">
          Transition In <span className="text-danger">*</span>
        </label>
        <select
          className="form-control"
          value={transitionIn}
          onChange={(e) => setTransitionIn(e.target.value)}
        >
          <option value="">Select transition</option>
          {entranceOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transition Out */}
      <div className="mb-3">
        <label className="form-label">
          Transition Out <span className="text-danger">*</span>
        </label>
        <select
          className="form-control"
          value={transitionOut}
          onChange={(e) => setTransitionOut(e.target.value)}
        >
          <option value="">Select transition</option>
          {exitOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div className="mb-3">
        <label className="form-label">
          Transition Duration (seconds)
        </label>
        <input
          type="range"
          className="form-range"
          min={2}
          max={10}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <small className="text-muted">{duration}s</small>
      </div>

      {/* Upload Images */}
      <div className="mb-4">
        <label className="form-label">Album Images</label>
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
                style={{ height: 200, objectFit: "cover" }}
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

                <button
                  className="btn btn-outline-danger btn-sm mt-2"
                  onClick={() => handleRemoveBanner(index)}
                >
                  Remove
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm mt-2 ms-2"
                  onClick={() => openEditModal(index)}
                >
                  <i className="fa fa-edit"></i> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Crop Modal */}
      {editIndex !== null && banners[editIndex] && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="card" style={{ width: 640 }}>
              <div className="card-body">
                <h5 className="card-title">Crop Banner Image</h5>
                <div className="mb-3">
                  <label className="form-label">Crop Area (drag to select)</label>
                  <div style={{ position: 'relative', border: '1px solid #ddd', display: 'inline-block', maxWidth: '100%' }}
                    onMouseDown={onCropMouseDown}
                    onMouseMove={onCropMouseMove}
                    onMouseUp={onCropMouseUp}
                    onMouseLeave={onCropMouseUp}
                  >
                    <img ref={imageRef} src={banners[editIndex].preview} alt="to-crop" style={{ display: 'block', maxWidth: 560, maxHeight: 420, width: '100%', height: 'auto' }} />
                    {cropRect.w > 0 && cropRect.h > 0 && (
                      <div style={{ position: 'absolute', left: cropRect.x, top: cropRect.y, width: cropRect.w, height: cropRect.h, border: '2px dashed #fff', boxShadow: '0 0 0 10000px rgba(0,0,0,0.4) inset' }} />
                    )}
                  </div>
                  <div className="mt-2"><small className="text-muted">Crop: {cropRect.w} x {cropRect.h} px</small></div>
                </div>

                {cropPreview && (
                  <div className="mb-3">
                    <label className="form-label">Cropped Preview</label>
                    <div>
                      <img src={cropPreview} alt="crop-preview" style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', border: '1px solid #ddd' }} />
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" onClick={performCrop} disabled={isProcessingCrop || (cropRect.w <= 0 && cropRect.h <= 0)}>
                    {isProcessingCrop ? 'Processing...' : 'Apply Crop'}
                  </button>
                  <button className="btn btn-secondary" onClick={closeEditModal} disabled={isProcessingCrop}>Cancel</button>
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
        <button
          className="btn btn-outline-secondary"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

EditAlbum.Layout = AdminLayout;
export default EditAlbum;
