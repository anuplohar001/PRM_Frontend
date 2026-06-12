import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Orbit, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLogin } from "../../services/hooks/useLogin";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const navigate = useNavigate()


  useEffect(() => {
    localStorage.clear();
  }, []);


  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      navigate("/choose-workspace", {
        state: {
          organizationMemberships: result.user.organizationMemberships,
        },
      });

    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  return (

    <div
      className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden"
    >


      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 w-full max-w-sm mx-6"
      >

        {/* Card */}
        <div className={cn(
          "rounded-2xl border p-8",
          "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl",
          "border-neutral-200/60 dark:border-neutral-800/60 shadow-xl shadow-neutral-900/5 dark:shadow-black/20"
        )}>
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-neutral-500 mt-1.5">Sign in to your workspace</p>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-medium border transition-all",
              "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}>
              <Github className="w-3.5 h-3.5" />
              GitHub
            </button>
            <button className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-medium border transition-all",
              "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}>
              <Chrome className="w-3.5 h-3.5" />
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-md text-sm border outline-none transition-all",
                    "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800",
                    "text-neutral-900 dark:text-white placeholder:text-neutral-400",
                    "focus:border-neutral-400 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-800"
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={cn(
                    "w-full pl-10 pr-10 py-2.5 rounded-md text-sm border outline-none transition-all",
                    "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800",
                    "text-neutral-900 dark:text-white placeholder:text-neutral-400",
                    "focus:border-neutral-400 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-800"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-white" />
                <span className="text-xs text-neutral-500">Remember me</span>
              </label>
              <Link to="#" className="text-xs font-medium text-neutral-900 dark:text-white hover:opacity-70 transition-opacity">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all",
                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90"
              )}
            >
              Sign in
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-500 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-neutral-900 dark:text-white hover:opacity-70 transition-opacity">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
