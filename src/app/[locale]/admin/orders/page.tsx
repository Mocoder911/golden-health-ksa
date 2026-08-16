"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { DeliveredOrder } from "@/types";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import { toast } from "sonner";

const emptyForm = {
  title_en: "", title_ar: "",
  client_category_en: "", client_category_ar: "",
  description_en: "", description_ar: "",
  quantity_details: "", country_origin: "",
  images: [] as string[],
};

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<DeliveredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from("delivered_orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };

  const openEdit = (o: DeliveredOrder) => {
    setForm({
      title_en: o.title_en, title_ar: o.title_ar,
      client_category_en: o.client_category_en, client_category_ar: o.client_category_ar,
      description_en: o.description_en ?? "", description_ar: o.description_ar ?? "",
      quantity_details: o.quantity_details ?? "", country_origin: o.country_origin ?? "",
      images: (o.images as string[]) || [],
    });
    setEditingId(o.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title_en || !form.title_ar) { toast.error("Title (EN & AR) is required"); return; }
    const payload = { ...form };

    if (editingId) {
      const { error } = await supabase.from("delivered_orders").update(payload as never).eq("id", editingId);
      if (error) { toast.error(error.message); return; }
      toast.success("Order updated!");
    } else {
      const { error } = await supabase.from("delivered_orders").insert(payload as never);
      if (error) { toast.error(error.message); return; }
      toast.success("Order added!");
    }
    setModalOpen(false);
    fetchOrders();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("delivered_orders").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Order deleted");
    setDeleteId(null);
    fetchOrders();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" /></div>;

  const inputCls = "w-full rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald/50";
  const labelCls = "mb-1 block text-sm font-medium text-text-secondary";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Delivered Orders</h1>
          <p className="mt-1 text-sm text-text-secondary">Track record & shipment gallery</p>
        </div>
        <button onClick={openCreate} className="rounded-lg gradient-emerald px-5 py-2.5 text-sm font-semibold text-onyx hover:opacity-90">+ Add Order</button>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center"><p className="text-text-muted">No delivered orders yet.</p></div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {(o.images as string[]).length > 0 && (
                    <img src={(o.images as string[])[0]} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                  )}
                  <div>
                    <h3 className="font-semibold text-text-primary">{o.title_en}</h3>
                    <p className="text-sm text-text-secondary">{o.client_category_en}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      Origin: {o.country_origin || "—"} | Qty: {o.quantity_details || "—"}
                    </p>
                    {(o.images as string[]).length > 1 && (
                      <p className="mt-1 text-xs text-emerald">{(o.images as string[]).length} images</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{new Date(o.created_at).toLocaleDateString()}</span>
                  <button onClick={() => openEdit(o)} className="rounded-lg p-1.5 text-text-muted hover:text-emerald">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteId(o.id)} className="rounded-lg p-1.5 text-text-muted hover:text-red-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Order" : "Add Order"}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className={labelCls}>Title (EN)</label><input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Title (AR)</label><input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className={labelCls}>Client Category (EN)</label><input value={form.client_category_en} onChange={(e) => setForm({ ...form, client_category_en: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Client Category (AR)</label><input value={form.client_category_ar} onChange={(e) => setForm({ ...form, client_category_ar: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className={labelCls}>Description (EN)</label><textarea rows={2} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Description (AR)</label><textarea rows={2} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className={inputCls} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className={labelCls}>Quantity / Bulk Details</label><input value={form.quantity_details} onChange={(e) => setForm({ ...form, quantity_details: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Country of Origin</label><input value={form.country_origin} onChange={(e) => setForm({ ...form, country_origin: e.target.value })} className={inputCls} /></div>
          </div>
          <MultiImageUpload value={form.images} onChange={(urls) => setForm({ ...form, images: urls })} folder="orders" label="Shipment Images" maxImages={10} />
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5">Cancel</button>
            <button onClick={handleSave} className="rounded-lg gradient-emerald px-6 py-2 text-sm font-semibold text-onyx hover:opacity-90">{editingId ? "Update" : "Create"}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Order" message="Are you sure you want to delete this delivered order?" confirmLabel="Delete" danger />
    </div>
  );
}
