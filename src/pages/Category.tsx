import { useForm } from "react-hook-form";
import { useState } from "react";
import type { TransactionType } from "../utils/types";
import { addCategory } from "../api/api";
import { toast } from "react-toastify";

export const TransactionTypeEnum = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
}

type CategoryForm = {
    name: string;
    type: TransactionType;
    active: boolean;
};

type Category = CategoryForm & { id: number };

function CategoryPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryForm>();

    const [categories, setCategories] = useState<Category[]>([]);

    const onSubmit = async (data: CategoryForm) => {
        const newCategory = {
            ...data,
            id: Date.now(),
        };
        await addCategory(data)
        toast.success("Category Added")
        setCategories([...categories, newCategory]);
        reset();
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl font-bold text-primary mb-6">
                    Category Management
                </h1>

                {/* Add Category Form */}
                <div className="bg-surface p-6 rounded-2xl shadow-lg mb-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Name */}
                        <div>
                            <label className="block mb-2 text-text-primary font-medium">
                                Category Name
                            </label>
                            <input
                                type="text"
                                placeholder="Category Name"
                                {...register("name", { required: "Name is required" })}
                                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${errors.name
                                        ? "border-error focus:ring-error"
                                        : "border-gray-300 focus:ring-primary"
                                    }`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block mb-2 text-text-primary font-medium">
                                Type
                            </label>
                            <select
                                {...register("type", { required: "Type is required" })}
                                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary"
                            >
                                <option value="">Select Type</option>
                                {Object.values(TransactionTypeEnum).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Active / Inactive */}
                        <div>
                            <label className="block mb-2 text-text-primary font-medium">
                                Status
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="true"
                                        {...register("active")}
                                        className="accent-primary"
                                    />
                                    <span className="text-text-secondary">Active</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="false"
                                        {...register("active")}
                                        className="accent-error"
                                    />
                                    <span className="text-text-secondary">Inactive</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-dark text-black font-semibold w-full py-2 rounded-lg transition"
                        >
                            Add Category
                        </button>
                    </form>
                </div>

                {/* Category List */}
                <div className="bg-surface p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Category List
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border-b">Name</th>
                                    <th className="px-4 py-2 border-b">Type</th>
                                    <th className="px-4 py-2 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-2 text-center text-text-secondary"
                                        >
                                            No categories added yet
                                        </td>
                                    </tr>
                                )}
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{cat.name}</td>
                                        <td className="px-4 py-2 border-b">{cat.type}</td>
                                        <td className="px-4 py-2 border-b">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white text-sm ${cat.active ? "bg-success" : "bg-error"
                                                    }`}
                                            >
                                                {cat.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
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

export default CategoryPage;
