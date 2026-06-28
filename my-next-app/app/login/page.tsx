"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gem } from "lucide-react";
import { http } from "@/Redux/http/Http/http";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data } = await http.post("/auth/login", { username, password });
      const token = data?.token ?? data?.access_token ?? data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr?.response?.data?.message ?? "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "radial-gradient(ellipse at 70% 60%, #1a0a2e 0%, #0d1b2a 40%, #0a1628 100%)" }}
    >
      {/* Subtle right glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 85% 65%, rgba(120,30,30,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ background: "#1e2130" }}
      >
        {/* Rainbow top border */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, #6c3ff5 0%, #a855f7 25%, #ec4899 55%, #f97316 80%, #fbbf24 100%)",
          }}
        />

        {/* Card Body */}
        <div className="px-12 pt-12 pb-8 flex flex-col items-center">
          {/* Logo */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)",
              boxShadow: "0 4px 24px rgba(251,191,36,0.35)",
            }}
          >
            <Gem className="w-8 h-8 text-white drop-shadow" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
            Jewellery Pro
          </h1>
          <p className="text-sm text-gray-400 mb-8">Enterprise Business Management System</p>

          {/* Form */}
          <div className="w-full flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all"
                style={{
                  background: "#2a2d3e",
                  border: "1px solid transparent",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6c3ff5")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none transition-all"
                style={{
                  background: "#2a2d3e",
                  border: "1px solid transparent",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6c3ff5")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 text-center -mt-2">{error}</p>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-bold text-white mt-1 transition-opacity disabled:opacity-60"
              style={{
                background: "linear-gradient(90deg, #5b3ff5 0%, #6c52f5 100%)",
                boxShadow: "0 4px 20px rgba(108,82,245,0.45)",
              }}
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </div>

          {/* Footer status */}
          <div className="flex items-center gap-4 mt-8">
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Secure Server
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gray-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
              v4.1.1 Stable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
