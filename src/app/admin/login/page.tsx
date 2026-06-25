"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password === "admin123") {
      sessionStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("รหัสผ่านไม่ถูกต้อง");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-grid flex items-center justify-center">
      <div className="card p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <svg className="w-10 h-10 mx-auto text-[var(--color-accent)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-xl font-bold">Admin</h1>
          <p className="text-sm text-[var(--color-text-dim)] mt-1">กรอกรหัสผ่านเพื่อเข้าสู่ระบบ</p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน..."
            className="w-full px-4 py-3 rounded mb-4 text-center text-lg font-medium focus:outline-none"
            style={{
              background: "var(--color-bg)",
              border: "2px solid var(--color-surface-border)",
              color: "var(--color-text)",
            }}
            autoFocus
          />
          {error && (
            <p className="text-sm text-[var(--color-rose)] text-center mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={!password || loading}
            className="w-full py-3 rounded font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-accent)",
              color: "#0c0f1a",
            }}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </main>
  );
}
