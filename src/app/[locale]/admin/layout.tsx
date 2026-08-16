"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = params.locale as string;

  // Don't show sidebar on login page
  const isLoginPage = pathname.includes("/admin/login");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-onyx">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isLoginPage) {
    router.push(`/${locale}/admin/login`);
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push(`/${locale}/admin/login`);
  };

  return (
    <div className="flex min-h-screen bg-onyx">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-onyx/80 px-6 backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Admin Panel
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              <Link
                href={`/${locale}/admin/dashboard`}
                locale="en"
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  locale === "en" ? "bg-emerald/20 text-emerald" : "text-text-muted hover:text-text-primary"
                }`}
              >
                EN
              </Link>
              <Link
                href={`/${locale}/admin/dashboard`}
                locale="ar"
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  locale === "ar" ? "bg-emerald/20 text-emerald" : "text-text-muted hover:text-text-primary"
                }`}
              >
                AR
              </Link>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
