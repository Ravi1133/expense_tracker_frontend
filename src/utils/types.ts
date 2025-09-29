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
export type PaginationProps = {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void; // Optional
};
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];