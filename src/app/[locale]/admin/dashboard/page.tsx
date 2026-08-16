"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import type { Inquiry } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [stats, setStats] = useState({ inquiries: 0, orders: 0, services: 0, sources: 0, newInquiries: 0 });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    const [inquiries, orders, services, sources] = await Promise.all([
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("delivered_orders").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("global_sources").select("*", { count: "exact", head: true }),
    ]);

    const { data: recent } = await supabase
      .from("inquiries")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5);

    setStats({
      inquiries: inquiries.count ?? 0,
      orders: orders.count ?? 0,
      services: services.count ?? 0,
      sources: sources.count ?? 0,
      newInquiries: recent?.length ?? 0,
    });
    if (recent) setRecentInquiries(recent);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Inquiries", value: stats.inquiries, color: "text-emerald", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
    { label: "New (Unread)", value: stats.newInquiries, color: "text-gold", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Delivered Orders", value: stats.orders, color: "text-emerald", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { label: "Services", value: stats.services, color: "text-gold", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
    { label: "Sourcing Countries", value: stats.sources, color: "text-emerald", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Welcome back{user?.email ? `, ${user.email}` : ""}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5 transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-secondary">{stat.label}</p>
              <svg className={`h-5 w-5 ${stat.color} opacity-50`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
              </svg>
            </div>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Recent Inquiries</h2>
        {recentInquiries.length === 0 ? (
          <p className="text-sm text-text-muted">No new inquiries.</p>
        ) : (
          <div className="space-y-3">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between rounded-lg bg-onyx-light/50 p-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{inq.contact_name}</p>
                  <p className="text-xs text-text-muted">{inq.company_name} &middot; {inq.email}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald/20 px-2 py-0.5 text-xs text-emerald">New</span>
                  <p className="mt-1 text-xs text-text-muted">{new Date(inq.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
