export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type LoginResponse={
    email:string,
    gender:string,
    token:string,
    id:number,
    status:string
}
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];