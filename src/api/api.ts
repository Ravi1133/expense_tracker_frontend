
const api = {
    auth: {
        login: "/userAuth/login",
        logout: "/logout",
        register: "/userAuth/register",
        getAlluser:"/userAuth/getUsers",
        updateData:"/userAuth/updateUser",
        
    },
    category: {
        getAll: "/category/getCategories",
        addCategory:"/category/addCategory"
    },
    transaction: {
        addTrasaction: "/transaction/addTransaction",
        getTransacionByUserId:"/transaction/getTransaction",
        getAllTransaction:"/transaction/getTransactions",
        updateTransaction:"/transaction/updateTransaction"
    }
}



import axiosInstance from "./axiosHandler";
import type { Category, CategoryBody, CategoryResponse, getUsersBody, getUsersResponse, LoginPayload, LoginResponse, regsiterPayload, regsiterResponse, TransactionAddResponse, TransactionBody, TransactionBodyUpdate, transactionGetBody, TransactionGetResponse, UpdateUserBody, UpdateUserResponse } from "./apiTypes"

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

export const regsiterUser = async (payload: regsiterPayload): Promise<regsiterResponse> => {
    return apiRequest<regsiterPayload, regsiterResponse>({
        url: api.auth.register,
        method: "POST",
        data: payload,
    });
};
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
    return apiRequest<LoginPayload, LoginResponse>({
        url: api.auth.login,
        method: "POST",
        data: payload,
    });
};
export const getAlluser = async (payload: getUsersBody): Promise<getUsersResponse> => {
    return apiRequest<getUsersBody, getUsersResponse>({
        url: api.auth.getAlluser,
        method: "POST",
        data: payload,
    });
};
export const updateUser = async (payload: UpdateUserBody): Promise<UpdateUserResponse> => {
    return apiRequest<UpdateUserBody, UpdateUserResponse>({
        url: api.auth.updateData,
        method: "PATCH",
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
export const updateTransaction = async (payload:TransactionBodyUpdate): Promise<TransactionAddResponse> => {
    return apiRequest<TransactionBodyUpdate, TransactionAddResponse>({
        url: api.transaction.updateTransaction,
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

export const getTransactionByUserId = async (payload:transactionGetBody): Promise<TransactionGetResponse> => {
    return apiRequest<transactionGetBody,TransactionGetResponse>({
        url: api.transaction.getTransacionByUserId,
        method: "POST",
        data: payload,
    });
};
export const getAllTransaction = async (payload:transactionGetBody): Promise<TransactionGetResponse> => {
    return apiRequest<transactionGetBody,TransactionGetResponse>({
        url: api.transaction.getAllTransaction,
        method: "POST",
        data: payload,
    });
};


export const getAllCategory = async (): Promise<CategoryResponse> => {
    return apiRequest<CategoryResponse>({
        url: api.category.getAll
    });
};
