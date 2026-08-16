"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabaseClient";
import type { SiteSettings } from "@/types";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const supabase = createClient();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/admin/login`);
    }
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (user) fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("");

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
      setMessage("Error saving settings: " + error.message);
    } else {
      setMessage("Settings saved successfully!");
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-onyx">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user || !settings) return null;

  return (
    <div className="min-h-screen bg-onyx p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Site Settings</h1>
          <p className="mt-1 text-text-secondary">
            Manage global website content
          </p>
        </div>
        <div className="flex gap-3">
          {message && (
            <span className="self-center text-sm text-emerald">{message}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg gradient-emerald px-6 py-2 font-semibold text-onyx transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Hero Section</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Hero Title (EN)</label>
              <input
                value={settings.hero_title_en}
                onChange={(e) => setSettings({ ...settings, hero_title_en: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Hero Title (AR)</label>
              <input
                value={settings.hero_title_ar}
                onChange={(e) => setSettings({ ...settings, hero_title_ar: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Hero Subtitle (EN)</label>
              <textarea
                value={settings.hero_subtitle_en}
                onChange={(e) => setSettings({ ...settings, hero_subtitle_en: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
                rows={2}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Hero Subtitle (AR)</label>
              <textarea
                value={settings.hero_subtitle_ar}
                onChange={(e) => setSettings({ ...settings, hero_subtitle_ar: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
                rows={2}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Hero Background Image URL</label>
              <input
                value={settings.hero_bg_image_url ?? ""}
                onChange={(e) => setSettings({ ...settings, hero_bg_image_url: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Experience Years Count</label>
              <input
                type="number"
                value={settings.experience_years_count}
                onChange={(e) => setSettings({ ...settings, experience_years_count: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
          </div>
        </div>

        {/* Contact & Footer */}
        <div className="glass rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Contact & Footer</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Phone Number</label>
              <input
                value={settings.phone_number ?? ""}
                onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">WhatsApp Number</label>
              <input
                value={settings.whatsapp_number ?? ""}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Email Address</label>
              <input
                value={settings.email_address ?? ""}
                onChange={(e) => setSettings({ ...settings, email_address: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Office Address (EN)</label>
              <input
                value={settings.office_address_en ?? ""}
                onChange={(e) => setSettings({ ...settings, office_address_en: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Office Address (AR)</label>
              <input
                value={settings.office_address_ar ?? ""}
                onChange={(e) => setSettings({ ...settings, office_address_ar: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-onyx-light px-4 py-2 text-text-primary outline-none focus:border-emerald/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
