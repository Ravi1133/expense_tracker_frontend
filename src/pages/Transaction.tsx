import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { addTransaction, getAllCategory, getTransactionByUserId, updateTransaction } from "../api/api";
import type { CategoryResponse, TransactionBody, TransactionGetResponse } from "../api/apiTypes";
import { getUserData } from "../utils/utilfunctions";
import { toast } from "react-toastify";
import Pagination from "../utils/Pagination";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import moment from "moment";

// Reuse TransactionType from previous setup
export const TransactionType = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

type TransactionForm = {
    id?: number,
    categoryId: number;
    amount: number;
    type: "INCOME" | "EXPENSE";
    description: string;
    transactionDate: string
};
const defaultState: TransactionForm = {
    id: undefined,
    categoryId: 0,
    amount: 0,
    type: "" as "INCOME" | "EXPENSE",
    description: "",
    transactionDate: "",
};

function Transaction() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<TransactionForm>();
    const [categories, setcategories] = useState<CategoryResponse["categories"] | null>(null)
    const [transactions, setTransactions] = useState<TransactionGetResponse["transaction"]["data"] | []>([]);
    const [paginationState, setpaginationState] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 10
    })
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const onSubmit = async (data: TransactionForm) => {
        debugger
        data.transactionDate = data.transactionDate
        // setTransactions([...transactions, data]);
        let userData = getUserData()
        let transaction = {}
        if (!userData?.id) return
        if (isEdit) {
            if (!data.id) return
            if (data.id === undefined) {
                console.error("Transaction ID missing for update");
                return;
            }

            // Pass id along with the data
            const transaction = await updateTransaction({ ...data });
            toast.success("Transaction Updated");
            setIsEdit(false)
            reset({ ...defaultState })
        } else {

            let transaction = await addTransaction({ ...data, userId: userData.id })
            toast.success("Transaction Added")

        }
        getAllUserTransaction()
        reset();
    };
    console.log("watch", watch())

    async function getCetegory() {
        let categories = await getAllCategory()
        setcategories(categories.categories)
    }
    const getAllUserTransaction = async () => {
        let payload = {
            page: paginationState.page,
            pageSize: paginationState.pageSize,
        }
        let response = await getTransactionByUserId(payload)
        console.log("response", response)
        setpaginationState(response.transaction.pagination)
        setTransactions(response.transaction.data)
    }
    useEffect(() => {
        getCetegory()

    }, [])
    useEffect(() => {
        getAllUserTransaction()
    }, [paginationState.page, paginationState.pageSize])


    console.log(categories, "categories")
    const today = new Date().toISOString().split("T")[0];

    const pageSizeChange = (data: any) => {
        console.log(data, "pageSizeChange")
        setpaginationState((state) => { return { ...state, pageSize: data } })
    }
    const pagechange = (data: any) => {
        console.log(data, "pageChange")
        setpaginationState((state) => { return { ...state, page: data } })
    }

    const editTransaction = (data: any) => {
        setIsEdit(true)
        reset({ amount: data.amount, categoryId: data.categoryId, transactionDate: moment(data.transactionDate).format("YYYY-MM-DD"), description: data.description, type: data.type, id: data.id })
    }
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl font-bold text-primary mb-6">Add Transaction</h1>
                {/* Form */}
                <div className="bg-surface p-6 rounded-2xl shadow-lg mb-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Category */}
                        <div>
                            <label className="block mb-2 font-medium text-text-primary">Category</label>
                            <select
                                {...register("categoryId", { required: "Category is required", valueAsNumber: true })}
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${errors.categoryId
                                    ? "border-error focus:ring-error"
                                    : "border-gray-300 focus:ring-primary"
                                    }`}
                            >
                                <option value="">Select Category</option>
                                {categories?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name} ({cat.type})
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="mt-1 text-sm text-error">{errors.categoryId.message}</p>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block mb-2 font-medium text-text-primary">Amount</label>
                            <input
                                type="number"
                                min={0}
                                placeholder="0.00"
                                {...register("amount", {
                                    required: "Amount is required",
                                    valueAsNumber: true,
                                    min: { value: 0.01, message: "Amount must be greater than 0" },
                                })}
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${errors.amount
                                    ? "border-error focus:ring-error"
                                    : "border-gray-300 focus:ring-primary"
                                    }`}
                            />
                            {errors.amount && (
                                <p className="mt-1 text-sm text-error">{errors.amount.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-text-primary">Date</label>
                            <input
                                type="date"
                                max={today}

                                placeholder="0.00"
                                {...register("transactionDate", {
                                    required: "Date is required"
                                })}
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${errors.transactionDate
                                    ? "border-error focus:ring-error"
                                    : "border-gray-300 focus:ring-primary"
                                    }`}
                            />
                            {errors.amount && (
                                <p className="mt-1 text-sm text-error">{errors?.transactionDate?.message}</p>
                            )}
                        </div>

                        {/* Transaction Type */}
                        <div>
                            <label className="block mb-2 font-medium text-text-primary">Transaction Type</label>
                            <select
                                {...register("type", { required: "Transaction type is required" })}
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${errors.type
                                    ? "border-error focus:ring-error"
                                    : "border-gray-300 focus:ring-primary"
                                    }`}
                            >
                                <option value="">Select Type</option>
                                {Object.values(TransactionType).map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-error">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-2 font-medium text-text-primary">Description</label>
                            <textarea
                                placeholder="Optional description"
                                {...register("description")}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="
                w-full py-2 rounded-lg font-semibold
                bg-primary text-black hover:bg-primary-dark
                dark:bg-primary-dark dark:text-white dark:hover:bg-primary
                transition
              "
                        >
                            {isEdit ? "Update Transaction" : "Add Transaction"}
                        </button>
                    </form>
                </div>

                {/* Transactions List */}
                <div className="bg-surface p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Transactions List</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border-b">Category</th>
                                    <th className="px-4 py-2 border-b">Amount</th>
                                    <th className="px-4 py-2 border-b">Type</th>
                                    <th className="px-4 py-2 border-b">Date</th>

                                    <th className="px-4 py-2 border-b">Description</th>
                                    <th className="px-4 py-2 border-b">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-2 text-center text-text-secondary">
                                            No transactions added yet
                                        </td>
                                    </tr>
                                )}
                                {transactions?.map((tx, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{tx.category.name}</td>
                                        <td className="px-4 py-2 border-b">{tx.amount}</td>
                                        <td className="px-4 py-2 border-b">{moment(tx.transactionDate).format("YYYY-MM-DD")}</td>

                                        <td className="px-4 py-2 border-b">{tx.type}</td>
                                        <td className="px-4 py-2 border-b">{tx.description || "-"}</td>
                                        <td className="px-4 py-2 border-b">
                                            <div className="flex">
                                                <FaRegTrashAlt className="cursor-pointer" /> <FaRegEdit onClick={() => editTransaction(tx)} className="cursor-pointer ms-2" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        page={paginationState.page}
                        pageSize={paginationState.pageSize}
                        totalCount={paginationState.totalCount}
                        onPageChange={pagechange}
                        onPageSizeChange={pageSizeChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default Transaction;
