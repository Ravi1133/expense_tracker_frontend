import axios from "axios"

let baseURL="http://localhost:5000"
const api={
    auth:{
        login:"/userAuth/login",
        logout:"/logout",
        register:"/userAuth/register"
    }
}



import axiosInstance from "./axiosHandler";
import type { LoginPayload, LoginResponse } from "./apiTypes"

type ApiOptions<T = any> = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: T;
  params?: Record<string, any>;
};

export async function apiRequest<T = any, R = any>({
  url,
  method = "GET",
  data,
  params,
}: ApiOptions<T>): Promise<R> {
  const response = await axiosInstance.request<R>({
    url,
    method,
    data,
    params,
  });
  return response.data;
}


export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiRequest<LoginPayload, LoginResponse>({
    url: api.auth.login,
    method: "POST",
    data: payload,
  });
};
