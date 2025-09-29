export type LoginPayload = {
    email: string;
    password: string;
};

export type CategoryType = {
    EXPENSE: String,
    INCOME: String
}
export type GetUsersPayload = {
    userId: number,
    categoryId: number,
    type: "INCOME" | "EXPENSE",

}
export type UpdateUserBody = {
    name?: string;
    gender?: string;
    password?: string
};

export type getUsersBody = {
    page?:number,
    pageSize?:number,
    name?: string;
    gender?: string;
    status?: string
    email?: string
}
export type getUsersResponse = {
    message: string,
    skip:number,
    totalCount:number,
    totalPage:number,
    pageSize:number,
    userData: {
        id:number,
        name: string;
        gender: string;
        status: string,
        email: string
    }[]
}

export type UpdateUserResponse = {
    message: string
    userData: {
        name: string;
        gender: string;
        id: number;
        password: string
    }
};

export type LoginResponse = {
    token: string;
    name: string;
    email: string;
    gender: string;
    id: number;
    status: string
    role: string
};
export type Category = {
    id: number;
    name: string;
    type: string;
    status: string;
    createdAt: string
}

export type CategoryBody = {
    name: string;
    type: string;
    status?: string;
}

export type CategoryResponse = {
    categories: Category[]
}

export type TransactionBody = {
    categoryId: number,
    userId: number,
    amount: number,
    type: "INCOME" | "EXPENSE",
    description: String
    transactionDate: Date | string
}

export type TransactionBodyUpdate = {
    id?: number,
    categoryId?: number,
    userId?: number,
    amount?: number,
    type?: "INCOME" | "EXPENSE",
    description?: String
    transactionDate?: Date | string
}

export type TransactionAddResponse = {
    message: String,
    transaction: TransactionBody & { id: number }
}
export type transactionGetBody = {
    page: number,
    pageSize: number,
    categoryId?: number,
    amount?: number,
    type?: string
}
export type transactionBodForIndividual = {
    data: (TransactionBody & { id: number; status: string; createdAt: Date, category: Category, user: { email: string, id: number, name: string } })[],
    pagination: { page: number, pageSize: number, totalCount: number, totalPage: number }
}
export type TransactionGetResponse = {
    message: string;
    transaction: transactionBodForIndividual
};