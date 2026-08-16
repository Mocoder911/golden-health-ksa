"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { Service } from "@/types";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

const ICONS = ["beaker","truck","globe","shield","flask","heart","star","lightning","wrench","chart","package","handshake"];

const emptyForm = { title_en: "", title_ar: "", description_en: "", description_ar: "", icon_name: "beaker", display_order: 0, is_active: true };

export default function ServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("display_order");
    if (data) setServices(data);
    setLoading(false);
  };

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };

  const openEdit = (s: Service) => {
    setForm({ title_en: s.title_en, title_ar: s.title_ar, description_en: s.description_en ?? "", description_ar: s.description_ar ?? "", icon_name: s.icon_name ?? "beaker", display_order: s.display_order, is_active: s.is_active });
    setEditingId(s.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title_en || !form.title_ar) { toast.error("Title (EN & AR) is required"); return; }
    if (editingId) {
      const { error } = await supabase.from("services").update(form as never).eq("id", editingId);
      if (error) { toast.error(error.message); return; }
      toast.success("Service updated!");
    } else {
      const { error } = await supabase.from("services").insert(form as never);
      if (error) { toast.error(error.message); return; }
      toast.success("Service added!");
    }
    setModalOpen(false);
    fetchServices();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("services").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Service deleted");
    setDeleteId(null);
    fetchServices();
  };

  const toggleActive = async (s: Service) => {
    await supabase.from("services").update({ is_active: !s.is_active } as never).eq("id", s.id);
    toast.success(s.is_active ? "Service deactivated" : "Service activated");
    fetchServices();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" /></div>;

  const inputCls = "w-full rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald/50";
  const labelCls = "mb-1 block text-sm font-medium text-text-secondary";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Services</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage service offerings displayed on the site</p>
        </div>
        <button onClick={openCreate} className="rounded-lg gradient-emerald px-5 py-2.5 text-sm font-semibold text-onyx hover:opacity-90">+ Add Service</button>
      </div>

      {services.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center"><p className="text-text-muted">No services yet. Add your first one.</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className={`glass rounded-xl p-5 transition-all ${s.is_active ? "" : "opacity-50"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10">
                    <svg className="h-5 w-5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{s.title_en}</h3>
                    <p className="text-xs text-text-secondary">{s.title_ar}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleActive(s)} className={`rounded-lg p-1.5 text-xs ${s.is_active ? "text-emerald" : "text-text-muted"}`}>
                    {s.is_active ? "ON" : "OFF"}
                  </button>
                  <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-text-muted hover:text-emerald">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteId(s.id)} className="rounded-lg p-1.5 text-text-muted hover:text-red-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              {s.description_en && <p className="mt-3 text-sm text-text-muted line-clamp-2">{s.description_en}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Service" : "Add Service"}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className={labelCls}>Title (EN)</label><input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Title (AR)</label><input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className={labelCls}>Description (EN)</label><textarea rows={3} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Description (AR)</label><textarea rows={3} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Icon</label>
              <select value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className={inputCls}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Display Order</label><input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className={inputCls} /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
            <label htmlFor="active" className="text-sm text-text-secondary">Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5">Cancel</button>
            <button onClick={handleSave} className="rounded-lg gradient-emerald px-6 py-2 text-sm font-semibold text-onyx hover:opacity-90">{editingId ? "Update" : "Create"}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Service" message="Are you sure you want to delete this service?" confirmLabel="Delete" danger />
    </div>
  );
}
