import { axiosInstance } from "@/services/axios";

export interface CreateUserPayload {
  fname: string;
  lname: string;
  email: string;
  role: string;
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await axiosInstance.post("/users", payload);
  return response.data;
};

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const getUsers = async (params: any) => {
  const res = await axiosInstance.get("/users", { params });
  return res.data;
};

export const getUser = async (id: number) => {
  const res = await axiosInstance.get(`/users/${id}`);
  return res.data.data;
};

export const updateUser = async (id: number, payload: any) => {
  const res = await axiosInstance.put(`/users/${id}`, payload);
  return res.data;
};
