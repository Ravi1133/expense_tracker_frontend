import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { addTransaction, getAllCategory, getTransactionByUserId } from "../api/api";
import type { CategoryResponse, TransactionGetResponse } from "../api/apiTypes";
import { getUserData } from "../utils/utilfunctions";
import { toast } from "react-toastify";

// Reuse TransactionType from previous setup
export const TransactionType = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

type TransactionForm = {
    categoryId: number;
    amount: number;
    type: "INCOME" | "EXPENSE";
    description: string;
    transactionDate: Date
};

// Example categories
// const categories = [
//   { id: 1, name: "Salary", type: "INCOME" },
//   { id: 2, name: "Food", type: "EXPENSE" },
//   { id: 3, name: "Investment", type: "INCOME" },
// ];

function Transaction() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<TransactionForm>();
    const [categories, setcategories] = useState<CategoryResponse["categories"] | null>(null)
    const [transactions, setTransactions] = useState<TransactionGetResponse["transaction"] |[]>([]);

    const onSubmit = async (data: TransactionForm) => {
        data.transactionDate = new Date(data.transactionDate)
        // setTransactions([...transactions, data]);
        let userData = getUserData()
        if (!userData?.id) return

        let transaction = await addTransaction({ ...data, userId: userData.id })
        toast.success("Transaction Added")
        reset();
    };
    console.log("watch", watch())

    async function getCetegory() {
        let categories = await getAllCategory()
        setcategories(categories.categories)
    }
    const getAllUserTransaction = async () => {
        let response = await getTransactionByUserId()
        console.log("response", response)
        setTransactions(response.transaction)
    }
    useEffect(() => {
        getCetegory()
        getAllUserTransaction()
    }, [])

    console.log(categories, "categories")
    const today = new Date().toISOString().split("T")[0];
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
                            Add Transaction
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
                                    <th className="px-4 py-2 border-b">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-2 text-center text-text-secondary">
                                            No transactions added yet
                                        </td>
                                    </tr>
                                )}
                                {transactions.map((tx, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{tx.category.name}</td>
                                        <td className="px-4 py-2 border-b">{tx.amount}</td>
                                        <td className="px-4 py-2 border-b">{tx.type}</td>
                                        <td className="px-4 py-2 border-b">{tx.description || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transaction;
