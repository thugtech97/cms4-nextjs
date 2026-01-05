import { axiosInstance } from "./axios";


export interface BannerPayload {
  id?: number;
  title?: string;
  description?: string;
  alt?: string;
  button_text?: string;
  url?: string;
  order?: number;
  image?: File;
}

export interface AlbumPayload {
  name: string;
  transition_in: string;
  transition_out: string;
  transition: number;
  banner_type: "image";
  type?: string;
  banners: BannerPayload[];
}

export interface AlbumRow {
  id: number;
  name: string;
  total_images: number;
  updated_at: string;
}

export const getAlbums = (params?: {search?: string;page?: number;per_page?: number;}) => {
  return axiosInstance.get("/albums", { params });
};

export const getAlbum = (id: number) => {
  return axiosInstance.get(`/albums/${id}`);
};

export const createAlbum = (payload: AlbumPayload) => {
  const formData = buildAlbumFormData(payload);
  return axiosInstance.post("/albums", formData);
};

export const updateAlbum = (id: number, payload: AlbumPayload) => {
  const formData = buildAlbumFormData(payload);
  formData.append("_method", "PUT"); // Laravel PUT via POST
  return axiosInstance.post(`/albums/${id}`, formData);
};

const buildAlbumFormData = (payload: AlbumPayload) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("transition_in", payload.transition_in);
  formData.append("transition_out", payload.transition_out);
  formData.append("transition", String(payload.transition));
  formData.append("banner_type", payload.banner_type);

  payload.banners.forEach((banner, index) => {
    if (banner.id) {
      formData.append(`banners[${index}][id]`, String(banner.id));
    }

    formData.append(`banners[${index}][title]`, banner.title ?? "");
    formData.append(`banners[${index}][description]`, banner.description ?? "");
    formData.append(`banners[${index}][alt]`, banner.alt ?? "");
    formData.append(`banners[${index}][button_text]`, banner.button_text ?? "");
    formData.append(`banners[${index}][url]`, banner.url ?? "");
    formData.append(`banners[${index}][order]`, String(banner.order ?? index));

    if (banner.image instanceof File) {
      formData.append(`banners[${index}][image]`, banner.image);
    }
  });

  return formData;
};
