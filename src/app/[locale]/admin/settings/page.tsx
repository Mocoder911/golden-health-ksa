"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import type { SiteSettings } from "@/types";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "sonner";

export default function SettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        hero_title_en: settings.hero_title_en,
        hero_title_ar: settings.hero_title_ar,
        hero_subtitle_en: settings.hero_subtitle_en,
        hero_subtitle_ar: settings.hero_subtitle_ar,
        hero_bg_image_url: settings.hero_bg_image_url,
        global_site_bg_url: settings.global_site_bg_url,
        experience_years_count: settings.experience_years_count,
        footer_about_en: settings.footer_about_en,
        footer_about_ar: settings.footer_about_ar,
        phone_number: settings.phone_number,
        whatsapp_number: settings.whatsapp_number,
        email_address: settings.email_address,
        office_address_en: settings.office_address_en,
        office_address_ar: settings.office_address_ar,
        social_links: settings.social_links,
      } as never)
      .eq("id", settings.id);

    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      toast.success("Settings saved successfully!");
    }
    setSaving(false);
  };

  const updateSocial = (key: string, value: string) => {
    if (!settings) return;
    const current = (settings.social_links as Record<string, string>) || {};
    setSettings({ ...settings, social_links: { ...current, [key]: value } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
      </div>
    );
  }

  if (!settings) return null;

  const social = (settings.social_links as Record<string, string>) || {};
  const inputCls =
    "w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-emerald/50";
  const labelCls = "mb-1.5 block text-sm font-medium text-text-secondary";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Site Settings</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage global website content, hero, footer & contact info
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg gradient-emerald px-6 py-2.5 text-sm font-semibold text-onyx transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Hero Section */}
      <section className="glass rounded-xl p-6">
        <h2 className="mb-5 text-lg font-semibold text-text-primary">Hero Section</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelCls}>Hero Title (EN)</label>
            <input value={settings.hero_title_en} onChange={(e) => setSettings({ ...settings, hero_title_en: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hero Title (AR)</label>
            <input value={settings.hero_title_ar} onChange={(e) => setSettings({ ...settings, hero_title_ar: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hero Subtitle (EN)</label>
            <textarea rows={2} value={settings.hero_subtitle_en} onChange={(e) => setSettings({ ...settings, hero_subtitle_en: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hero Subtitle (AR)</label>
            <textarea rows={2} value={settings.hero_subtitle_ar} onChange={(e) => setSettings({ ...settings, hero_subtitle_ar: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Experience Years</label>
            <input type="number" value={settings.experience_years_count} onChange={(e) => setSettings({ ...settings, experience_years_count: parseInt(e.target.value) || 0 })} className={inputCls} />
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ImageUpload value={settings.hero_bg_image_url} onChange={(url) => setSettings({ ...settings, hero_bg_image_url: url })} folder="hero" label="Hero Background Image" />
          <ImageUpload value={settings.global_site_bg_url} onChange={(url) => setSettings({ ...settings, global_site_bg_url: url })} folder="backgrounds" label="Global Site Background" />
        </div>
      </section>

      {/* Contact & Footer */}
      <section className="glass rounded-xl p-6">
        <h2 className="mb-5 text-lg font-semibold text-text-primary">Contact & Footer</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelCls}>Phone Number</label>
            <input value={settings.phone_number ?? ""} onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })} className={inputCls} placeholder="+966 XX XXX XXXX" />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <input value={settings.whatsapp_number ?? ""} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} className={inputCls} placeholder="+966 XX XXX XXXX" />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input value={settings.email_address ?? ""} onChange={(e) => setSettings({ ...settings, email_address: e.target.value })} className={inputCls} placeholder="info@goldenhealth.com" />
          </div>
          <div>
            <label className={labelCls}>Office Address (EN)</label>
            <input value={settings.office_address_en ?? ""} onChange={(e) => setSettings({ ...settings, office_address_en: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Office Address (AR)</label>
            <input value={settings.office_address_ar ?? ""} onChange={(e) => setSettings({ ...settings, office_address_ar: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelCls}>Footer About (EN)</label>
            <textarea rows={3} value={settings.footer_about_en} onChange={(e) => setSettings({ ...settings, footer_about_en: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Footer About (AR)</label>
            <textarea rows={3} value={settings.footer_about_ar} onChange={(e) => setSettings({ ...settings, footer_about_ar: e.target.value })} className={inputCls} />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="glass rounded-xl p-6">
        <h2 className="mb-5 text-lg font-semibold text-text-primary">Social Links</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {["linkedin", "instagram", "twitter", "facebook", "youtube", "tiktok"].map((platform) => (
            <div key={platform}>
              <label className={labelCls}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
              <input
                value={social[platform] ?? ""}
                onChange={(e) => updateSocial(platform, e.target.value)}
                className={inputCls}
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
