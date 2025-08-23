import type { TLogin, TSignup } from "../utils/Interface.utils";
import axiosInstance from "./AxiosInstance";

// Signup (no token required)
export async function signup(data: TSignup) {
  return axiosInstance.post("/auth/signup", data);
}

// Login (no token initially, token will be stored)
export async function login(data: TLogin) {
  return axiosInstance.post("/auth/login", data);
}
