"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { Inquiry } from "@/types";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";

export default function InquiriesPage() {
  const supabase = createClient();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => { fetchInquiries(); }, [filter]);

  const fetchInquiries = async () => {
    setLoading(true);
    let query = supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    if (data) setInquiries(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    const { error } = await supabase.from("inquiries").update({ status } as never).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated");
    fetchInquiries();
  };

  const deleteInquiry = async (id: string) => {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Inquiry deleted");
    setSelectedInquiry(null);
    fetchInquiries();
  };

  const statusColors: Record<string, string> = {
    new: "bg-emerald/20 text-emerald",
    in_progress: "bg-gold/20 text-gold",
    resolved: "bg-blue-500/20 text-blue-400",
    closed: "bg-text-muted/20 text-text-muted",
  };

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    in_progress: inquiries.filter((i) => i.status === "in_progress").length,
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Inquiries</h1>
        <p className="mt-1 text-sm text-text-secondary">B2B import requests & leads</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {["all", "new", "in_progress", "resolved", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === s ? "gradient-emerald text-onyx font-semibold" : "glass text-text-secondary hover:text-text-primary"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" /></div>
      ) : inquiries.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center"><p className="text-text-muted">No inquiries found.</p></div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="glass rounded-xl p-5 transition-all hover:border-emerald/10">
              <div className="flex items-start justify-between">
                <div className="cursor-pointer flex-1" onClick={() => setSelectedInquiry(inq)}>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-text-primary">{inq.contact_name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[inq.status]}`}>
                      {inq.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{inq.company_name} &middot; {inq.email}</p>
                  {inq.message && <p className="mt-2 text-sm text-text-muted line-clamp-1">{inq.message}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-text-muted">{new Date(inq.created_at).toLocaleDateString()}</span>
                  <select
                    value={inq.status}
                    onChange={(e) => updateStatus(inq.id, e.target.value as Inquiry["status"])}
                    className="rounded border border-white/10 bg-onyx-light px-2 py-1 text-xs text-text-secondary outline-none"
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

      {/* Detail Modal */}
      <Modal open={!!selectedInquiry} onClose={() => setSelectedInquiry(null)} title="Inquiry Details">
        {selectedInquiry && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-xs text-text-muted">Contact Name</p><p className="text-sm text-text-primary">{selectedInquiry.contact_name}</p></div>
              <div><p className="text-xs text-text-muted">Company</p><p className="text-sm text-text-primary">{selectedInquiry.company_name}</p></div>
              <div><p className="text-xs text-text-muted">Email</p><p className="text-sm text-text-primary">{selectedInquiry.email}</p></div>
              <div><p className="text-xs text-text-muted">Phone</p><p className="text-sm text-text-primary">{selectedInquiry.phone || "—"}</p></div>
              <div><p className="text-xs text-text-muted">Service Interest</p><p className="text-sm text-text-primary">{selectedInquiry.service_type || "—"}</p></div>
              <div><p className="text-xs text-text-muted">Country of Interest</p><p className="text-sm text-text-primary">{selectedInquiry.origin_country_interest || "—"}</p></div>
            </div>
            {selectedInquiry.message && (
              <div><p className="text-xs text-text-muted">Message</p><p className="mt-1 text-sm text-text-primary whitespace-pre-wrap">{selectedInquiry.message}</p></div>
            )}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs text-text-muted">Submitted {new Date(selectedInquiry.created_at).toLocaleString()}</span>
              <button onClick={() => deleteInquiry(selectedInquiry.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
