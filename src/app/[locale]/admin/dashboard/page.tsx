"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [stats, setStats] = useState({
    inquiries: 0,
    orders: 0,
    services: 0,
    sources: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/admin/login`);
    }
  }, [user, loading, router, locale]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    const [inquiries, orders, services, sources] = await Promise.all([
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("delivered_orders").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("global_sources").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      inquiries: inquiries.count ?? 0,
      orders: orders.count ?? 0,
      services: services.count ?? 0,
      sources: sources.count ?? 0,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-onyx">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const statCards = [
    { label: "Total Inquiries", value: stats.inquiries, color: "text-emerald" },
    { label: "Delivered Orders", value: stats.orders, color: "text-gold" },
    { label: "Services", value: stats.services, color: "text-emerald" },
    { label: "Sourcing Countries", value: stats.sources, color: "text-gold" },
  ];

  return (
    <div className="min-h-screen bg-onyx p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-text-secondary">
            Welcome back, {user.email}
          </p>
        </div>
        <button
          onClick={() => {
            signOut();
            router.push(`/${locale}/admin/login`);
          }}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-red-500/30 hover:text-red-400"
        >
          Sign Out
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-6 transition-transform hover:scale-[1.02]"
          >
            <p className="text-sm text-text-secondary">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: `/${locale}/admin/settings`, label: "Site Settings", desc: "Manage global content" },
          { href: `/${locale}/admin/orders`, label: "Delivered Orders", desc: "Track record entries" },
          { href: `/${locale}/admin/sourcing`, label: "Sourcing Countries", desc: "Manage source hubs" },
          { href: `/${locale}/admin/inquiries`, label: "Inquiries", desc: "View contact submissions" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="glass rounded-xl p-5 transition-all hover:border-emerald/20 hover:bg-onyx-lighter"
          >
            <h3 className="font-semibold text-text-primary">{link.label}</h3>
            <p className="mt-1 text-sm text-text-muted">{link.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
