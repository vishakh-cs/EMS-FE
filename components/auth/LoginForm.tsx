"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postApi, employee } from "@/app/services";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the API service using the exact requested pattern:
      const response = await postApi(employee.employeeLogin, {
        email,
        password,
        remember,
      });

      // Save user details and token in sessionStorage
      const userData = response?.data?.data || response?.data;
      if (userData) {
        if (userData.token) sessionStorage.setItem("token", userData.token);
        if (userData.firstName) sessionStorage.setItem("firstName", userData.firstName);
        if (userData.lastName) sessionStorage.setItem("lastName", userData.lastName);
        if (userData.designation) sessionStorage.setItem("designation", userData.designation);
      }

      // Successful login -> route to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login Error:", err);
      // Fallback message based on Axios error response or custom message
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please verify your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-xs bg-error/10 border border-error/30 text-error rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-on-surface block"
          htmlFor="email"
        >
          Email Address
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            mail
          </span>
          <input
            id="email"
            type="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            className="text-sm font-medium text-on-surface"
            htmlFor="password"
          >
            Password
          </label>
          <a
            href="#"
            className="text-xs font-semibold text-primary hover:brightness-125 transition-all"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            lock
          </span>
          <input
            id="password"
            type="password"
            required
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="glass-input w-full pl-11 pr-12 py-3 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Remember */}
      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          disabled={loading}
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="w-4 h-4 rounded border-outline-variant bg-white/5 text-primary focus:ring-0 focus:ring-offset-0"
        />
        <label
          htmlFor="remember"
          className="text-xs text-on-surface-variant cursor-pointer select-none"
        >
          Remember this device for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-container text-on-primary font-semibold py-3 rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Login</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </>
        )}
      </button>
    </form>
  );
}
