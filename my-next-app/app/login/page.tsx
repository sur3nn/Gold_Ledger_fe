"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gem, User, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";

import { loginAction } from "@/Redux/Action/action";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        user_name: username,
        password,
      };

      const result = await dispatch(loginAction(payload)).unwrap();
      console.log("result", result?.data?.token);
      localStorage.setItem("token", result?.data?.token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4"
      style={{
        background:
          "radial-gradient(ellipse at 70% 60%, #1a0a2e 0%, #0d1b2a 40%, #0a1628 100%)",
      }}
    >
      {/* ── Ambient background layers ── */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 85% 65%, rgba(120,30,30,0.18) 0%, transparent 70%)",
        }}
      />

      {/* faint grid texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* floating gradient orbs */}
      <div
        className="pointer-events-none fixed w-[420px] h-[420px] rounded-full opacity-30 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent 70%)",
          top: "-8%",
          left: "-6%",
          animation: "floatSlow 9s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none fixed w-[380px] h-[380px] rounded-full opacity-25 blur-[110px]"
        style={{
          background: "radial-gradient(circle, #ec4899, transparent 70%)",
          bottom: "-10%",
          right: "-8%",
          animation: "floatSlow 11s ease-in-out infinite reverse",
        }}
      />
      <div
        className="pointer-events-none fixed w-[300px] h-[300px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #fbbf24, transparent 70%)",
          top: "40%",
          right: "12%",
          animation: "floatSlow 13s ease-in-out infinite",
        }}
      />

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-md rounded-[28px] overflow-hidden"
        style={{
          background: "rgba(30, 33, 48, 0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 25px 70px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
          animation: "cardIn 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* top gradient strip */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, #6c3ff5 0%, #a855f7 25%, #ec4899 55%, #f97316 80%, #fbbf24 100%)",
          }}
        />

        {/* subtle inner glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[280px] h-[200px] opacity-40 blur-3xl"
          style={{ background: "radial-gradient(ellipse, #fbbf24, transparent 70%)" }}
        />

        <div className="relative px-8 sm:px-11 pt-11 pb-9 flex flex-col items-center">
          {/* Logo */}
          <div
            className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center mb-6 relative"
            style={{
              background: "linear-gradient(135deg, #fde68a 0%, #fbbf24 45%, #d97706 100%)",
              boxShadow:
                "0 8px 30px rgba(251,191,36,0.4), inset 0 1px 1px rgba(255,255,255,0.4)",
            }}
          >
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
            <Gem className="w-8 h-8 text-white drop-shadow-sm" strokeWidth={2.2} />
          </div>

          <h1 className="text-[28px] sm:text-3xl font-bold text-white mb-1.5 tracking-tight text-center">
            Jewellery Pro
          </h1>

          <p className="text-[13px] text-gray-400 mb-9 text-center tracking-wide">
            Enterprise Business Management System
          </p>

          <div className="w-full flex flex-col gap-4">
            {/* Username */}
            <div>
              <label className="text-[12px] font-semibold text-gray-400 tracking-wide uppercase mb-1.5 block">
                Username
              </label>

              <div
                className="flex items-center gap-2.5 rounded-xl px-4 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <User size={16} className="text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="w-full py-3.5 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] font-semibold text-gray-400 tracking-wide uppercase mb-1.5 block">
                Password
              </label>

              <div
                className="flex items-center gap-2.5 rounded-xl px-4 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Lock size={16} className="text-gray-500 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full py-3.5 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-2.5 text-center"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <p className="text-red-400 text-[13px] font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-full text-white font-semibold text-[15px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98] mt-1"
              style={{
                background: "linear-gradient(90deg, #5b3ff5 0%, #8b5cf6 50%, #ec4899 100%)",
                boxShadow: "0 8px 24px rgba(139,92,246,0.35)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-1">
              <ShieldCheck size={12} className="text-gray-600" />
              <p className="text-[11px] text-gray-600 tracking-wide">
                Secured enterprise access
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -24px) scale(1.06); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}