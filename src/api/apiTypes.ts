export type LoginPayload = {
    email: string;
    password: string;
};

export type CategoryType = {
    EXPENSE: String,
    INCOME: String
}
export type LoginResponse = {
    token: string;
    name: string;
    email: string;
    gender: string;
    id: number;
    status: string
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
    type:"INCOME"|"EXPENSE",
    description:String
    transactionDate:Date
}
export type TransactionAddResponse = {
    message:String,
    transaction:TransactionBody & {id:number}
}

export type TransactionGetResponse = {
    message: string;
    transaction: (TransactionBody & { id: number; status: string; createdAt: Date,category:Category,user:{email:string,id:number,name:string} })[];
};