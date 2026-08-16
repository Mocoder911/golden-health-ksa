"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabaseClient";
import type { Inquiry } from "@/types";

export default function InquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !user) router.push(`/${locale}/admin/login`);
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (user) fetchInquiries();
  }, [user, filter]);

  const fetchInquiries = async () => {
    let query = supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    if (data) setInquiries(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    await supabase.from("inquiries").update({ status } as never).eq("id", id);
    fetchInquiries();
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-onyx">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const statusColors: Record<string, string> = {
    new: "bg-emerald/20 text-emerald",
    in_progress: "bg-gold/20 text-gold",
    resolved: "bg-blue-500/20 text-blue-400",
    closed: "bg-text-muted/20 text-text-muted",
  };

  return (
    <div className="min-h-screen bg-onyx p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Inquiries</h1>
        <p className="mt-1 text-text-secondary">Contact form submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {["all", "new", "in_progress", "resolved", "closed"].map((status) => (
          <button
            key={status}
            onClick={() => { setFilter(status); setLoading(true); }}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === status
                ? "gradient-emerald text-onyx font-semibold"
                : "glass text-text-secondary hover:text-text-primary"
            }`}
          >
            {status === "all" ? "All" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-muted">No inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {inq.contact_name}
                    <span className="ml-2 text-sm text-text-muted">
                      — {inq.company_name}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {inq.email} | {inq.phone}
                  </p>
                  {inq.message && (
                    <p className="mt-2 text-sm text-text-muted">{inq.message}</p>
                  )}
                  <p className="mt-2 text-xs text-text-muted">
                    Service: {inq.service_type} | Origin: {inq.origin_country_interest}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[inq.status]}`}>
                    {inq.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) => updateStatus(inq.id, e.target.value as Inquiry["status"])}
                    className="mt-1 rounded border border-white/10 bg-onyx-light px-2 py-1 text-xs text-text-secondary outline-none"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
