import axios from "axios"

let baseURL = "http://localhost:5000"
const api = {
    auth: {
        login: "/userAuth/login",
        logout: "/logout",
        register: "/userAuth/register"
    },
    category: {
        getAll: "/category/getCategories",
        addCategory:"/category/addCategory"
    },
    transaction: {
        addTrasaction: "/transaction/addTransaction",
        getTransacionByUserId:"/transaction/getTransaction"
    }
}



import axiosInstance from "./axiosHandler";
import type { Category, CategoryBody, CategoryResponse, LoginPayload, LoginResponse, TransactionAddResponse, TransactionBody, TransactionGetResponse } from "./apiTypes"

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
export const addTransaction = async (payload:TransactionBody): Promise<TransactionAddResponse> => {
    return apiRequest<TransactionBody, TransactionAddResponse>({
        url: api.transaction.addTrasaction,
        method: "POST",
        data: payload,
    });
};
export const addCategory = async (payload:CategoryBody): Promise<Category> => {
    return apiRequest<CategoryBody, Category>({
        url: api.category.addCategory,
        method: "POST",
        data: payload,
    });
};

export const getTransactionByUserId = async (): Promise<TransactionGetResponse> => {
    return apiRequest<TransactionGetResponse>({
        url: api.transaction.getTransacionByUserId
    });
};


export const getAllCategory = async (): Promise<CategoryResponse> => {
    return apiRequest<CategoryResponse>({
        url: api.category.getAll
    });
};
