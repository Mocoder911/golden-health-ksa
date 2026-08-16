"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { GlobalSource } from "@/types";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";

const FLAGS = ["🇰🇷","🇧🇷","🇨🇳","🇨🇦","🇹🇷","🇺🇸","🇫🇷","🇮🇹","🇩🇪","🇯🇵","🇮🇳","🇪🇸","🇬🇧","🇦🇪","🇸🇦"];

const emptyForm = {
  country_name_en: "",
  country_name_ar: "",
  flag_icon: "🌍",
  specialties_en: [] as string[],
  specialties_ar: [] as string[],
  image_url: null as string | null,
  display_order: 0,
  is_active: true,
};

export default function SourcingPage() {
  const supabase = createClient();
  const [sources, setSources] = useState<GlobalSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [specEnInput, setSpecEnInput] = useState("");
  const [specArInput, setSpecArInput] = useState("");

  useEffect(() => { fetchSources(); }, []);

  const fetchSources = async () => {
    const { data } = await supabase.from("global_sources").select("*").order("display_order");
    if (data) setSources(data);
    setLoading(false);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSpecEnInput("");
    setSpecArInput("");
    setModalOpen(true);
  };

  const openEdit = (s: GlobalSource) => {
    setForm({
      country_name_en: s.country_name_en,
      country_name_ar: s.country_name_ar,
      flag_icon: s.flag_icon ?? "🌍",
      specialties_en: s.specialties_en,
      specialties_ar: s.specialties_ar,
      image_url: s.image_url,
      display_order: s.display_order,
      is_active: s.is_active,
    });
    setEditingId(s.id);
    setSpecEnInput("");
    setSpecArInput("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.country_name_en || !form.country_name_ar) {
      toast.error("Country name (EN & AR) is required");
      return;
    }
    const payload = {
      country_name_en: form.country_name_en,
      country_name_ar: form.country_name_ar,
      flag_icon: form.flag_icon,
      specialties_en: form.specialties_en,
      specialties_ar: form.specialties_ar,
      image_url: form.image_url,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase.from("global_sources").update(payload as never).eq("id", editingId);
      if (error) { toast.error(error.message); return; }
      toast.success("Country updated!");
    } else {
      const { error } = await supabase.from("global_sources").insert(payload as never);
      if (error) { toast.error(error.message); return; }
      toast.success("Country added!");
    }
    setModalOpen(false);
    fetchSources();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("global_sources").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Country deleted");
    setDeleteId(null);
    fetchSources();
  };

  const addSpecialty = (lang: "en" | "ar") => {
    const val = lang === "en" ? specEnInput : specArInput;
    if (!val.trim()) return;
    const key = lang === "en" ? "specialties_en" : "specialties_ar";
    setForm({ ...form, [key]: [...form[key], val.trim()] });
    lang === "en" ? setSpecEnInput("") : setSpecArInput("");
  };

  const removeSpecialty = (lang: "en" | "ar", index: number) => {
    const key = lang === "en" ? "specialties_en" : "specialties_ar";
    setForm({ ...form, [key]: form[key].filter((_, i) => i !== index) });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" /></div>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Global Sourcing</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage sourcing countries & specialties</p>
        </div>
        <button onClick={openCreate} className="rounded-lg gradient-emerald px-5 py-2.5 text-sm font-semibold text-onyx transition-opacity hover:opacity-90">
          + Add Country
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-muted">No sourcing countries yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s) => (
            <div key={s.id} className="glass rounded-xl p-5 transition-all hover:border-emerald/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.flag_icon ?? "🌍"}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{s.country_name_en}</h3>
                    <p className="text-sm text-text-secondary">{s.country_name_ar}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-text-muted hover:bg-white/5 hover:text-emerald">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteId(s.id)} className="rounded-lg p-1.5 text-text-muted hover:bg-white/5 hover:text-red-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              {s.specialties_en.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.specialties_en.map((sp, i) => (
                    <span key={i} className="rounded-full bg-emerald/10 px-2 py-0.5 text-xs text-emerald">{sp}</span>
                  ))}
                </div>
              )}
              {s.image_url && (
                <img src={s.image_url} alt={s.country_name_en} className="mt-3 h-24 w-full rounded-lg object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Country" : "Add Country"}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Country Name (EN)</label>
              <input value={form.country_name_en} onChange={(e) => setForm({ ...form, country_name_en: e.target.value })} className="w-full rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald/50" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Country Name (AR)</label>
              <input value={form.country_name_ar} onChange={(e) => setForm({ ...form, country_name_ar: e.target.value })} className="w-full rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald/50" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Flag</label>
              <select value={form.flag_icon} onChange={(e) => setForm({ ...form, flag_icon: e.target.value })} className="w-full rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none">
                {FLAGS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Display Order</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald/50" />
            </div>
          </div>

          {/* Specialties EN */}
          <div>
            <label className="mb-1 block text-sm text-text-secondary">Specialties (EN)</label>
            <div className="flex gap-2">
              <input value={specEnInput} onChange={(e) => setSpecEnInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty("en"))} placeholder="Type & press Enter" className="flex-1 rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald/50" />
              <button type="button" onClick={() => addSpecialty("en")} className="rounded-lg bg-emerald/20 px-3 py-2 text-sm text-emerald hover:bg-emerald/30">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {form.specialties_en.map((s, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-xs text-emerald">
                  {s} <button onClick={() => removeSpecialty("en", i)} className="hover:text-red-400">&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* Specialties AR */}
          <div>
            <label className="mb-1 block text-sm text-text-secondary">Specialties (AR)</label>
            <div className="flex gap-2">
              <input value={specArInput} onChange={(e) => setSpecArInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty("ar"))} placeholder="اكتب واضغط Enter" className="flex-1 rounded-lg border border-white/10 bg-onyx-light px-3 py-2 text-sm text-text-primary outline-none focus:border-emerald/50" />
              <button type="button" onClick={() => addSpecialty("ar")} className="rounded-lg bg-emerald/20 px-3 py-2 text-sm text-emerald hover:bg-emerald/30">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {form.specialties_ar.map((s, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-xs text-emerald">
                  {s} <button onClick={() => removeSpecialty("ar", i)} className="hover:text-red-400">&times;</button>
                </span>
              ))}
            </div>
          </div>

          <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="sourcing" label="Country Image" />

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-text-secondary hover:bg-white/5">Cancel</button>
            <button onClick={handleSave} className="rounded-lg gradient-emerald px-6 py-2 text-sm font-semibold text-onyx hover:opacity-90">{editingId ? "Update" : "Create"}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Country" message="Are you sure you want to remove this sourcing country?" confirmLabel="Delete" danger />
    </div>
  );
}
