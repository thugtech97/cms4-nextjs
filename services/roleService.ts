import { axiosInstance } from "@/services/axios";

export interface Role {
  id: number;
  name: string;
}

export const fetchRoles = async (): Promise<Role[]> => {
  const res = await axiosInstance.get("/fetch_roles");
  return res.data.data;
};
