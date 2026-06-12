import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building2,
  Github,
  Chrome,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { useSignup } from "@/services/auth.service";

export default function Signup() {
  const navigate = useNavigate();

  const { signup, loading } = useSignup();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    signup(
      form,
      (data) => {
        navigate("/login");
      },
      (error) => {
        console.error(error.message);
      }
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" />

      <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />

      <motion.div className="relative z-10 mx-6 w-full max-w-sm">
        {/* Card */}
        <div
          className={cn(
            "rounded-2xl border p-8",
            "border-neutral-200/60 bg-white/80 shadow-xl shadow-neutral-900/5 backdrop-blur-xl",
            "dark:border-neutral-800/60 dark:bg-neutral-900/80 dark:shadow-black/20"
          )}
        >
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Create your account
            </h1>

            <p className="mt-1.5 text-sm text-neutral-500">
              Start managing projects in minutes
            </p>
          </div>

          {/* Social */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className={cn(
                "flex items-center justify-center gap-2 rounded-md border py-2.5 text-xs font-medium transition-all",
                "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
                "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              )}
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </button>

            <button
              type="button"
              className={cn(
                "flex items-center justify-center gap-2 rounded-md border py-2.5 text-xs font-medium transition-all",
                "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
                "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              )}
            >
              <Chrome className="h-3.5 w-3.5" />
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />

            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              or
            </span>

            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Full name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={cn(
                    "w-full rounded-md border py-2.5 pl-10 pr-4 text-sm outline-none transition-all",
                    "border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400",
                    "focus:border-neutral-400 focus:bg-white",
                    "dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-800"
                  )}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className={cn(
                    "w-full rounded-md border py-2.5 pl-10 pr-4 text-sm outline-none transition-all",
                    "border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400",
                    "focus:border-neutral-400 focus:bg-white",
                    "dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-800"
                  )}
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Role
              </label>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  className={cn(
                    "w-full rounded-md border py-2.5 pl-10 pr-4 text-sm outline-none transition-all",
                    "border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400",
                    "focus:border-neutral-400 focus:bg-white",
                    "dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-800"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={cn(
                    "w-full rounded-md border py-2.5 pl-10 pr-10 text-sm outline-none transition-all",
                    "border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400",
                    "focus:border-neutral-400 focus:bg-white",
                    "dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-800"
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>


            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter a strong password"
                  className={cn(
                    "w-full rounded-md border py-2.5 pl-10 pr-10 text-sm outline-none transition-all",
                    "border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400",
                    "focus:border-neutral-400 focus:bg-white",
                    "dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-800"
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all",
                "bg-neutral-900 text-white hover:opacity-90",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "dark:bg-white dark:text-neutral-900"
              )}
            >
              {loading ? "Creating..." : "Create account"}

              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-neutral-900 transition-opacity hover:opacity-70 dark:text-white"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}