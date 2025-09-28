import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    alert("Registration successful!");
  };

  return (
    <div className=" border border-white flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Create an Account</h1>
          <p className="mt-2 text-text-secondary">
            Join us and start your journey today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
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
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

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

          {/* Gender */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Gender
            </label>
            <select
              {...register("gender", {
                required: "Please select your gender",
              })}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.gender
                  ? "border-error focus:ring-error"
                  : "border-gray-300 focus:ring-primary"
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-error">{errors.gender.message}</p>
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
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
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

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-error focus:ring-error"
                  : "border-gray-300 focus:ring-primary"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-black font-semibold hover:bg-primary-dark transition-colors"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
