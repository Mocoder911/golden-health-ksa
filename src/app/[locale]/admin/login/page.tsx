"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    router.push(`/${locale}/admin/dashboard`);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/admin/dashboard`);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-onyx px-4">
      <div className="glass-strong w-full max-w-md rounded-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Admin Login</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to manage Golden Health KSA
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-emerald/50"
              placeholder="admin@goldenhealth.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2.5 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-emerald/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg gradient-emerald py-2.5 font-semibold text-onyx transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
