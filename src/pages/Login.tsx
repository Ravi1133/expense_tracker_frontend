import { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../utils/AuthContaxt";
import { toast } from "react-toastify";

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  let globaleContext= useContext(UserContext)
  console.log("globaleContext",globaleContext)
  const onSubmit = async(data: LoginFormData) => {
    console.log("Login Data:", data);
    let response=await globaleContext?.login(data)
    console.log("response login",response)
    toast.success("login success")
    // alert("Login Successful!");
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Login</h1>
          <p className="mt-2 text-text-secondary">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-error focus:ring-error"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-error focus:ring-error"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-black font-semibold hover:bg-primary-dark transition-colors"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-black hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
