import { useForm } from "react-hook-form";
import { useState } from "react";
import { getUserData } from "../utils/utilfunctions";
import { updateUser } from "../api/api";
import { toast } from "react-toastify";
import type { UpdateUserBody } from "../api/apiTypes";

type ProfileFormData = {
  name: string;
  email: string;
  role: string;
  gender: string;
  password?: string;
  confirmPassword?: string;
};

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
    let userData=getUserData()
  // Prefilled dummy user data (can come from API)
  const defaultValues: ProfileFormData = {
    name: userData?.name||"",
    email: userData?.email||"",
    role: userData?.role ||"",
    gender: userData?.gender||"",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues,
  });

  const password = watch("password");

  const onSubmit = async(data: ProfileFormData) => {
    console.log("Updated Profile Data:", data);
    let payload:UpdateUserBody={
          name:  data.name,
          gender:data.gender,
    }
    if(data.password){
        payload={...payload,password:data.password}
    }
    let userData=await updateUser(payload)
    localStorage.setItem("userData",JSON.stringify(userData.userData))
    toast.success("User Updated")
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-surface rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Profile</h1>
            <p className="mt-1 text-text-secondary">
              View and update your account details
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-primary px-4 py-2 text-black font-semibold hover:bg-primary-dark transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg bg-gray-300 px-4 py-2 text-black font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-form"
                className="rounded-lg bg-primary px-4 py-2 text-black font-semibold hover:bg-primary-dark transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form
          id="profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-error focus:ring-error"
                    : "border-gray-300 focus:ring-primary"
                } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error">{errors.name.message}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Email
              </label>
              <input
                type="email"
                disabled
                {...register("email")}
                className="w-full rounded-lg border px-4 py-2 bg-gray-100 cursor-not-allowed border-gray-300"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Role
              </label>
              <input
                type="text"
                disabled
                {...register("role")}
                className="w-full rounded-lg border px-4 py-2 bg-gray-100 cursor-not-allowed border-gray-300"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Gender
              </label>
              <select
                disabled={!isEditing}
                {...register("gender", {
                  required: "Please select your gender",
                })}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.gender
                    ? "border-error focus:ring-error"
                    : "border-gray-300 focus:ring-primary"
                } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-error">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Password
              </label>
              <input
                type="password"
                disabled={!isEditing}
                placeholder="********"
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-error focus:ring-error"
                    : "border-gray-300 focus:ring-primary"
                } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Confirm Password
              </label>
              <input
                type="password"
                disabled={!isEditing}
                placeholder="********"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-error focus:ring-error"
                    : "border-gray-300 focus:ring-primary"
                } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
