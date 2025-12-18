import { axiosInstance, setCsrfCookie } from "./axios";

export const login = async (email: string, password: string) => {
  try {

    await setCsrfCookie();

    const response = await axiosInstance.post("/login", {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      return response.data.token;
    }

    //throw new Error("Login failed");

  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred during login.";
      console.error(`Error Status: ${status}, Message: ${message}`);
      throw new Error(message);
    } else {

      console.error("Unexpected error", error);
      throw new Error("Something went wrong. Please try again.");
    }
  }
};
